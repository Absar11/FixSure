import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine text color based on scroll and page
  const textColorClass = scrolled 
    ? 'text-brand-navy' 
    : (isHomePage ? 'text-white' : 'text-white'); // Both home and service pages have dark hero sections

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-black tracking-tighter">
              <span className={scrolled ? 'text-brand-navy' : 'text-white'}>Fix</span>
              <span className="text-brand-orange">Sure</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-10 items-center">
            {isHomePage ? (
              <>
                <a href="#services" className={`${textColorClass} hover:text-brand-orange transition-colors font-bold uppercase text-xs tracking-widest`}>Services</a>
                <a href="#about" className={`${textColorClass} hover:text-brand-orange transition-colors font-bold uppercase text-xs tracking-widest`}>About Us</a>
              </>
            ) : (
              <>
                <Link to="/" className={`${textColorClass} hover:text-brand-orange transition-colors font-bold uppercase text-xs tracking-widest`}>Home</Link>
                <a href="#services" className={`${textColorClass} hover:text-brand-orange transition-colors font-bold uppercase text-xs tracking-widest`}>Other Services</a>
              </>
            )}
            <a href="#contact" className="bg-brand-orange text-white px-8 py-3 rounded-xl hover:bg-orange-600 transition-all shadow-lg font-black uppercase text-xs tracking-widest transform hover:-translate-y-1">
              Book Now
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className={`${scrolled ? 'text-brand-navy' : 'text-white'} focus:outline-none`}>
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-2xl absolute w-full left-0 top-full animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="px-6 pt-4 pb-10 space-y-4 flex flex-col">
            {isHomePage ? (
              <>
                <a href="#services" className="block py-3 text-brand-navy font-black uppercase text-sm tracking-widest border-b border-gray-50" onClick={() => setIsOpen(false)}>Services</a>
                <a href="#about" className="block py-3 text-brand-navy font-black uppercase text-sm tracking-widest border-b border-gray-50" onClick={() => setIsOpen(false)}>About Us</a>
              </>
            ) : (
              <>
                <Link to="/" className="block py-3 text-brand-navy font-black uppercase text-sm tracking-widest border-b border-gray-100" onClick={() => setIsOpen(false)}>Home</Link>
              </>
            )}
            <a href="#contact" className="block py-4 text-center bg-brand-orange text-white font-black uppercase text-sm tracking-widest rounded-xl shadow-lg" onClick={() => setIsOpen(false)}>Book Now</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
