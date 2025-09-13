import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BuyTicket = () => {
  const { user } = useSelector((state) => state.auth);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const [selectedSeat, setSelectedSeat] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Static movies data
  const movies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      genre: "Action/Sci-Fi",
      duration: "181 min",
      rating: "8.4/10",
      price: 250,
      image: "https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=Avengers+Endgame",
      theaters: ["PVR Cinemas", "INOX", "Cinepolis"],
      showTimes: ["10:00 AM", "1:30 PM", "5:00 PM", "8:30 PM"]
    },
    {
      id: 2,
      title: "Spider-Man: No Way Home",
      genre: "Action/Adventure",
      duration: "148 min",
      rating: "8.2/10",
      price: 280,
      image: "https://via.placeholder.com/300x400/E74C3C/FFFFFF?text=Spider-Man+NWH",
      theaters: ["PVR Cinemas", "INOX", "Multiplex"],
      showTimes: ["11:00 AM", "2:30 PM", "6:00 PM", "9:30 PM"]
    },
    {
      id: 3,
      title: "The Batman",
      genre: "Action/Crime",
      duration: "176 min",
      rating: "7.8/10",
      price: 300,
      image: "https://via.placeholder.com/300x400/2C3E50/FFFFFF?text=The+Batman",
      theaters: ["INOX", "Cinepolis", "Fun Cinema"],
      showTimes: ["12:00 PM", "3:30 PM", "7:00 PM", "10:30 PM"]
    },
    {
      id: 4,
      title: "Top Gun: Maverick",
      genre: "Action/Drama",
      duration: "130 min",
      rating: "8.3/10",
      price: 270,
      image: "https://via.placeholder.com/300x400/27AE60/FFFFFF?text=Top+Gun+Maverick",
      theaters: ["PVR Cinemas", "INOX", "Cinepolis"],
      showTimes: ["10:30 AM", "2:00 PM", "5:30 PM", "9:00 PM"]
    },
    {
      id: 5,
      title: "Doctor Strange 2",
      genre: "Action/Fantasy",
      duration: "126 min",
      rating: "6.9/10",
      price: 290,
      image: "https://via.placeholder.com/300x400/8E44AD/FFFFFF?text=Doctor+Strange+2",
      theaters: ["INOX", "Multiplex", "Fun Cinema"],
      showTimes: ["11:30 AM", "3:00 PM", "6:30 PM", "10:00 PM"]
    },
    {
      id: 6,
      title: "Black Panther: Wakanda Forever",
      genre: "Action/Drama",
      duration: "161 min",
      rating: "6.7/10",
      price: 260,
      image: "https://via.placeholder.com/300x400/34495E/FFFFFF?text=Black+Panther+2",
      theaters: ["PVR Cinemas", "Cinepolis", "Fun Cinema"],
      showTimes: ["12:30 PM", "4:00 PM", "7:30 PM", "11:00 PM"]
    }
  ];

  // Generate seat numbers
  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (let row of rows) {
      for (let num = 1; num <= 15; num++) {
        seats.push(`${row}${num}`);
      }
    }
    return seats;
  };

  const availableSeats = generateSeats();

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedTheater('');
    setSelectedShowTime('');
    setSelectedSeat('');
    setMessage('');
  };

  const handleBuyTicket = async () => {
    if (!selectedMovie || !selectedTheater || !selectedShowTime || !selectedSeat) {
      setMessage('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ticket/buy', {
        movieTitle: selectedMovie.title,
        theaterName: selectedTheater,
        showTime: selectedShowTime,
        seatNumber: selectedSeat,
        price: selectedMovie.price,
        buyerId: user.userId
      });

      setMessage('Ticket booked successfully! 🎉');
      setSelectedMovie(null);
      setSelectedTheater('');
      setSelectedShowTime('');
      setSelectedSeat('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to book ticket. Please try again.');
      console.error('Error booking ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">🎬 Book Movie Tickets</h2>
          <p className="text-purple-200 text-lg">Choose your favorite movie and book your seats!</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {movies.map(movie => (
            <div
              key={movie.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                selectedMovie?.id === movie.id ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
              onClick={() => handleMovieSelect(movie)}
            >
              <div className="relative">
                <img 
                  src={movie.image} 
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold">
                  ⭐ {movie.rating}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{movie.title}</h3>
                <p className="text-gray-600 mb-1">{movie.genre}</p>
                <p className="text-gray-500 text-sm mb-2">🕐 {movie.duration}</p>
                <p className="text-2xl font-bold text-purple-600">₹{movie.price}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Book Ticket for "{selectedMovie.title}"
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theater</label>
                <select
                  value={selectedTheater}
                  onChange={(e) => setSelectedTheater(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Theater</option>
                  {selectedMovie.theaters.map(theater => (
                    <option key={theater} value={theater}>{theater}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show Time</label>
                <select
                  value={selectedShowTime}
                  onChange={(e) => setSelectedShowTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Show Time</option>
                  {selectedMovie.showTimes.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Seat</label>
              <div className="grid grid-cols-8 gap-2">
                {availableSeats.slice(0, 40).map(seat => (
                  <button
                    key={seat}
                    className={`p-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                      selectedSeat === seat
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-100 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedSeat(seat)}
                    type="button"
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Movie:</span>
                  <span className="font-medium">{selectedMovie.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theater:</span>
                  <span className="font-medium">{selectedTheater || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Show Time:</span>
                  <span className="font-medium">{selectedShowTime || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat:</span>
                  <span className="font-medium">{selectedSeat || '-'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-purple-600 pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{selectedMovie.price}</span>
                </div>
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              onClick={handleBuyTicket}
              disabled={loading}
            >
              {loading ? '🔄 Booking...' : '🎫 Book Ticket'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyTicket;