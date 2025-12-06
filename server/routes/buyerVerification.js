const express = require('express');
const BuyerVerification = require('../models/BuyerVerification');
const router = express.Router();

// GET all buyer verifications
router.get('/', async (req, res) => {
  try {
    const verifications = await BuyerVerification.find()
      .populate('buyerId', 'username email')
      .populate('verifiedBy', 'username');
    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST verify buyer
router.post('/:buyerId/verify', async (req, res) => {
  try {
    const { verifiedBy } = req.body;

    let verification = await BuyerVerification.findOne({ buyerId: req.params.buyerId });

    if (verification) {
      verification.verifiedStatus = true;
      verification.verifiedBy = verifiedBy;
      verification.verificationDate = new Date();
    } else {
      verification = new BuyerVerification({
        buyerId: req.params.buyerId,
        verifiedStatus: true,
        verifiedBy,
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
