import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CurrentlySelling = () => {
  const { user } = useSelector((state) => state.auth);
  const [sellingTickets, setSellingTickets] = useState([]);

  useEffect(() => {
    fetchSellingTickets();
  }, []);

  const fetchSellingTickets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ticket/selling/${user.id}`);
      setSellingTickets(response.data);
    } catch (error) {
      console.error('Error fetching selling tickets:', error);
    }
  };

  const handleRemoveFromSale = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:5000/api/ticket/selling/${ticketId}`);
      alert('Ticket removed from sale');
      fetchSellingTickets();
    } catch (error) {
      console.error('Error removing ticket:', error);
      alert('Failed to remove ticket from sale');
    }
  };

  const getStatusBadge = (status) => {
    const baseClass = "px-2 py-1 rounded text-sm font-medium";
    switch (status) {
      case 'available':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'sold':
        return `${baseClass} bg-blue-100 text-blue-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Currently Selling</h1>

      {sellingTickets.length === 0 ? (
        <p>You have no tickets currently for sale</p>
      ) : (
        <div className="space-y-4">
          {sellingTickets.map((ticket) => (
            <div key={ticket._id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{ticket.movieTitle}</h3>
                  <p><strong>Theater:</strong> {ticket.theaterName}</p>
                  <p><strong>Show Time:</strong> {new Date(ticket.showTime).toLocaleString()}</p>
                  <p><strong>Seat:</strong> {ticket.seatNumber}</p>
                  <p><strong>Selling Price:</strong> ₹{ticket.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={getStatusBadge(ticket.status)}>{ticket.status}</span>
                    {ticket.buyer && (
                      <span className="text-sm text-gray-600">
                        Buyer: {ticket.buyer.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {ticket.status === 'available' && (
                    <button
                      onClick={() => handleRemoveFromSale(ticket._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Remove from Sale
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentlySelling;