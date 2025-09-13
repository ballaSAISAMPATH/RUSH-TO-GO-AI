import React from 'react';
import { FileText, Users, Shield, CheckCircle, Bot, AlertTriangle, Gavel, RefreshCw, Mail, ArrowLeft, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../Auth/AuthLayout';

const GoBackButton = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md hover:from-cyan-600 hover:to-blue-700 transition-all font-medium transform hover:scale-105"
    >
      <ArrowLeft size={18} />
      <span>Go Back</span>
    </button>
  );
};

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Go Back Button */}
        <div className="mb-8">
          <GoBackButton />
        </div>
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInUp">
          <div className="flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-cyan-500 mr-4" />
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-gray-500 text-lg">Last Updated: July 26, 2025</p>
          <div className="mt-6 p-6 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-lg">
            <p className="text-cyan-400 font-semibold text-lg">
              By using our RUSH TO GO application, you agree to abide by these terms.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Section 1 */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-md animate-slideUp">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">1. User Eligibility</h2>
            </div>
            <p className="text-gray-400">
              You must be at least 13 years old to use this platform. If you are under 18, you must have permission from a parent or legal guardian.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-md animate-slideUp" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">2. Account Responsibility</h2>
            </div>
            <ul className="space-y-3">
              {[
                'Keep your login credentials confidential.',
                'You are responsible for all activity under your account.'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-md animate-slideUp" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center mb-6">
              <CheckCircle className="w-8 h-8 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">3. Ticket Resale Marketplace</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Our platform allows you to buy and sell last-minute tickets securely.
            </p>
            <div className="space-y-4">
              {[
                'Sellers can recover up to 75-80% of their ticket price.',
                'Buyers get access to discounted tickets, saving 20-30%.',
                'A platform commission of 5-10% is charged on each resale transaction.'
              ].map((item, index) => (
                <div key={index} className="bg-green-950 p-4 rounded-lg border border-green-800">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-green-400">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-md animate-slideUp" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">4. Acceptable Use</h2>
            </div>
            <p className="text-gray-400 mb-4">
              You agree <strong className="text-red-500">not</strong> to:
            </p>
            <div className="space-y-4">
              {[
                'Use the app for unlawful activities',
                'Sell fraudulent or invalid tickets',
                'Attempt to hack, reverse-engineer, or disrupt the platform'
              ].map((item, index) => (
                <div key={index} className="bg-red-950 p-4 rounded-lg border border-red-800">
                  <div className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-red-400">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5 */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-md animate-slideUp" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center mb-6">
              <Gavel className="w-8 h-8 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
            </div>
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
              <p className="text-gray-400">
                We are not liable for any loss or damage arising from your use of the platform, including financial loss from reselling or purchasing tickets.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800 shadow-md animate-slideUp" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center mb-6">
              <RefreshCw className="w-8 h-8 text-cyan-500 mr-3" />
              <h2 className="text-2xl font-bold text-white">6. Changes to the Terms</h2>
            </div>
            <p className="text-gray-400">
              We may revise these terms at any time. Continued use means you accept the updated terms.
            </p>
          </div>

          {/* Contact Section */}
          <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500/30 shadow-lg mt-12 animate-slideUp" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-cyan-500 mr-3" />
              <h3 className="text-xl font-bold text-cyan-400">Contact</h3>
            </div>
            <p className="text-gray-400">
              For questions regarding these terms, reach out to{' '}
              <a
                href="mailto:praveengamini009@gmail.com"
                className="text-cyan-500 hover:text-cyan-300 underline font-semibold"
              >
                rushToGoVIIT@gmail.com
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 RUSH TO GO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TermsOfService;