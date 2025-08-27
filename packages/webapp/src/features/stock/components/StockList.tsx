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
                                        <div className="text-xs text-muted-foreground flex justify-between mt-1">
                                            <span>{stock.code}</span>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* 고가 */}
                                                <div className="flex items-center justify-end space-x-1">
                                                    <span className="text-red-600 text-[11px] font-medium bg-red-50 px-1.5 py-0.5 rounded">
                                                      고가
                                                    </span>
                                                    <span className="font-mono tabular-nums text-red-600 text-sm text-right">
                                                      {stock.high.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">원</span>
                                                </div>
                                                {/* 저가 */}
                                                <div className="flex items-center justify-end space-x-1">
                                                    <span className="text-blue-600 text-[11px] font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                                                      저가
                                                    </span>
                                                    <span className="font-mono tabular-nums text-blue-600 text-sm text-right">
                                                      {stock.low.toLocaleString()}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">원</span>
                                                </div>
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
