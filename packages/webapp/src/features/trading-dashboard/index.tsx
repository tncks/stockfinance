import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { StockChart } from "@/shared/ui/stock-chart";
import { PortfolioCard } from "@/features/portfolio-card";
import { TradingInterface } from "@/features/trading-interface";
import { CommunityHub } from "@/features/community-hub";
import { BIAssistant } from "@/features/stock-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DollarSign, TrendingUp, TrendingDown, Users, Bot } from "lucide-react";

// Mock data
const stockData = [
  { time: '9:30', price: 150.25 },
  { time: '10:00', price: 152.10 },
  { time: '10:30', price: 148.75 },
  { time: '11:00', price: 155.30 },
  { time: '11:30', price: 157.85 },
  { time: '12:00', price: 159.40 },
  { time: '12:30', price: 161.20 },
  { time: '1:00', price: 163.75 },
];

const portfolioItems = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 10,
    avgPrice: 150.00,
    currentPrice: 163.75,
    totalValue: 1637.50,
    gain: 137.50,
    gainPercent: 9.17
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    shares: 5005,
    avgPrice: 800.00,
    currentPrice: 750.25,
    totalValue: 3751.25,
    gain: -248.75,
    gainPercent: -6.22
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 3,
    avgPrice: 2500.00,
    currentPrice: 2650.75,
    totalValue: 7952.25,
    gain: 452.25,
    gainPercent: 6.03
  }
];

export function TradingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalPortfolioValue = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
  const totalGain = portfolioItems.reduce((sum, item) => sum + item.gain, 0);
  const totalGainPercent = (totalGain / (totalPortfolioValue - totalGain)) * 100;

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Stocks Trading Simulator
              </h1>
              <p className="text-muted-foreground mt-2">Practice trading without the risk</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                모의예수금: &#8361;5,000,000
              </Badge>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">합산투자금액(예상값)</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">오늘의 P&L</CardTitle>
                {totalGain >= 0 ?
                    <TrendingUp className="h-4 w-4 text-bull" /> :
                    <TrendingDown className="h-4 w-4 text-bear" />
                }
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-bull' : 'text-bear'}`}>
                  {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}% change
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Rank</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">#127</div>
                <p className="text-xs text-muted-foreground">글로벌 리더보드</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
              <TabsTrigger value="overview">컴포넌트-A(오버뷰)</TabsTrigger>
              <TabsTrigger value="trade">컴포넌트-B(트레이드)</TabsTrigger>
              <TabsTrigger value="portfolio">컴포넌트-C(포트폴리오)</TabsTrigger>
              <TabsTrigger value="community">컴포넌트-D(커뮤니티)</TabsTrigger>
              <TabsTrigger value="bssistant">컴포넌트-E(어시스턴트)</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Featured Stock Chart */}
              <StockChart
                  symbol="AAPL"
                  data={stockData}
                  currentPrice={163.75}
                  change={13.75}
                  changePercent={9.17}
              />

              {/* Quick Portfolio Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                    <PortfolioCard key={item.symbol} item={item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trade">
              <TradingInterface />
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                    <PortfolioCard key={item.symbol} item={item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="community">
              <CommunityHub />
            </TabsContent>

            <TabsContent value="bssistant">
              <BIAssistant />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}
