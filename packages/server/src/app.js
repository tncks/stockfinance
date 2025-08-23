const express = require('express');
const app = express();
const apiRoutes = require('./api/v1/routes');

// Middleware
app.use(express.json());

// API Routes
app.use('/api/v1', apiRoutes);

module.exports = app;
