import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Brain, Zap, Calendar, Target, CheckCircle, Tag } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";

const ticketData = [
  { name: "Total Tickets Sold", value: 943 },
  { name: "Cancelled Tickets (~1%)", value: 9.43 },
  { name: "Not Resold Tickets (~50%)", value: 4.715 },
];
const TicketDemo = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoResponse, setDemoResponse] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("ticket-demo");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [isVisible]);

  const processResale = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setDemoResponse({
        breakdown: [
          {
            step: "Seller lists ticket (₹200)",
            detail: "Uploads unused ticket to platform",
          },
          {
            step: "Platform secures transaction",
            detail: "Stripe/PayPal ensures fraud-free resale",
          },
          {
            step: "Buyer gets discounted ticket",
            detail: "Pays ₹160–175 (20–30% cheaper)",
          },
          {
            step: "Seller refunded instantly",
            detail: "Receives ₹150 (75% of original)",
          },
          {
            step: "Platform keeps commission",
            detail: "10–15% retained for operations",
          },
        ],
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div
      id="ticket-demo"
      className={`bg-white/5 rounded-2xl p-8 border border-white hover:border-cyan-500 transition-all duration-300 ${
        isVisible ? "animate-fade-in-up" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex items-center mb-6">
        <Brain className="w-6 h-6 text-cyan-500 mr-3" />
        <h3 className="text-xl font-semibold text-white">
          Demo Ticket Resale Flow
        </h3>
      </div>

      <button
        onClick={processResale}
        disabled={isProcessing}
        className="w-full bg-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-500/90 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>Processing resale...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            <span>See How It Works</span>
          </>
        )}
      </button>

      {demoResponse && (
        <div className="mt-6 space-y-3">
          <h4 className="text-white font-semibold flex items-center">
            <CheckCircle className="w-4 h-4 text-cyan-500 mr-2" />
            Resale Breakdown:
          </h4>
          {demoResponse.breakdown.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 rounded-lg p-4 border border-white/20"
            >
              <span className="text-white font-medium">{item.step}</span>
              <p className="text-sm text-cyan-300 mt-1">{item.detail}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LandingPage = () => {
  const dispatch = useDispatch();

  const [currentFeature, setCurrentFeature] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});

  const features = [
    {
      icon: Brain,
      title: "Ticket Resale Marketplace",
      desc: "A trusted space where users can resell unused tickets instantly.",
      example: "Sell a ₹200 ticket → recover up to ₹150 securely.",
    },
    {
      icon: Target,
      title: "Affordable Last-Minute Deals",
      desc: "Buyers get discounted tickets at 20–30% less while enjoying the same show.",
      example: "₹200 ticket available at ₹160–175 just before the show.",
    },
    {
      icon: Calendar,
      title: "Secure & Reliable Payments",
      desc: "Powered by Stripe & PayPal ensuring safe transfers, instant refunds, and payouts.",
      example: "Both buyers & sellers enjoy fraud-free transactions.",
    },
    {
      icon: Tag,
      title: "Smart Technology Integration",
      desc: "AI/ML predicts demand, GPS tracking prevents fraud, and boosts trust.",
      example: "Weekend resale demand spikes by 40% auto-detected.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          if (entry.isIntersecting && !visibleSections[sectionId]) {
            setVisibleSections((prev) => ({ ...prev, [sectionId]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll("[data-scroll-animate]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [visibleSections]);

  return (
    <div className="min-h-screen bg-black">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
      `}</style>

      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/5"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-cyan-500/10 border border-cyan-500/30 rounded-full px-6 py-2 mb-8">
              <Zap className="w-4 h-4 text-cyan-500 mr-2" />
              <span className="text-cyan-500 font-medium text-sm">
                Secure · Instant · Affordable
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Resell & Buy Tickets
              <span className="block text-cyan-500">Anytime</span>
              <span className="block text-white">Even Last Minute</span>
            </h1>

            <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
              Sellers recover up to 75–80% of their ticket price, buyers save
              20–30%, and secure payments ensure smooth, fraud-free transactions
              — all in seconds.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border transition-all duration-500 transform hover:scale-105 ${
                      currentFeature === index
                        ? "bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/20"
                        : "bg-white/5 border-white/20 hover:border-cyan-500/50"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 mb-4 mx-auto transition-colors duration-300 ${
                        currentFeature === index
                          ? "text-cyan-500"
                          : "text-white"
                      }`}
                    />
                    <h3 className="text-white font-semibold mb-2 text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-white text-xs mb-3">{feature.desc}</p>
                    <div
                      className={`text-xs italic transition-colors duration-300 ${
                        currentFeature === index
                          ? "text-cyan-500"
                          : "text-white/70"
                      }`}
                    >
                      {feature.example}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-cyan-400">
            Movie Ticketing Stats – India 2023
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Understanding ticket cancellations and resales can help identify
            opportunities for resale platforms.
          </p>

          {/* Stats Cards */}
          <div
            id="stats"
            className="flex flex-col md:flex-row gap-6 mt-8 justify-between"
          >
            <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-gray-400 text-sm uppercase mb-2">
                Total Tickets Sold
              </h3>
              <p className="text-3xl font-bold text-cyan-400">
                <CountUp end={943} duration={2} suffix="M" />
              </p>
            </div>
            <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-gray-400 text-sm uppercase mb-2">
                Cancelled Tickets (~1%)
              </h3>
              <p className="text-3xl font-bold text-cyan-400">
                <CountUp end={9.43} duration={2} decimals={2} suffix="M" />
              </p>
            </div>
            <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-gray-400 text-sm uppercase mb-2">
                Not Resold Tickets (~50%)
              </h3>
              <p className="text-3xl font-bold text-cyan-400">
                <CountUp end={4.715} duration={2} decimals={2} suffix="M" />
              </p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="mt-12 h-64 bg-gray-800 p-4 rounded-lg shadow-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ticketData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fill: "white", fontSize: 12 }} />
                <YAxis tick={{ fill: "white", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderRadius: "8px",
                    border: "none",
                    color: "white",
                  }}
                />
                <Bar dataKey="value" fill="#06b6d4" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-gray-400 mt-4 text-sm max-w-xl mx-auto">
            Assuming a 1% cancellation rate, roughly half of those cancellations
            may remain unsold, representing a potential daily market of
            ~12,000–15,000 tickets.
          </p>
        </div>
      </section>

      {/* Demo Section */}
      <section
        id="demo"
        className="py-20 bg-gradient-to-r from-cyan-500/5 to-transparent"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="demo-header"
            data-scroll-animate
            className={`text-center mb-12 ${
              visibleSections["demo-header"]
                ? "animate-fade-in-up"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              See Ticket Resale in Action
            </h2>
            <p className="text-xl text-white">
              Experience how Rush-to-Go enables fair refunds and cheaper
              last-minute tickets.
            </p>
          </div>
          <TicketDemo />
        </div>
      </section>

      {/* Features Detail Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-br from-cyan-500/5 to-cyan-500/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            id="features-header"
            data-scroll-animate
            className={`text-center mb-16 ${
              visibleSections["features-header"]
                ? "animate-fade-in-up"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Rush-to-Go
            </h2>
            <p className="text-xl text-white">
              Explore how our platform makes last-minute ticket resale safe,
              affordable, and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div
              id="features-left"
              data-scroll-animate
              className={`space-y-8 ${
                visibleSections["features-left"]
                  ? "animate-fade-in-left"
                  : "opacity-0 translate-x-[-30px]"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Ticket Resale Marketplace
                  </h3>
                  <p className="text-white">
                    A trusted space where sellers recover up to 75–80% of ticket
                    price, minimizing loss from cancellations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Affordable Last-Minute Deals
                  </h3>
                  <p className="text-white">
                    Buyers save 20–30% while enjoying the same movie — perfect
                    for last-minute plans.
                  </p>
                </div>
              </div>
            </div>

            <div
              id="features-right"
              data-scroll-animate
              className={`space-y-8 ${
                visibleSections["features-right"]
                  ? "animate-fade-in-right"
                  : "opacity-0 translate-x-[30px]"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Secure Payments
                  </h3>
                  <p className="text-white">
                    Stripe & PayPal guarantee fraud-free transfers, instant
                    refunds, and smooth payouts.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Smart Technology + GPS
                  </h3>
                  <p className="text-white">
                    AI/ML predicts demand spikes, GPS prevents fraud, and
                    location-based recommendations add convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
