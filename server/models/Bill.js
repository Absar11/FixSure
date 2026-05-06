const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: { type: Number, required: true, unique: true },
  inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: true },
  customerName: { type: String, required: true },
  amount: { type: Number, required: true },
  details: { type: String },
  pdfPath: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
