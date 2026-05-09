import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t-4 border-brand-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-white">Fix</span>
              <span className="text-brand-orange">Sure</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              FixSure (Apke Ghar ka Sahi Saathi). Providing reliable, fast, and affordable home appliance repair and maintenance services directly to your doorstep.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-brand-orange transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-brand-orange transition-colors">Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-brand-orange transition-colors">Services</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-brand-orange transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-brand-orange transition-colors">Contact</a></li>
              <li><a href="/admin/login" className="text-gray-400 hover:text-brand-orange transition-colors">Admin Login</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="text-brand-orange mt-1 mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">Delhi NCR, India</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="text-brand-orange mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">+91 93107 00828</span>
              </li>
              <li className="flex items-center">
                <FiMail className="text-brand-orange mr-3 flex-shrink-0" size={20} />
                <span className="text-gray-400">support@fixsure.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} FixSure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
