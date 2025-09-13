const MovieTicket = require('../models/MovieTicket');
const User = require('../models/User');

// Get all available movies with static data
const getAvailableMovies = async (req, res) => {
  try {
    const staticMovies = [
      {
        _id: 'movie1',
        title: 'Avengers: Endgame',
        theaters: [
          {
            name: 'PVR Cinemas (Vizag)',
            showtimes: ['10:00 AM', '2:00 PM', '6:00 PM', '10:00 PM'],
            price: 250
          },
          {
            name: 'INOX (Vizianagaram)',
            showtimes: ['11:00 AM', '3:00 PM', '7:00 PM', '11:00 PM'],
            price: 280
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg'
      },
      {
        _id: 'movie2',
        title: 'Spider-Man: No Way Home',
        theaters: [
          {
            name: 'Cinepolis (Vizag)',
            showtimes: ['9:00 AM', '1:00 PM', '5:00 PM', '9:00 PM'],
            price: 300
          },
          {
            name: 'PVR Cinemas (Vizianagaram)',
            showtimes: ['12:00 PM', '4:00 PM', '8:00 PM'],
            price: 270
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'
      },
      {
        _id: 'movie3',
        title: 'RRR',
        theaters: [
          {
            name: 'Asian Cinemas (Vizianagaram)',
            showtimes: ['10:30 AM', '2:30 PM', '6:30 PM', '10:30 PM'],
            price: 200
          },
          {
            name: 'INOX (Vizag)',
            showtimes: ['11:30 AM', '3:30 PM', '7:30 PM'],
            price: 220
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/tjpiEnZBUAA8pdNPRKa5vP2Zpqw.jpg'
      },
      {
        _id: 'movie4',
        title: 'Bahubali 2',
        theaters: [
          {
            name: 'Multiplex (Vizag)',
            showtimes: ['9:30 AM', '1:30 PM', '5:30 PM', '9:30 PM'],
            price: 180
          },
          {
            name: 'Sri Rama Theatre (Vizianagaram)',
            showtimes: ['10:00 AM', '2:00 PM', '6:00 PM'],
            price: 150
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/sXf30F2HFpsFPXlNz7jpOySSV9I.jpg'
      },
      {
        _id: 'movie5',
        title: 'Pushpa: The Rise',
        theaters: [
          {
            name: 'Jagadamba Theatre (Vizag)',
            showtimes: ['10:00 AM', '1:45 PM', '5:30 PM', '9:15 PM'],
            price: 220
          },
          {
            name: 'Asian Cinemas (Vizianagaram)',
            showtimes: ['11:00 AM', '3:00 PM', '7:00 PM'],
            price: 200
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/w2RG8J3um9F3eggUeJVuuAI0RFk.jpg'
      },
      {
        _id: 'movie6',
        title: 'KGF: Chapter 2',
        theaters: [
          {
            name: 'INOX (Vizag)',
            showtimes: ['10:15 AM', '2:15 PM', '6:15 PM', '10:15 PM'],
            price: 250
          },
          {
            name: 'Venkateswara Theatre (Vizianagaram)',
            showtimes: ['11:30 AM', '3:30 PM', '7:30 PM'],
            price: 180
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/khNVygolU0TxLIDWff5tQlAhZ23.jpg'
      },
      {
        _id: 'movie7',
        title: 'Jawan',
        theaters: [
          {
            name: 'Cinepolis (Vizag)',
            showtimes: ['9:45 AM', '1:45 PM', '5:45 PM', '9:45 PM'],
            price: 280
          },
          {
            name: 'PVR Cinemas (Vizianagaram)',
            showtimes: ['12:15 PM', '4:15 PM', '8:15 PM'],
            price: 260
          }
        ],
        poster: 'https://www.themoviedb.org/t/p/w1280/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg'
      },
      {
        _id: 'movie8',
        title: 'Salaar: Part 1',
        theaters: [
          {
            name: 'Jagadamba Theatre (Vizag)',
            showtimes: ['10:00 AM', '1:30 PM', '5:00 PM', '8:30 PM'],
            price: 300
          },
          {
            name: 'Sri Rama Theatre (Vizianagaram)',
            showtimes: ['11:15 AM', '3:15 PM', '7:15 PM'],
            price: 220
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/2G1C677cokQKFHbUKG9sVlIGOiX.jpg'
      },
      {
        _id: 'movie9',
        title: 'Leo',
        theaters: [
          {
            name: 'PVR Cinemas (Vizag)',
            showtimes: ['9:00 AM', '12:45 PM', '4:30 PM', '8:15 PM'],
            price: 280
          },
          {
            name: 'INOX (Vizianagaram)',
            showtimes: ['10:30 AM', '2:15 PM', '6:00 PM'],
            price: 240
          }
        ],
        poster: 'https://images.indianexpress.com/2023/09/leo2.jpg'
      },
      {
        _id: 'movie10',
        title: 'Vikram',
        theaters: [
          {
            name: 'Cinepolis (Vizag)',
            showtimes: ['10:30 AM', '2:00 PM', '6:00 PM', '10:00 PM'],
            price: 270
          },
          {
            name: 'Asian Cinemas (Vizianagaram)',
            showtimes: ['11:00 AM', '3:00 PM', '7:00 PM'],
            price: 230
          }
        ],
        poster: 'https://www.tallengestore.com/cdn/shop/files/Vikram-KamalHaasan-TamilMoviePoster2_large.jpg?v=1713618961'
      },
      {
        _id: 'movie11',
        title: 'Sita Ramam',
        theaters: [
          {
            name: 'Jagadamba Theatre (Vizag)',
            showtimes: ['9:30 AM', '1:30 PM', '5:30 PM', '9:30 PM'],
            price: 200
          },
          {
            name: 'Sri Rama Theatre (Vizianagaram)',
            showtimes: ['10:30 AM', '2:30 PM', '6:30 PM'],
            price: 180
          }
        ],
        poster: 'https://image.tmdb.org/t/p/w500/g3hk2wEeIsTGhh7JvK8yWFVR7ue.jpg'
      }
    ];

    res.json(staticMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Book a ticket normally
const bookTicket = async (req, res) => {
  try {
    const { movieTitle, theaterName, showTime, seatNumber, price, userId } = req.body;

    const ticket = new MovieTicket({
      movieTitle,
      theaterName,
      showTime: new Date(showTime),
      seatNumber,
      price,
      seller: userId,
      buyer: userId,
      status: 'sold',
      isForSale: false,
      paymentStatus: 'paid',
      qrCode: `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    await ticket.save();
    await ticket.populate('seller', 'name email');

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's booked tickets
const getUserBookedTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await MovieTicket.find({
      $or: [
        { seller: userId, buyer: userId }, // Originally booked by user
        { buyer: userId, seller: { $ne: userId } } // Bought from reseller
      ]
    }).populate('seller', 'name email').populate('buyer', 'name email');

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List ticket for resale
const listTicketForResale = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { resalePrice } = req.body;

    const ticket = await MovieTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.isForSale = true;
    ticket.price = resalePrice;
    ticket.status = 'available';
    ticket.buyer = null;
    ticket.paymentStatus = 'pending';

    await ticket.save();
    await ticket.populate('seller', 'name email');

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all resale tickets
const getResaleTickets = async (req, res) => {
  try {
    const tickets = await MovieTicket.find({
      isForSale: true,
      status: 'available',
      showTime: { $gt: new Date() } // Only future shows
    }).populate('seller', 'name email');

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buy resale ticket
const buyResaleTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { buyerId } = req.body;

    const ticket = await MovieTicket.findById(ticketId);
    if (!ticket || !ticket.isForSale || ticket.status !== 'available') {
      return res.status(400).json({ error: 'Ticket not available for purchase' });
    }

    ticket.buyer = buyerId;
    ticket.status = 'sold';
    ticket.isForSale = false;
    ticket.paymentStatus = 'paid';

    await ticket.save();
    await ticket.populate('seller', 'name email');
    await ticket.populate('buyer', 'name email');

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's selling tickets
const getUserSellingTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await MovieTicket.find({
      seller: userId,
      isForSale: true
    }).populate('buyer', 'name email');

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove ticket from sale
const removeFromSale = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await MovieTicket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.isForSale = false;
    ticket.status = 'sold'; // Revert back to sold so it can be resold again
    ticket.buyer = ticket.seller; // Reset buyer back to original owner
    ticket.paymentStatus = 'paid';

    await ticket.save();
    res.json({ message: 'Ticket removed from sale' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's sold tickets (tickets sold to others)
const getUserSoldTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    const tickets = await MovieTicket.find({
      seller: userId,
      buyer: { $ne: userId }, // Buyer is different from seller
      status: 'sold'
    }).populate('seller', 'name email').populate('buyer', 'name email');

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAvailableMovies,
  bookTicket,
  getUserBookedTickets,
  listTicketForResale,
  getResaleTickets,
  buyResaleTicket,
  getUserSellingTickets,
  removeFromSale,
  getUserSoldTickets
};
