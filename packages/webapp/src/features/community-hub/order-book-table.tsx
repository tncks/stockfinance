import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {MessageSquare, TrendingUp, TrendingDown, Heart, Share} from "lucide-react";

import { supabase } from "@/shared/lib/supabaseClient";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Input } from "@/shared/ui/input";
import {toast} from "sonner";
// export function OrderBookTable({ data }) {
//     return (
//         <table className="w-full text-right border border-gray-300 border-collapse">
//             <thead>
//             <tr>
//                 <th colSpan={2} className="text-red-600">매도잔량</th>
//                 <th className="font-bold text-red-600">호가</th>
//                 <th colSpan={2} className="text-blue-600">매수잔량</th>
//             </tr>
//             </thead>
//             <tbody>
//             {data.map(({ askVol, askPrice, bidVol, bidPrice }, idx) => (
//                 <tr key={idx}>
//                     <td className="px-2 py-1 text-sm">{askVol.toLocaleString()}</td>
//                     <td className="px-2 py-1 font-semibold text-red-600">{askPrice.toLocaleString()}</td>
//                     <td className="px-2 py-1 font-semibold text-blue-600">{bidPrice.toLocaleString()}</td>
//                     <td className="px-2 py-1 text-sm">{bidVol.toLocaleString()}</td>
//                 </tr>
//             ))}
//             </tbody>
//         </table>
//     );
// }
// --- OrderBookTable 컴포넌트: shadcn/ui 기반으로 재구성 ---
export function OrderBookTable({ data }) {
    // Determine max volume for dynamic bar width
    const allVolumes = data.flatMap(item => [item.askVol, item.bidVol]);
    const maxVolume = Math.max(...allVolumes);

    return (
        <Table className="text-right">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[35%] text-center text-red-600 dark:text-red-400">매도잔량</TableHead>
                    <TableHead className="w-[30%] text-center font-bold">가격</TableHead>
                    <TableHead className="w-[35%] text-center text-blue-600 dark:text-blue-400">매수잔량</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(({ askVol, askPrice, bidVol, bidPrice }, idx) => (
                    <OrderBookRow
                        key={idx}
                        askVol={askVol}
                        askPrice={askPrice}
                        bidVol={bidVol}
                        bidPrice={bidPrice}
                        maxVolume={maxVolume}
                    />
                ))}
            </TableBody>
        </Table>
    );
}

// --- OrderBookRow 컴포넌트: 호가 가격 및 잔량 시각화 ---
export function OrderBookRow({ askVol, askPrice, bidVol, bidPrice, maxVolume }) {
    // Calculate dynamic bar widths based on max volume
    const askWidth = (askVol / maxVolume) * 100;
    const bidWidth = (bidVol / maxVolume) * 100;

    return (
        <TableRow className="relative">
            {/* 매도잔량 (Ask Volume) */}
            <TableCell className="p-0 text-right">
                <div
                    className="relative z-10 p-2 overflow-hidden"
                    style={{ background: `linear-gradient(to right, transparent ${100 - askWidth}%, rgba(252,165,165,0.4) ${100 - askWidth}%)` }}
                >
                    <span className="relative z-20 text-sm text-foreground">{askVol.toLocaleString()}</span>
                </div>
            </TableCell>

            {/* 호가 (Price) */}
            <TableCell className="p-0 text-center font-bold text-lg border-x-2 border-gray-200 dark:border-zinc-700">
                <span className="text-red-600 dark:text-red-400">{askPrice.toLocaleString()}</span>
                <br/>
                <span className="text-blue-600 dark:text-blue-400">{bidPrice.toLocaleString()}</span>
            </TableCell>

            {/* 매수잔량 (Bid Volume) */}
            <TableCell className="p-0 text-left">
                <div
                    className="relative z-10 p-2 overflow-hidden"
                    style={{ background: `linear-gradient(to left, transparent ${100 - bidWidth}%, rgba(147,197,253,0.4) ${100 - bidWidth}%)` }}
                >
                    <span className="relative z-20 text-sm text-foreground">{bidVol.toLocaleString()}</span>
                </div>
            </TableCell>
        </TableRow>
    );
}