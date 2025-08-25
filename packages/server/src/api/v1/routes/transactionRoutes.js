const express = require('express');
const router_v2 = express.Router();   // 그냥 router_v2 대신, router 로 변수 이름(통일) 설정 해도, 전역변수 충돌없이 정상 작동할라나? 잘 모름
const transactionController = require('../../../controllers/transactionController');
// const { Router } = require('express');
// const stockController = require('../../../controllers/stock.controller');
// const router = Router(); // router vs router_v2

// 매수/매도 관련 API 라우트 정의
router_v2.post('/buy', transactionController.buyStock);  // 주식 매수
router_v2.post('/sell', transactionController.sellStock); // 주식 매도

module.exports = router_v2;
