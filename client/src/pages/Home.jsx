import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const Home = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Services />
      <ContactForm />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Home;
