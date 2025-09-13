import React, { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [dots, setDots] = useState('');

  const tasks = [
    { text: "Initializing Rush-to-Go", emoji: "🎟️" },
    { text: "Loading Ticket Data", emoji: "📋" },
    { text: "Setting up Payment Gateway", emoji: "💳" },
    { text: "Syncing Offers & Deals", emoji: "🔄" },
    { text: "Ready to Go", emoji: "🚀" }
  ];

  // Simulate NProgress functionality
  const simulateNProgress = (progressValue) => {
    const nprogressBar = document.getElementById('nprogress-bar');
    if (nprogressBar) {
      nprogressBar.style.width = `${progressValue}%`;
    }
  };

  useEffect(() => {
    const nprogressContainer = document.getElementById('nprogress-container');
    if (nprogressContainer) nprogressContainer.style.opacity = '1';

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 3 + 1;
        simulateNProgress(Math.min(newProgress, 100));
        setCurrentTask(Math.min(Math.floor(newProgress / 20), tasks.length - 1));

        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            if (nprogressContainer) nprogressContainer.style.opacity = '0';
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // Animated dots
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  return (
    <>
      {/* NProgress Bar */}
      <div 
        id="nprogress-container"
        className="fixed top-0 left-0 right-0 z-50 transition-opacity duration-300"
        style={{ opacity: 0 }}
      >
        <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 relative overflow-hidden">
          <div 
            id="nprogress-bar"
            className="absolute top-0 left-0 h-full bg-white/30 transition-all duration-300 ease-out"
            style={{ width: '0%' }}
          >
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-r from-transparent to-white/50 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">

          {/* Main Logo/Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-20 h-20 mx-auto bg-cyan-500 rounded-2xl shadow-lg flex items-center justify-center text-3xl animate-pulse text-white">
                <Ticket className="w-10 h-10" />
              </div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 -left-4 w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mt-4 mb-2">
              Rush-to-Go
            </h1>
            <p className="text-cyan-400 text-sm md:text-base">
              Loading Ticket Resale Platform
            </p>
          </div>

          {/* Current Task */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-2xl animate-bounce">
                {tasks[currentTask]?.emoji}
              </div>
              <div>
                <div className="text-white font-medium text-sm md:text-base">
                  {tasks[currentTask]?.text}{dots}
                </div>
                <div className="text-cyan-300 text-xs md:text-sm">
                  Step {currentTask + 1} of {tasks.length}
                </div>
              </div>
            </div>

            {/* Local Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-700 rounded-full h-2 md:h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 relative"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>
              <div className="text-right text-cyan-400 text-xs md:text-sm font-medium mt-2">
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { icon: "🎫", title: "Ticket Deals" },
              { icon: "⚡", title: "Fast Checkout" },
              { icon: "💰", title: "Seller Refunds" },
              { icon: "📊", title: "Smart Analytics" }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-white/10 rounded-lg p-3 md:p-4 text-center transform transition-all duration-500 hover:scale-105 ${
                  currentTask > index ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-xl md:text-2xl mb-1">{feature.icon}</div>
                <div className="text-white text-xs md:text-sm font-medium">
                  {feature.title}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <div className="text-cyan-300 text-xs md:text-sm opacity-75">
              Preparing your Rush-to-Go experience...
            </div>
          </div>

          {/* Floating particles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-500 rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); opacity: 0.2; }
            50% { transform: translateY(-10px); opacity: 0.5; }
          }
        `}</style>
      </div>
    </>
  );
};

export default LoadingSpinner;
