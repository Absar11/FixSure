import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContactForm = ({ minimal = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    serviceType: 'AC Repair',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'phone') {
      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, phone: val });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      return toast.error('Please enter a valid 10-digit phone number');
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending your request...');
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/inquiries`, formData);
      toast.success('Booking request sent! We will contact you shortly.', { id: loadingToast });
      setFormData({ name: '', phone: '', address: '', serviceType: 'AC Repair', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (minimal) {
    return (
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-navy to-brand-orange"></div>
        <h3 className="text-xl font-black text-brand-navy mb-6 uppercase tracking-tight">Book Service Now</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-orange transition-all text-sm outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required maxLength="10" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-orange transition-all text-sm outline-none" placeholder="9876543210" />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Service</label>
            <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-orange transition-all text-sm outline-none">
              <option value="AC Repair">AC Repair</option>
              <option value="Refrigerator Repair">Refrigerator Repair</option>
              <option value="Washing Machine Repair">Washing Machine Repair</option>
              <option value="Microwave Repair">Microwave Repair</option>
              <option value="Other">Other Appliances</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-brand-orange transition-all text-sm outline-none" placeholder="Your full address" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 mt-4 text-sm uppercase tracking-widest">
            {isSubmitting ? 'Sending...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold text-brand-orange tracking-widest uppercase mb-2">Book Now</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6 leading-tight">Schedule Your Service Today</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Don't let a faulty appliance ruin your comfort. Fill out the form, and our expert technicians will be at your doorstep.
            </p>
            <div className="bg-brand-light p-8 rounded-2xl border border-gray-100">
              <h4 className="text-xl font-bold text-brand-navy mb-4">Why Choose FixSure?</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-700 font-medium"><div className="w-2 h-2 bg-brand-orange rounded-full mr-3"></div> Same Day Service</li>
                <li className="flex items-center text-gray-700 font-medium"><div className="w-2 h-2 bg-brand-orange rounded-full mr-3"></div> Experienced Technicians</li>
                <li className="flex items-center text-gray-700 font-medium"><div className="w-2 h-2 bg-brand-orange rounded-full mr-3"></div> 100% Satisfaction Guarantee</li>
              </ul>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-navy to-brand-orange"></div>
              <h3 className="text-2xl font-bold text-brand-navy mb-8">Service Request Form</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required maxLength="10" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all" placeholder="9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all" placeholder="Your full address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Required</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all bg-white">
                    <option value="AC Repair">AC Repair</option>
                    <option value="Refrigerator Repair">Refrigerator Repair</option>
                    <option value="Washing Machine Repair">Washing Machine Repair</option>
                    <option value="Microwave Repair">Microwave Repair</option>
                    <option value="Chimney Repair">Chimney Repair</option>
                    <option value="Other">Other Home Appliances</option>
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-navy hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1">
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
