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
                                        <div className="font-medium">{stock.name}</div>
                                        {/*
                                        * 고가/저가 정보를 두 줄로 분리하여 표현하는 새로운 UI입니다.
                                        * flex-col과 flex-row를 조합하여 `고가: {가격}`과 `저가: {가격}`을
                                        * 각각 다른 줄에 배치했습니다.
                                        * 이 방식은 가격의 자릿수에 상관없이 레이블과 가격이 항상 같은 줄에서 정렬되고,
                                        * 종목명 아래에 명확하게 구분되어 보입니다.
                                        */}
                                        <div className="flex flex-col text-sm text-muted-foreground mt-1">
                                            {/* 고가 섹션 */}
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-red-500">고가</span>
                                                <span className="text-right text-red-500 font-semibold tabular-nums">
                                                    {stock.high.toLocaleString()}원
                                                </span>
                                            </div>
                                            {/* 저가 섹션 */}
                                            <div className="flex justify-between items-center w-full mt-1">
                                                <span className="text-blue-500">저가</span>
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
