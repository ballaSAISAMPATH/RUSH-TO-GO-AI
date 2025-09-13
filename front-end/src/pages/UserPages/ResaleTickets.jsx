import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ResaleTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [resaleTickets, setResaleTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [buyModal, setBuyModal] = useState({ show: false, ticket: null });
  const [buyLoading, setBuyLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-low');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchResaleTickets();
  }, []);

  const fetchResaleTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/api/ticket/');
      
      const availableResaleTickets = response.data.filter(ticket => 
        ticket.isForSale && 
        ticket.status === 'available' && 
        ticket.seller._id !== user.id
      );
      
      setResaleTickets(availableResaleTickets);
    } catch (error) {
      setMessage('Failed to fetch resale tickets');
      console.error('Error fetching resale tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (ticket) => {
    setBuyModal({ show: true, ticket });
  };

  const handleBuyConfirm = async () => {
    setBuyLoading(true);
    try {
      await axios.post('/api/ticket/buy-resale', {
        ticketId: buyModal.ticket._id,
        buyerId: user.id
      });

      setMessage('🎉 Ticket purchased successfully!');
      setBuyModal({ show: false, ticket: null });
      fetchResaleTickets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to purchase ticket. Please try again.');
      console.error('Error buying resale ticket:', error);
    } finally {
      setBuyLoading(false);
    }
  };

  const closeBuyModal = () => {
    setBuyModal({ show: false, ticket: null });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (showTime) => {
    const now = new Date();
    const showDate = new Date(showTime);
    const diffMs = showDate - now;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours > 24) return `${Math.ceil(diffHours/24)}d left`;
    if (diffHours > 0) return `${diffHours}h left`;
    return 'Soon';
  };

  const getSavingsPercent = (originalPrice, currentPrice) => {
    const original = originalPrice || currentPrice + 100;
    return Math.round(((original - currentPrice) / original) * 100);
  };

  const filteredAndSortedTickets = resaleTickets
    .filter(ticket => {
      const matchesSearch = ticket.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ticket.theaterName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'deals' && getSavingsPercent(300, ticket.price) > 10) ||
                           (filterBy === 'tonight' && getTimeRemaining(ticket.showTime).includes('h'));
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'time': return new Date(a.showTime) - new Date(b.showTime);
        case 'savings': return getSavingsPercent(300, b.price) - getSavingsPercent(300, a.price);
        default: return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"></div>
            <div className="absolute top-2 left-2 animate-spin rounded-full h-16 w-16 border-4 border-transparent bg-gradient-to-r from-violet-500 to-pink-500 rounded-full opacity-70"></div>
          </div>
          <p className="text-white text-xl font-bold mt-6 animate-pulse">Finding amazing deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-violet-500/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              🏪 Ticket Marketplace
            </h1>
            <p className="text-xl text-purple-200">Discover amazing deals from fellow movie lovers!</p>
            <div className="flex justify-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{resaleTickets.length}</div>
                <div className="text-purple-300 text-sm">Available Tickets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">₹{Math.min(...resaleTickets.map(t => t.price), 999)}</div>
                <div className="text-purple-300 text-sm">Starting From</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">50%</div>
                <div className="text-purple-300 text-sm">Max Savings</div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies, theaters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <div className="absolute left-4 top-3 text-purple-300 text-xl">🔍</div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="all">All Tickets</option>
                  <option value="deals">Best Deals</option>
                  <option value="tonight">Show Tonight</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="time">Show Time</option>
                  <option value="savings">Best Savings</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className={`p-4 rounded-xl text-center font-bold text-lg ${
            message.includes('successfully') 
              ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
              : 'bg-red-500/20 text-red-300 border border-red-500/50'
          }`}>
            {message}
          </div>
        </div>
      )}

      {/* Tickets Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {filteredAndSortedTickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎭</div>
            <h3 className="text-3xl font-bold text-white mb-4">No Tickets Found</h3>
            <p className="text-purple-300 text-lg mb-2">Try adjusting your search or filters</p>
            <button 
              onClick={() => { setSearchQuery(''); setFilterBy('all'); }}
              className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-violet-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedTickets.map(ticket => (
              <div key={ticket._id} className="group">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/25">
                  {/* Ticket Header */}
                  <div className="relative bg-gradient-to-r from-pink-500/80 to-violet-500/80 p-6 text-white">
                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        🔥 HOT DEAL
                      </span>
                      {getSavingsPercent(300, ticket.price) > 15 && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          💰 {getSavingsPercent(300, ticket.price)}% OFF
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold mb-2 pr-20">{ticket.movieTitle}</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-pink-100">
                        <div className="text-sm opacity-90">Starting at</div>
                        <div className="text-3xl font-bold">₹{ticket.price}</div>
                      </div>
                      <div className="text-right text-pink-100">
                        <div className="text-sm opacity-90">{getTimeRemaining(ticket.showTime)}</div>
                        <div className="text-lg font-semibold">{ticket.showTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-purple-300 text-sm">🏢 Theater</div>
                        <div className="text-white font-semibold">{ticket.theaterName}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-purple-300 text-sm">💺 Seat</div>
                        <div className="text-white font-semibold">{ticket.seatNumber}</div>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-xl p-4 border border-violet-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                            {ticket.seller.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-semibold">{ticket.seller.name}</div>
                            <div className="text-purple-300 text-sm">Verified Seller ✅</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-purple-300 text-sm">Listed</div>
                          <div className="text-white text-sm font-medium">{formatDate(ticket.updatedAt)}</div>
                        </div>
                      </div>
                      <div className="text-purple-300 text-sm">
                        📧 {ticket.seller.email}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleBuyClick(ticket)}
                      className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/50"
                    >
                      🛒 Buy Now • ₹{ticket.price}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy Confirmation Modal */}
      {buyModal.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 max-w-lg w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">🎟️ Confirm Purchase</h3>
              <button 
                className="text-purple-300 hover:text-white text-3xl font-bold transition-colors"
                onClick={closeBuyModal}
              >
                ✕
              </button>
            </div>

            {/* Purchase Summary */}
            <div className="bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-xl p-6 mb-6">
              <h4 className="text-xl font-bold text-white mb-4">{buyModal.ticket.movieTitle}</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-purple-300">Theater</div>
                  <div className="text-white font-semibold">{buyModal.ticket.theaterName}</div>
                </div>
                <div>
                  <div className="text-purple-300">Show Time</div>
                  <div className="text-white font-semibold">{buyModal.ticket.showTime}</div>
                </div>
                <div>
                  <div className="text-purple-300">Seat</div>
                  <div className="text-white font-semibold">{buyModal.ticket.seatNumber}</div>
                </div>
                <div>
                  <div className="text-purple-300">Seller</div>
                  <div className="text-white font-semibold">{buyModal.ticket.seller.name}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-xl text-white">Total Amount</span>
                  <span className="text-3xl font-bold text-pink-400">₹{buyModal.ticket.price}</span>
                </div>
              </div>
            </div>

            {/* Warning Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-yellow-400 text-2xl">⚠️</div>
                <div className="text-yellow-200 text-sm">
                  <p className="font-semibold mb-1">Important Notice:</p>
                  <p>Once purchased, ticket ownership transfers immediately. Contact seller: <span className="font-bold text-yellow-100">{buyModal.ticket.seller.email}</span></p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all border border-white/20"
                onClick={closeBuyModal}
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                onClick={handleBuyConfirm}
                disabled={buyLoading}
              >
                {buyLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </div>
                ) : (
                  '✅ Confirm Purchase'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResaleTickets;