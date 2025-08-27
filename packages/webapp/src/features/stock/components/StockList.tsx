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
                                        * 아래 div는 고가와 저가 정보를 표시하는 영역입니다.
                                        * C언어의 printf("%10d", value)처럼 고정된 너비와 정렬을 위해
                                        * Tailwind CSS 클래스를 추가했습니다.
                                        */}
                                        <div className="flex gap-3 text-sm text-muted-foreground">
                                            {/*
                                            * "tabular-nums": 모든 숫자의 너비를 동일하게 만듭니다.
                                            * "min-w-[120px]": 최소 너비를 지정하여, 숫자가 적어도 공간을 확보합니다.
                                            * "text-right": 텍스트를 오른쪽으로 정렬하여, 숫자가 항상 끝에 맞춰지게 합니다.
                                            * "inline-block": min-w 속성이 정상적으로 작동하도록 block 속성을 추가합니다.
                                            */}
                                            <span className="text-red-500 tabular-nums min-w-[120px] text-right inline-block">
                                                고가: {stock.high.toLocaleString()}원
                                            </span>
                                            <span className="text-blue-500 tabular-nums min-w-[120px] text-right inline-block">
                                                저가: {stock.low.toLocaleString()}원
                                            </span>
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
