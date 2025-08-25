const express = require('express');
const router_v2 = express.Router();   // 그냥 router_v2 대신, router 로 변수 이름(통일) 설정 해도, 전역변수 충돌없이 정상 작동할라나? 잘 모름
const userController = require('../../../controllers/userController');
// const { Router } = require('express');
// const stockController = require('../../../controllers/stock.controller');
// const router = Router(); // router vs router_v2

// 사용자 관련 API 라우트 정의
router_v2.get('/:userId/holdings', userController.getUserHoldings); // 특정 사용자의 보유 주식 조회
router_v2.get('/:userId/balance', userController.getUserBalance);   // 특정 사용자의 잔고 조회

module.exports = router_v2;
