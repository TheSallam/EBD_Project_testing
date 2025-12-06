const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const authRoute = require('./routes/auth');
const productsRoute = require('./routes/products');
const buyerRoute = require('./routes/buyerVerification');
const transactionsRoute = require('./routes/transactions');

console.log('authRoute type:', typeof authRoute);
console.log('productsRoute type:', typeof productsRoute);
console.log('buyerRoute type:', typeof buyerRoute);
console.log('transactionsRoute type:', typeof transactionsRoute);

app.use('/api/auth', authRoute);
app.use('/api/products', productsRoute);
app.use('/api/buyer-verification', buyerRoute);
app.use('/api/transactions', transactionsRoute);


// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Digital B2B Farmers Marketplace API - Milestone 1' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
