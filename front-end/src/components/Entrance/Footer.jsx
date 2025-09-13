import React from 'react';
import { Brain, Mail, Phone, Globe, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center transform rotate-12">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">
                  AI TaskFlow
                </span>
                <div className="text-xs text-cyan-500 font-medium">Powered by AI</div>
              </div>
            </div>
            <p className="text-white mb-6 max-w-md leading-relaxed">
              Experience the future of task management with AI that understands your workflow, 
              automatically prioritizes tasks, and helps you achieve more with intelligent automation.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-cyan-500" />
              AI Features
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-white hover:text-cyan-500 transition-colors duration-200">Smart Breakdown</a></li>
              <li><a href="#" className="text-white hover:text-cyan-500 transition-colors duration-200">Auto Prioritization</a></li>
              <li><a href="#" className="text-white hover:text-cyan-500 transition-colors duration-200">Smart Scheduling</a></li>
              <li><a href="#" className="text-white hover:text-cyan-500 transition-colors duration-200">AI Analytics</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-500" />
                <a   href="https://mail.google.com/mail/u/0/?to=praveengamini009@gmail.com&fs=1&tf=cm" target="_blank" className="text-white hover:text-cyan-500 transition-colors duration-200">
                  praveengamini009@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-cyan-500" />
                <a href="tel:+917013268191" className="text-white hover:text-cyan-500 transition-colors duration-200">
                  +91 7013268191
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cyan-500" />
                <a  href="https://praveengamini.netlify.app" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-500 transition-colors duration-200">
                  praveengamini.netlify.app
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Linkedin className="w-4 h-4 text-cyan-500" />
                <a  href="https://www.linkedin.com/in/praveen-gamini-3bb729273" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-500 transition-colors duration-200">
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Github className="w-4 h-4 text-cyan-500" />
                <a  href="https://github.com/praveengamini" target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-500 transition-colors duration-200">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm">
              © 2025 Praveen Gamini. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              <p className="text-cyan-500 text-sm font-medium">Available for Collaboration</p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
