const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 모든 주식 조회 (GET /api/stocks)
exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await prisma.stockLivePrice.findMany();
        res.status(200).json(stocks);
    } catch (error) {
        console.error('Error fetching all stocks:', error);
        res.status(500).json({ message: '주식 정보를 불러오는 중 오류가 발생했습니다.' });
    }
};

// 특정 주식 조회 (GET /api/stocks/:id) - 여기서는 id 대신 symbol로 조회하는 경우가 많지만, RESTful 규칙에 따라 :id를 사용
exports.getStockById = async (req, res) => {
    const { id } = req.params;
    try {
        const stock = await prisma.stockLivePrice.findUnique({
            where: { id: parseInt(id) },
        });
        if (!stock) {
            return res.status(404).json({ message: '해당 주식을 찾을 수 없습니다.' });
        }
        res.status(200).json(stock);
    } catch (error) {
        console.error(`Error fetching stock with id ${id}:`, error);
        res.status(500).json({ message: '주식 정보를 불러오는 중 오류가 발생했습니다.' });
    }
};

// 새로운 주식 추가 (POST /api/stocks)
exports.createStock = async (req, res) => {
    const { symbol, name, currentPrice } = req.body;
    // 입력 유효성 검사
    if (!symbol || !name || currentPrice === undefined) {
        return res.status(400).json({ message: '모든 필드를 입력해야 합니다: symbol, name, currentPrice' });
    }
    try {
        const newStock = await prisma.stockLivePrice.create({
            data: {
                symbol: symbol.toUpperCase(), // 심볼은 대문자로 저장
                name,
                currentPrice: parseFloat(currentPrice),
            },
        });
        res.status(201).json(newStock); // 201 Created
    } catch (error) {
        // 이미 존재하는 심볼일 경우 Unique constraint 에러 발생
        if (error.code === 'P2002') {
            return res.status(409).json({ message: '이미 존재하는 주식 심볼입니다.' }); // 409 Conflict
        }
        console.error('Error creating stock:', error);
        res.status(500).json({ message: '주식을 추가하는 중 오류가 발생했습니다.' });
    }
};

// 주식 정보 업데이트 (PUT /api/stocks/:id)
exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { name, currentPrice } = req.body;
    try {
        const updatedStock = await prisma.stockLivePrice.update({
            where: { id: parseInt(id) },
            data: {
                name,
                currentPrice: currentPrice !== undefined ? parseFloat(currentPrice) : undefined,
            },
        });
        res.status(200).json(updatedStock);
    } catch (error) {
        // 업데이트 대상 주식이 없을 경우
        if (error.code === 'P2025') {
            return res.status(404).json({ message: '해당 주식을 찾을 수 없어 업데이트할 수 없습니다.' });
        }
        console.error(`Error updating stock with id ${id}:`, error);
        res.status(500).json({ message: '주식 정보를 업데이트하는 중 오류가 발생했습니다.' });
    }
};

// 주식 삭제 (DELETE /api/stocks/:id)
exports.deleteStock = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.stockLivePrice.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // 204 No Content (삭제 성공 시 본문 없음)
    } catch (error) {
        // 삭제 대상 주식이 없을 경우
        if (error.code === 'P2025') {
            return res.status(404).json({ message: '해당 주식을 찾을 수 없어 삭제할 수 없습니다.' });
        }
        console.error(`Error deleting stock with id ${id}:`, error);
        res.status(500).json({ message: '주식을 삭제하는 중 오류가 발생했습니다.' });
    }
};
