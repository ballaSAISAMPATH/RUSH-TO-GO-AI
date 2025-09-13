import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Ticket, DollarSign, ChevronDown, Calendar, MapPin, Clock, XCircle } from 'lucide-react';

const SellTicket = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [resalePrice, setResalePrice] = useState('');
  const [selectedTicket, setSelectedTicket] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isListing, setIsListing] = useState(false);

  useEffect(() => {
    fetchBookedTickets();
  }, [user?.id]);

  // This useEffect will automatically update the resale price when a ticket is selected
  useEffect(() => {
    if (selectedTicket) {
      const ticketDetails = bookedTickets.find(t => t._id === selectedTicket);
      if (ticketDetails) {
        // Automatically set the resale price to 80% of the original price
        setResalePrice(Math.floor(ticketDetails.price * 0.8));
      }
    } else {
      setResalePrice('');
    }
  }, [selectedTicket, bookedTickets]);

  const fetchBookedTickets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/ticket/booked/${user?.id}`);
      const availableForSale = response.data.filter(ticket =>
        ticket.status === 'sold' &&
        !ticket.isForSale &&
        new Date(ticket.showTime) > new Date()
      );
      setBookedTickets(availableForSale);
    } catch (error) {
      console.error('Error fetching booked tickets:', error);
      toast.error('Failed to load your tickets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellTicket = async () => {
    if (!selectedTicket || !resalePrice || isListing) {
      toast.error('Please select a ticket and enter a valid resale price.');
      return;
    }

    setIsListing(true);
    try {
      await axios.put(`http://localhost:5000/api/ticket/resale/${selectedTicket}`, {
        resalePrice: parseFloat(resalePrice)
      });
      toast.success('Ticket listed for sale successfully!');
      setResalePrice('');
      setSelectedTicket('');
      fetchBookedTickets();
    } catch (error) {
      console.error('Error listing ticket:', error);
      toast.error('Failed to list ticket for sale. Please try again.');
    } finally {
      setIsListing(false);
    }
  };

  const getSelectedTicketDetails = () => {
    return bookedTickets.find(ticket => ticket._id === selectedTicket);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-8">
          <DollarSign size={40} className="text-cyan-500" />
          <h1 className="text-2xl sm:text-2xl font-extrabold text-white">
            Sell Your <span className="text-cyan-500">Tickets</span>
          </h1>
        </div>

        {isLoading ? (
          <div className="bg-black rounded-xl p-6 border border-gray-700 animate-pulse">
            <div className="w-3/4 h-8 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-black rounded w-1/2"></div>
              <div className="h-4 bg-black rounded w-2/3"></div>
            </div>
          </div>
        ) : bookedTickets.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No tickets available for sale.</p>
            <p className="text-sm text-gray-500 mt-2">
              Only tickets you have already purchased and are not yet on sale can be relisted.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeInUp">
            {/* Ticket Selection */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <label className="block text-lg font-medium text-cyan-400 mb-4">
                Select Ticket to Sell
              </label>
              <div className="relative">
                <select
                  value={selectedTicket}
                  onChange={(e) => setSelectedTicket(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white appearance-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                >
                  <option value="">Choose a ticket to sell</option>
                  {bookedTickets.map((ticket) => (
                    <option key={ticket._id} value={ticket._id}>
                      {ticket.movieTitle} - {new Date(ticket.showTime).toLocaleString()}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Ticket Details and Resale Price Input */}
            {selectedTicket && (
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg transition-all duration-300 animate-fadeInUp">
                {getSelectedTicketDetails() && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-2">{getSelectedTicketDetails().movieTitle}</h3>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-cyan-400" />
                        <div>
                          <span className="text-gray-400">Theater:</span>
                          <p className="font-semibold text-white">{getSelectedTicketDetails().theaterName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-cyan-400" />
                        <div>
                          <span className="text-gray-400">Date:</span>
                          <p className="font-semibold text-white">{new Date(getSelectedTicketDetails().showTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-cyan-400" />
                        <div>
                          <span className="text-gray-400">Show Time:</span>
                          <p className="font-semibold text-white">{new Date(getSelectedTicketDetails().showTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket size={16} className="text-cyan-400" />
                        <div>
                          <span className="text-gray-400">Seat:</span>
                          <p className="font-semibold text-white">{getSelectedTicketDetails().seatNumber}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-4 border-t border-gray-700">
                      <div>
                        <p className="text-sm text-gray-400">Original Price:</p>
                        <p className="text-base font-semibold text-gray-500 line-through">₹{getSelectedTicketDetails().price}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cyan-400">Resale Price (₹)</label>
                        <input disabled
                          type="number"
                          value={resalePrice}
                          onChange={(e) => setResalePrice(e.target.value)}
                          placeholder="Enter price"
                          className="w-32 px-3 py-2 mt-1 border-none rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
              <button
                onClick={handleSellTicket}
                disabled={!selectedTicket || !resalePrice || isListing}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md font-bold transition-all duration-300 transform hover:scale-[1.02] hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isListing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Listing...
                  </>
                ) : (
                  'List Ticket for Sale'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellTicket;