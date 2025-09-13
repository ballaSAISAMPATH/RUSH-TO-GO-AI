const express = require('express');
const {
  getAvailableMovies,
  bookTicket,
  getUserBookedTickets,
  listTicketForResale,
  getResaleTickets,
  buyResaleTicket,
  getUserSellingTickets,
  removeFromSale,
  getUserSoldTickets
} = require('../controllers/TicketController');

const router = express.Router();

// Get all available movies
router.get('/movies', getAvailableMovies);

// Book a ticket normally
router.post('/book', bookTicket);

// Get user's booked tickets
router.get('/booked/:userId', getUserBookedTickets);

// List ticket for resale
router.put('/resale/:ticketId', listTicketForResale);

// Get all resale tickets
router.get('/resale', getResaleTickets);

// Buy resale ticket
router.post('/resale/:ticketId/buy', buyResaleTicket);

// Get user's selling tickets
router.get('/selling/:userId', getUserSellingTickets);

// Remove ticket from sale
router.delete('/selling/:ticketId', removeFromSale);
router.get('/sold/:userId', getUserSoldTickets);
module.exports = router;