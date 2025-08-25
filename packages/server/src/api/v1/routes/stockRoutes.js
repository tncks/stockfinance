const express = require('express');
const router_v2 = express.Router();   // 그냥 router_v2 대신, router 로 변수 이름(통일) 설정 해도, 전역변수 충돌없이 정상 작동할라나? 잘 모름
const stockController = require('../../../controllers/stockController');
// const { Router } = require('express');
// const stockController = require('../../../controllers/stock.controller');
// const router = Router(); // router vs router_v2

// 주식 관련 API 라우트 정의
router_v2.get('/', stockController.getAllStocks);             // 모든 주식 조회
router_v2.get('/:id', stockController.getStockById);         // 특정 주식 조회
router_v2.post('/', stockController.createStock);            // 새로운 주식 추가
router_v2.put('/:id', stockController.updateStock);          // 주식 정보 업데이트
router_v2.delete('/:id', stockController.deleteStock);       // 주식 삭제

module.exports = router_v2;
