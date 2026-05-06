import React from 'react';
import { FiTool, FiSettings, FiWind, FiCheckCircle } from 'react-icons/fi';

const services = [
  {
    title: 'AC Repair',
    description: 'Fast and reliable repair for all AC brands. We fix cooling issues, strange noises, and water leaks.',
    icon: <FiTool size={40} className="text-brand-orange" />,
    features: ['Compressor Repair', 'Gas Refill', 'PCB Repair']
  },
  {
    title: 'AC Installation',
    description: 'Professional installation for split and window ACs ensuring optimal cooling performance and longevity.',
    icon: <FiSettings size={40} className="text-brand-orange" />,
    features: ['Split AC Setup', 'Window AC Setup', 'Wiring & Piping']
  },
  {
    title: 'AC Servicing',
    description: 'Regular maintenance to improve air quality, reduce energy bills, and prevent unexpected breakdowns.',
    icon: <FiWind size={40} className="text-brand-orange" />,
    features: ['Deep Cleaning', 'Filter Replacement', 'Performance Check']
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-orange tracking-widest uppercase mb-2">What We Do</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-brand-navy">Our Premium Services</h3>
          <div className="w-24 h-1 bg-brand-orange mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8 border border-gray-100 group">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300">
                {service.icon}
              </div>
              <h4 className="text-2xl font-bold text-brand-navy mb-4">{service.title}</h4>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm font-medium text-gray-700">
                    <FiCheckCircle className="text-brand-orange mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
