import React, { useState } from 'react';
import { Ticket, Mail, Phone, Globe } from 'lucide-react';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
    alert('Message sent successfully!');
  };

  return (
    <footer className="bg-black border-t border-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + About */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center transform rotate-12">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Rush-to-Go</span>
                <div className="text-xs text-cyan-500 font-medium">
                  Movies · Anytime · Even Last Minute
                </div>
              </div>
            </div>
            <p className="text-white mb-6 max-w-md leading-relaxed">
              Rush-to-Go is a secure, user-friendly ticket resale marketplace. 
              Sellers recover up to 75–80% of their ticket price, buyers save 20–30% 
              with last-minute deals, and payments are powered by Stripe & PayPal.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform Features</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-white hover:text-cyan-500 transition-colors duration-200">Ticket Resale Marketplace</a></li>
              <li><a href="#features" className="text-white hover:text-cyan-500 transition-colors duration-200">Affordable Last-Minute Deals</a></li>
              <li><a href="#features" className="text-white hover:text-cyan-500 transition-colors duration-200">Secure Payments</a></li>
              <li><a href="#features" className="text-white hover:text-cyan-500 transition-colors duration-200">Smart Tech + GPS</a></li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                rows={4}
                required
              />
              <button
                type="submit"
                className="bg-cyan-500 text-black font-semibold px-6 py-2 rounded-lg hover:bg-cyan-400 transition-colors duration-200"
              >
                Send Message
              </button>
            </form>

            <div className="mt-6 text-white text-sm space-y-2">
              <p>Or reach us via:</p>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cyan-500" />
                  <span>support@rush-to-go.com</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <span>rush-to-go.netlify.app</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-white mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">© 2025 Team Rush-to-Go. All rights reserved.</p>
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <p className="text-cyan-500 text-sm font-medium">Secure · Instant · Affordable</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
