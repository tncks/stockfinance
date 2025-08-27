import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {MessageSquare, TrendingUp, TrendingDown, Heart, Share} from "lucide-react";
import {toast} from "sonner";
import {OrderBookTable, OrderBookRow} from './order-book-table';


// 50000 ~ 90000 사이 랜덤 정수 생성 함수
const getRandomVol = () =>
    Math.floor(Math.random() * (90000 - 50000 + 1)) + 50000;

const INITIAL_ORDER_BOOK_DATA = [
    {askVol: getRandomVol(), askPrice: 70900, bidPrice: 70400, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70800, bidPrice: 70300, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70700, bidPrice: 70200, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70600, bidPrice: 70100, bidVol: getRandomVol()},
    {askVol: getRandomVol(), askPrice: 70500, bidPrice: 70000, bidVol: getRandomVol()},
];


export function CommunityHub() {


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side Feed */}
            <div className="lg:col-span-2 space-y-6 bg-gray-700">
                <br/>
                <br/>
            </div>

            {/* Right side Feed */}
            <div>
                <div className="max-w-md mx-auto p-4 bg-black rounded shadow">
                    <OrderBookTable data={INITIAL_ORDER_BOOK_DATA}/>
                </div>
            </div>


        </div>
    );
}
