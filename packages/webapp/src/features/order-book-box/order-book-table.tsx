import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table";
import {Input} from "@/shared/ui/input";
import {toast} from "sonner";

// --- OrderBookTable 컴포넌트 ---
export function OrderBookTable({data}) {

    const allVolumes = data.flatMap(item => [item.vol]);
    const maxVolume = Math.max(...allVolumes);

    return (
        <Table className="text-right">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[35%] text-center text-white dark:text-white">매도잔량</TableHead>
                    <TableHead className="w-[30%] text-center text-white font-bold">호가</TableHead>
                    <TableHead className="w-[35%] text-center text-white dark:text-white">매수잔량</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(({price, vol, type}, idx) => (
                    <OrderBookRow
                        key={idx}
                        price={price}
                        vol={vol}
                        type={type}
                        maxVolume={maxVolume}
                    />
                ))}
            </TableBody>
        </Table>
    );
}

// --- OrderBookRow 컴포넌트 ---
export function OrderBookRow({price, vol, type, maxVolume}) {
    // Calculate dynamic bar widths based on max volume
    const width = (vol / maxVolume) * 100;
    const isAsk = type === 'ask';

    return (
        <TableRow className="relative">
            {/* 매도잔량 (Ask Volume) */}
            <TableCell className="p-0 text-right">
                {isAsk && (
                    <div
                        className="relative z-10 p-2 overflow-hidden"
                        style={{background: `linear-gradient(to right, transparent ${100 - width}%, rgba(252,165,165,0.4) ${100 - width}%)`}}
                    >
                        <span className="relative z-20 text-sm text-foreground">{vol.toLocaleString()}</span>
                    </div>
                )}
            </TableCell>

            {/* 호가 (Price) */}
            <TableCell
                className={`p-0 text-center font-bold text-lg border-x-2 border-gray-200 dark:border-zinc-700 ${isAsk ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {price.toLocaleString()}
            </TableCell>

            {/* 매수잔량 (Bid Volume) */}
            <TableCell className="p-0 text-left">
                {!isAsk && (
                    <div
                        className="relative z-10 p-2 overflow-hidden"
                        style={{background: `linear-gradient(to left, transparent ${100 - width}%, rgba(147,197,253,0.4) ${100 - width}%)`}}
                    >
                        <span className="relative z-20 text-sm text-foreground">{vol.toLocaleString()}</span>
                    </div>
                )}
            </TableCell>
        </TableRow>
    );
}