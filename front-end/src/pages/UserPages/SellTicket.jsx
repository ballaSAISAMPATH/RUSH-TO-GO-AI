import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SellTicket = () => {
  const { user } = useSelector((state) => state.auth);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [resalePrice, setResalePrice] = useState('');
  const [selectedTicket, setSelectedTicket] = useState('');

  useEffect(() => {
    fetchBookedTickets();
  }, []);

  const fetchBookedTickets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ticket/booked/${user.id}`);
      const availableForSale = response.data.filter(ticket => 
        ticket.status === 'sold' && 
        !ticket.isForSale && 
        new Date(ticket.showTime) > new Date() &&
        ticket.seller._id === user.id && 
        ticket.buyer._id === user.id
      );
      setBookedTickets(availableForSale);
    } catch (error) {
      console.error('Error fetching booked tickets:', error);
    }
  };

  const handleSellTicket = async () => {
    if (!selectedTicket || !resalePrice) {
      alert('Please select ticket and enter resale price');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/ticket/resale/${selectedTicket}`, {
        resalePrice: parseFloat(resalePrice)
      });
      alert('Ticket listed for sale successfully!');
      setResalePrice('');
      setSelectedTicket('');
      fetchBookedTickets();
    } catch (error) {
      console.error('Error listing ticket:', error);
      alert('Failed to list ticket for sale');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sell Your Tickets</h1>
      
      {bookedTickets.length === 0 ? (
        <p>No tickets available for sale</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-bold">Select Ticket to Sell:</label>
            <select 
              value={selectedTicket} 
              onChange={(e) => setSelectedTicket(e.target.value)}
              className="border rounded p-2 w-full mb-4"
            >
              <option value="">Choose a ticket</option>
              {bookedTickets.map((ticket) => (
                <option key={ticket._id} value={ticket._id}>
                  {ticket.movieTitle} - {ticket.theaterName} - {new Date(ticket.showTime).toLocaleString()} - Seat: {ticket.seatNumber}
                </option>
              ))}
            </select>
          </div>

          {selectedTicket && (
            <div className="border rounded p-4">
              {bookedTickets.map(ticket => ticket._id === selectedTicket && (
                <div key={ticket._id}>
                  <h3 className="font-bold text-lg mb-2">{ticket.movieTitle}</h3>
                  <p><strong>Theater:</strong> {ticket.theaterName}</p>
                  <p><strong>Show Time:</strong> {new Date(ticket.showTime).toLocaleString()}</p>
                  <p><strong>Seat:</strong> {ticket.seatNumber}</p>
                  <p><strong>Original Price:</strong> ₹{ticket.price}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block mb-2 font-bold">Resale Price (₹):</label>
            <input 
              type="number" 
              value={resalePrice} 
              onChange={(e) => setResalePrice(e.target.value)}
              placeholder="Enter resale price"
              className="border rounded p-2 w-full mb-4"
            />
          </div>

          <button 
            onClick={handleSellTicket}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            List Ticket for Sale
          </button>
        </div>
      )}
    </div>
  );
};

export default SellTicket;