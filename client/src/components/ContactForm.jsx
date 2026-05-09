import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiUser, FiPhone, FiMapPin, FiSend, FiChevronDown, FiWind, FiCoffee, FiCpu, FiArchive, FiShield, FiCheckCircle, FiMoreHorizontal, FiActivity } from 'react-icons/fi';

const ContactForm = ({ minimal = false, preselectedService = 'AC Repair' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: preselectedService,
    address: '',
    message: '' // Using message field for problem description
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const services = [
    { id: 'AC Repair', label: 'AC Repair', icon: <FiWind className="text-blue-500" /> },
    { id: 'Refrigerator', label: 'Refrigerator', icon: <FiArchive className="text-cyan-500" /> },
    { id: 'Washing Machine', label: 'Washing Machine', icon: <FiCpu className="text-purple-500" /> },
    { id: 'Microwave/Oven', label: 'Microwave/Oven', icon: <FiCoffee className="text-orange-500" /> },
    { id: 'Chimney', label: 'Chimney Repair', icon: <FiArchive className="text-gray-500" /> },
    { id: 'Other', label: 'Other Services', icon: <FiMoreHorizontal className="text-gray-400" /> }
  ];

  const trustCards = [
    { icon: <FiShield />, title: 'Genuine Parts', text: 'We use 100% original spare parts with warranty.' },
    { icon: <FiCheckCircle />, title: 'Expert Techs', text: 'Verified and certified home appliance specialists.' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading('Submitting your request...');
    try {
      await api.post('/api/inquiries', formData);
      toast.success('Service Request Sent! We will call you shortly.', { id: loadingToast });
      setFormData({ name: '', phone: '', serviceType: 'AC Repair', address: '', message: '' });
    } catch (error) {
      toast.error('Failed to send request. Please try again.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (minimal) {
    return (
      <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-navy"></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm" />
          <input type="tel" placeholder="Phone" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm" />
          
          <div className="relative" ref={dropdownRef}>
            <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-transparent font-bold text-sm text-brand-navy">
              <div className="flex items-center space-x-2">
                {services.find(s => s.id === formData.serviceType)?.icon}
                <span>{services.find(s => s.id === formData.serviceType)?.label}</span>
              </div>
              <FiChevronDown />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {services.map((s) => (
                  <button key={s.id} type="button" onClick={() => { setFormData({ ...formData, serviceType: s.id }); setIsDropdownOpen(false); }} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 text-left font-bold text-xs text-gray-600">
                    {s.icon} <span>{s.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <textarea placeholder="Address" required rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"></textarea>
          <textarea placeholder="Describe Problem (Optional)" rows="2" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"></textarea>
          <button type="submit" disabled={isSubmitting} className="w-full bg-brand-navy text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg hover:-translate-y-1 transition-all">
            {isSubmitting ? 'Sending...' : 'Book Now'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <section id="contact" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Trust Cards */}
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-sm font-black text-brand-orange tracking-[0.3em] uppercase">Why Choose FixSure</h2>
            <h3 className="text-4xl md:text-6xl font-black text-brand-navy leading-tight uppercase tracking-tighter italic">Professional Service <span className="text-brand-orange">Guaranteed</span></h3>
            <p className="text-gray-500 text-lg font-medium">Over 1000+ satisfied customers in Delhi NCR. We provide top-notch repair services for all your household appliances.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustCards.map((card, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col space-y-4 hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h4 className="text-lg font-black text-brand-navy uppercase tracking-tight">{card.title}</h4>
                  <p className="text-gray-400 text-xs font-bold leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-[50px] shadow-2xl p-10 md:p-16 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-brand-navy"></div>
              <div className="text-center mb-10">
                <h3 className="text-3xl font-black text-brand-navy uppercase tracking-tighter">Book Service</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Professional technicians at your doorstep</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" />
                    <input type="text" placeholder="Full Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm" />
                  </div>
                  <div className="relative group">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-orange" />
                    <input type="tel" placeholder="Mobile Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm" />
                  </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all font-bold text-sm text-brand-navy">
                    <div className="flex items-center space-x-3">
                      {services.find(s => s.id === formData.serviceType)?.icon}
                      <span>{services.find(s => s.id === formData.serviceType)?.label}</span>
                    </div>
                    <FiChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                      {services.map((service) => (
                        <button key={service.id} type="button" onClick={() => { setFormData({ ...formData, serviceType: service.id }); setIsDropdownOpen(false); }} className={`w-full flex items-center space-x-4 px-6 py-4 hover:bg-orange-50 transition-colors text-left font-bold text-sm ${formData.serviceType === service.id ? 'bg-orange-50 text-brand-orange' : 'text-gray-600'}`}>
                          <span className="text-lg">{service.icon}</span>
                          <span>{service.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <FiMapPin className="absolute left-4 top-6 text-gray-400 group-focus-within:text-brand-orange" />
                  <textarea placeholder="Your Address" required rows="2" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"></textarea>
                </div>

                <div className="relative group">
                  <FiActivity className="absolute left-4 top-6 text-gray-400 group-focus-within:text-brand-orange" />
                  <textarea placeholder="Describe Your Problem (Optional)" rows="2" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-orange outline-none font-bold text-sm"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-navy hover:bg-gray-800 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-3 uppercase tracking-widest text-sm">
                  {isSubmitting ? 'Sending...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
