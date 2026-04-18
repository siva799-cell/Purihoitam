const express = require('express');
const router = express.Router();
const Purohit = require('../models/purohit');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRegistration = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number required'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('dob').isISO8601().withMessage('Valid date required'),
  body('gotram').trim().notEmpty().withMessage('Gotram is required'),
  body('upanayana').isIn(['yes', 'no']).withMessage('Upanayana value invalid'),
];

// Register Purohit
router.post('/register', validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      phone,
      email,
      password,
      dob,
      vedas,
      subVedas,
      upanayana,
      married,
      gotram,
      upasana,
    } = req.body;

    // Check if phone already exists
    let existingPurohit = await Purohit.findOne({ phone });
    if (existingPurohit) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Check if email already exists (if provided)
    if (email) {
      existingPurohit = await Purohit.findOne({ email });
      if (existingPurohit) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new Purohit
    const newPurohit = new Purohit({
      photo: req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png',
      name,
      phone,
      email: email || null,
      password: hashedPassword,
      dob: new Date(dob),
      vedas: vedas || { rigveda: false, yajurveda: false, samaveda: false, atharvaveda: false },
      subVedas: subVedas || [],
      upanayana,
      married: upanayana === 'yes' ? married : null,
      gotram,
      upasana: upasana || null,
    });

    // Save to database
    await newPurohit.save();

    res.status(201).json({
      message: 'Registration successful!',
      data: {
        id: newPurohit._id,
        name: newPurohit.name,
        phone: newPurohit.phone,
        email: newPurohit.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all Purohits (optional - for admin panel)
router.get('/purohits', async (req, res) => {
  try {
    const purohits = await Purohit.find().select('-password');
    res.json(purohits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single Purohit by ID
router.get('/purohit/:id', async (req, res) => {
  try {
    const purohit = await Purohit.findById(req.params.id).select('-password');
    if (!purohit) {
      return res.status(404).json({ message: 'Purohit not found' });
    }
    res.json(purohit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update Purohit
router.put('/purohit/:id', async (req, res) => {
  try {
    const purohit = await Purohit.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!purohit) {
      return res.status(404).json({ message: 'Purohit not found' });
    }

    res.json({
      message: 'Updated successfully',
      data: purohit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Purohit
router.delete('/purohit/:id', async (req, res) => {
  try {
    const purohit = await Purohit.findByIdAndDelete(req.params.id);
    if (!purohit) {
      return res.status(404).json({ message: 'Purohit not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
