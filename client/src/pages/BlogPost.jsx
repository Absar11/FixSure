import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FiCalendar, FiUser, FiClock, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Tips to Keep Your AC Cooling Like New",
    content: `
      Maintaining your air conditioner is crucial for both comfort and efficiency. 
      Here are the top 5 tips from FixSure experts:
      1. Clean the Filters Every 15 Days: Dust accumulation reduces airflow and cooling.
      2. Check for Gas Leakage: If your AC isn't cooling, a gas top-up might be needed.
      3. Keep the Outdoor Unit Clear: Ensure there is enough space around the compressor for heat dissipation.
      4. Professional Service Once a Season: A deep clean by a technician can prevent major breakdowns.
      5. Use Inverter Mode Wisely: Setting the temperature to 24-26°C is ideal for both cooling and energy saving.
    `,
    image: "https://images.pexels.com/photos/5466810/pexels-photo-5466810.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 10, 2024",
    author: "FixSure Experts",
    readTime: "5 min read",
    category: "AC Repair"
  },
  {
    id: 2,
    title: "Why Your Refrigerator is Not Cooling: Common Issues",
    content: `
      A refrigerator that doesn't cool can lead to food spoilage. Common causes include:
      - Dirty Condenser Coils: When coils are covered in dust, the fridge works harder to cool.
      - Damaged Door Gaskets: If the seal is loose, cold air escapes.
      - Thermostat Issues: Sometimes it's just a wrong setting or a faulty sensor.
      - Blocked Vents: Ensure food items aren't blocking the airflow inside.
    `,
    image: "https://images.pexels.com/photos/5849580/pexels-photo-5849580.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 08, 2024",
    author: "FixSure Experts",
    readTime: "4 min read",
    category: "Maintenance"
  },
  {
    id: 3,
    title: "Washing Machine Maintenance: Extend Its Life by 5 Years",
    content: `
      Your washing machine is a workhorse. Give it some love with these tips:
      - Use the right detergent to prevent scale buildup.
      - Leave the door open after a wash to prevent mold and smell.
      - Clean the lint filter after every 5-10 washes.
      - Don't overload the drum, as it puts pressure on the motor.
    `,
    image: "https://images.pexels.com/photos/5591501/pexels-photo-5591501.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 05, 2024",
    author: "FixSure Experts",
    readTime: "6 min read",
    category: "Appliances"
  },
  {
    id: 4,
    title: "Fatehpur Launch: Bringing Quality Service to Your City",
    content: `
      We are thrilled to announce that FixSure is now officially serving the residents of Fatehpur!
      We bring our signature transparent pricing and expert technician guarantee to your doorstep.
      Whether it's an AC repair, Fridge maintenance, or Washing Machine troubleshooting, 
      Fatehpur residents can now book services in just a few clicks.
      Special launch offer: Get 10% OFF on your first service in Fatehpur!
    `,
    image: "https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "May 09, 2024",
    author: "Admin",
    readTime: "3 min read",
    category: "News"
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-2xl font-bold">Article Not Found</h2>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <article className="pt-44 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-brand-orange font-black uppercase text-xs tracking-widest mb-8 hover:-translate-x-2 transition-all">
            <FiArrowLeft className="mr-2" /> Back to Blog
          </Link>
          
          <div className="space-y-6 mb-12">
            <span className="bg-brand-orange text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{post.category}</span>
            <h1 className="text-4xl md:text-6xl font-black text-brand-navy leading-tight uppercase tracking-tighter">{post.title}</h1>
            
            <div className="flex items-center space-x-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-8">
              <span className="flex items-center"><FiUser className="mr-2 text-brand-orange" /> {post.author}</span>
              <span className="flex items-center"><FiCalendar className="mr-2 text-brand-orange" /> {post.date}</span>
              <span className="flex items-center"><FiClock className="mr-2 text-brand-orange" /> {post.readTime}</span>
            </div>
          </div>

          <div className="rounded-[50px] overflow-hidden mb-16 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-auto" />
          </div>

          <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed space-y-8">
            {post.content.split('\n').map((para, i) => (
              para.trim() && <p key={i}>{para.trim()}</p>
            ))}
          </div>

          <div className="mt-16 p-10 bg-brand-light rounded-[40px] border border-gray-100">
            <h3 className="text-xl font-black text-brand-navy uppercase tracking-tight mb-4">Need help with your appliance?</h3>
            <p className="text-gray-500 mb-8 font-medium">Don't wait for a breakdown. Book a professional maintenance service today and save money in the long run.</p>
            <Link to="/#contact" className="inline-block bg-brand-navy text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
              Book a Technician Now
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
