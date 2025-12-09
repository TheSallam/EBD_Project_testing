const express = require('express');
const BuyerVerification = require('../models/BuyerVerification');
const { authMiddleware, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all buyer verifications (admin only)
router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const verifications = await BuyerVerification.find()
      .populate('buyerId', 'username email')
      .populate('verifiedBy', 'username');
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST verify buyer - ONLY ADMIN
router.post('/:buyerId/verify', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const buyerId = req.params.buyerId;

    let verification = await BuyerVerification.findOne({ buyerId });

    if (verification) {
      verification.verifiedStatus = true;
      verification.verifiedBy = req.user._id;  // admin from token
      verification.verificationDate = new Date();
    } else {
      verification = new BuyerVerification({
        buyerId,
        verifiedStatus: true,
        verifiedBy: req.user._id,
        verificationDate: new Date()
      });
    }

    await verification.save();
    res.status(201).json(verification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
