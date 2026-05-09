import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPhone, FiArrowLeft, FiShield, FiClock, FiUserCheck, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

// Import Images
import acImg from '../assets/AC_Technician.png';
import fridgeImg from '../assets/refrigrator_technician.png';
import washingImg from '../assets/Washing_Machine_Technician.png';
import microwaveImg from '../assets/Microwave_Technician.png';

const serviceData = {
  'ac': {
    title: 'AC Services',
    banner: 'Fast Repair & Deep Cleaning',
    image: acImg,
    description: 'We provide top-notch AC services for all major brands including Split, Window, and Inverter ACs. Our experts ensure your comfort with fast and reliable solutions.',
    benefits: ['45 Days Warranty', 'Same Day Service', 'Genuine Parts', 'Expert Support'],
    points: ['Split & Window AC Setup', 'Gas Charging & Leakage Repair', 'PCB & Compressor Repair', 'Jet Pump Deep Cleaning']
  },
  'refrigerator': {
    title: 'Refrigerator',
    banner: 'Cooling Restoration & Gas Refilling',
    image: fridgeImg,
    description: 'Facing cooling issues or water leaks in your fridge? Our technicians specialize in single door, double door, and side-by-side refrigerator repairs.',
    benefits: ['Certified Techs', 'Doorstep Repair', 'Fixed Prices', 'All Brands'],
    points: ['Compressor Replacement', 'Thermostat & Relay Repair', 'Gas Refilling', 'Defrost Issue Resolution']
  },
  'washing-machine': {
    title: 'Washing Machine',
    banner: 'Fully & Semi-Automatic Service',
    image: washingImg,
    description: 'From drum noise to water drainage problems, we fix all issues in front-load and top-load washing machines using high-quality parts.',
    benefits: ['Low Cost Service', 'On-time Arrival', 'Original Parts', 'Guarantee'],
    points: ['Motor & Drum Repair', 'Control Board (PCB) Fix', 'Drain Pump Replacement', 'Vibration Correction']
  },
  'microwave': {
    title: 'Microwave & Oven',
    banner: 'Heating & Keypad Failure Solutions',
    image: microwaveImg,
    description: 'Don’t let a broken microwave disrupt your kitchen. We offer expert repair for heating problems, spark issues, and keypad failures.',
    benefits: ['Instant Solutions', 'Safe & Secure', 'Experienced Staff', 'Fair Pricing'],
    points: ['Magnetron Replacement', 'Touch Pad & Switch Repair', 'Turntable Motor Fix', 'High Voltage Transformer']
  }
};

const ServiceDetail = () => {
  const { type } = useParams();
  const service = serviceData[type];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-brand-navy mb-4">Service Not Found</h2>
          <Link to="/" className="text-brand-orange font-bold hover:underline flex items-center justify-center">
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      
      {/* Premium Hero Banner with Image */}
      <section className="pt-40 pb-24 bg-brand-navy relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover object-center opacity-40" />
          <div className="absolute inset-0 bg-brand-navy opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy to-transparent opacity-80"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center text-brand-orange text-xs font-black uppercase tracking-widest mb-8 hover:translate-x-[-5px] transition-transform">
            <FiArrowLeft className="mr-2" /> Back to Home
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight uppercase tracking-tight">
              {service.title} <span className="text-brand-orange">Repair</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl leading-relaxed">
              {service.banner}. Reliable, fast, and affordable solutions at your doorstep.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Content: Description & Features */}
            <div className="lg:w-3/5 space-y-12">
              <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100">
                <h2 className="text-3xl font-black text-brand-navy mb-6 tracking-tight uppercase">Service Overview</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-10">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
                    <h3 className="text-lg font-black text-brand-navy mb-6 uppercase tracking-wider">Expertise</h3>
                    <ul className="space-y-4">
                      {service.points.map((point, idx) => (
                        <li key={idx} className="flex items-start text-sm font-bold text-gray-700">
                          <FiCheckCircle className="text-brand-orange mt-1 mr-3 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                    <h3 className="text-lg font-black text-brand-navy mb-6 uppercase tracking-wider">Benefits</h3>
                    <ul className="space-y-4">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-sm font-bold text-gray-700">
                          <FiShield className="text-brand-navy mt-1 mr-3 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: <FiClock />, title: '90-Min Arrival', subtitle: 'Fast Service' },
                  { icon: <FiUserCheck />, title: 'Verified Techs', subtitle: 'Background Checked' },
                  { icon: <FiPhone />, title: 'Call 24/7', subtitle: '9310700828' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-brand-light rounded-2xl flex items-center justify-center text-brand-navy text-xl shadow-inner">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-brand-navy text-sm uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content: Sticky Form */}
            <div className="lg:w-2/5">
              <div className="lg:sticky lg:top-32">
                <ContactForm minimal={true} />
                
                {/* Emergency Card */}
                <div className="mt-6 bg-brand-navy p-8 rounded-3xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange opacity-20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                  <h4 className="text-lg font-black mb-2 uppercase tracking-tight">Need Urgent Help?</h4>
                  <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-wider">Available 24/7 for Emergencies</p>
                  <a href="tel:9310700828" className="flex items-center justify-center space-x-3 bg-brand-orange hover:bg-orange-600 text-white py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest shadow-xl">
                    <FiPhone />
                    <span>Call Technician</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
