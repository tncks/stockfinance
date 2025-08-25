const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./api/v1/routes');
const authRoutes = require('./api/v1/routes/authRoutes');

// Middleware (two things)
// (1)
app.use(cors({

    origin: ['https://stockfinance.vercel.app', 'http://localhost:3000'],
    credentials: true

}));
// (2)
app.use(express.json());

// API Routes
app.use('/api/v1', apiRoutes);
app.use('/api/v1/auth', authRoutes);

module.exports = app;
