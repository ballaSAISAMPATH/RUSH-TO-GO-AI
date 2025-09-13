import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import axios from 'axios';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { Star, Clock, MapPin, Calendar, Ticket, Play, Film } from 'lucide-react';
import ScrollToBottom from '../../utilities/ScrollToBottom';
// Seat Button Component
const SeatButton = ({ seatNumber, seatIndex, isSelected, isBooked, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isBooked}
      className={`
        relative w-12 h-12 rounded-lg text-sm font-bold transition-all duration-300 transform
        ${isSelected
          ? 'bg-cyan-500 text-black scale-110 shadow-lg shadow-cyan-500/50 ring-2 ring-cyan-400'
          : isBooked
            ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
            : 'bg-gray-600 text-white hover:bg-gray-500 hover:scale-105 hover:shadow-md hover:ring-1 hover:ring-cyan-400/50'
        }
        ${!isBooked ? 'active:scale-95' : ''}
      `}
      title={`Seat ${seatNumber} - ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
    >
      {seatIndex}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <Ticket size={10} className="text-cyan-500" />
        </div>
      )}
    </button>
  );
};

// Fixed booked seats to avoid random changes
const getBookedSeatsForRow = (row) => {
  const bookedSeats = {
    'A': [3, 7, 12],
    'B': [2, 8, 14],
    'C': [1, 6, 11],
    'D': [4, 9, 13],
    'E': [3, 7, 15],
    'F': [1, 5, 10],
    'G': [2, 6, 12, 14],
    'H': [4, 8, 11],
    'I': [3, 9, 13],
    'J': [1, 7, 15]
  };
  return bookedSeats[row] || [];
};

const BookTicket = () => {
  const { user } = useSelector((state) => state.auth);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);
  useEffect(() => {
    if (selectedMovie) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [selectedMovie]);
  const fetchMovies = async () => {
    try {
      setIsLoadingMovies(true);
      const response = await axios.get('http://localhost:5000/api/ticket/movies');
      console.log(response.data); 
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const handleBookTicket = async () => {
    if (!selectedMovie || !selectedTheater || !selectedShowtime || !seatNumber) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
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

      setIsDialogOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error booking ticket:', error);
      alert('Failed to book ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const resetBookingForm = () => {
    setSelectedMovie(null);
    setSelectedTheater('');
    setSelectedShowtime('');
    setSeatNumber('');
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setSeatNumber('');
    setSelectedMovie(null);
    setSelectedTheater('');
    setSelectedShowtime('');
  };

  const getSelectedTheaterPrice = () => {
    if (!selectedMovie || !selectedTheater) return 0;
    const theater = selectedMovie.theaters.find(t => t.name === selectedTheater);
    return theater ? theater.price : 0;
  };

  const LoadingCard = () => (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
      <div className="h-64 bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-8 opacity-0 animate-fadeInUp">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="text-cyan-400" size={40} />
            <h1 className="text-4xl font-bold text-white">Book Your Movie Tickets</h1>
          </div>
          <p className="text-gray-400 text-lg">Choose your favorite movie and enjoy the cinematic experience</p>
        </div>

        {isLoadingMovies ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {movies.map((movie, index) => (
              <div
                key={movie._id}
                className="group bg-black rounded-xl overflow-hidden border border-gray-700 cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 opacity-0 animate-fadeInUp"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  setSelectedMovie(movie); // First, set the selected movie
                  scrollToBottom(); // Then, call the scroll function
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-center">
                        <Play className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" size={48} />
                      </div>
                    </div>
                  </div>

                  {(movie.rating || movie.imdbRating) && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg">
                      <Star size={12} fill="currentColor" />
                      {movie.rating || movie.imdbRating}
                    </div>
                  )}

                  {movie.language && (
                    <div className="absolute top-3 left-3 bg-cyan-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                      {movie.language}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-2">
                    {movie.title}
                  </h3>

                  {(movie.genre || movie.genres) && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(movie.genre ? movie.genre.split(',') : movie.genres || []).slice(0, 2).map((g, index) => (
                        <span key={index} className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full text-xs font-medium">
                          {typeof g === 'string' ? g.trim() : g}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    {(movie.duration || movie.runtime) && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock size={14} />
                        <span>{movie.duration || movie.runtime} min</span>
                      </div>
                    )}

                    {movie.theaters && movie.theaters.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={14} />
                        <span>{movie.theaters.length} theater{movie.theaters.length > 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {movie.theaters && movie.theaters.length > 0 && (
                      <div className="text-cyan-400 font-semibold">
                        Starting from ₹{Math.min(...movie.theaters.map(t => t.price))}
                      </div>
                    )}
                  </div>

                  {movie.description && (
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2">
                      {movie.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMovie && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-2xl shadow-cyan-500/10 animate-slideUp">
            <div className="flex flex-col lg:flex-row items-start gap-6 mb-6">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="w-full lg:w-48 h-64 lg:h-72 object-cover rounded-lg shadow-lg"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedMovie.title}</h2>
                  {selectedMovie.description && (
                    <p className="text-gray-300 text-sm leading-relaxed">{selectedMovie.description}</p>
                  )}
                </div>

                {(selectedMovie.genre || selectedMovie.genres) && (
                  <div className="flex flex-wrap gap-2">
                    {(selectedMovie.genre ? selectedMovie.genre.split(',') : selectedMovie.genres || []).map((g, index) => (
                      <span key={index} className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                        {typeof g === 'string' ? g.trim() : g}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-gray-300">
                  {(selectedMovie.duration || selectedMovie.runtime) && (
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-cyan-400" />
                      <div>
                        <div className="text-xs text-gray-400">Duration</div>
                        <div className="font-semibold">{selectedMovie.duration || selectedMovie.runtime} min</div>
                      </div>
                    </div>
                  )}

                  {selectedMovie.language && (
                    <div className="flex items-center gap-2">
                      <Film size={18} className="text-cyan-400" />
                      <div>
                        <div className="text-xs text-gray-400">Language</div>
                        <div className="font-semibold">{selectedMovie.language}</div>
                      </div>
                    </div>
                  )}

                  {(selectedMovie.rating || selectedMovie.imdbRating) && (
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-yellow-400" fill="currentColor" />
                      <div>
                        <div className="text-xs text-gray-400">Rating</div>
                        <div className="font-semibold">{selectedMovie.rating || selectedMovie.imdbRating}/10</div>
                      </div>
                    </div>
                  )}

                  {selectedMovie.releaseDate && (
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-cyan-400" />
                      <div>
                        <div className="text-xs text-gray-400">Release</div>
                        <div className="font-semibold">{new Date(selectedMovie.releaseDate).getFullYear()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className=" text-cyan-400 font-semibold text-sm flex items-center gap-2">
                  <MapPin size={16} />
                  Select Theater
                </label>
                <select
                  value={selectedTheater}
                  onChange={(e) => {
                    setSelectedTheater(e.target.value);
                    setSelectedShowtime(''); // Reset showtime when theater changes
                    setSeatNumber(''); // Reset seat when theater changes
                  }}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                >
                  <option value="">Choose Theater</option>
                  {selectedMovie.theaters?.map((theater) => (
                    <option key={theater.name} value={theater.name}>
                      {theater.name} - ₹{theater.price}
                    </option>
                  ))}
                </select>
              </div>

              {selectedTheater && (
                <div className="space-y-2 animate-fadeIn">
                  <label className=" text-cyan-400 font-semibold text-sm flex items-center gap-2">
                    <Clock size={16} />
                    Select Showtime
                  </label>
                  <select
                    value={selectedShowtime}
                    onChange={(e) => {
                      setSelectedShowtime(e.target.value);
                      setSeatNumber(''); // Reset seat when showtime changes
                    }}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300"
                  >
                    <option value="">Choose Time</option>
                    {selectedMovie.theaters.find(t => t.name === selectedTheater)?.showtimes?.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Seat Selection - Full Width */}
            {selectedTheater && selectedShowtime && (
              <div className="mb-6 animate-fadeIn">
                <label className=" text-cyan-400 font-semibold text-lg flex items-center gap-2 mb-4">
                  <Ticket size={20} />
                  Select Your Seat
                </label>
                <div className="bg-black rounded-xl p-8 border border-gray-700">
                  {/* Screen indicator */}
                  <div className="text-center mb-12">
                    <div className="bg-gradient-to-b from-white to-gray-300 h-6 rounded-t-3xl w-4/5 mx-auto mb-3 shadow-lg"></div>
                    <p className="text-gray-400 text-lg font-medium">SCREEN THIS WAY</p>
                  </div>

                  {/* Seat Layout - Full Theater */}
                  {/* Seat Layout - Full Theater */}
                  <div className="space-y-4 max-w-6xl mx-auto">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((row, rowIndex) => {
                      const bookedSeats = getBookedSeatsForRow(row);

                      return (
                        <div key={row} className="flex items-center justify-center gap-3 p-x-2">
                          <span className="text-cyan-400 font-bold w-10 text-center text-xl">{row}</span>
                          <div className="flex gap-4">
                            {/* Left section (1-5) */}
                            {Array.from({ length: 5 }, (_, index) => {
                              const currentSeat = `${row}${index + 1}`;
                              const isBooked = bookedSeats.includes(index + 1);

                              return (
                                <SeatButton
                                  key={currentSeat}
                                  seatNumber={currentSeat}
                                  seatIndex={index + 1}
                                  // FIX: Compare the current seat's ID with the state variable
                                  isSelected={currentSeat === seatNumber}
                                  isBooked={isBooked}
                                  onClick={() => setSeatNumber(currentSeat)}
                                />
                              );
                            })}

                            {/* Left Aisle */}
                            <div className="w-8"></div>

                            {/* Middle section (6-10) */}
                            {Array.from({ length: 5 }, (_, index) => {
                              const currentSeat = `${row}${index + 6}`;
                              const isBooked = bookedSeats.includes(index + 6);

                              return (
                                <SeatButton
                                  key={currentSeat}
                                  seatNumber={currentSeat}
                                  seatIndex={index + 6}
                                  // FIX: Compare the current seat's ID with the state variable
                                  isSelected={currentSeat === seatNumber}
                                  isBooked={isBooked}
                                  onClick={() => setSeatNumber(currentSeat)}
                                />
                              );
                            })}

                            {/* Right Aisle */}
                            <div className="w-8"></div>

                            {/* Right section (11-15) */}
                            {Array.from({ length: 5 }, (_, index) => {
                              const currentSeat = `${row}${index + 11}`;
                              const isBooked = bookedSeats.includes(index + 11);

                              return (
                                <SeatButton
                                  key={currentSeat}
                                  seatNumber={currentSeat}
                                  seatIndex={index + 11}
                                  // FIX: Compare the current seat's ID with the state variable
                                  isSelected={currentSeat === seatNumber}
                                  isBooked={isBooked}
                                  onClick={() => setSeatNumber(currentSeat)}
                                />
                              );
                            })}
                          </div>
                          <span className="text-cyan-400 font-bold w-10 text-center text-xl">{row}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center gap-12 mt-12 pt-6 border-t border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-lg shadow-sm"></div>
                      <span className="text-gray-300 text-lg">Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-cyan-500 rounded-lg shadow-sm ring-2 ring-cyan-400"></div>
                      <span className="text-gray-300 text-lg">Selected</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg shadow-sm opacity-50"></div>
                      <span className="text-gray-300 text-lg">Booked</span>
                    </div>
                  </div>

                  {seatNumber && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl text-center border border-cyan-500/30">
                      <p className="text-cyan-400 font-bold text-2xl">
                        Selected Seat: <span className="text-white">{seatNumber}</span>
                      </p>
                      <p className="text-gray-300 mt-2">Row {seatNumber[0]} • Seat {seatNumber.slice(1)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="text-gray-300">
                {selectedTheater && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <span>Total Price: <span className="text-cyan-400 font-bold text-2xl">₹{getSelectedTheaterPrice()}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} />
                      <span>Show Date: Tomorrow</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetBookingForm}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all duration-300 transform hover:scale-105"
                >
                  Clear Selection
                </button>

                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={!selectedMovie || !selectedTheater || !selectedShowtime || !seatNumber}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25"
                    >
                      <Ticket size={18} />
                      Book Ticket
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className="bg-gray-800 border border-gray-700 text-white max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-cyan-400 text-xl flex items-center gap-2">
                        <Ticket size={20} />
                        Confirm Your Booking
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300 space-y-4">
                        <div className="bg-gray-700 p-4 rounded-lg space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Movie:</span>
                            <span className="text-white font-medium">{selectedMovie?.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Theater:</span>
                            <span className="text-white font-medium">{selectedTheater}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Show Time:</span>
                            <span className="text-white font-medium">{selectedShowtime} (Tomorrow)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Seat:</span>
                            <span className="text-white font-medium">{seatNumber}</span>
                          </div>
                          <div className="border-t border-gray-600 pt-3 flex justify-between">
                            <span className="text-cyan-400 font-semibold">Total Amount:</span>
                            <span className="text-cyan-400 font-bold text-lg">₹{getSelectedTheaterPrice()}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          Please confirm your booking details. Once confirmed, your ticket will be reserved and cannot be cancelled.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-600 text-white border-gray-500 hover:bg-gray-500">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBookTicket}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Booking...
                          </div>
                        ) : (
                          'Confirm Booking'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <AlertDialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <AlertDialogContent className="bg-gray-800 border border-green-500/50 text-white max-w-md">
          <AlertDialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Ticket size={32} className="text-green-400" />
            </div>
            <AlertDialogTitle className="text-green-400 text-2xl">
              Booking Confirmed!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg space-y-3 text-sm">
                <div className="text-center border-b border-gray-600 pb-3">
                  <h3 className="text-white font-bold text-lg">{selectedMovie?.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-400">Theater:</span>
                    <p className="text-white font-medium">{selectedTheater}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Seat:</span>
                    <p className="text-white font-medium">{seatNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Time:</span>
                    <p className="text-white font-medium">{selectedShowtime}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white font-medium">Tomorrow</p>
                  </div>
                </div>
                <div className="border-t border-gray-600 pt-3 text-center">
                  <span className="text-green-400 font-bold text-xl">₹{getSelectedTheaterPrice()}</span>
                  <p className="text-gray-400 text-xs mt-1">Amount Paid</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-medium">🎉 Your ticket has been booked successfully!</p>
                <p className="text-gray-400 text-sm mt-2">
                  Please arrive 15 minutes before the show time.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleSuccessModalClose}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Book Another Ticket
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BookTicket;
