import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiCalendar, FiUser, FiArrowRight, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Tips to Keep Your AC Cooling Like New",
    excerpt: "Learn how simple maintenance can save you from high electricity bills and costly repairs this summer.",
    image: "https://images.pexels.com/photos/5466810/pexels-photo-5466810.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 10, 2024",
    author: "FixSure Experts",
    readTime: "5 min read",
    category: "AC Repair"
  },
  {
    id: 2,
    title: "Why Your Refrigerator is Not Cooling: Common Issues",
    excerpt: "Is your fridge acting up? Check these 4 common problems before calling a technician.",
    image: "https://images.pexels.com/photos/5849580/pexels-photo-5849580.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 08, 2024",
    author: "FixSure Experts",
    readTime: "4 min read",
    category: "Maintenance"
  },
  {
    id: 3,
    title: "Washing Machine Maintenance: Extend Its Life by 5 Years",
    excerpt: "Simple habits that can prevent drum damage and water leakage in your washing machine.",
    image: "https://images.pexels.com/photos/5591501/pexels-photo-5591501.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 05, 2024",
    author: "FixSure Experts",
    readTime: "6 min read",
    category: "Appliances"
  },
  {
    id: 4,
    title: "Fatehpur Launch: Bringing Quality Service to Your City",
    excerpt: "FixSure is now live in Fatehpur! Read about our special launch offers and services available.",
    image: "https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 09, 2024",
    author: "Admin",
    readTime: "3 min read",
    category: "News"
  }
];

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      {/* Blog Hero */}
      <section className="pt-40 pb-20 bg-brand-navy relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange opacity-10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-sm font-black text-brand-orange tracking-[0.3em] uppercase mb-4">Our Journal</h2>
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">The <span className="text-brand-orange">FixSure</span> Blog</h1>
          <p className="text-xl text-gray-400 max-w-2xl font-medium">
            Expert advice, maintenance tips, and the latest news from the world of home appliance care.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[40px] mb-6 aspect-[4/3]">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white bg-opacity-90 backdrop-blur-md text-brand-navy px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center"><FiCalendar className="mr-1.5 text-brand-orange" /> {post.date}</span>
                    <span className="flex items-center"><FiClock className="mr-1.5 text-brand-orange" /> {post.readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-brand-navy group-hover:text-brand-orange transition-colors uppercase leading-tight tracking-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-500 font-medium leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <Link to={`/blog/${post.id}`} className="flex items-center space-x-2 text-brand-navy font-black uppercase text-xs tracking-widest group-hover:translate-x-2 transition-all">
                    <span>Read Article</span>
                    <FiArrowRight className="text-brand-orange" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-navy rounded-[60px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Stay Updated with <span className="text-brand-orange">Pro Tips</span></h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto font-medium">Join our mailing list to receive exclusive maintenance guides and special discount offers directly in your inbox.</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-brand-orange"
            />
            <button className="bg-brand-orange text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">Subscribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
