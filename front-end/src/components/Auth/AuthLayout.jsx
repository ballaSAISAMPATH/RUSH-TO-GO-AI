import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Ticket, CheckCircle, Target, Calendar, Clock, Zap, Brain, ArrowLeft } from 'lucide-react';

const AuthLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black border-b-2 border-cyan-500 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 group -ml-4"
                aria-label="Go back to homepage"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-cyan-500 transition-colors duration-200" />
              </button>
              
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="p-2 bg-cyan-500 rounded-lg">
                  <Ticket className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Rush-to-Go</h1>
                      <div className="text-xs text-cyan-500 font-semibold">Movies · Anytime · Last Minute</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex min-h-screen pt-[80px]">
        {/* Left info panel */}
        <div className="hidden md:flex md:w-1/2 xl:w-3/5 bg-gradient-to-br from-gray-900 to-black p-6 lg:p-12 flex-col justify-center">
          <div className="max-w-lg mx-auto">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 lg:mb-4">
                Seamless Last-Minute Tickets
              </h2>
              <p className="text-base lg:text-lg xl:text-xl text-gray-300 leading-relaxed">
                Find, sell, and buy tickets effortlessly with  recommendations.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 lg:space-y-6">
              {[
                { icon: CheckCircle, title: "Instant Ticket Listing", desc: "List your tickets in seconds and reach buyers immediately." },
                { icon: Target, title: "Smart Recommendations", desc: "Get AI suggestions for pricing and availability." },
                { icon: Calendar, title: "Event Scheduling", desc: "Manage your upcoming events efficiently." },
                { icon: Clock, title: "Real-Time Updates", desc: "Stay informed about ticket status and sales." }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 lg:space-x-4">
                  <div className="p-2.5 lg:p-3 bg-cyan-500 rounded-lg flex-shrink-0">
                    <feature.icon className="w-5 h-5 lg:w-6 lg:h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 text-sm lg:text-base">{feature.title}</h3>
                    <p className="text-gray-300 text-xs lg:text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Example */}
            <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-gray-900 rounded-lg border-2 border-cyan-500 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-cyan-500" />
                <span className="font-semibold text-white text-sm lg:text-base">Example</span>
              </div>
              <div className="space-y-2 text-xs lg:text-sm">
                <div className="p-2.5 lg:p-3 bg-gray-800 rounded-lg">
                  <span className="font-medium text-white">You type:</span>
                  <p className="text-cyan-400 italic">"Sell my movie ticket for tonight"</p>
                </div>
                <div className="text-center text-gray-500">↓</div>
                <div className="p-2.5 lg:p-3 bg-gray-800 rounded-lg">
                  <span className="font-medium text-white">AI Suggests:</span>
                  <ul className="mt-2 space-y-1 text-gray-300">
                    <li>• List at 80% price</li>
                    <li>• Notify interested buyers</li>
                    <li>• Track views and engagement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-1/2 xl:w-2/5 flex items-center justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="w-full max-w-sm lg:max-w-md xl:max-w-lg">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-cyan-500 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <span className="text-sm text-gray-400 text-center sm:text-left">© 2025 Rush-to-Go. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <a onClick={() => navigate('/privacy-policy')} className="text-sm text-cyan-500 hover:text-cyan-400 cursor-pointer">Privacy Policy</a>
                <a onClick={() => navigate('/terms-service')} className="text-sm text-cyan-500 hover:text-cyan-400 cursor-pointer">Terms of Service</a>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Powered by</span>
              <Brain className="w-4 h-4 text-cyan-500" />
              <span className="text-cyan-500 font-medium">AI Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout;
