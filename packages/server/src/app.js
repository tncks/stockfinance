const express = require('express');
const app = express();
const apiRoutes = require('./api/v1/routes');
const authRoutes = require('./api/v1/routes/authRoutes');

// Middleware
app.use(express.json());

// API Routes
app.use('/api/v1', apiRoutes);
app.use('/api/v1/auth', authRoutes);

module.exports = app;
