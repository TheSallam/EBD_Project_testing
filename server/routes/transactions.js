const express = require('express');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const { authMiddleware, requireRole } = require('../middleware/auth');
const router = express.Router();

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('buyerId', 'username')
      .populate('productId', 'productName pricePerUnit');
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
    const qty = Number(quantityPurchased);
    if (Number.isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: 'quantityPurchased must be a positive number' });
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

    // 6. Create and Save Transaction
    const transaction = new Transaction({
      buyerId: req.user._id,
      productId,
      quantityPurchased: qty,
      totalPrice,
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

module.exports = router;
