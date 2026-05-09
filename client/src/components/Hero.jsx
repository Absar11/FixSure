import React from 'react';
import heroBg from '../assets/hero_bg.png';

const Hero = () => {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 flex items-center min-h-screen" id="home">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Home Appliance Technician" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-brand-navy bg-opacity-70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent opacity-80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-orange bg-opacity-20 text-brand-orange font-semibold tracking-wider mb-4 border border-brand-orange border-opacity-50 uppercase text-xs">
            Expert Home Appliance Services
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 leading-tight">
            FixSure <span className="text-brand-orange text-3xl md:text-5xl block mt-2">Apke Ghar ka Sahi Saathi</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl">
            Professional repair, installation, and maintenance for AC, Refrigerator, Washing Machine, Microwave, and more. Fast, reliable, and affordable solutions at your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 text-center">
              Book Service Now
            </a>
            <a href="#contact" className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white font-bold py-4 px-8 rounded-full transition-all text-center">
              Our Services
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
