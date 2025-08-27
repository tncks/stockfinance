import {useState, useEffect } from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {MessageSquare, TrendingUp, TrendingDown, Heart, Share} from "lucide-react";
import {toast} from "sonner";
import {OrderBookTable, OrderBookRow} from './order-book-table';

const INITIAL_ORDER_BOOK_DATA = {
    currentPrice: 70500, // 기준 가격
    priceStep: 100,      // 호가 단위
};

// 50000 ~ 90000 사이 랜덤 정수 생성 함수
const getRandomVol = () =>
    Math.floor(Math.random() * (90000 - 50000 + 1)) + 50000;
/*
// 50000 ~ 90000 사이 랜덤 정수 생성 함수
const getRandomVol = () =>
    Math.floor(Math.random() * (90000 - 50000 + 1)) + 50000;

const INITIAL_ORDER_BOOK_DATA = [
    {askVol: getRandomVol(), askPrice: 70900, bidPrice: 70400, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70800, bidPrice: 70300, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70700, bidPrice: 70200, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70600, bidPrice: 70100, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70500, bidPrice: 70000, bidVol: getRandomVol()},
];*/


export function CommunityHub() {
    const [data, setData] = useState([]);


    // Function to generate mock order book data based on a current price
    const generateMockData = (currentPrice) => {
        const mockData = [];
        const numLevels = 5;

        // Generate ask and bid prices
        const askPrices = Array.from({ length: numLevels }, (_, i) => currentPrice + (i + 1) * INITIAL_ORDER_BOOK_DATA.priceStep).reverse();
        const bidPrices = Array.from({ length: numLevels }, (_, i) => currentPrice - (i + 1) * INITIAL_ORDER_BOOK_DATA.priceStep);

        // Combine ask and bid data into a single array
        const combinedData = [];
        askPrices.forEach(price => combinedData.push({ price, vol: getRandomVol(), type: 'ask' }));
        bidPrices.forEach(price => combinedData.push({ price, vol: getRandomVol(), type: 'bid' }));

        return combinedData;
    };

    useEffect(() => {
        // Initial data generation
        const initialData = generateMockData(INITIAL_ORDER_BOOK_DATA.currentPrice);
        setData(initialData);
    }, []);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side Feed */}
            <div className="lg:col-span-2 space-y-4 ">
                <Card className="max-w-md mx-auto shadow-lg">
                    <CardHeader>
                        <CardTitle>호가창</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderBookTable data={data} />
                    </CardContent>
                </Card>
            </div>



        </div>
    );
}
