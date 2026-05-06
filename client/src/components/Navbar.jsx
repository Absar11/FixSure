import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-effect py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold">
              <span className="text-brand-navy">Fix</span>
              <span className="text-brand-orange">Sure</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#services" className="text-brand-navy hover:text-brand-orange transition-colors font-medium">Services</a>
            <a href="#about" className="text-brand-navy hover:text-brand-orange transition-colors font-medium">About Us</a>
            <a href="#contact" className="bg-brand-orange text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors shadow-md font-medium">
              Book Now
            </a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-brand-navy focus:outline-none">
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl absolute w-full left-0 top-full">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <a href="#services" className="block px-3 py-2 text-brand-navy font-medium" onClick={() => setIsOpen(false)}>Services</a>
            <a href="#about" className="block px-3 py-2 text-brand-navy font-medium" onClick={() => setIsOpen(false)}>About Us</a>
            <a href="#contact" className="block px-3 py-2 text-brand-orange font-bold" onClick={() => setIsOpen(false)}>Book Now</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
