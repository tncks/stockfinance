import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Stock } from "../types";

export type StockListProps = {
    stocks: Stock[];
    selectedStock: Stock | null;
    onStockSelect: (stock: Stock) => void;
};

export const StockList = React.memo(({ stocks, selectedStock, onStockSelect }: StockListProps) => {
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
                                            <div className="flex gap-3">
                                                <span className="text-red-500 w-32 text-right font-mono">고가: {stock.high.toLocaleString()} 원</span>
                                                <span className="text-blue-500 w-32 text-right font-mono">저가: {stock.low.toLocaleString()} 원</span>
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
