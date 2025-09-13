import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const SoldTickets = () => {
  const { user } = useSelector((state) => state.auth);
  const [soldTickets, setSoldTickets] = useState([]);

  useEffect(() => {
    fetchSoldTickets();
  }, []);

  const fetchSoldTickets = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ticket/sold/${user.id}`);
      setSoldTickets(response.data);
    } catch (error) {
      console.error('Error fetching sold tickets:', error);
    }
  };

  const calculateProfit = (originalPrice, soldPrice) => {
    const profit = soldPrice - originalPrice;
    return profit;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sold Tickets</h1>
      
      {soldTickets.length === 0 ? (
        <p>No tickets sold yet</p>
      ) : (
        <div className="space-y-4">
          {soldTickets.map((ticket) => (
            <div key={ticket._id} className="border rounded p-4 bg-green-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{ticket.movieTitle}</h3>
                  <p><strong>Theater:</strong> {ticket.theaterName}</p>
                  <p><strong>Show Time:</strong> {new Date(ticket.showTime).toLocaleString()}</p>
                  <p><strong>Seat:</strong> {ticket.seatNumber}</p>
                  <p><strong>Sold Price:</strong> ₹{ticket.price}</p>
                  <p><strong>Sold To:</strong> {ticket.buyer?.name} ({ticket.buyer?.email})</p>
                  <p><strong>Sale Date:</strong> {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                  
                  <div className="mt-2 p-2 bg-white rounded border">
                    <p className="text-sm">
                      <strong>Transaction Status:</strong> 
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        ✅ Completed
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="px-3 py-2 bg-green-100 text-green-800 rounded font-bold">
                    💰 ₹{ticket.price} Earned
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4 mt-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-lg mb-2">Sales Summary</h3>
              <p><strong>Total Tickets Sold:</strong> {soldTickets.length}</p>
              <p><strong>Total Revenue:</strong> ₹{soldTickets.reduce((sum, ticket) => sum + ticket.price, 0)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoldTickets;