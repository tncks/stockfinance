import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PortfolioItem {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  gain: number;
  gainPercent: number;
}

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const isPositive = item.gain >= 0;

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 backdrop-blur-sm hover:border-border transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{item.symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">{item.name}</p>
          </div>
          <Badge variant={isPositive ? "default" : "destructive"} className="gap-1">
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {isPositive ? '+' : ''}{item.gainPercent.toFixed(2)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">보유수량</p>
            <p className="font-medium">{item.shares}</p>
          </div>
          <div>
            <p className="text-muted-foreground">주당 가격(평균)</p>
            <p className="font-medium">${item.avgPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="border-t border-border/50 pt-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">현재 총 평가액</p>
              <p className="text-lg font-bold">${item.totalValue.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">등락(대비)</p>
              <p className={`text-lg font-bold ${isPositive ? 'text-bull' : 'text-bear'}`}>
                {isPositive ? '+' : ''}${item.gain.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
