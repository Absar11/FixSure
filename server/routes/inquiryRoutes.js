const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const Bill = require('../models/Bill');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ─── STATIC ROUTES FIRST (must be before /:id) ────────────────────────────

// GET all inquiries
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate('billId').sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET: Find Bill by Inquiry ID
router.get('/find-bill/:inquiryId', async (req, res) => {
  try {
    const { inquiryId } = req.params;
    console.log('Finding bill for inquiryId:', inquiryId);
    const bill = await Bill.findOne({ inquiryId: new mongoose.Types.ObjectId(inquiryId) });
    if (!bill) {
      console.log('Bill not found for inquiryId:', inquiryId);
      return res.status(404).json({ error: 'No bill found for this lead' });
    }
    console.log('Bill found:', bill.billNumber);
    res.json(bill);
  } catch (err) {
    console.error('Error finding bill:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET: Serve PDF file by Bill ID
router.get('/bill-file/:billId', async (req, res) => {
  try {
    console.log('Serving PDF for Bill ID:', req.params.billId);
    const bill = await Bill.findById(req.params.billId);
    
    if (!bill) {
      console.error('Bill NOT FOUND in database for ID:', req.params.billId);
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    console.log('File path in DB:', bill.pdfPath);
    if (!fs.existsSync(bill.pdfPath)) {
      console.error('File NOT FOUND on disk at path:', bill.pdfPath);
      return res.status(404).json({ error: 'PDF file not found on disk' });
    }

    const absolutePath = path.resolve(bill.pdfPath);
    console.log('Serving absolute path:', absolutePath);
    const fileName = path.basename(bill.pdfPath);
    res.download(absolutePath, fileName);
  } catch (err) {
    console.error('Error serving bill file:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST: Submit new inquiry
router.post('/', async (req, res) => {
  try {
    const { name, phone, address, serviceType, message } = req.body;
    const newInquiry = new Inquiry({ name, phone, address, serviceType, message });
    const savedInquiry = await newInquiry.save();

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      console.log('Emitting newInquiry event for:', savedInquiry.name);
      io.emit('newInquiry', savedInquiry);
    }

    res.status(201).json({ message: 'Inquiry submitted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// ─── DYNAMIC ROUTES AFTER STATIC ─────────────────────────────────────────

// PUT: Update inquiry status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// DELETE: Delete an inquiry
router.delete('/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST: Generate Bill PDF and save to DB
router.post('/:id/bill', async (req, res) => {
  try {
    console.log("--- SERVER_CODE_VERSION: V2_CHECK ---");
    console.log("IN BILL ROUTE. ID:", req.params.id);
    const { items, discount, paymentMode, warrantyNote } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please add at least one service item' });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      return sum + ((Number(item.amount) || 0) * (Number(item.qty) || 1));
    }, 0);
    const totalAmount = subtotal - (Number(discount) || 0);

    // Bill number
    const lastBill = await Bill.findOne().sort({ billNumber: -1 });
    const billNumber = lastBill ? lastBill.billNumber + 1 : 1001;
    const orderId = `FSHA${String(billNumber).padStart(6, '0')}`;

    // Ensure bills directory exists
    const billsDir = path.join(__dirname, '../bills');
    if (!fs.existsSync(billsDir)) fs.mkdirSync(billsDir, { recursive: true });

    const fileName = `Bill_${billNumber}.pdf`;
    const filePath = path.join(billsDir, fileName);

    // ── Generate PDF using Promise so we can properly await ──
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const logoPath = path.join(__dirname, '../assets/logo.png');

      // Logo
      if (fs.existsSync(logoPath)) doc.image(logoPath, 50, 45, { width: 60 });

      // Header
      doc.fillColor('#1a237e').fontSize(20).text('FixSure', 120, 50);
      doc.fillColor('#444').fontSize(10).text('Appliance Repair & Home Maintenance Services', 120, 75);
      doc.text('9310700828', 120, 90);

      // Watermark
      if (fs.existsSync(logoPath)) {
        doc.save();
        doc.opacity(0.05);
        doc.image(logoPath, 150, 250, { width: 300 });
        doc.restore();
      }

      // Invoice Info
      doc.fillColor('#000').fontSize(10);
      doc.text(`Invoice No: ${billNumber}`, 400, 50, { align: 'right' });
      doc.text(`Order Id: ${orderId}`, 400, 65, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 400, 80, { align: 'right' });

      // Customer Details
      doc.rect(50, 130, 512, 60).fill('#f9f9f9').stroke('#eee');
      doc.fillColor('#1a237e').fontSize(12).text('Customer Details:', 60, 140);
      doc.fillColor('#000').fontSize(10);
      doc.text(`Name: ${inquiry.name || 'N/A'}`, 60, 155);
      doc.text(`Mobile: ${inquiry.phone || 'N/A'}`, 60, 170);
      doc.text(`Address: ${inquiry.address || 'N/A'}`, 250, 155, { width: 300 });

      // Table Header
      const tableTop = 220;
      doc.rect(50, tableTop, 512, 20).fill('#1a237e');
      doc.fillColor('#fff').fontSize(10).text('Description', 60, tableTop + 5);
      doc.text('Qty', 350, tableTop + 5, { width: 50, align: 'center' });
      doc.text('Amount (Rs.)', 450, tableTop + 5, { width: 100, align: 'right' });

      // Table Rows
      let rowTop = tableTop + 25;
      doc.fillColor('#000');
      items.forEach((item) => {
        doc.text(item.description || 'Service', 60, rowTop);
        doc.text(String(item.qty || 1), 350, rowTop, { width: 50, align: 'center' });
        doc.text(`${item.amount || 0}/-`, 450, rowTop, { width: 100, align: 'right' });
        rowTop += 20;
        doc.moveTo(50, rowTop - 5).lineTo(562, rowTop - 5).stroke('#eee');
      });

      // Summary
      const summaryTop = Math.max(rowTop + 10, 300);
      doc.fontSize(10);
      doc.fillColor('#000').text('Subtotal:', 350, summaryTop, { width: 100, align: 'right' });
      doc.text(`${subtotal}/-`, 450, summaryTop, { width: 100, align: 'right' });
      doc.text('Discount:', 350, summaryTop + 15, { width: 100, align: 'right' });
      doc.text(`${discount || 0}/-`, 450, summaryTop + 15, { width: 100, align: 'right' });
      doc.rect(340, summaryTop + 30, 222, 25).fill('#1a237e');
      doc.fillColor('#fff').fontSize(12).text('Total Amount:', 350, summaryTop + 37);
      doc.text(`Rs. ${totalAmount}/-`, 450, summaryTop + 37, { align: 'right' });

      // Payment mode and Note
      doc.fillColor('#000').fontSize(10).text(`Payment Mode: ${paymentMode || 'UPI'}`, 50, summaryTop + 40);
      doc.moveDown(4);
      doc.fillColor('#1a237e').fontSize(10).text('Note:', 50, doc.y);
      doc.fillColor('#444').text(warrantyNote || 'N/A', 50, doc.y + 5, { width: 512 });

      // Footer
      doc.moveDown(4);
      doc.fillColor('#1a237e').fontSize(12).text('Thank you for choosing FixSure!', { align: 'center' });

      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    // ── PDF is fully written, now save to database ──
    const newBill = new Bill({
      billNumber,
      orderId,
      inquiryId: inquiry._id,
      customer: {
        name: inquiry.name || 'N/A',
        phone: inquiry.phone || 'N/A',
        address: inquiry.address || 'N/A',
      },
      items,
      discount: Number(discount) || 0,
      totalAmount,
      paymentMode: paymentMode || 'UPI',
      warrantyNote,
      pdfPath: filePath,
    });

    const savedBill = await newBill.save();

    // Update inquiry status and link bill
    inquiry.status = 'Completed';
    inquiry.billId = savedBill._id;
    await inquiry.save();

    console.log('Bill saved successfully:', billNumber);
    
    // ✅ Return updated inquiry data so frontend can update state without page reload
    const updatedInquiry = await Inquiry.findById(inquiry._id).populate('billId');

    res.json({ 
      message: 'Bill generated successfully', 
      billNumber, 
      orderId, 
      billId: savedBill._id,
      updatedInquiry
    });

  } catch (err) {
    console.error('Bill generation error:', err);
    res.status(500).json({ error: err.message || 'Server Error' });
  }
});

// POST: Generate Direct Bill (No Inquiry required)
router.post('/generate-direct-bill', async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, discount, paymentMode, warrantyNote } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Please add at least one service item' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      return sum + ((Number(item.amount) || 0) * (Number(item.qty) || 1));
    }, 0);
    const totalAmount = subtotal - (Number(discount) || 0);

    // Bill number
    const lastBill = await Bill.findOne().sort({ billNumber: -1 });
    const billNumber = lastBill ? lastBill.billNumber + 1 : 1001;
    const orderId = `FSHA${String(billNumber).padStart(6, '0')}`;

    // Ensure bills directory exists
    const billsDir = path.join(__dirname, '../bills');
    if (!fs.existsSync(billsDir)) fs.mkdirSync(billsDir, { recursive: true });

    const fileName = `Bill_${billNumber}.pdf`;
    const filePath = path.join(billsDir, fileName);

    // Generate PDF
    await new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const logoPath = path.join(__dirname, '../assets/logo.png');
      if (fs.existsSync(logoPath)) doc.image(logoPath, 50, 45, { width: 60 });

      doc.fillColor('#1a237e').fontSize(20).text('FixSure', 120, 50);
      doc.fillColor('#444').fontSize(10).text('Appliance Repair & Home Maintenance Services', 120, 75);
      doc.text('9310700828', 120, 90);

      doc.fillColor('#000').fontSize(10);
      doc.text(`Invoice No: ${billNumber}`, 400, 50, { align: 'right' });
      doc.text(`Order Id: ${orderId}`, 400, 65, { align: 'right' });
      doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 400, 80, { align: 'right' });

      doc.rect(50, 130, 512, 60).fill('#f9f9f9').stroke('#eee');
      doc.fillColor('#1a237e').fontSize(12).text('Customer Details:', 60, 140);
      doc.fillColor('#000').fontSize(10);
      doc.text(`Name: ${customerName || 'N/A'}`, 60, 155);
      doc.text(`Mobile: ${customerPhone || 'N/A'}`, 60, 170);
      doc.text(`Address: ${customerAddress || 'N/A'}`, 250, 155, { width: 300 });

      const tableTop = 220;
      doc.rect(50, tableTop, 512, 20).fill('#1a237e');
      doc.fillColor('#fff').fontSize(10).text('Description', 60, tableTop + 5);
      doc.text('Qty', 350, tableTop + 5, { width: 50, align: 'center' });
      doc.text('Amount (Rs.)', 450, tableTop + 5, { width: 100, align: 'right' });

      let rowTop = tableTop + 25;
      doc.fillColor('#000');
      items.forEach((item) => {
        doc.text(item.description || 'Service', 60, rowTop);
        doc.text(String(item.qty || 1), 350, rowTop, { width: 50, align: 'center' });
        doc.text(`${item.amount || 0}/-`, 450, rowTop, { width: 100, align: 'right' });
        rowTop += 20;
        doc.moveTo(50, rowTop - 5).lineTo(562, rowTop - 5).stroke('#eee');
      });

      const summaryTop = Math.max(rowTop + 10, 300);
      doc.fontSize(10).fillColor('#000').text('Subtotal:', 350, summaryTop, { width: 100, align: 'right' });
      doc.text(`${subtotal}/-`, 450, summaryTop, { width: 100, align: 'right' });
      doc.text('Discount:', 350, summaryTop + 15, { width: 100, align: 'right' });
      doc.text(`${discount || 0}/-`, 450, summaryTop + 15, { width: 100, align: 'right' });
      doc.rect(340, summaryTop + 30, 222, 25).fill('#1a237e');
      doc.fillColor('#fff').fontSize(12).text('Total Amount:', 350, summaryTop + 37);
      doc.text(`Rs. ${totalAmount}/-`, 450, summaryTop + 37, { align: 'right' });

      doc.fillColor('#000').fontSize(10).text(`Payment Mode: ${paymentMode || 'UPI'}`, 50, summaryTop + 40);
      doc.moveDown(4);
      doc.fillColor('#1a237e').fontSize(10).text('Note:', 50, doc.y);
      doc.fillColor('#444').text(warrantyNote || 'N/A', 50, doc.y + 5, { width: 512 });
      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });

    const newBill = new Bill({
      billNumber,
      orderId,
      customer: { name: customerName, phone: customerPhone, address: customerAddress },
      items,
      discount: Number(discount) || 0,
      totalAmount,
      paymentMode: paymentMode || 'UPI',
      warrantyNote,
      pdfPath: filePath,
    });

    const savedBill = await newBill.save();
    res.json({ message: 'Direct Bill generated successfully', billNumber, orderId, billId: savedBill._id });

  } catch (err) {
    console.error('Direct Bill error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;