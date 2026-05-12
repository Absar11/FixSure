const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: { type: Number, required: true, unique: true },
  orderId: { type: String, required: true },
  inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: false },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    description: { type: String, required: true },
    qty: { type: Number, required: true, default: 1 },
    amount: { type: Number, required: true }
  }],
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, default: 'UPI' },
  warrantyNote: { type: String },
  pdfPath: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
