import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const BookTicket = () => {
  const { user } = useSelector((state) => state.auth);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [seatNumber, setSeatNumber] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ticket/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleBookTicket = async () => {
    if (!selectedMovie || !selectedTheater || !selectedShowtime || !seatNumber) {
      alert('Please fill all fields');
      return;
    }

    const theater = selectedMovie.theaters.find(t => t.name === selectedTheater);
    
    // Set show date to tomorrow to ensure it's in the future
    const showDateTime = new Date();
    showDateTime.setDate(showDateTime.getDate() + 1); // Tomorrow
    showDateTime.setHours(parseInt(selectedShowtime.split(':')[0]), parseInt(selectedShowtime.split(':')[1]), 0, 0);

    try {
      await axios.post('http://localhost:5000/api/ticket/book', {
        movieTitle: selectedMovie.title,
        theaterName: selectedTheater,
        showTime: showDateTime,
        seatNumber,
        price: theater.price,
        userId: user.id
      });
      alert('Ticket booked successfully!');
      setSeatNumber('');
      setSelectedMovie(null);
      setSelectedTheater('');
      setSelectedShowtime('');
    } catch (error) {
      console.error('Error booking ticket:', error);
      alert('Failed to book ticket');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Book Tickets</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {movies.map((movie) => (
          <div key={movie._id} className="border rounded p-4 cursor-pointer hover:bg-gray-50" 
               onClick={() => setSelectedMovie(movie)}>
            <img src={movie.poster} alt={movie.title} className="w-full h-48 object-cover mb-2" />
            <h3 className="font-bold">{movie.title}</h3>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="border rounded p-4 mb-4">
          <h2 className="text-xl font-bold mb-4">{selectedMovie.title}</h2>
          
          <div className="mb-4">
            <label className="block mb-2">Theater:</label>
            <select value={selectedTheater} onChange={(e) => setSelectedTheater(e.target.value)} className="border rounded p-2 w-full">
              <option value="">Select Theater</option>
              {selectedMovie.theaters.map((theater) => (
                <option key={theater.name} value={theater.name}>
                  {theater.name} - ₹{theater.price}
                </option>
              ))}
            </select>
          </div>

          {selectedTheater && (
            <div className="mb-4">
              <label className="block mb-2">Showtime:</label>
              <select value={selectedShowtime} onChange={(e) => setSelectedShowtime(e.target.value)} className="border rounded p-2 w-full">
                <option value="">Select Showtime</option>
                {selectedMovie.theaters.find(t => t.name === selectedTheater)?.showtimes.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2">Seat Number:</label>
            <input 
              type="text" 
              value={seatNumber} 
              onChange={(e) => setSeatNumber(e.target.value)} 
              placeholder="e.g. A1, B5" 
              className="border rounded p-2 w-full" 
            />
          </div>

          <button onClick={handleBookTicket} className="bg-blue-500 text-white px-4 py-2 rounded">
            Book Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default BookTicket;