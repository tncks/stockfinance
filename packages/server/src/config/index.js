require('dotenv').config();

module.exports = {
  serviceKey: process.env.STOCK_SERVICE_KEY || 'ILHpBh/Ei4zp88S4zdGSxnDALfZ76JTiJzofGsEYYiGpXldHO3QV39MxgM8sOjSxhLxHS9AV7XDjgoR3u3DGxw==',
  apiUrl: 'https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo',
  stockCodes: ['005930'], // dummy
};
