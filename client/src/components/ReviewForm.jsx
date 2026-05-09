import React, { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { FiStar, FiSend, FiUser, FiMapPin, FiMessageSquare } from 'react-icons/fi';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    message: ''
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return toast.error('Please write a message');
    
    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your feedback...');
    try {
      await api.post('/api/reviews', formData);
      toast.success('Thank you! Your review has been submitted for approval.', { id: loadingToast });
      setFormData({ name: '', location: '', rating: 5, message: '' });
    } catch (error) {
      toast.error('Failed to submit review. Please try again.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-navy"></div>
      
      <div className="text-center mb-10">
        <h3 className="text-3xl font-black text-brand-navy uppercase tracking-tighter mb-2">Share Your Experience</h3>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">We value your feedback!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-orange outline-none transition-all font-bold text-sm"
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Location (e.g. Dwarka, Delhi)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-orange outline-none transition-all font-bold text-sm"
            />
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex flex-col items-center py-4 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Your Rating</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setFormData({ ...formData, rating: star })}
                className="transition-all transform hover:scale-125 focus:outline-none"
              >
                <FiStar
                  size={32}
                  className={star <= (hoverRating || formData.rating) ? 'text-brand-orange fill-brand-orange' : 'text-gray-300'}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-black text-brand-navy mt-2 uppercase tracking-widest">
            {formData.rating === 5 ? 'Excellent!' : formData.rating === 4 ? 'Good' : formData.rating === 3 ? 'Average' : 'Below Average'}
          </span>
        </div>

        <div className="relative">
          <FiMessageSquare className="absolute left-4 top-6 text-gray-400" />
          <textarea
            placeholder="Tell us about our service..."
            required
            rows="4"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-orange outline-none transition-all font-bold text-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-navy hover:bg-gray-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 uppercase tracking-widest text-sm"
        >
          {isSubmitting ? (
            <span>Submitting...</span>
          ) : (
            <>
              <FiSend />
              <span>Submit Review</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
