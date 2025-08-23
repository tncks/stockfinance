const { Router } = require('express');
const tradingRoutes = require('./trading.routes');

const router = Router();

router.use('/trading', tradingRoutes);

module.exports = router;
