import {Button} from "@/shared/ui/button";
import {Input} from "@/shared/ui/input";
import {Badge} from "@/shared/ui/badge";
import {ScrollArea} from "@/shared/ui/scroll-area";
import {useEffect, useState, useRef} from 'react';
import {supabase} from '@/shared/lib/supabaseClient';
import {Card, CardContent, CardHeader, CardTitle} from '@/shared/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/shared/ui/table';
import {createChart, LineSeries} from 'lightweight-charts';  // , CandlestickSeries
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";




// 잠깐 순서 정리: useEffect() 호출 -> 내부 로직 실행 -> fetchStockData[LivePrice] & fetchChartData[DailyPrices] -> setStocks() 통해 stocks 에 값 담김 -> setSCharts() 통해 scharts 에 값 담김 -> myChartFun() 언제 실행? -> setTimeout 언제 실행? 순서 어케?

export function BIAssistant() {

    let lineSeries;
    const [inputMessage, setInputMessage] = useState("");
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<any>(null); // 차트 인스턴스 참조용
    const lineSeriesRef = useRef<any>(null); // lineSeries 인스턴스 참조용

    type Stock = {
        stock_code: string;
        stock_name: string;
        stock_highest: number;
        stock_lowest: number;
    };

    type SChart = {
        base_date: number;
        stock_code: string;
        stock_name: string;
        stock_highest: number;
    };


    const [stocks, setStocks] = useState<Stock[]>([]);
    const [scharts, setSCharts] = useState<SChart[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);


    useEffect(() => {

        if (chartContainerRef.current && !chartInstanceRef.current) {
            const chartOptions = {
                height: 600,
                layout: {
                    background: {
                        color: '#000000', // 배경을 검정색으로 설정
                    },
                    textColor: '#FFFFFF'
                },
                grid: {
                    vertLines: {color: '#444444'},    // 수직 그리드 회색
                    horzLines: {color: '#444444'},    // 수평 그리드 회색
                },
            };
            // const ele = document.getElementById('my-container');
            const chart = createChart(chartContainerRef.current!  /*ele*/, chartOptions);
            lineSeries = chart.addSeries(LineSeries, {
                autoscaleInfoProvider: undefined,
                baseLineColor: "#ffff00",
                baseLineStyle: undefined,
                baseLineVisible: true,
                baseLineWidth: undefined,
                color: "#00ff00",
                crosshairMarkerBackgroundColor: "#000000",
                crosshairMarkerBorderColor: "#ff0000",
                crosshairMarkerBorderWidth: 0,
                crosshairMarkerRadius: 0,
                crosshairMarkerVisible: true,
                lastPriceAnimation: undefined,
                lastValueVisible: true,
                lineStyle: undefined,
                lineType: undefined,
                lineVisible: true,
                lineWidth: 2,
                pointMarkersRadius: 0,
                pointMarkersVisible: false,
                priceFormat: {type: 'price', precision: 0, minMove: 1},
                priceLineColor: "#ff0000",
                priceLineSource: undefined,
                priceLineStyle: undefined,
                priceLineVisible: true,
                priceLineWidth: 1,
                priceScaleId: "",
                title: "",
                visible: true,
            });

            /*
            // const candlestickSeries = chart.addSeries(CandlestickSeries, {
            //     upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            //     wickUpColor: '#26a69a', wickDownColor: '#ef5350',
            // });
            // candlestickSeries.setData([
            //     {time: '2024-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72},
            //     {time: '2024-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09},
            //     {time: '2024-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29},
            //     {time: '2024-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50},
            //     {time: '2024-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04},
            //     {time: '2024-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40},
            //     {time: '2024-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25},
            //     {time: '2024-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43},
            //     {time: '2024-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10},
            //     {time: '2024-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26},
            // ]);
            */

            chart.timeScale().fitContent();

            chartInstanceRef.current = chart;
            lineSeriesRef.current = lineSeries;

            return () => {
                if (chartInstanceRef.current) {
                    chartInstanceRef.current.remove();
                    chartInstanceRef.current = null;
                }
            };
        }
    }, []);

    // // 차트 초기화 함수
    // const myChartFun = () => {
    //
    //     // logo 최소화 숨기기 실행
    //     const logo = document.getElementById('tv-attr-logo');
    //     if (logo) {
    //         logo.style.width = '1px';   // width를 1px로
    //         logo.style.overflow = 'hidden';
    //     }
    //
    // }
    //
    useEffect(() => {

        const fetchStockData = async () => {
            try {
                //setLoading(true);
                setError(null);

                // Fetch all columns and all rows from the table1
                const selecterSTR = "종목코드,종목명,고가,저가";
                const cols = selecterSTR.split(',');
                const {data, error: supabaseError} = await supabase
                    .from('StockLivePrice')
                    .select(selecterSTR)
                    .order('종목명', {ascending: true});


                // console.log(data);
                if (data) {
                    const mapped = data.map((row) => ({
                        stock_code: row[cols[0]],
                        stock_name: row[cols[1]],
                        stock_highest: row[cols[2]],
                        stock_lowest: row[cols[3]],
                    })) as Stock[];
                    //console.log('map:');
                    //console.log(mapped);
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

        const fetchChartData = async () => {
            try {
                setError(null);

                // Fetch all columns and all rows from the table2
                const graphSTR = "기준일자,종목코드,종목명,고가";
                const Graph_cols_graph = graphSTR.split(',');
                const {data, error: supabaseError} = await supabase
                    .from('DailyPrices')
                    .select(graphSTR)
                    .gte('기준일자', 20250810)
                    .lte('기준일자', 20250814)
                    .eq('종목명', '기아')
                    .order('기준일자', {ascending: true});

                if (data) {
                    const mapped = data.map((row) => ({
                        base_date: row[Graph_cols_graph[0]],
                        stock_code: row[Graph_cols_graph[1]],
                        stock_name: row[Graph_cols_graph[2]],
                        stock_highest: row[Graph_cols_graph[3]],
                    })) as SChart[];
                    //console.log('map:');
                    //console.log(mapped);
                    /*setSCharts(mapped);*/

                    // added:
                    const chartKIAsTestData = mapped.map(d => ({
                        time: `${String(d.base_date).substring(0, 4)}-${String(d.base_date).substring(4, 6)}-${String(d.base_date).substring(6, 8)}`,
                        value: d.stock_highest
                    }));
                    console.log('KIA-KIA-consoleLOG:');
                    console.log(chartKIAsTestData);                    // 예상 콘솔 출력 결과 : 첫번째값: '2024-12-22', 두번째값: 32

                    //
                    if (lineSeriesRef.current) {
                        lineSeriesRef.current.setData(chartKIAsTestData);
                    }

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
                    setError("아직 데이터가 없나 봅니다. 확인해보세요.");
                }
            } finally {
                // Whether it succeeds or fails, stop loading
                setLoading(false);

            }

        }

        fetchStockData();
        fetchChartData();
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
                        <div className="p-1 bg-accent/10 rounded-full">
                            &nbsp;
                        </div>
                        &nbsp;
                        <Badge variant="secondary" className="ml-auto">?</Badge>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">


                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>종목전체</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stocks != null ? stocks.map((stock) => (
                                        <TableRow key={stock.stock_code}>
                                            <TableCell>
                                                <div className="font-medium">{stock.stock_name}</div>
                                                <div
                                                    className="text-sm text-muted-foreground">{stock.stock_code}&nbsp;&nbsp;{stock.stock_highest}{'원[고가], '}{stock.stock_lowest}{'원[저가]'}</div>
                                                {/*<div className="text-sm font-extralight"></div>*/}
                                                {/*<div className="text-sm font-extralight"></div>*/}
                                            </TableCell>

                                        </TableRow>
                                    )) : 0 + 0}
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
                                className="flex-1"
                            />

                        </div>
                    </div>
                </CardContent>
            </Card>

            {/*<TabsContent value="overview" className="space-y-6">*/}

                {/* My Stock Chart */}
                <div className="space-y-6">
                    {/* Debug:Testing chart... */}
                    <div className="space-y-4">
                        <br/>
                        <div ref={chartContainerRef} className="w-full h-[400px]"></div>
                        <br/>
                    </div>


                </div>


            {/*</TabsContent>*/}


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

