const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  serviceType: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
