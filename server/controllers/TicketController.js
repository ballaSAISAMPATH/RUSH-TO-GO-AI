const MovieTicket = require("../models/movieTicketSchema");

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
      showTime,
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
    const { ticketId, resalePrice, userId } = req.body;

    const ticket = await MovieTicket.findById(ticketId);

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (ticket.buyer.toString() !== userId) {
      return res.status(403).json({ error: "You can only resell tickets you own" });
    }

    // mark ticket as listed for sale
    ticket.isForSale = true;
    ticket.price = resalePrice; // update to new price
    ticket.status = "available";
    ticket.paymentStatus = "pending";

    await ticket.save();
    res.json({ message: "Ticket listed for resale", ticket });
  } catch (err) {
    res.status(500).json({ error: "Failed to resell ticket", details: err.message });
  }
};

// 🛒 3. Buy Resale Ticket
exports.buyResaleTicket = async (req, res) => {
  try {
    const { ticketId, buyerId } = req.body;

    const ticket = await MovieTicket.findById(ticketId);

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    if (!ticket.isForSale || ticket.status !== "available") {
      return res.status(400).json({ error: "Ticket is not available for resale" });
    }

    // update ownership
    ticket.buyer = buyerId;
    ticket.seller = buyerId; // new owner
    ticket.paymentStatus = "paid";
    ticket.status = "sold";
    ticket.isForSale = false;

    await ticket.save();
    res.json({ message: "Resale ticket purchased successfully", ticket });
  } catch (err) {
    res.status(500).json({ error: "Failed to buy resale ticket", details: err.message });
  }
};

// 📋 4. Fetch All Tickets (both normal + resale)
exports.getAllTickets = async (req, res) => {
  console.log("at bkd");
  try {
    
    const tickets = await MovieTicket.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets", details: err.message });
  }
};
exports.getUserTickets = async (req, res) => {
  console.log( req.params.userId);
  try {
      const tickets = await MovieTicket.find({ buyer: req.params.userId });
      console.log(tickets);
      
      res.json(tickets);
  } 
  catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets", details: err.message });
  }
};
