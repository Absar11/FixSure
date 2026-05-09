import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = "919310700828"; 
  const message = "Hello FixSure, I would like to book a service for my home appliance.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all transform hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={32} />
      <span className="absolute -top-12 right-0 bg-white text-brand-navy text-[10px] font-black py-2 px-4 rounded-xl shadow-xl border border-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Chat with Us
      </span>
    </a>
  );
};

export default WhatsAppButton;
