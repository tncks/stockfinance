import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
//import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { tradeOrderSchema } from "@/shared/lib/validations";

const stockList = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 163.75, change: 2.45, changePercent: 1.52 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2650.75, change: -15.30, changePercent: -0.57 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 750.25, change: 8.90, changePercent: 1.20 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.30, change: 5.20, changePercent: 1.27 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3420.15, change: -25.85, changePercent: -0.75 },
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
        `${validatedOrder.action.toUpperCase()} order placed: ${validatedOrder.quantity} shares of ${validatedOrder.symbol} for $${totalValue.toFixed(2)}`
      );
      
      // Reset form
      setQuantity('');
      setPrice('');
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || "Invalid order data";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stock List */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-card to-card/80 border-border/50">
        <CardHeader>
          <CardTitle>Market Watch</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
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
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingDown className="h-3 w-3" />
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
          <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={action} onValueChange={setAction}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy" className="data-[state=active]:bg-bull data-[state=active]:text-white">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-bear data-[state=active]:text-white">
                Sell
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={action} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Selected Stock</Label>
                <div className="p-3 bg-secondary/50 rounded-md">
                  {selectedStock ? (
                    <div>
                      <div className="font-semibold">{selectedStock}</div>
                      <div className="text-sm text-muted-foreground">
                        ${stockList.find(s => s.symbol === selectedStock)?.price.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">Select a stock from the list</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market">Market Order</SelectItem>
                    <SelectItem value="limit">Limit Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Number of shares"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    max="10000"
                  />
              </div>

              {orderType === 'limit' && (
                <div className="space-y-2">
                  <Label>Limit Price</Label>
                    <Input
                      type="number"
                      placeholder="Price per share"
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
                  <div className="text-sm text-muted-foreground">Estimated Total</div>
                  <div className="text-lg font-bold">
                    $
                    {(
                      parseInt(quantity) * 
                      (orderType === 'market' 
                        ? stockList.find(s => s.symbol === selectedStock)!.price 
                        : parseFloat(price) || 0)
                    ).toFixed(2)}
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
