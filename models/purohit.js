const mongoose = require('mongoose');

const purohitSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/,
  },
  email: {
    type: String,
    lowercase: true,
    sparse: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  vedas: {
    rigveda: {
      type: Boolean,
      default: false,
    },
    yajurveda: {
      type: Boolean,
      default: false,
    },
    samaveda: {
      type: Boolean,
      default: false,
    },
    atharvaveda: {
      type: Boolean,
      default: false,
    },
  },
  subVedas: {
    type: [String],
    default: [],
  },
  upanayana: {
    type: String,
    enum: ['yes', 'no'],
    required: true,
  },
  married: {
    type: String,
    enum: ['yes', 'no', null],
    default: null,
  },
  gotram: {
    type: String,
    required: true,
    trim: true,
  },
  upasana: {
    type: String,
    trim: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Purohit', purohitSchema);
