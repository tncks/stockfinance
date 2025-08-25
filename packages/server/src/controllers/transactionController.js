const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// [M1] (현재 테스트중, 일단 여기선 쓰는 중)

// 주식 매수 로직 (POST /api/buy)
exports.buyStock = async (req, res) => {
    const { userId, stockId, quantity } = req.body; // stockSymbol 대신 stockId를 받는 것으로 변경 (더 정확함)

    // 입력 유효성 검사
    if (!userId || !stockId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: '유효한 사용자 ID, 주식 ID, 그리고 0보다 큰 수량을 입력해야 합니다.' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. 사용자 및 주식 정보 조회
            const user = await tx.user.findUnique({ where: { id: userId } });
            const stock = await tx.stock.findUnique({ where: { id: stockId } });

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            if (!stock) {
                throw new Error('주식을 찾을 수 없습니다.');
            }

            const totalPrice = stock.currentPrice * quantity;

            // 2. 잔고 확인
            if (user.balance < totalPrice) {
                throw new Error('잔고가 부족합니다.');
            }

            // 3. 사용자 잔고 차감
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: totalPrice } },
            });

            // 4. 보유 주식 업데이트 또는 생성
            const holding = await tx.holding.findUnique({
                where: { userId_stockId: { userId, stockId: stock.id } },
            });

            if (holding) {
                await tx.holding.update({
                    where: { id: holding.id },
                    data: { quantity: { increment: quantity } },
                });
            } else {
                await tx.holding.create({
                    data: { userId, stockId: stock.id, quantity },
                });
            }

            // 5. 성공 시 업데이트된 사용자 정보 반환 (프론트엔드에서 최신 잔고를 즉시 반영할 수 있도록)
            const updatedUser = await tx.user.findUnique({ where: { id: userId } });
            return updatedUser;
        });

        res.status(200).json({ success: true, user: result, message: '매수가 성공적으로 처리되었습니다.' });
    } catch (error) {
        console.error('매수 트랜잭션 실패:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// 주식 매도 로직 (POST /api/sell)
exports.sellStock = async (req, res) => {
    const { userId, stockId, quantity } = req.body;

    // 입력 유효성 검사
    if (!userId || !stockId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: '유효한 사용자 ID, 주식 ID, 그리고 0보다 큰 수량을 입력해야 합니다.' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. 사용자 및 주식 정보, 보유 주식 정보 조회
            const user = await tx.user.findUnique({ where: { id: userId } });
            const stock = await tx.stock.findUnique({ where: { id: stockId } });
            const holding = await tx.holding.findUnique({
                where: { userId_stockId: { userId, stockId } },
            });

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            if (!stock) {
                throw new Error('주식을 찾을 수 없습니다.');
            }
            if (!holding || holding.quantity < quantity) {
                throw new Error('보유 수량이 부족하거나 주식을 보유하고 있지 않습니다.');
            }

            const sellPrice = stock.currentPrice * quantity;

            // 2. 사용자 잔고 증가
            await tx.user.update({
                where: { id: userId },
                data: { balance: { increment: sellPrice } },
            });

            // 3. 보유 주식 수량 감소 또는 삭제
            if (holding.quantity - quantity === 0) {
                // 모든 수량을 매도하면 Holding 기록 삭제
                await tx.holding.delete({
                    where: { id: holding.id },
                });
            } else {
                // 일부만 매도하면 수량 감소
                await tx.holding.update({
                    where: { id: holding.id },
                    data: { quantity: { decrement: quantity } },
                });
            }

            // 4. 성공 시 업데이트된 사용자 정보 반환
            const updatedUser = await tx.user.findUnique({ where: { id: userId } });
            return updatedUser;
        });

        res.status(200).json({ success: true, user: result, message: '매도가 성공적으로 처리되었습니다.' });
    } catch (error) {
        console.error('매도 트랜잭션 실패:', error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

//
// [M2] (검토 후 더 좋은 로직/유지보수 형태라면 도입 가능) - 일단 검토부터 필요함 아래 내용은.
/*
방식 정리: (코드 구현 및 모듈화에서 살짝 차이남)

(매수/매도/보유 조회)

비즈니스 규칙

매수: balance >= price * qty → 잔고 감소, 보유수량 증가, Trade 기록

매도: holding.quantity >= qty → 잔고 증가, 보유수량 감소, Trade 기록

모두 하나의 트랜잭션에서 처리

// backend/src/modules/trade/trade.repository.ts
import { prisma } from '../../utils/prisma';

export const tradeRepo = {
  user: (tx, id: number) => tx.user.findUnique({ where: { id } }),
  stock: (tx, symbol: string) => tx.stock.findUnique({ where: { symbol } }),
  holdingByUserStock: (tx, userId: number, stockId: number) =>
    tx.holding.findUnique({ where: { userId_stockId: { userId, stockId } } }),
  createHolding: (tx, userId: number, stockId: number, qty: number) =>
    tx.holding.create({ data: { userId, stockId, quantity: qty } }),
  updateHolding: (tx, holdingId: number, qtyDelta: number) =>
    tx.holding.update({ where: { id: holdingId }, data: { quantity: { increment: qtyDelta } } }),
  updateBalance: (tx, userId: number, delta: string) =>
    tx.user.update({ where: { id: userId }, data: { balance: { increment: delta } } }),
  recordTrade: (tx, userId: number, stockId: number, side: 'BUY'|'SELL', price: string, qty: number) =>
    tx.trade.create({ data: { userId, stockId, side, price, quantity: qty } }),
  holdingsOf: (userId: number) =>
    prisma.holding.findMany({
      where: { userId },
      include: { stock: true }
    }),
};

// backend/src/modules/trade/trade.service.ts
import { prisma } from '../../utils/prisma';
import { z } from 'zod';
import { tradeRepo } from './trade.repository';

export const tradeSchema = z.object({
  symbol: z.string(),
  price: z.string(), // Decimal 안전
  quantity: z.number().int().positive()
});

export const tradeService = {
  async buy(userId: number, input: z.infer<typeof tradeSchema>) {
    return prisma.$transaction(async (tx) => {
      const user = await tradeRepo.user(tx, userId);
      const stock = await tradeRepo.stock(tx, input.symbol);
      if (!user || !stock) throw new Error('User or stock not found');

      // 총 금액 = price * qty (Decimal 곱셈은 문자열/Decimal로 계산)
      const total = (BigInt(input.price.replace('.', '')) * BigInt(input.quantity)).toString();
      // ↑ 간단 설명용. 실제론 decimal.js 등으로 처리 권장.

      // 잔고 확인 (문자열/Decimal 비교 로직 필요) — 여기선 단순 비교 가정
      // 실무는 Prisma Decimal, decimal.js를 함께 써서 안전비교 권장
      // if (decimal(user.balance).lt(decimal(total))) throw new Error('Insufficient balance');

      await tradeRepo.updateBalance(tx, userId, `-${input.price}`); // * qty 반영 필요
      // ↑ 데모용 단순화. 실제로는 total을 사용해야 합니다.
      let holding = await tradeRepo.holdingByUserStock(tx, userId, stock.id);
      if (holding) {
        await tradeRepo.updateHolding(tx, holding.id, input.quantity);
      } else {
        await tradeRepo.createHolding(tx, userId, stock.id, input.quantity);
      }
      await tradeRepo.recordTrade(tx, userId, stock.id, 'BUY', input.price, input.quantity);
      return { ok: true };
    });
  },

  async sell(userId: number, input: z.infer<typeof tradeSchema>) {
    return prisma.$transaction(async (tx) => {
      const user = await tradeRepo.user(tx, userId);
      const stock = await tradeRepo.stock(tx, input.symbol);
      if (!user || !stock) throw new Error('User or stock not found');

      const holding = await tradeRepo.holdingByUserStock(tx, userId, stock.id);
      if (!holding || holding.quantity < input.quantity) throw new Error('Insufficient holdings');

      // 잔고 증가 (총액 계산은 위와 동일하게 decimal로)
      await tradeRepo.updateBalance(tx, userId, input.price); // * qty 반영 필요(데모 단순화)
      await tradeRepo.updateHolding(tx, holding.id, -input.quantity);
      await tradeRepo.recordTrade(tx, userId, stock.id, 'SELL', input.price, input.quantity);
      return { ok: true };
    });
  },

  async holdings(userId: number) {
    return tradeRepo.holdingsOf(userId);
  }
};


//주의(실무): 금액 연산은 decimal.js 등으로 필수적으로 처리하세요.


//
// backend/src/modules/trade/trade.controller.ts
import { Router } from 'express';
import { tradeService, tradeSchema } from './trade.service';
import { authGuard } from '../../middlewares/auth';

export const tradeRouter = Router();

tradeRouter.post('/buy', authGuard, async (req, res, next) => {
  try {
    const input = tradeSchema.parse(req.body);
    const out = await tradeService.buy((req as any).userId, input);
    res.json(out);
  } catch (e) { next(e); }
});

tradeRouter.post('/sell', authGuard, async (req, res, next) => {
  try {
    const input = tradeSchema.parse(req.body);
    const out = await tradeService.sell((req as any).userId, input);
    res.json(out);
  } catch (e) { next(e); }
});

tradeRouter.get('/holdings', authGuard, async (req, res, next) => {
  try {
    const out = await tradeService.holdings((req as any).userId);
    res.json(out);
  } catch (e) { next(e); }
});
 */