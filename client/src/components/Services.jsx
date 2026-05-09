import React from 'react';
import { Link } from 'react-router-dom';
import { FiWind, FiBox, FiRefreshCw, FiZap, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const services = [
  {
    id: 'ac',
    title: 'AC Services',
    description: 'Expert repair, installation, and deep cleaning for all split and window AC brands.',
    icon: <FiWind size={40} className="text-brand-orange" />,
    features: ['Gas Refill', 'Installation', 'PCB Repair'],
    link: '/service/ac'
  },
  {
    id: 'refrigerator',
    title: 'Refrigerator',
    description: 'Quick cooling restoration and gas refilling for single, double door and side-by-side fridges.',
    icon: <FiBox size={40} className="text-brand-orange" />,
    features: ['Cooling Issue', 'Gas Leakage', 'Thermostat'],
    link: '/service/refrigerator'
  },
  {
    id: 'washing-machine',
    title: 'Washing Machine',
    description: 'Reliable repair for top-load, front-load, and semi-automatic machines of all major brands.',
    icon: <FiRefreshCw size={40} className="text-brand-orange" />,
    features: ['Drum Fix', 'Motor Repair', 'Drain Issue'],
    link: '/service/washing-machine'
  },
  {
    id: 'microwave',
    title: 'Microwave & Oven',
    description: 'Professional repair for heating issues, keypad failures, and turntable problems.',
    icon: <FiZap size={40} className="text-brand-orange" />,
    features: ['Heating Fix', 'Keypad Repair', 'Magnetron'],
    link: '/service/microwave'
  }
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-orange tracking-widest uppercase mb-2">What We Do</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-brand-navy">Our Premium Services</h3>
          <div className="w-24 h-1 bg-brand-orange mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 group flex flex-col h-full">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-orange group-hover:bg-opacity-10 transition-all duration-300">
                {service.icon}
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-4">{service.title}</h4>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm flex-grow">
                {service.description}
              </p>
              <ul className="space-y-3 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs font-semibold text-gray-700">
                    <FiCheckCircle className="text-brand-orange mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link 
                to={service.link} 
                className="flex items-center justify-between w-full py-3 px-6 rounded-xl bg-brand-navy text-white font-bold text-sm hover:bg-gray-800 transition-all"
              >
                View Details
                <FiArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
