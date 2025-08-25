const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 사용자의 보유 주식 전체 불러오기 (GET /api/holdings/:userId)
exports.getUserHoldings = async (req, res) => {
    const { userId } = req.params;

    // 입력 유효성 검사
    if (!userId) {
        return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
    }

    try {
        // userId에 해당하는 사용자의 모든 보유 주식(Holding)을 조회합니다.
        // 각 Holding에는 연결된 Stock 정보도 함께 포함합니다.
        const holdings = await prisma.holding.findMany({
            where: { userId: parseInt(userId) },
            include: { // `include`를 사용하여 관련 모델 데이터를 함께 가져옵니다.
                stock: true, // 보유 주식의 상세 정보(symbol, name, currentPrice 등)를 포함
            },
        });

        if (holdings.length === 0) {
            return res.status(200).json({ message: '보유 주식이 없습니다.', holdings: [] });
        }

        res.status(200).json(holdings);
    } catch (error) {
        console.error(`Error fetching holdings for user ${userId}:`, error);
        res.status(500).json({ message: '보유 주식 정보를 불러오는 중 오류가 발생했습니다.' });
    }
};

// 사용자 잔고 조회 (선택 사항)
exports.getUserBalance = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: { balance: true, name: true, email: true } // 필요한 필드만 선택
        });
        if (!user) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error fetching user balance for user ${userId}:`, error);
        res.status(500).json({ message: '사용자 잔고를 불러오는 중 오류가 발생했습니다.' });
    }
};



/*
Block 1]
api path? 가정:  signup', async (req, res, next) => {
  try {
    const parsed = signupSchema.parse(req.body);
    const out = await userService.signup(parsed);
    res.json(out);
  } catch (e) { next(e); }
});

Block 2]
api path? 가정:  login', async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const out = await userService.login(parsed);
    res.json(out);
  } catch (e) { next(e); }
});



// backend/src/modules/user/user.service.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { userRepo } from './user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
export const loginSchema = signupSchema;

export const userService = {
//Block 1-b]
  async signup(input: z.infer<typeof signupSchema>) {
    const exists = await userRepo.findByEmail(input.email);
    if (exists) throw new Error('Email already exists');
    const hash = await bcrypt.hash(input.password, 10);
    const user = await userRepo.create(input.email, hash);
    return { id: user.id, email: user.email };
  },
//Block 2-b]
  async login(input: z.infer<typeof loginSchema>) {
    const user = await userRepo.findByEmail(input.email);
    if (!user) throw new Error('Invalid credentials');
    const ok = await bcrypt.compare(input.password, user.hash);
    if (!ok) throw new Error('Invalid credentials');
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return { token };
  }
};

 */