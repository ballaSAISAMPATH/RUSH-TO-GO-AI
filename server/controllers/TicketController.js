const MovieTicket = require('../models/movieTicketSchema');
const User = require('../models/User');

// 🎬 1. Normal Buy Ticket (direct booking by user)
exports.buyTicket = async (req, res) => {
  console.log(req.body);
  
  try {
    const {
      movieTitle,
      theaterName,
      showTime,
      seatNumber,
      price,
      buyerId
    } = req.body;
    
    console.log(movieTitle,
      theaterName,
      showTime,
      seatNumber,
      price,
      buyerId );
    // create new ticket directly booked by buyer
    const newTicket =await MovieTicket.create({
      movieTitle,
      theaterName,
      showTime: new Date(showTime),
      seatNumber,
      price,
      seller: buyerId,   
      buyer: buyerId,
      paymentStatus: "paid",
      status: "sold",
      isForSale: false,
      qrCode: null,
    });

    res.status(201).json({ message: "Ticket booked successfully", ticket: newTicket });
  } catch (err) {
    res.status(500).json({ error: "Failed to buy ticket", details: err.message });
  }
};

// 🔄 2. Resell Ticket (user puts an already booked ticket for sale)
exports.resellTicket = async (req, res) => {
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

// 📋 4. Fetch All Tickets (both normal + resale)
exports.getAllTickets = async (req, res) => {
  console.log("at bkd");
  try {
    
    const tickets = await MovieTicket.find();
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
    ticket.status = 'cancelled';
    
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
