import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MyTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ticket/booked/${user.id}`);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      
      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="border rounded p-4">
              <h3 className="font-bold text-lg">{ticket.movieTitle}</h3>
              <p><strong>Theater:</strong> {ticket.theaterName}</p>
              <p><strong>Show Time:</strong> {new Date(ticket.showTime).toLocaleString()}</p>
              <p><strong>Seat:</strong> {ticket.seatNumber}</p>
              <p><strong>Price:</strong> ₹{ticket.price}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              {ticket.qrCode && <p><strong>QR Code:</strong> {ticket.qrCode}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;