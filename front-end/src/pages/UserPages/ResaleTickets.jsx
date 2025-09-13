import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ResaleTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [resaleTickets, setResaleTickets] = useState([]);

  useEffect(() => {
    fetchResaleTickets();
  }, []);

  const fetchResaleTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ticket/resale');
      console.log(response.data);
      
      const filteredTickets = response.data.filter(ticket => ticket.seller._id !== user.id);
      setResaleTickets(filteredTickets);
    } catch (error) {
      console.error('Error fetching resale tickets:', error);
    }
  };

  const handleBuyTicket = async (ticketId) => {
    try {
      await axios.post(`http://localhost:5000/api/ticket/resale`, {
        buyerId: user.id
      });
      alert('Ticket purchased successfully!');
      fetchResaleTickets();
    } catch (error) {
      console.error('Error buying ticket:', error);
      alert('Failed to purchase ticket');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resale Tickets</h1>
      
      {resaleTickets.length === 0 ? (
        <p>No resale tickets available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resaleTickets.map((ticket) => (
            <div key={ticket._id} className="border rounded p-4">
              <h3 className="font-bold text-lg">{ticket.movieTitle}</h3>
              <p><strong>Theater:</strong> {ticket.theaterName}</p>
              <p><strong>Show Time:</strong> {new Date(ticket.showTime).toLocaleString()}</p>
              <p><strong>Seat:</strong> {ticket.seatNumber}</p>
              <p><strong>Price:</strong> ₹{ticket.price}</p>
              <p><strong>Seller:</strong> {ticket.seller.name}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              
              <button 
                onClick={() => handleBuyTicket(ticket._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
              >
                Buy Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResaleTickets;