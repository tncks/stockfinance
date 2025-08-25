import {Button} from "@/shared/ui/button";
import {Input} from "@/shared/ui/input";
import {Badge} from "@/shared/ui/badge";
import {ScrollArea} from "@/shared/ui/scroll-area";
import {Bot, Send} from "lucide-react";
import {useEffect, useState} from 'react';
import {supabase} from '@/shared/lib/supabaseClient';
import {Card, CardContent, CardHeader, CardTitle} from '@/shared/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/shared/ui/table';


export function BIAssistant() {

    const [inputMessage, setInputMessage] = useState("");

    const handleSendMessage = () => {
        return;


    };



    type Stock = {
        stock_code: string;
        stock_name: string;
    };


    const [stocks, setStocks] = useState<Stock[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all columns and all rows from the 'DailyPrices' table
                const {data, error: supabaseError} = await supabase
                    .from('DailyPrices')
                    .select("종목코드, 종목명");


                console.log('data:');
                console.log(data);
                if (data) {
                    const mapped = data.map((row) => ({
                        stock_code: row["종목코드"],
                        stock_name: row["종목명"],
                    })) as Stock[];
                    console.log('map:');
                    console.log(mapped);
                    setStocks(mapped);
                }

                if (supabaseError) {
                    // If Supabase returns an error, throw it to be caught by the catch block
                    throw supabaseError;
                }

            } catch (err: unknown) {
                // If any error occurs during the process, update the error state
                console.error("Error fetching stock data:", err);
                if (err instanceof Error) {
                  setError(`Failed to load data: ${err.message}`);
                } else {
                  setError("아직 주식 데이터가 없나 봅니다. 확인해보세요. 혹은 와이파이 연결 문제 등 다른 가능성도 고려할 수 있어요.");
                }
            } finally {
                // Whether it succeeds or fails, stop loading
                setLoading(false);
            }
        };

        fetchStockData();
    }, []); // The empty dependency array [] means this effect runs only once on mount


     if (loading) {
         return <div className="p-4">..</div>;
     }

     if (error) {
         return <div className="p-4 text-red-500">{error}</div>;
     }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Custom Dashboard Interface */}
            <Card className="lg:col-span-3 bg-gradient-to-br from-card to-card/80 border-border/50 flex flex-col">
                <CardHeader className="border-b border-border/50">
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-accent/10 rounded-full">
                            <Bot className="h-5 w-5 text-accent"/>
                        </div>
                        주식
                        <Badge variant="secondary" className="ml-auto">Online</Badge>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">



                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>화면</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stocks != null ? stocks.map((stock) => (
                                        <TableRow key={stock.stock_code}>
                                            <TableCell>
                                                <div className="font-medium">{stock.stock_name}</div>
                                                <div
                                                    className="text-sm text-muted-foreground">{stock.stock_code}</div>
                                            </TableCell>

                                        </TableRow>
                                    )) : 0+0 }
                                </TableBody>
                            </Table>



                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t border-border/50">
                        <div className="flex gap-2">
                            <Input
                                placeholder="입력..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage} className="bg-accent hover:bg-accent/90">
                                <Send className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>


        </div>
    );


}


// 주식 Holding 관련 API 등 목적은 화면에 가져와서 프론트 단에 출력하기, 코드 도입 검토.. ->
/*
GPT 와 대화 내용

프론트엔드 프로젝트 구조 제안
my-frontend/
├── node_modules/
├── public/
├── src/
│   ├── api/
│   │   └── holdings.js         // React Query custom hook for holdings
│   ├── components/
│   │   ├── HoldingsList.js       // 보유 주식 목록을 표시하는 컴포넌트
│   │   ├── BuySellForm.js        // 매수/매도 폼 컴포넌트 (간단하게)
│   │   └── UserBalance.js        // 사용자 잔고를 표시하는 컴포넌트
│   ├── App.js
│   └── index.js                  // React Query Provider 설정
├── package.json


백엔드 프로젝트 구조 제안
my-backend/
├── node_modules/
├── prisma/
│   └── schema.prisma // 기존 스키마 재사용
├── src/
│   ├── controllers/
│   │   ├── stockController.js    // 주식 CRUD 로직
│   │   ├── userController.js     // 사용자 관련 로직 (보유 주식 조회)
│   │   └── transactionController.js // 매수/매도 로직
│   ├── routes/
│   │   ├── stockRoutes.js        // 주식 관련 API 라우트
│   │   ├── userRoutes.js         // 사용자 관련 API 라우트
│   │   └── transactionRoutes.js  // 매수/매도 API 라우트
│   └── server.js                 // 메인 Express 서버 파일
├── package.json
 */
/*
FE

my-frontend/src/api/holdings.js (Custom Hook)
재사용성을 높이기 위해 useHoldings 라는 커스텀 훅을 만듭니다. -> my-frontend/src/api/holdings.js

// my-frontend/src/api/holdings.js
import { useQuery } from '@tanstack/react-query';

// 사용자 ID에 따라 보유 주식 정보를 가져오는 함수
const fetchHoldings = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to fetch holdings.');
  }
  const response = await fetch(`http://localhost:4000/api/users/${userId}/holdings`);
  if (!response.ok) {
    // 에러 발생 시 HTTP 응답의 에러 메시지를 파싱하여 던짐
    const errorData = await response.json();
    throw new Error(errorData.message || '보유 주식 정보를 불러오는 데 실패했습니다.');
  }
  return response.json();
};

// React Query를 사용하는 커스텀 훅
export function useHoldings(userId) {
  return useQuery({
    queryKey: ['holdings', userId], // 쿼리 키: 데이터 캐싱 및 식별에 사용
    queryFn: () => fetchHoldings(userId), // 데이터를 가져올 함수
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
  });
}

 */
/*
my-frontend/src/components/HoldingsList.js (보유 주식 목록 컴포넌트)
useHoldings 훅을 사용하여 데이터를 불러오고 화면에 표시합니다. -> my-frontend/src/components/HoldingsList.js

// my-frontend/src/components/HoldingsList.js
import React from 'react';
import { useHoldings } from '../api/holdings'; // 커스텀 훅 import

function HoldingsList({ userId }) {
  // useHoldings 훅을 사용하여 데이터 가져오기
  const {
    data: holdings,     // API로부터 받은 데이터 (보유 주식 목록)
    isLoading,         // 데이터 로딩 중인지 여부
    isError,           // 데이터 로딩 중 에러 발생 여부
    error,             // 발생한 에러 객체
    refetch,           // 수동으로 데이터 재요청 함수
    isFetching         // 백그라운드에서 데이터를 다시 가져오고 있는지 여부 (캐시된 데이터가 있어도 갱신 중일 때 true)
  } = useHoldings(userId);

  // 로딩 중일 때
  if (isLoading) return <div>보유 주식 정보를 불러오는 중입니다...</div>;
  // 에러 발생 시
  if (isError) return <div>오류 발생: {error.message}</div>;
  // 보유 주식이 없는 경우 (API 응답에서 message 필드가 있을 때)
  if (holdings.message) return <div>{holdings.message}</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>나의 보유 주식 ({userId}번 사용자)</h2>
      {isFetching && <p style={{ color: 'blue' }}>데이터를 업데이트 중입니다...</p>}
      {holdings.length === 0 ? (
        <p>현재 보유한 주식이 없습니다.</p>
      ) : (
        <ul>
          {holdings.map((holding) => (
            <li key={holding.id} style={{ marginBottom: '10px' }}>
              <strong>{holding.stock.name} ({holding.stock.symbol})</strong>: {holding.quantity} 주
              (현재가: ${holding.stock.currentPrice})
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => refetch()} style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        새로고침
      </button>
    </div>
  );
}

export default HoldingsList;

*/
/*
마지막으로 개발자를 위한 팁:
React Query의 캐싱 확인 및 장점
자동 캐싱: HoldingsList 컴포넌트가 useHoldings(userId) 훅을 호출하면, React Query는 ['holdings', userId]라는 쿼리 키로 데이터를 캐시합니다.

첫 번째 로드: API 요청 -> 데이터 캐시 -> 화면 표시

두 번째 로드 (짧은 시간 내): API 요청 없이 캐시된 데이터를 즉시 반환 -> 화면 표시 (빠른 UX)

백그라운드에서 staleTime이 지나면, React Query는 데이터를 백그라운드에서 다시 가져와(refetch) 캐시를 업데이트합니다. 이 때 isFetching이 true가 됩니다.

invalidateQueries를 통한 캐시 무효화: BuySellForm에서 매수/매도 트랜잭션이 성공하면 queryClient.invalidateQueries({ queryKey: ['holdings', userId] })를 호출합니다.

이 함수는 ['holdings', userId] 쿼리 키를 가진 캐시를 '무효화(stale)' 상태로 만듭니다.

그러면 HoldingsList 컴포넌트가 자동으로 다시 렌더링되면서 최신 데이터를 서버에서 재요청하게 됩니다. 이 과정에서 isFetching 상태를 통해 사용자에게 "업데이트 중"이라는 피드백을 줄 수 있습니다.

이는 수동으로 상태를 관리하거나 useEffect에서 복잡한 로직을 작성할 필요 없이, 데이터의 최신성을 보장하는 강력한 방법입니다.
*/

//--------------------------------------------------------------

// New block :

// Grok 이 짠 다른 코드. 위 주석과 완전히 다른 내용 시작
// 아래 주석:
/*
// frontend/src/hooks/useHoldings.ts
import { useQuery } from '@tanstack/react-query';
import { API_URL, authHeader } from '../api';

export function useHoldings() {
  return useQuery({
    queryKey: ['holdings'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/trades/holdings`, { headers: { ...authHeader() }});
      if (!res.ok) throw new Error('fetch holdings failed');
      return res.json();
    }
  });
}
tsx
복사
편집
// frontend/src/components/HoldingsTable.tsx
import { useHoldings } from '../hooks/useHoldings';

export default function HoldingsTable() {
  const { data, isLoading, error } = useHoldings();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Fail</div>;
  return (
    <table>
      <thead><tr><th>Symbol</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>
        {data.map((h) => (
          <tr key={h.id}>
            <td>{h.stock.symbol}</td>
            <td>{h.quantity}</td>
            <td>{h.stock.currentPrice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
tsx
복사
편집
// frontend/src/components/TradeForm.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL, authHeader } from '../api';
import { useState } from 'react';

export default function TradeForm() {
  const qc = useQueryClient();
  const [symbol, setSymbol] = useState('AAPL');
  const [price, setPrice] = useState('100.00');
  const [qty, setQty] = useState(1);

  const trade = useMutation({
    mutationFn: async (side: 'buy'|'sell') => {
      const res = await fetch(`${API_URL}/api/trades/${side}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ symbol, price, quantity: qty })
      });
      if (!res.ok) throw new Error('trade failed');
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['holdings'] })
  });

  return (
    <div>
      <input value={symbol} onChange={e=>setSymbol(e.target.value.toUpperCase())}/>
      <input value={price} onChange={e=>setPrice(e.target.value)} />
      <input type="number" value={qty} onChange={e=>setQty(parseInt(e.target.value))}/>
      <button onClick={()=>trade.mutate('buy')} disabled={trade.isPending}>Buy</button>
      <button onClick={()=>trade.mutate('sell')} disabled={trade.isPending}>Sell</button>
    </div>
  );
}
 */


/*
* 자주 터지는 이슈 & 실무 팁

TS2339: prisma.stock_info가 없다

schema.prisma에 model StockInfo가 없거나, prisma generate를 안 했거나, 에디터 캐시 문제.

해결: 모델명/@@map/@map 점검 → npm run prisma:gen → 에디터 재시작.

db push가 drop 요구

기존 DB와 Prisma 마이그레이션 히스토리 불일치 때문.

전략:

기존 DB 보존하려면 prisma db pull(리버스) → 스키마 정리 → generate만.

새 테이블만 추가하되 reset 피하려면, prisma migrate diff로 SQL만 생성해서 수동 적용.

초기에 빈 마이그레이션으로 baseline을 맞추는 것도 방법.

BigInt 123n/Decimal 직렬화

JSON 직렬화 에러 or 프런트에서 값 깨짐.

해결: 응답 직전에 문자열 변환(replacer), 혹은 superjson, 금액 연산은 decimal.js 사용.

트랜잭션에서 동시성

같은 주식/같은 유저가 동시 주문 → 수량/잔고 깨질 수 있음.

해결: 같은 리소스는 한 트랜잭션에서 읽고-검증하고-즉시 업데이트. 필요하면 일련의 업데이트 순서를 강제. (Postgres SERIALIZABLE 수준 고려)

RLS(Supabase)

서버에서 관리한다면 서비스 키 또는 DB 연결로 접근.

FE에서 직접 Supabase 테이블 쓰면 정책을 정확히 구성해야 함. 서버-중심이면 Express API로만 접근 권장.
*
*
*
*
마지막 코칭

지금 단계에선 “완벽한 거래 엔진”보다 정합성(트랜잭션) + UX(상태 갱신) 두 축에 집중하세요.

돈 계산은 무조건 Decimal.

Prisma는 모델명 ↔ 실제 테이블 매핑만 명확히 하면, 클라이언트 코드에서 “없는 속성” 에러는 거의 사라집니다.
* */