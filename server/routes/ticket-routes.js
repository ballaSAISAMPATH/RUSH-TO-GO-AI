const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/TicketController");

// buying a new ticket normally
router.post("/buy", ticketController.buyTicket);

// resell an owned ticket
router.post("/resell", ticketController.resellTicket);

// buy resale ticket
router.post("/buy-resale", ticketController.buyResaleTicket);

// fetch all tickets
router.get("/getTickets", ticketController.getAllTickets);
router.get("/getTickets:userId", ticketController.getUserTickets);

module.exports = router;
