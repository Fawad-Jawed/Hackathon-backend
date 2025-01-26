// models/Beneficiary.js
const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  cnic: { type: String, required: true, unique: true }, // Required field
  name: { type: String, required: true }, // Required field
  phone: { type: String, required: true }, // Required field
  address: { type: String, required: true }, // Required field
  purpose: { type: String, required: true }, // Required field
  history: [
    {
      department: { type: String, required: true },
      action: { type: String, required: true },
      remarks: { type: String, required: true },
      status: { type: String, required: true },
      solution: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Auto-generated
  updatedAt: { type: Date, default: Date.now }, // Auto-updated
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
