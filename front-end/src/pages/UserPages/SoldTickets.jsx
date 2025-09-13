import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SoldTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [soldTickets, setSoldTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSoldTickets();
  }, []);

  const fetchSoldTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/ticket/sold/${user.id}`);
      setSoldTickets(response.data);
    } catch (error) {
      console.error('Error fetching sold tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfit = (originalPrice, soldPrice) => {
    const profit = soldPrice - originalPrice;
    return profit;
  };

  const totalRevenue = soldTickets.reduce((sum, ticket) => sum + ticket.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <span className="ml-4 text-cyan-500">Loading sold tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-500 mb-2">Sold Tickets</h1>
          <div className="h-1 w-24 bg-cyan-500 rounded"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Tickets</p>
                <p className="text-2xl font-bold text-white">{soldTickets.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-cyan-500">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Avg. Price</p>
                <p className="text-2xl font-bold text-white">
                  ₹{soldTickets.length > 0 ? Math.round(totalRevenue / soldTickets.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        {soldTickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No tickets sold yet</h3>
            <p className="text-gray-500">Your sold tickets will appear here once you make sales.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {soldTickets.map((ticket, index) => (
              <div key={ticket._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Main Content */}
                  <div className="flex-1 lg:pr-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{ticket.movieTitle}</h3>
                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {ticket.theaterName}
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(ticket.showTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center text-green-600 px-3 py-1 font-extrabold rounded-full text-xs  bg-black-500 bg-opacity-20 text-cyan-500 border border-cyan-500">
                          SOLD
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="bg-black bg-opacity-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Show Time</p>
                        <p className="text-white font-semibold">{new Date(ticket.showTime).toLocaleString()}</p>
                      </div>
                      <div className="bg-black bg-opacity-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Seat Number</p>
                        <p className="text-white font-semibold">{ticket.seatNumber}</p>
                      </div>
                      <div className="bg-black bg-opacity-50 rounded-lg p-3">
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Sale Date</p>
                        <p className="text-white font-semibold">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Buyer Information */}
                    <div className="bg-black bg-opacity-30 rounded-lg p-4 border border-gray-800">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-400 text-sm font-medium">Buyer Information</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-xs">Name</p>
                          <p className="text-white font-semibold">{ticket.buyer?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Email</p>
                          <p className="text-white font-semibold">{ticket.buyer?.email || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Section */}
                <div className="mt-4 lg:mt-0 lg:ml-6 flex justify-end">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-500 mb-1">₹{ticket.price}</div>
                      <div className="text-sm text-gray-400">Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Summary */}
        {soldTickets.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-cyan-500 bg-opacity-20 rounded-lg mr-4">
                <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Sales Performance</h3>
                <p className="text-gray-400">Overview of your ticket sales</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-500 mb-1">{soldTickets.length}</p>
                <p className="text-gray-400 text-sm">Tickets Sold</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-500 mb-1">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-500 mb-1">₹{soldTickets.length > 0 ? Math.round(totalRevenue / soldTickets.length) : 0}</p>
                <p className="text-gray-400 text-sm">Average Price</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-500 mb-1">100%</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoldTickets;