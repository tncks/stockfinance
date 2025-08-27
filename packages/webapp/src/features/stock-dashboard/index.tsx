import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { createChart, IChartApi, ISeriesApi, LineData, LineSeries } from "lightweight-charts";
import { useStockList } from "@/features/stock/hooks";
import { StockList } from "@/features/stock/components/StockList";
import { Stock } from "@/features/stock/types";
import { supabase } from "@/shared/lib/supabaseClient";

// ============================================================================
// 1. 상수 및 타입 정의 (Constants & Types)
// - 애플리케이션 전역에서 사용될 상수와 타입을 중앙에서 관리합니다.
// ============================================================================

const CONSTANTS = {
    DB_TABLES: {
        DAILY_PRICES: "DailyPrices",
    },
    API_KEYS: {
        HIGH_PRICE: "고가",
        BASE_DATE: "기준일자",
    },
} as const;

type ChartApiResponse = Record<typeof CONSTANTS.API_KEYS[keyof typeof CONSTANTS.API_KEYS], any>;

// ============================================================================
// 2. 서비스 계층 (Service Layer)
// - 데이터 소스(API, DB)와의 모든 통신을 담당합니다.
// ============================================================================

const stockService = {
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

            // @ts-ignore
            seriesRef.current = chart.addSeries(LineSeries, {
                // @ts-ignore
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

// ============================================================================
// 5. 컨테이너 컴포넌트 (Container Component)
// - 여러 컴포넌트와 훅을 조합하여 페이지를 구성합니다.
// ============================================================================

export function StockDashboard() {
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    const stockListState = useStockList();
    const chartDataState = useChartData(selectedStock?.name || null);

    useEffect(() => {
        if (stockListState.data && stockListState.data.length > 0 && !selectedStock) {
            setSelectedStock(stockListState.data[0]);
        }
    }, [stockListState.data, selectedStock]);

    const handleStockSelect = (stock: Stock) => {
        setSelectedStock(stock);
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
                stockName={selectedStock?.name || "종목을 선택하세요"}
                isLoading={chartDataState.status === "loading"}
            />
            <StockList
                stocks={stockListState.data || []}
                selectedStock={selectedStock}
                onStockSelect={handleStockSelect}
            />
        </div>
    );
}