import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  Ticket,
  IndianRupee,
  DollarSign,
  Film,
  MapPin,
  Clock,
  ShoppingBag,
  XCircle,
  Info,
} from "lucide-react";

const ResaleTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [resaleTickets, setResaleTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(null); // Track which ticket is being bought
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ticketToBuy, setTicketToBuy] = useState(null);

  useEffect(() => {
    fetchResaleTickets();
  }, [user?.id]);

  const fetchResaleTickets = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:5000/api/ticket/resale"
      );
      const filteredTickets = response.data.filter(
        (ticket) => ticket.seller?._id !== user?.id
      );
      setResaleTickets(filteredTickets);
    } catch (error) {
      console.error("Error fetching resale tickets:", error);
      toast.error("Failed to load available tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyTicket = (ticket) => {
    setTicketToBuy(ticket);
    setShowConfirmDialog(true);
  };

  const confirmBuyTicket = async () => {
    if (!ticketToBuy || isBuying) return;

    setIsBuying(ticketToBuy._id);
    setShowConfirmDialog(false);

    try {
      await axios.post(
        `http://localhost:5000/api/ticket/resale/${ticketToBuy._id}/buy`,
        {
          buyerId: user.id,
        }
      );
      toast.success("Ticket purchased successfully!");
      fetchResaleTickets(); // Refresh the list
    } catch (error) {
      console.error("Error buying ticket:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to purchase ticket. Please try again."
      );
    } finally {
      setIsBuying(null);
      setTicketToBuy(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 p-8">
      <div className="max-w-full mx-auto">
        <div className="flex items-center gap-0 mb-8">
          <IndianRupee size={30} className="text-cyan-500" />
          <h1 className="text-2xl sm:text-2xl font-extrabold text-white">
            <span className="text-cyan-500">Resale</span> Tickets
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
                </div>
              </div>
            ))}
          </div>
        ) : resaleTickets.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <XCircle size={64} className="text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">
              No tickets are currently available for resale.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check back later for new listings!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resaleTickets.map((ticket, index) => (
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
                    <div className="bg-cyan-500/20 text-cyan-400 font-bold text-sm px-3 py-1 rounded-full border border-cyan-400/50">
                      Resale
                    </div>
                  </div>

                  <div className="space-y-3 text-sm flex-grow">
                    <div className="flex items-center gap-3">
                      <Film size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Movie:</span>
                        <p className="font-semibold text-white">
                          {ticket.movieTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Theater:</span>
                        <p className="font-semibold text-white">
                          {ticket.theaterName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Show Time:</span>
                        <p className="font-semibold text-white">
                          {new Date(ticket.showTime).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Ticket size={20} className="text-gray-400" />
                      <div>
                        <span className="text-gray-400">Seat:</span>
                        <p className="font-semibold text-white">
                          {ticket.seatNumber}
                        </p>
                      </div>
                    </div>

                    <div className="text-gray-400 mt-4 border-t border-gray-700 pt-3">
                      <span className="block font-medium">Seller:</span>
                      <span className="text-white font-semibold">
                        {ticket.seller.name}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col items-start gap-2">
                    <div className="flex gap-2 text-center flex-wrap items-center justify-between">
                      <div className="border-e-2 border-white pe-2">
                        <p className="text-sm font-medium text-gray-400 ">
                          Original Price:
                        </p>
                        <p className="text-2xl font-bold text-red-400 line-through ">
                          ₹{Math.ceil(ticket.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-400">
                          Resale Price:
                        </p>
                        <p className="text-2xl font-bold text-green-400">
                          ₹{Math.ceil(ticket.price * 0.8)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuyTicket(ticket)}
                      disabled={isBuying === ticket._id}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-md font-bold transition-all duration-300 transform hover:scale-[1.02] hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isBuying === ticket._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Purchasing...
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={20} /> Buy Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn">
          <div className="relative p-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500 transform scale-105">
            <div className="bg-gray-900 p-8 rounded-2xl max-w-md mx-auto relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                  <Info size={32} className="text-cyan-400 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">
                  Confirm Purchase
                </h3>
                <p className="text-gray-400 mb-6 text-sm">
                  Are you sure you want to purchase this ticket? This action
                  cannot be undone.
                </p>

                {/* Ticket Details */}
                <div className="w-full bg-gray-800 p-4 rounded-lg mb-6 text-left border border-gray-700">
                  <p className="text-white font-bold text-lg mb-2">
                    {ticketToBuy?.movieTitle}
                  </p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between text-gray-400">
                      <span>Theater:</span>
                      <span className="text-white font-medium">
                        {ticketToBuy?.theaterName}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Show Time:</span>
                      <span className="text-white font-medium">
                        {ticketToBuy?.showTime
                          ? new Date(ticketToBuy.showTime).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Seat:</span>
                      <span className="text-white font-medium">
                        {ticketToBuy?.seatNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span className="text-cyan-400">Price:</span>
                      <span className="text-cyan-400 font-bold">
                        ₹{ticketToBuy?.price}
                      </span>
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
                    onClick={confirmBuyTicket}
                    disabled={isBuying}
                    className="w-1/2 py-2 text-white bg-gradient-to-r from-cyan-600 to-blue-800 rounded-lg transition-all duration-300 hover:from-cyan-700 hover:to-blue-900 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                  >
                    {isBuying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Purchasing...
                      </>
                    ) : (
                      "Confirm"
                    )}
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ResaleTickets;
