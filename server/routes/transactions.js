const express = require('express');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { authMiddleware, requireRole } = require('../middleware/auth');
const router = express.Router();
const BuyerVerification = require('../models/BuyerVerification'); // Add this import

// GET transactions (Filtered by Role)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};

    // 1. Logic for Farmers: Find their products, then find transactions for those products
    if (req.user.role === 'farmer') {
      const myProducts = await Product.find({ farmerId: req.user._id }).select('_id');
      const productIds = myProducts.map(p => p._id);
      query = { productId: { $in: productIds } };
    } 
    // 2. Logic for Buyers: Only see their own purchases
    else if (req.user.role === 'buyer') {
      query = { buyerId: req.user._id };
    }
    // 3. Admins see everything (query remains empty {})

    const transactions = await Transaction.find(query)
      .populate('buyerId', 'username email') // Show who bought it
      .populate({
        path: 'productId',
        select: 'productName pricePerUnit farmerId',
        populate: { path: 'farmerId', select: 'username' } // Show who sold it
      })
      .sort({ transactionDate: -1 }); // Newest first

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create transaction (record history) - buyer only
router.post('/', authMiddleware, requireRole('buyer'), async (req, res) => {
  try {
    const { productId, quantityPurchased } = req.body;
    
    // 1. Validate Input
    if (!productId || !quantityPurchased) {
      return res.status(400).json({ message: 'productId and quantityPurchased are required' });
    }

    // NEW: Check Verification Status
    const verification = await BuyerVerification.findOne({ buyerId: req.user._id });
    if (!verification || !verification.verifiedStatus) {
      return res.status(403).json({ 
        message: "Account not verified. You cannot make purchases until approved by an Admin." 
      });
    }

    // 2. Find the Product
    const product = await Product.findById(productId);
    if (!product || product.isAvailable === false) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    // 3. Logic: Check if enough quantity exists
    if (product.quantity < qty) {
      return res.status(400).json({ 
        message: `Not enough stock. Only ${product.quantity} kg available.` 
      });
    }

    // 4. Calculate Price
    const totalPrice = qty * Number(product.pricePerUnit || 0);

    // 5. Update Product Inventory
    product.quantity -= qty;
    
    // Logic: If quantity hits 0, listing disappears (isAvailable = false)
    if (product.quantity === 0) {
      product.isAvailable = false;
    }
    await product.save();

    // 6. Create and Save Transaction WITH SNAPSHOTS
    const transaction = new Transaction({
      buyerId: req.user._id,
      productId: productId,
      // Save static copies of details
      productNameSnapshot: product.productName,
      priceSnapshot: product.pricePerUnit,
      
      quantityPurchased: qty,
      totalPrice,
      status: 'pending'
    });
    await transaction.save();

    res.status(201).json({ 
      transaction, 
      message: 'Transaction successful',
      remainingStock: product.quantity 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// PATCH: Update Transaction Status (Farmer or Admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find transaction and populate product to check ownership
    const transaction = await Transaction.findById(req.params.id).populate('productId');
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Authorization: Only Admin or the Farmer who sold the product can update
    const isOwner = req.user.role === 'farmer' && transaction.productId.farmerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    transaction.status = status;
    await transaction.save();

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



module.exports = router;
