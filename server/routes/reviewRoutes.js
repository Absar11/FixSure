const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

console.log('Review Routes Loaded');

// Submit a new review
router.post('/', async (req, res) => {
  try {
    const { name, location, rating, message } = req.body;
    const newReview = new Review({ name, location, rating, message });
    await newReview.save();
    res.status(201).json({ message: 'Feedback submitted successfully! It will be visible after approval.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get all approved reviews for frontend
router.get('/approved', async (req, res) => {
  try {
    const approvedReviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json(approvedReviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get all reviews for admin
router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Update review status (Approve/Reject)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `Review ${status.toLowerCase()} successfully`, review: updatedReview });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

// Delete a review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
