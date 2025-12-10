const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantityPurchased: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
