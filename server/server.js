const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Ai_routes = require('./routes/Ai_routes')
require('dotenv').config(); 
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 5000; 
const otpRoutes = require('./routes/otp-routes')
const authRouter = require('./routes/auth-routes');
const ticketRouter = require('./routes/ticket-routes')
app.use(cors({
  origin: process.env.CLIENT_ORIGIN, 
  credentials: true,             
}));

app.use(cookieParser());
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/ticket',ticketRouter)
app.use('/api/otp',otpRoutes)
app.use('/api/ai',Ai_routes)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
