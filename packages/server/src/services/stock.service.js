const axios = require('axios');
const { serviceKey, apiUrl, stockCodes } = require('../config');

let globalResultData = null;
let globalErrormsg = null;

async function fetchAndInsertStockData() {
    const allDataPromises = stockCodes.map(code => {
        const params = {
            serviceKey: serviceKey,
            resultType: 'json',
            beginBasDt: '20200101',
            endBasDt: '20250822',
            likeSrtnCd: code,
            numOfRows: 13000,
            pageNo: 1
        };
        return axios.get(apiUrl, {params});
    });

    try {
        const responses = await Promise.all(allDataPromises);
        let combinedData = [];

        for (const response of responses) {
            const rawData = response.data;
            const items = rawData.response.body.items.item;
            if (items) {
                const formattedData = items.map(item => ({
                    base_date: item.basDt,
                    short_code: item.srtnCd,
                    isin_code: item.isinCd,
                    item_name: item.itmsNm,
                    market_category: item.mrktCtg,
                    closing_price: parseInt(item.clpr),
                    compared_to_previous: parseInt(item.vs),
                    fluctuation_rate: parseFloat(item.fltRt),
                    market_price: parseInt(item.mkp),
                    high_price: parseInt(item.hipr),
                    low_price: parseInt(item.lopr),
                    trade_quantity: parseInt(item.trqu),
                    trade_price: parseInt(item.trPrc),
                    listed_stock_count: parseInt(item.lstgStCnt),
                    market_total_amount: parseInt(item.mrktTotAmt)
                }));
                console.log(`${formattedData[0].item_name || '종목 코드'}에 대한 데이터가 성공적으로 정형화되었습니다.`);
                combinedData = combinedData.concat(formattedData);
            }
        }
        globalResultData = combinedData;
        globalErrormsg = null;
    } catch (error) {
        globalErrormsg = error.message || 'Unknown error';
        console.error('API 호출 또는 데이터 처리 중 오류 발생:', error);
        globalResultData = null;
    }
}

const initializeStockData = () => {
    fetchAndInsertStockData();
    // Optionally, set up a recurring fetch interval
    // setInterval(fetchAndInsertStockData, 1000 * 60 * 60); // e.g., every hour
};

const getCachedData = () => {
    return { data: globalResultData, error: globalErrormsg };
};

module.exports = {
    initializeStockData,
    getCachedData,
};
