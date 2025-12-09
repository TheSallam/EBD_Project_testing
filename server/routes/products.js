const express = require('express');
const Product = require('../models/Product');
const { authMiddleware, requireRole } = require('../middleware/auth');
const mongoose = require('mongoose');
const router = express.Router();

function validateProductBody(body) {
  const errors = [];
  if (!body.productName) errors.push('productName is required');
  if (body.quantity == null || Number.isNaN(Number(body.quantity))) errors.push('quantity must be a number');
  if (body.pricePerUnit == null || Number.isNaN(Number(body.pricePerUnit))) errors.push('pricePerUnit must be a number');
  if (!body.farmerId || !mongoose.Types.ObjectId.isValid(body.farmerId)) errors.push('farmerId is required and must be a valid id');
  return errors;
}

// GET all products (Viewing by Buyers)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).populate('farmerId', 'username');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create product (Farmers listing)
router.post('/', authMiddleware, requireRole('farmer'), async (req, res) => {
  try {
    const errors = validateProductBody(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Invalid data', errors });
    }
    const product = new Product({ ...req.body, farmerId: req.user._id });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// PUT update product
router.put('/:id', authMiddleware, requireRole('farmer'), async (req, res) => {
  try {
    const errors = validateProductBody({ ...req.body, farmerId: req.user._id });
    if (errors.length) return res.status(400).json({ message: 'Invalid data', errors });

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user._id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// DELETE product
router.delete('/:id', authMiddleware, requireRole('farmer'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
