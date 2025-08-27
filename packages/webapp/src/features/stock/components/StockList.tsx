import React, {useMemo, useState} from "react";
import {Card, CardContent, CardHeader} from "@/shared/ui/card";
import {Input} from "@/shared/ui/input";
import {ScrollArea} from "@/shared/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table";
import {Stock} from "../types";

export type StockListProps = {
    stocks: Stock[];
    selectedStock: Stock | null;
    onStockSelect: (stock: Stock) => void;
};

export const StockList = React.memo(({stocks, selectedStock, onStockSelect}: StockListProps) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStocks = useMemo(() => {
        if (!searchTerm) return stocks;
        return stocks.filter((stock) =>
            stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.code.includes(searchTerm)
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
                                        selectedStock?.code === stock.code ? "bg-muted" : ""
                                    }`}
                                    onClick={() => onStockSelect(stock)}
                                >
                                    <TableCell>
                                        {/* * 사용자의 피드백에 따라 2x2 그리드 레이아웃으로 변경했습니다.
                                        * 좌측에는 종목명(상단)과 종목코드(하단, 작게)를,
                                        * 우측에는 고가(상단)와 저가(하단)를 배치합니다.
                                        * flexbox를 사용하여 좌우 정렬을 완벽하게 구현합니다.
                                        */}
                                        <div className="flex justify-between items-center">
                                            {/* 좌측: 종목명 (상) & 종목코드 (하, 작게) */}
                                            <div className="flex flex-col">
                                                <span className="font-medium text-base">{stock.name}</span>
                                                <span className="text-sm text-muted-foreground">{stock.code}</span>
                                            </div>
                                            {/* 우측: 고가 (상) & 저가 (하) */}
                                            <div className="flex flex-col items-end">
                                                <span className="text-right text-red-500 font-semibold tabular-nums">
                                                    {stock.high.toLocaleString()}원
                                                </span>
                                                <span className="text-right text-blue-500 font-semibold tabular-nums">
                                                    {stock.low.toLocaleString()}원
                                                </span>
                                            </div>
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
