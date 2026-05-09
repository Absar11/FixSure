import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiCheckCircle, FiShield, FiAward, FiClock, FiStar, FiMapPin } from 'react-icons/fi';
import aboutImg from '../assets/hero_bg2.png';
import ReviewForm from '../components/ReviewForm';

const reviewsData = [
  {
    name: 'Amit Kumar',
    location: 'Dwarka, Delhi',
    text: 'FixSure technicians are very professional. They fixed my double-door fridge in just 1 hour. Highly recommended for their transparency.',
    rating: 5,
    initials: 'AK'
  },
  {
    name: 'Sonal Singh',
    location: 'Noida Sector 62',
    text: 'Great service! They arrived on time for my washing machine repair. The pricing was fair and the technician was very polite.',
    rating: 4.5,
    initials: 'SS'
  },
  {
    name: 'Rajesh Sharma',
    location: 'Indirapuram, Ghaziabad',
    text: 'I was worried about my AC gas charging but FixSure provided a 45-day warranty which gave me peace of mind. Excellent work!',
    rating: 5,
    initials: 'RS'
  },
  {
    name: 'Priya Mehta',
    location: 'DLF Phase 3, Gurgaon',
    text: 'The best microwave repair service in the city. Quick response and very professional handling of the equipment.',
    rating: 5,
    initials: 'PM'
  },
  {
    name: 'Vikram Aditya',
    location: 'Rohini, Delhi',
    text: 'Transparent pricing and genuine parts. I have used their services twice now and they never disappoint.',
    rating: 5,
    initials: 'VA'
  }
];

const About = () => {
  const [activeReview, setActiveReview] = useState(0);
  const [dbReviews, setDbReviews] = useState([]);

  const fetchApprovedReviews = async () => {
    try {
      const response = await axios.get(`http://${window.location.hostname}:5000/api/reviews/approved`);
      if (response.data.length > 0) {
        setDbReviews(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchApprovedReviews();
    
    const currentReviews = dbReviews.length > 0 ? dbReviews : reviewsData;
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % currentReviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [dbReviews.length]);

  const displayReviews = dbReviews.length > 0 ? dbReviews : reviewsData;

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      
      {/* Hero Header */}
      <section className="pt-40 pb-20 bg-brand-navy relative overflow-hidden text-white text-center md:text-left">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter">About <span className="text-brand-orange">FixSure</span></h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl font-bold italic border-l-4 border-brand-orange pl-6 mx-auto md:mx-0">
            "Apke Ghar ka Sahi Saathi" - Your trusted partner for all home appliance services.
          </p>
        </div>
      </section>

      {/* Our Story & Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2">
              <div className="relative group">
                <img src={aboutImg} alt="FixSure Team" className="rounded-[60px] shadow-2xl relative z-10 border-[12px] border-white grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-brand-orange rounded-full z-0 opacity-20 blur-2xl"></div>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-10">
              <h2 className="text-sm font-black text-brand-orange tracking-[0.3em] uppercase">Our Story</h2>
              <h3 className="text-4xl md:text-6xl font-black text-brand-navy leading-tight uppercase tracking-tighter">Reliability in every <span className="text-brand-orange">Repair</span></h3>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">
                FixSure was started with a simple vision: to make home appliance repair transparent, affordable, and reliable. We believe in quality over quantity, ensuring every job is done perfectly the first time.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-6">
                <div>
                  <h4 className="text-4xl font-black text-brand-navy">1000+</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Happy Customers</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-brand-navy">4</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Cities Served</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h4 className="text-4xl font-black text-brand-navy">10+</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Expert Techs</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {['Delhi', 'Noida', 'Gurgaon', 'Ghaziabad'].map((city) => (
                  <span key={city} className="flex items-center text-xs font-black text-brand-navy bg-gray-100 px-4 py-2 rounded-full uppercase tracking-tighter">
                    <FiMapPin className="mr-2 text-brand-orange" /> {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Sliding Reviews Section */}
      <section className="py-24 bg-brand-navy text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-sm font-black text-brand-orange tracking-[0.3em] uppercase mb-16">Customer Voices</h2>
          
          <div className="relative min-h-[400px] flex items-center justify-center">
            {displayReviews.map((review, index) => (
              <div 
                key={index} 
                className={`absolute w-full max-w-4xl transition-all duration-1000 transform ${
                  index === activeReview 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95 pointer-events-none'
                }`}
              >
                <div className="bg-white bg-opacity-5 p-12 rounded-[50px] border border-white border-opacity-10 backdrop-blur-xl">
                  <div className="flex justify-center space-x-1 text-brand-orange mb-8">
                    {[...Array(5)].map((_, i) => (
                      <FiStar 
                        key={i} 
                        fill={i < Math.floor(review.rating) ? "currentColor" : "transparent"} 
                        stroke="currentColor"
                        className={i === 4 && review.rating % 1 !== 0 ? "opacity-50" : ""}
                      />
                    ))}
                  </div>
                  <p className="text-2xl md:text-4xl font-bold italic mb-10 leading-relaxed tracking-tight text-gray-100">
                    "{review.text || review.message}"
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center font-black text-brand-navy text-xl">
                      {review.initials || review.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h5 className="font-black uppercase tracking-tighter text-xl">{review.name}</h5>
                      <p className="text-xs text-brand-orange font-bold uppercase tracking-widest">{review.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3 mt-12">
            {displayReviews.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveReview(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === activeReview ? 'bg-brand-orange w-8' : 'bg-white bg-opacity-30'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Submission Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ReviewForm />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
