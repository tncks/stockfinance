// const express = require('express');
// const router = express.Router();
// const stockController = require('../controllers/stockController');
const { Router } = require('express');
const stockController = require('../../../controllers/stock.controller');
const router = Router();

router.get('/stocks', stockController.getStockData);
router.post('/echo', stockController.echo);

module.exports = router;
// 현재로서는 4~11 line 정상작동함. //1~3 line 주석 세줄은 그냥 참고용임. 중요하지 않음. 나머지 주석이 아닌 코드들은 잘 동작함. trading.routes.js : 기존 (잘 동작하는 파일)