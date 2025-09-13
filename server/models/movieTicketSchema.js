const mongoose = require("mongoose");

const movieTicketSchema = new mongoose.Schema({
  movieTitle: {
    type: String,
    required: true
  },
  theaterName: {
    type: String,
    required: true
  },
  showTime: {
    type: Date, // exact show date & time
    default: Date.now(),
  },
  seatNumber: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  seller: {
    type:String,
    ref: "User",
    required: true
  },
  buyer: {
    type: String,
    ref: "User",
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  status: {
    type: String,
    enum: ["available", "sold"],
    default: "available"
  },
  isForSale: {
    type: Boolean,
    default: true // true = listed for sale, false = not for sale
  },
  qrCode: {
    type: String, // QR/barcode string or image URL
    default: null
  }
}, {
  timestamps: true
});

const MovieTicket = mongoose.model("MovieTicket", movieTicketSchema);

module.exports = MovieTicket;
