import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Input} from "@/shared/ui/input";
import {Label} from "@/shared/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/shared/ui/select";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {Search, TrendingUp, TrendingDown} from "lucide-react";
import {toast} from "sonner";
import {ZodError} from "zod";
import {tradeOrderSchema} from "@/shared/lib/validations";
import "../../assets/styles/master.css";
import "../../styles/master.css";

const stockList = [
    {symbol: 'AAPL', name: '애플', price: 163, change: 2, changePercent: 1.52},
    {symbol: 'GOOGL', name: '알파벳', price: 2650, change: -15, changePercent: -0.57},
    {symbol: 'TSLA', name: '테슬라', price: 750, change: 8, changePercent: 1.20},
    {symbol: 'MSFT', name: '마이크로소프트', price: 415, change: 5, changePercent: 1.27},
    {symbol: 'AMZN', name: '아마존', price: 3420, change: -25, changePercent: -0.75},
];

export function TradingInterface() {
    const [selectedStock, setSelectedStock] = useState('');
    const [orderType, setOrderType] = useState('market');
    const [action, setAction] = useState('buy');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStocks = stockList.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleTrade = () => {
        try {
            const orderData = {
                symbol: selectedStock,
                quantity,
                price: orderType === 'limit' ? price : undefined,
                orderType,
                action
            };

            const validatedOrder = tradeOrderSchema.parse(orderData);

            const stock = stockList.find(s => s.symbol === validatedOrder.symbol);
            if (!stock) {
                toast.error("Selected stock not found");
                return;
            }

            const totalValue = validatedOrder.quantity * (orderType === 'market' ? stock.price : validatedOrder.price || 0);

            toast.success(
                `${validatedOrder.action.toUpperCase()} order placed: ${validatedOrder.quantity} shares of ${validatedOrder.symbol} for $${totalValue.toFixed(0)}`
            );

            // Reset form
            setQuantity('');
            setPrice('');
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessage = error.errors?.[0]?.message || "Invalid order data";   // 할일-투두: 코드 수정 필요 (나중에) 유지보수하기.
                toast.error(errorMessage);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stock List */}
            <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/80 border-border/50">
                <CardHeader>
                    <CardTitle>모의 트레이딩홈</CardTitle>
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="종목 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredStocks.map((stock) => (
                            <div
                                key={stock.symbol}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                                    selectedStock === stock.symbol ? 'border-primary bg-primary/5' : 'border-border/50'
                                }`}
                                onClick={() => setSelectedStock(stock.symbol)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{stock.symbol}</h3>
                                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">${stock.price.toFixed(2)}</div>
                                        <div className={`text-sm flex items-center gap-1 ${
                                            stock.change >= 0 ? 'text-bull' : 'text-bear'
                                        }`}>
                                            {stock.change >= 0 ?
                                                <TrendingUp className="h-3 w-3"/> :
                                                <TrendingDown className="h-3 w-3"/>
                                            }
                                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Trading Panel */}
            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
                <CardHeader>
                    <CardTitle>여기서 매수매도 주문을 진행하다</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Tabs value={action} onValueChange={setAction}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="buy"
                                         className="data-[state=active]:bg-bull data-[state=active]:text-white">
                                매수
                            </TabsTrigger>
                            <TabsTrigger value="sell"
                                         className="data-[state=active]:bg-bear data-[state=active]:text-white">
                                매도
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value={action} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label>목록 상 선택된 주식</Label>
                                <div className="p-3 bg-secondary/50 rounded-md">
                                    {selectedStock ? (
                                        <div>
                                            <div className="font-semibold">{selectedStock}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {stockList.find(s => s.symbol === selectedStock)?.price.toFixed(0)} 원
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted-foreground">목록 상의 주식 중 선택하기</div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>주문방식</Label>
                                <Select value={orderType} onValueChange={setOrderType}>
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="market">시장가 (선택)</SelectItem>
                                        <SelectItem value="limit">지정가 (선택)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>주문수량</Label>
                                <Input
                                    className="no-spin"
                                    type="number"
                                    placeholder="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    min="1"
                                    max="10000"
                                />
                            </div>

                            {orderType === 'limit' && (
                                <div className="space-y-2">
                                    <Label>희망지정가</Label>
                                    <Input
                                        type="number"
                                        className="no-spin"
                                        placeholder="숫자만 입력.. (예시: 10000)"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        min="0.01"
                                        max="50000"
                                        step="0.01"
                                    />
                                </div>
                            )}

                            {selectedStock && quantity && (
                                <div className="p-3 bg-secondary/50 rounded-md">
                                    <div className="text-sm text-muted-foreground">거래금액</div>
                                    <div className="text-lg font-bold">
                                        $
                                        {(
                                            parseInt(quantity) *
                                            (orderType === 'market'
                                                ? stockList.find(s => s.symbol === selectedStock)!.price
                                                : parseInt(price) || 0)
                                        )}
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleTrade}
                                className={`w-full ${action === 'buy' ? 'bg-bull hover:bg-bull/90' : 'bg-bear hover:bg-bear/90'}`}
                                disabled={!selectedStock || !quantity}
                            >
                                {action === 'buy' ? 'Buy' : 'Sell'} {selectedStock}
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}