import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MySelling = () => {
  const { user } = useSelector((state) => state.auth);
  const [sellingTickets, setSellingTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editModal, setEditModal] = useState({ show: false, ticket: null });
  const [newPrice, setNewPrice] = useState('');
  const [soldTickets, setSoldTickets] = useState([]);

  useEffect(() => {
    fetchSellingTickets();
    fetchSoldTickets();
  }, [user.id]);

  const fetchSellingTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/api/ticket/');
      
      // Filter tickets that are being sold by current user
      const mySellingTickets = response.data.filter(ticket => 
        ticket.seller._id === user.id && 
        ticket.isForSale === true &&
        ticket.status === 'available'
      );
      
      setSellingTickets(mySellingTickets);
    } catch (error) {
      setMessage('Failed to fetch selling tickets');
      console.error('Error fetching selling tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSoldTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/api/ticket/');
      
      // Filter tickets that were resold by current user
      const mySoldTickets = response.data.filter(ticket => 
        ticket.seller._id === user.id && 
        ticket.buyer._id !== user.id &&
        ticket.status === 'sold' &&
        ticket.paymentStatus === 'paid'
      );
      
      setSoldTickets(mySoldTickets);
    } catch (error) {
      console.error('Error fetching sold tickets:', error);
    }
  };

  const handleRemoveFromSale = async (ticketId) => {
    try {
      // We'll create a custom endpoint to handle this, for now using resell with same price
      const ticket = sellingTickets.find(t => t._id === ticketId);
      
      await axios.post('/api/ticket/resell', {
        ticketId: ticketId,
        resalePrice: ticket.price,
        userId: user.id,
        removeFromSale: true
      });

      setMessage('Ticket removed from sale successfully! ✅');
      fetchSellingTickets();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to remove ticket from sale');
      console.error('Error removing ticket from sale:', error);
    }
  };

  const handleEditPrice = (ticket) => {
    setEditModal({ show: true, ticket });
    setNewPrice(ticket.price.toString());
  };

  const handleUpdatePrice = async () => {
    if (!newPrice || newPrice <= 0) {
      setMessage('Please enter a valid price');
      return;
    }

    try {
      await axios.post('/api/ticket/resell', {
        ticketId: editModal.ticket._id,
        resalePrice: parseInt(newPrice),
        userId: user.id
      });

      setMessage('Price updated successfully! 💰');
      setEditModal({ show: false, ticket: null });
      setNewPrice('');
      
      fetchSellingTickets();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update price');
      console.error('Error updating price:', error);
    }
  };

  const closeEditModal = () => {
    setEditModal({ show: false, ticket: null });
    setNewPrice('');
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
          <p className="text-white text-lg">Loading your selling tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">💼 My Selling Center</h2>
          <p className="text-purple-200 text-lg">Manage your tickets for sale and view sold tickets</p>
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

        {/* Currently Selling Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">🔄 Currently Selling</h3>
          
          {sellingTickets.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">No Tickets Listed for Sale</h4>
              <p className="text-gray-600">You don't have any tickets currently listed for resale.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellingTickets.map(ticket => (
                <div key={ticket._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold">{ticket.movieTitle}</h4>
                      <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                        🔄 For Sale
                      </span>
                    </div>
                    <p className="text-orange-100">Listed for ₹{ticket.price}</p>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">🏢 Theater:</span>
                        <span className="font-semibold">{ticket.theaterName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">🕐 Show:</span>
                        <span className="font-semibold">{ticket.showTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">💺 Seat:</span>
                        <span className="font-semibold">{ticket.seatNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">📅 Listed:</span>
                        <span className="text-sm">{formatDate(ticket.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-blue-500 text-white font-medium py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        onClick={() => handleEditPrice(ticket)}
                      >
                        ✏️ Edit Price
                      </button>
                      <button
                        className="flex-1 bg-red-500 text-white font-medium py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
                        onClick={() => handleRemoveFromSale(ticket._id)}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sold Tickets Section */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">✅ Successfully Sold</h3>
          
          {soldTickets.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">No Tickets Sold Yet</h4>
              <p className="text-gray-600">Once you sell tickets, they will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {soldTickets.map(ticket => (
                <div key={ticket._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold">{ticket.movieTitle}</h4>
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                        ✅ Sold
                      </span>
                    </div>
                    <p className="text-green-100">Sold for ₹{ticket.price}</p>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">🏢 Theater:</span>
                        <span className="font-semibold">{ticket.theaterName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">🕐 Show:</span>
                        <span className="font-semibold">{ticket.showTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">💺 Seat:</span>
                        <span className="font-semibold">{ticket.seatNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">👤 Buyer:</span>
                        <span className="font-semibold">{ticket.buyer.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">📧 Contact:</span>
                        <span className="text-blue-600 text-sm break-all">{ticket.buyer.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">📅 Sold:</span>
                        <span className="text-sm">{formatDate(ticket.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Price Modal */}
        {editModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">✏️ Edit Price</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                  onClick={closeEditModal}
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-bold text-gray-800 text-lg">{editModal.ticket.movieTitle}</h4>
                  <p className="text-gray-600">{editModal.ticket.theaterName} • {editModal.ticket.showTime}</p>
                  <p className="text-gray-600">Seat: {editModal.ticket.seatNumber}</p>
                  <p className="text-gray-600">Current Price: ₹{editModal.ticket.price}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Price (₹)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  min="1"
                  placeholder="Enter new price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <small className="text-gray-500 mt-1 block">Set a competitive price to sell faster</small>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  onClick={closeEditModal}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                  onClick={handleUpdatePrice}
                >
                  Update Price
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySelling;