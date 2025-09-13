import React, { useState } from 'react';
import { Brain, Menu, Zap, Contact, Star, ChartNoAxesCombined, Ticket } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-md border-b border-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo + Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center transform rotate-12">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-white">Rush-to-Go</span>
              <div className="text-xs text-cyan-500 font-medium">Movies · Anytime · Even Last Minute</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#demo" className="text-white hover:text-cyan-500 transition-colors duration-200">How It Works</a>
            <a href="#reviews" className="text-white hover:text-cyan-500 transition-colors duration-200">Reviews</a>
            <a href="#stats" className="text-white hover:text-cyan-500 transition-colors duration-200">Stats</a>
            <a href="#features" className="text-white hover:text-cyan-500 transition-colors duration-200">Features</a>
            <a href="#contact" className="text-white hover:text-cyan-500 transition-colors duration-200">Contact Us</a>
            <button
              className="bg-cyan-500 hover:bg-[#8FE877] cursor-pointer text-white font-semibold px-4 py-2 rounded-md transition-colors duration-200"
              onClick={() => navigate('/auth/login')}
            >
              Login
            </button>
          </nav>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              className="bg-cyan-500 hover:bg-[#8FE877] text-white font-semibold px-3 py-2 rounded-md transition-colors duration-200 text-sm"
              onClick={() => navigate('/auth/login')}
            >
              Login
            </button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="text-white hover:text-cyan-500 transition-colors duration-200 p-2 hover:bg-[#66B539]/5 rounded-lg">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[320px] sm:w-[400px] bg-black border-l border-cyan-500"
              >
                <SheetHeader className="pb-6 border-b border-white/20">
                  <SheetTitle className="flex items-center space-x-3 justify-start">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-[#8FE877] rounded-xl flex items-center justify-center transform rotate-12 shadow-lg shadow-[#66B539]/25">
                        <Ticket className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-cyan-500 to-[#66B539] rounded-full animate-pulse shadow-sm"></div>
                    </div>
                    <div>
                      <span className="text-xl font-bold text-white">Rush-to-Go</span>
                      <div className="text-xs text-cyan-500 font-semibold">Movies · Anytime · Last Minute</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-4 mt-8">
                  <a
                    href="#demo"
                    className="group flex items-center space-x-3 text-white hover:text-[#66B539] transition-all duration-300 text-lg font-medium py-3 px-4 rounded-lg hover:bg-cyan-50/5 hover:translate-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Zap className="w-5 h-5 text-cyan-500 group-hover:text-[#66B539]" />
                    <span>How It Works</span>
                  </a>
                  <a
                    href="#reviews"
                    className="group flex items-center space-x-3 text-white hover:text-cyan-500 transition-all duration-300 text-lg font-medium py-3 px-4 rounded-lg hover:bg-cyan-50/5 hover:translate-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star className="w-5 h-5 text-cyan-500 group-hover:text-[#66B539]" />
                    <span>Reviews</span>
                  </a>
                  <a
                    href="#stats"
                    className="group flex items-center space-x-3 text-white hover:text-cyan-500 transition-all duration-300 text-lg font-medium py-3 px-4 rounded-lg hover:bg-cyan-50/5 hover:translate-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ChartNoAxesCombined className="w-5 h-5 text-cyan-500 group-hover:text-[#66B539]" />
                    <span>Stats</span>
                  </a>
                  <a
                    href="#features"
                    className="group flex items-center space-x-3 text-white hover:text-cyan-500 transition-all duration-300 text-lg font-medium py-3 px-4 rounded-lg hover:bg-cyan-50/5 hover:translate-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Brain className="w-5 h-5 text-cyan-500 group-hover:text-[#66B539]" />
                    <span>Features</span>
                  </a>
                  <a
                    href="#contact"
                    className="group flex items-center space-x-3 text-white hover:text-cyan-500 transition-all duration-300 text-lg font-medium py-3 px-4 rounded-lg hover:bg-cyan-50/5 hover:translate-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Contact className="w-5 h-5 text-cyan-500 group-hover:text-[#66B539]" />
                    <span>Contact Us</span>
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
