const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const Bill = require('../models/Bill');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res) => {
  try {
    const { name, phone, address, serviceType, message } = req.body;
    const newInquiry = new Inquiry({ name, phone, address, serviceType, message });
    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update inquiry status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete an inquiry
router.delete('/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Generate Bill and Save PDF
router.post('/:id/bill', async (req, res) => {
  try {
    const { amount, details } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    // Auto-increase bill number
    const lastBill = await Bill.findOne().sort({ billNumber: -1 });
    const billNumber = lastBill ? lastBill.billNumber + 1 : 1001;

    const fileName = `Bill_${billNumber}.pdf`;
    const filePath = path.join(__dirname, '../bills', fileName);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath));

    // PDF Content
    doc.fontSize(25).text('FixSure Service Bill', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Bill Number: ${billNumber}`);
    doc.text(`Customer Name: ${inquiry.name}`);
    doc.text(`Phone: ${inquiry.phone}`);
    doc.text(`Service: ${inquiry.serviceType}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.text('-------------------------------------------');
    doc.text(`Details: ${details || 'N/A'}`);
    doc.text(`Total Amount: Rs. ${amount}`);
    doc.text('-------------------------------------------');
    doc.moveDown();
    doc.fontSize(12).text('Thank you for choosing FixSure!', { align: 'center' });

    doc.end();

    const newBill = new Bill({
      billNumber,
      inquiryId: inquiry._id,
      customerName: inquiry.name,
      amount,
      details,
      pdfPath: filePath
    });

    await newBill.save();
    
    // Update inquiry status to Completed after billing
    inquiry.status = 'Completed';
    await inquiry.save();

    res.json({ message: 'Bill generated and saved successfully', bill: newBill });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
