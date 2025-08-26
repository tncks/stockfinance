import { ScrollArea } from "@/shared/ui/scroll-area";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/shared/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Input } from "@/shared/ui/input";
import { createChart, IChartApi, ISeriesApi, LineData, LineSeries } from "lightweight-charts";

// ============================================================================
// 1. 상수 및 타입 정의 (Constants & Types)
// - 애플리케이션 전역에서 사용될 상수와 타입을 중앙에서 관리합니다.
// ============================================================================

const CONSTANTS = {
    DB_TABLES: {
        LIVE_PRICES: "StockLivePrice",
        DAILY_PRICES: "DailyPrices",
    },
    API_KEYS: {
        STOCK_CODE: "종목코드",
        STOCK_NAME: "종목명",
        HIGH_PRICE: "고가",
        LOW_PRICE: "저가",
        BASE_DATE: "기준일자",
    },
} as const;

type Stock = {
    code: string;
    name: string;
    high: number;
    low: number;
};

type StockApiResponse = Record<typeof CONSTANTS.API_KEYS[keyof typeof CONSTANTS.API_KEYS], any>;
type ChartApiResponse = Record<typeof CONSTANTS.API_KEYS[keyof typeof CONSTANTS.API_KEYS], any>;

// ============================================================================
// 2. 서비스 계층 (Service Layer)
// - 데이터 소스(API, DB)와의 모든 통신을 담당합니다.
// ============================================================================

const stockService = {
    async getStocks(): Promise<Stock[]> {
        const { data, error } = await supabase
            .from(CONSTANTS.DB_TABLES.LIVE_PRICES)
            .select("종목코드,종목명,고가,저가")
            .order("종목명");

        if (error) throw new Error(error.message);
        if (!data) throw new Error("주식 목록 데이터가 없습니다.");

        return data.map(this.transformStock);
    },

    async getChartData(stockName: string): Promise<LineData[]> {
        const { data, error } = await supabase
            .from(CONSTANTS.DB_TABLES.DAILY_PRICES)
            .select("기준일자,고가")
            .eq("종목명", stockName)
            .gte("기준일자", 20250810)
            .lte("기준일자", 20250814)
            .order("기준일자");

        if (error) throw new Error(error.message);
        if (!data) throw new Error("차트 데이터가 없습니다.");

        return data.map(this.transformChartData);
    },

    transformStock(apiStock: StockApiResponse): Stock {
        return {
            code: apiStock[CONSTANTS.API_KEYS.STOCK_CODE],
            name: apiStock[CONSTANTS.API_KEYS.STOCK_NAME],
            high: apiStock[CONSTANTS.API_KEYS.HIGH_PRICE],
            low: apiStock[CONSTANTS.API_KEYS.LOW_PRICE],
        };
    },

    transformChartData(apiChartItem: ChartApiResponse): LineData {
        const dateStr = String(apiChartItem[CONSTANTS.API_KEYS.BASE_DATE]);
        return {
            time: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}` as const,
            value: apiChartItem[CONSTANTS.API_KEYS.HIGH_PRICE],
        };
    },
};

// ============================================================================
// 3. 커스텀 훅 (Custom Hooks)
// - UI 상태 관리와 서비스 계층 호출을 담당합니다.
// ============================================================================

type AsyncState<T> = {
    status: "idle" | "loading" | "success" | "error";
    data: T | null;
    error: string | null;
};

function useStockList() {
    const [state, setState] = useState<AsyncState<Stock[]>>({
        status: "idle",
        data: null,
        error: null,
    });

    useEffect(() => {
        setState((s) => ({ ...s, status: "loading", data: null }));
        stockService.getStocks()
            .then((data) => {
                setState({ status: "success", data, error: null });
            })
            .catch((error) => {
                setState({ status: "error", data: null, error: error.message });
            });
    }, []);

    return state;
}

function useChartData(selectedStockName: string | null) {
    const [state, setState] = useState<AsyncState<LineData[]>>({
        status: "idle",
        data: null,
        error: null,
    });

    useEffect(() => {
        if (!selectedStockName) {
            setState({ status: "idle", data: null, error: null });
            return;
        }

        setState((s) => ({ ...s, status: "loading", data: null }));
        stockService.getChartData(selectedStockName)
            .then((data) => {
                setState({ status: "success", data, error: null });
            })
            .catch((error) => {
                setState({ status: "error", data: null, error: error.message });
            });
    }, [selectedStockName]);

    return state;
}

// ============================================================================
// 4. 프레젠테이션 컴포넌트 (Presentational Components)
// - 순수하게 UI를 렌더링하는 역할만 담당합니다.
// ============================================================================

type StockChartProps = {
    chartData: LineData[];
    stockName: string;
    isLoading?: boolean;
};

const StockChart = React.memo(({ chartData, stockName, isLoading }: StockChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        if (!chartRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
                layout: { background: { color: "#131722" }, textColor: "#d1d4dc" },
                grid: { vertLines: { color: "#334158" }, horzLines: { color: "#334158" } },
            });

            

            seriesRef.current = chart.addSeries(LineSeries, {
                lineColor: '#009688', topColor: 'rgba(0, 150, 136, 0.4)', bottomColor: 'rgba(0, 150, 136, 0.0)',
                priceFormat: { type: 'price', precision: 0, minMove: 1 }
            });
            seriesRef.current.applyOptions({
                priceFormat: { type: 'price', precision: 0, minMove: 1 }
            });
            chartRef.current = chart;
        }

        seriesRef.current.setData(chartData);
        chartRef.current.timeScale().fitContent();

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.resize(
                    chartContainerRef.current.clientWidth,
                    chartContainerRef.current.clientHeight
                );
            }
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [chartData]);

    useEffect(() => {
        return () => {
            chartRef.current?.remove();
        };
    }, []);

    return (
        <Card className="lg:col-span-2 flex flex-col h-full relative">
            <CardHeader>
                <CardTitle>{stockName} 일별 주가</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 -mt-4">
                {(isLoading || chartData.length === 0) && (
                    <div className="absolute inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center z-10">
                        <p className="text-white">
                            {isLoading ? "차트 데이터를 불러오는 중..." : "표시할 데이터가 없습니다."}
                        </p>
                    </div>
                )}
                <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
            </CardContent>
        </Card>
    );
});
StockChart.displayName = "StockChart";

type StockListProps = {
    stocks: Stock[];
    selectedStock: string | null;
    onStockSelect: (stockName: string) => void;
};

const StockList = React.memo(({ stocks, selectedStock, onStockSelect }: StockListProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStocks = useMemo(() => {
        if (!searchTerm) return stocks;
        return stocks.filter((stock) =>
            stock.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stocks, searchTerm]);

    return (
        <Card className="lg:col-span-1 flex flex-col h-full">
            <CardHeader>
                <Input
                    placeholder="종목명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[580px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>전체 종목</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStocks.map((stock) => (
                                <TableRow
                                    key={stock.code}
                                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                                        selectedStock === stock.name ? "bg-muted" : ""
                                    }`}
                                    onClick={() => onStockSelect(stock.name)}
                                >
                                    <TableCell>
                                        <div className="font-medium">{stock.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {stock.code} | 고가: {stock.high.toLocaleString()}원, 저가:{" "}
                                            {stock.low.toLocaleString()}원
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
});
StockList.displayName = "StockList";

// ============================================================================
// 5. 컨테이너 컴포넌트 (Container Component)
// - 여러 컴포넌트와 훅을 조합하여 페이지를 구성합니다.
// ============================================================================

export function StockDashboard() {
    const [selectedStockName, setSelectedStockName] = useState<string | null>(null);

    const stockListState = useStockList();
    const chartDataState = useChartData(selectedStockName);

    useEffect(() => {
        if (stockListState.data && stockListState.data.length > 0 && !selectedStockName) {
            setSelectedStockName(stockListState.data[0].name);
        }
    }, [stockListState.data, selectedStockName]);

    const handleStockSelect = (stockName: string) => {
        setSelectedStockName(stockName);
    };

    if (stockListState.status === "loading" || stockListState.status === "idle") {
        return <div className="p-4">주식 목록을 불러오는 중...</div>;
    }

    if (stockListState.status === "error") {
        return <div className="p-4 text-red-500">오류 발생: {stockListState.error}</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            <StockChart
                chartData={chartDataState.data || []}
                stockName={selectedStockName || "종목을 선택하세요"}
                isLoading={chartDataState.status === "loading"}
            />
            <StockList
                stocks={stockListState.data || []}
                selectedStock={selectedStockName}
                onStockSelect={handleStockSelect}
            />
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

