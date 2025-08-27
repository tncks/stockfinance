import React, {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {OrderBookTable} from './order-book-table';
import {useStockList} from "@/features/stock/hooks";
import {StockList} from "@/features/stock/components/StockList";
import {Stock} from "@/features/stock/types";

// 50000 ~ 90000 사이 랜덤 정수 생성 함수
const getRandomVol = () =>
    Math.floor(Math.random() * (90000 - 50000 + 1)) + 50000;

export function OrderBookBox() {

    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [orderBookData, setOrderBookData] = useState<any[]>([]);
    const stockListState = useStockList();


    const getPriceStep = (lowPrice: number, highPrice: number) => {

        const priceRange = highPrice - lowPrice;
        if (priceRange <= 100) {
            return Math.floor(priceRange/10);
        } else if (priceRange <= 500) {
            return 10;
        } else if (priceRange <= 1000) {
            return 50;
        } else if (priceRange <= 2000) {
            return 100;
        } else if (priceRange <= 3000) {
            return 200;
        } else if (priceRange <= 4000) {
            return 300;
        } else if (priceRange <= 5000) {
            return 400;
        } else if (priceRange <= 6000) {
            return 500;
        } else if (priceRange <= 7000) {
            return 600;
        } else if (priceRange <= 8000) {
            return 700;
        } else if (priceRange <= 10000) {
            return 800;
        } else {
            return Math.floor(priceRange/10);
        }
    };


    // Function to generate mock order book data based on a current price
    const generateOrderBookData = (low: number, high: number) => {

        const combinedData: any[] = [];
        const priceStep = getPriceStep(low, high);   //low, high 순

        // Generate ask prices (from high to low)
        for (let i = 0; i < 5; i++) {
            const price = high - i * priceStep;
            combinedData.push({price, vol: getRandomVol(), type: 'ask'});
        }

        // Generate bid prices (from low to high)
        for (let i = 0; i < 5; i++) {
            const price = low + i * priceStep;
            combinedData.push({price, vol: getRandomVol(), type: 'bid'});
        }


        combinedData.sort((a, b) => b.price - a.price); // SORT!!
        return combinedData;
    };

    useEffect(() => {
        if (stockListState.status === "success" && stockListState.data && !selectedStock) {
            const firstStock = stockListState.data[0];
            setSelectedStock(firstStock);
        }
    }, [stockListState.status, stockListState.data, selectedStock]);

    useEffect(() => {
        if(selectedStock) {
            const { low, high } = selectedStock;
            const newOrderBookData = generateOrderBookData(low, high);
            setOrderBookData(newOrderBookData);
        }

    }, [selectedStock]);

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side Feed */}

            <Card className="min-w-96 max-w-md mx-auto shadow-lg lg:col-span-2 flex flex-col h-full relative">
                <CardHeader>
                    <CardTitle>호가</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderBookTable data={orderBookData}/>
                </CardContent>
            </Card>

            {/* {Right side Feed} */}
            <div>
                <StockList
                    stocks={stockListState.data || []}
                    selectedStock={selectedStock}
                    onStockSelect={handleStockSelect}
                />
            </div>


        </div>
    );
}