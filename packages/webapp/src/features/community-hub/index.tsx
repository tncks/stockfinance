import React, {useState, useEffect, useMemo} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
// import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
// import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
// import {MessageSquare, TrendingUp, TrendingDown, Heart, Share} from "lucide-react";
import {toast} from "sonner";
import {OrderBookTable, OrderBookRow} from './order-book-table';
import {Input} from "@/shared/ui/input.tsx";
import {ScrollArea} from "@/shared/ui/scroll-area.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table.tsx";
import {supabase} from "@/shared/lib/supabaseClient.ts";


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

type StockListProps = {
    stocks: Stock[];
    selectedStock: string | null;
    onStockSelect: (stockName: string) => void;
};

type StockApiResponse = Record<typeof CONSTANTS.API_KEYS[keyof typeof CONSTANTS.API_KEYS], any>;



///////////////////////////////////////////////////////////////////////////////////////////


const INITIAL_ORDER_BOOK_DATA = {
    currentPrice: 70500, // 기준 가격
    priceStep: 100,      // 호가 단위
};

// 50000 ~ 90000 사이 랜덤 정수 생성 함수
const getRandomVol = () =>
    Math.floor(Math.random() * (90000 - 50000 + 1)) + 50000;











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

    transformStock(apiStock: StockApiResponse): Stock {
        return {
            code: apiStock[CONSTANTS.API_KEYS.STOCK_CODE],
            name: apiStock[CONSTANTS.API_KEYS.STOCK_NAME],
            high: apiStock[CONSTANTS.API_KEYS.HIGH_PRICE],
            low: apiStock[CONSTANTS.API_KEYS.LOW_PRICE],
        };
    },

};

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


export function CommunityHub() {
    const [data, setData] = useState([]);
    const [selectedStockName, setSelectedStockName] = useState<string | null>(null);
    const stockListState = useStockList();


    // Function to generate mock order book data based on a current price
    const generateOrderBookData = (currentPrice) => {
        const numLevels = 5;

        // Generate ask and bid prices
        const askPrices = Array.from({length: numLevels}, (_, i) => currentPrice + (i + 1) * INITIAL_ORDER_BOOK_DATA.priceStep).reverse();
        const bidPrices = Array.from({length: numLevels}, (_, i) => currentPrice - (i + 1) * INITIAL_ORDER_BOOK_DATA.priceStep);

        // Combine ask and bid data into a single array
        const combinedData = [];
        askPrices.forEach(price => combinedData.push({price, vol: getRandomVol(), type: 'ask'}));
        bidPrices.forEach(price => combinedData.push({price, vol: getRandomVol(), type: 'bid'}));

        return combinedData;
    };

    useEffect(() => {
        // Initial data generation
        const initialData = generateOrderBookData(INITIAL_ORDER_BOOK_DATA.currentPrice);
        setData(initialData);
    }, []);












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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side Feed */}
            <div>
                <Card className="max-w-md mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle>호가</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderBookTable data={data}/>
                    </CardContent>
                </Card>
            </div>
            {/* {Right side Feed} */}
            <div>
                <StockList
                    stocks={stockListState.data || []}
                    selectedStock={selectedStockName}
                    onStockSelect={handleStockSelect}
                />
            </div>


        </div>
    );
}
