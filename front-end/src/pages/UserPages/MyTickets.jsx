import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MyTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [resaleModal, setResaleModal] = useState({ show: false, ticket: null });
  const [resalePrice, setResalePrice] = useState('');

  useEffect(() => {
    fetchMyTickets();
  }, [user.id]);

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ticket/');
      
      // Filter tickets owned by current user and not currently for sale
      const myTickets = response.data.filter(ticket => 
        ticket.buyer._id === user.id && 
        ticket.paymentStatus === 'paid' && 
        !ticket.isForSale
      );
      
      setTickets(myTickets);
    } catch (error) {
      setMessage('Failed to fetch tickets');
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResellClick = (ticket) => {
    setResaleModal({ show: true, ticket });
    setResalePrice(ticket.price.toString());
  };

  const handleResellSubmit = async () => {
    if (!resalePrice || resalePrice <= 0) {
      setMessage('Please enter a valid price');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/api/ticket/resell', {
        ticketId: resaleModal.ticket._id,
        resalePrice: parseInt(resalePrice),
        userId: user.id
      });

      setMessage('Ticket listed for resale successfully! 🎉');
      setResaleModal({ show: false, ticket: null });
      setResalePrice('');
      
      // Refresh tickets list
      fetchMyTickets();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to list ticket for resale');
      console.error('Error reselling ticket:', error);
    }
  };

  const closeResaleModal = () => {
    setResaleModal({ show: false, ticket: null });
    setResalePrice('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">🎫 My Tickets</h2>
          <p className="text-purple-200 text-lg">Manage your purchased tickets</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-semibold ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        {tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-white mb-4">No Tickets Found</h3>
            <p className="text-purple-200 mb-2">You haven't purchased any tickets yet.</p>
            <p className="text-purple-200">Start by booking your favorite movies!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map(ticket => (
              <div key={ticket._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
                  <h3 className="text-xl font-bold mb-2">{ticket.movieTitle}</h3>
                  <div className="flex items-center">
                    <span className="bg-green-500 text-green-100 px-2 py-1 rounded-full text-sm font-medium">
                      ✅ Confirmed
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">🏢 Theater:</span>
                      <span className="text-gray-800 font-semibold">{ticket.theaterName}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">🕐 Show Time:</span>
                      <span className="text-gray-800 font-semibold">{ticket.showTime}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">💺 Seat:</span>
                      <span className="text-gray-800 font-semibold">{ticket.seatNumber}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">💰 Price:</span>
                      <span className="text-purple-600 font-bold text-lg">₹{ticket.price}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">📅 Booked:</span>
                      <span className="text-gray-800 text-sm">{formatDate(ticket.createdAt)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">💳 Payment:</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        ✅ Paid
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleResellClick(ticket)}
                  >
                    🔄 Resell Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resale Modal */}
        {resaleModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">🔄 Resell Ticket</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={closeResaleModal}
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 text-lg">{resaleModal.ticket.movieTitle}</h4>
                  <p className="text-gray-600">{resaleModal.ticket.theaterName} • {resaleModal.ticket.showTime}</p>
                  <p className="text-gray-600">Seat: {resaleModal.ticket.seatNumber}</p>
                  <p className="text-gray-600">Original Price: ₹{resaleModal.ticket.price}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Resale Price (₹)</label>
                <input
                  type="number"
                  value={resalePrice}
                  onChange={(e) => setResalePrice(e.target.value)}
                  min="1"
                  placeholder="Enter resale price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <small className="text-gray-500 mt-1 block">You can set any price for your ticket</small>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  onClick={closeResaleModal}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  onClick={handleResellSubmit}
                >
                  List for Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;