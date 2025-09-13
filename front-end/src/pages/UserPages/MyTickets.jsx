import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Film, MapPin, Clock, Ticket, Star, DollarSign } from 'lucide-react';

const MyTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyTickets();
  }, [user.id]);

  const fetchMyTickets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5000/api/ticket/booked/${user.id}`);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      <div className="max-w-full mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Ticket size={40} className="text-cyan-500" />
          <h1 className="text-2xl sm:text-2xl font-extrabold text-white">
            My <span className="text-cyan-500">Bookings</span>
          </h1>
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
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">You haven't booked any tickets yet.</p>
            <p className="text-sm text-gray-500 mt-2">Start by booking a movie ticket to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket, index) => (
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
                    <h3 className="text-2xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-400">
                      {ticket.movieTitle}
                    </h3>
                    <div className="bg-cyan-500/20 text-cyan-400 font-bold text-sm px-3 py-1 rounded-full border border-cyan-400/50">
                      Booked
                    </div>
                  </div>

                  <div className="space-y-4 text-sm flex-grow">
                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-gray-400 transition-colors duration-300 group-hover:text-cyan-400" />
                      <div>
                        <span className="text-gray-400">Theater:</span>
                        <p className="font-semibold text-white">{ticket.theaterName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-gray-400 transition-colors duration-300 group-hover:text-cyan-400" />
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
                      <Star size={20} className="text-gray-400 transition-colors duration-300 group-hover:text-cyan-400" />
                      <div>
                        <span className="text-gray-400">Seat:</span>
                        <p className="font-semibold text-white">{ticket.seatNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign size={20} className="text-gray-400 transition-colors duration-300 group-hover:text-cyan-400" />
                      <div>
                        <span className="text-gray-400">Price:</span>
                        <p className="font-semibold text-white">₹{ticket.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* {ticket.qrCode && (
                    <div className="mt-6 border-t border-gray-700 pt-4 text-center">
                      <p className="text-gray-400 mb-2">Scan for entry:</p>
                      <img 
                        src={`data:image/png;base64,${ticket.qrCode}`} 
                        alt="QR Code" 
                        className="mx-auto w-32 h-32 rounded-lg transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MyTickets;