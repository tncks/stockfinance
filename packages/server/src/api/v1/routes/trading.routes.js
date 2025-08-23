const { Router } = require('express');
const stockController = require('../../../controllers/stock.controller');

const router = Router();

router.get('/stocks', stockController.getStockData);
router.post('/echo', stockController.echo);

module.exports = router;
