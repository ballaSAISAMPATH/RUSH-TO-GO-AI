import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Ticket, XCircle, Film, MapPin, Clock, DollarSign, Trash2 } from 'lucide-react';

const CurrentlySelling = () => {
  const { user } = useSelector((state) => state.auth);
  const [sellingTickets, setSellingTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null); // Track which ticket is being deleted
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  useEffect(() => {
    fetchSellingTickets();
  }, [user?.id]);

  const fetchSellingTickets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/ticket/selling/${user.id}`);
      setSellingTickets(response.data);
    } catch (error) {
      console.error('Error fetching selling tickets:', error);
      toast.error('Failed to load tickets for sale.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromSale = (ticketId) => {
    const ticket = sellingTickets.find(t => t._id === ticketId);
    if (ticket) {
      setTicketToDelete(ticket);
      setShowConfirmDialog(true);
    }
  };

  const confirmRemoveFromSale = async () => {
    if (!ticketToDelete) return;

    setIsDeleting(ticketToDelete._id);
    setShowConfirmDialog(false);

    try {
      await axios.delete(`http://localhost:5000/api/ticket/selling/${ticketToDelete._id}`);
      toast.success('Ticket successfully removed from sale.');
      fetchSellingTickets(); // Refresh the list
    } catch (error) {
      console.error('Error removing ticket:', error);
      toast.error('Failed to remove ticket from sale. Please try again.');
    } finally {
      setIsDeleting(null);
      setTicketToDelete(null);
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider";
    switch (status) {
      case 'available':
        return `${baseClass} bg-green-500/20 text-green-400 border border-green-500/50`;
      case 'sold':
        return `${baseClass} bg-blue-500/20 text-blue-400 border border-blue-500/50`;
      default:
        return `${baseClass} bg-gray-500/20 text-gray-400 border border-gray-500/50`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      <div className="max-w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Ticket size={40} className="text-cyan-500" />
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            Currently <span className="text-cyan-500">Selling</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse"
              >
                <div className="w-3/4 h-8 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sellingTickets.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">You have no tickets currently listed for sale.</p>
            <p className="text-sm text-gray-500 mt-2">Book a ticket and try listing it on the marketplace.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellingTickets.map((ticket, index) => (
              <div
                key={ticket._id}
                className="group relative rounded-2xl p-0.5 overflow-hidden transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl p-0.5 z-0 transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-cyan-500 to-purple-500 filter blur-lg"></div>

                {/* Ticket Card Content */}
                <div className="relative z-10 bg-gray-800 rounded-2xl p-6 h-full flex flex-col justify-between border border-gray-700 transition-all duration-300 group-hover:border-cyan-500/50">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">
                      {ticket.movieTitle}
                    </h3>
                    <div className={getStatusBadge(ticket.status)}>
                      {ticket.status}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm flex-grow">
                    <div className="flex items-center gap-3">
                      <Film size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Original Movie:</span>
                        <p className="font-semibold text-white">{ticket.movieTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Theater:</span>
                        <p className="font-semibold text-white">{ticket.theaterName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Show Time:</span>
                        <p className="font-semibold text-white">
                          {new Date(ticket.showTime).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Selling Price:</span>
                        <p className="font-semibold text-white">₹{ticket.price}</p>
                      </div>
                    </div>

                    {ticket.status === 'sold' && ticket.buyer && (
                      <div className="text-gray-400 mt-4 border-t border-gray-700 pt-3">
                        <span className="block font-medium">Sold to:</span>
                        <span className="text-white font-semibold">{ticket.buyer.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    {ticket.status === 'available' && (
                      <button
                        onClick={() => handleRemoveFromSale(ticket._id)}
                        disabled={isDeleting === ticket._id}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md font-medium transition-all duration-300 transform hover:scale-[1.02] hover:from-red-700 hover:to-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isDeleting === ticket._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Removing...
                          </>
                        ) : (
                          'Remove from Sale'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-red-500 to-purple-500 transition-all duration-500 transform scale-105">
            <div className="bg-gray-900 p-8 rounded-2xl max-w-md mx-auto relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <Trash2 size={32} className="text-red-400 animate-wiggle" />
                </div>
                <h3 className="text-xl font-bold text-red-400 mb-2">Confirm Deletion</h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Are you sure you want to remove this ticket from sale?
                  <br />
                  This action cannot be undone.
                </p>

                {/* Ticket Details */}
                <div className="w-full bg-gray-800 p-4 rounded-lg mb-6 text-left border border-gray-700">
                  <p className="text-cyan-400 font-bold text-lg mb-2">{ticketToDelete?.movieTitle}</p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Theater:</span>
                      <span className="text-white font-medium">{ticketToDelete?.theaterName}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Show Time:</span>
                      <span className="text-white font-medium">
                        {ticketToDelete?.showTime ? new Date(ticketToDelete.showTime).toLocaleString() : ''}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Seat:</span>
                      <span className="text-white font-medium">{ticketToDelete?.seatNumber}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Price:</span>
                      <span className="text-white font-medium">₹{ticketToDelete?.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 w-full">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="w-1/2 py-2 text-gray-300 bg-gray-700 rounded-lg transition-all duration-300 hover:bg-gray-600 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmRemoveFromSale}
                    disabled={isDeleting}
                    className="w-1/2 py-2 text-white bg-gradient-to-r from-red-600 to-red-800 rounded-lg transition-all duration-300 hover:from-red-700 hover:to-red-900 disabled:opacity-50 font-medium"
                  >
                    {isDeleting ? 'Removing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CurrentlySelling;