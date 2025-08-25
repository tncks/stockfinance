const { Router } = require('express');
const tradingRoutes = require('./trading.routes');  // 기존
const stockRoutes = require('./stockRoutes'); // (추가)
const transactionRoutes = require('./transactionRoutes'); //
const userRoutes = require('./userRoutes'); //
const authRoutes = require('./authRoutes'); // Gemini 추가

const router = Router();

router.use('/trading', tradingRoutes); // 기존

router.use('/stocks', stockRoutes);  // 0824: code update: (추가) 라우트 연결
router.use('/transactions', transactionRoutes); // /api/buy, /api/sell 경로가 됨(이라고 GPT가 말함)   (<- 경로명, 경로 위치 등 경로 설정 이유로 에러 발생 가능! 추후 확인 필요)
router.use('/users', userRoutes); // /api/users/:userId/holdings, /api/users/:userId/balance 경로가 됨(이라고 GPT가 말함)  (<- 에러 발생 가능! 추후 확인 필요)
router.use('/auth', authRoutes); // Gemini 추가: /api/v1/auth 경로가 됩니다.



module.exports = router;


/*
추가 제안 및 코딩 팁:(GPT)

GPT의 말 : 백엔드 사용을 위한 추가 팁:

- 환경 설정: my-backend 폴더에 .env 파일을 만들고 DATABASE_URL="mysql://user:password@localhost:3306/your_database_name"와 같이 데이터베이스 연결 정보를 입력해야 합니다.

- Prisma 마이그레이션: 백엔드 코드를 실행하기 전에 npx prisma migrate dev --name init 명령어를 실행하여 데이터베이스 스키마를 동기화해야 합니다.

- 의존성 설치: npm install express prisma @prisma/client 명령어를 실행하여 필요한 라이브러리를 설치합니다.
 */

// 한편
/*
BigInt/Decimal JSON 직렬화 (언젠가 나중에 관련 이슈 발생시 이 내용을 참고)

Postgres BIGINT 또는 Prisma Decimal은 JS로 올 때 n 접미(BigInt) 또는 Decimal 객체/문자열로 다뤄집니다.
안전하게 내려주려면 문자열로 변환:

// backend/src/middlewares/bigIntJson.ts
export function bigIntJsonMiddleware(_req, res, next) {
  const original = res.json;
  res.json = function (data) {
    const serialized = JSON.parse(
      JSON.stringify(
        data,
        (_, v) => (typeof v === 'bigint' ? v.toString() : v) // BigInt → string
      )
    );
    return original.call(this, serialized);
  };
  next();
}
 */