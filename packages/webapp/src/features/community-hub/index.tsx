import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { MessageSquare, TrendingUp, TrendingDown, Heart, Share } from "lucide-react";
import { toast } from "sonner";

const communityPosts = [
  {
    id: 1,
    user: "TraderMike",
    avatar: "TM",
    time: "2 hours ago",
    content: "Just made a great call on AAPL! Up 15% this week. The key is patience and research.",
    likes: 24,
    comments: 8,
    tags: ["AAPL", "BullishCall"],
    gain: 15.4
  },
  {
    id: 2,
    user: "StockWizard",
    avatar: "SW",
    time: "4 hours ago",
    content: "TSLA looking bearish on the technicals. RSI is overbought and we're hitting resistance. Might be time to take profits.",
    likes: 18,
    comments: 12,
    tags: ["TSLA", "TechnicalAnalysis"],
    gain: -3.2
  },
  {
    id: 3,
    user: "InvestorSarah",
    avatar: "IS",
    time: "6 hours ago",
    content: "Diversification is key! My portfolio is spread across tech, healthcare, and energy. Risk management > FOMO.",
    likes: 31,
    comments: 15,
    tags: ["Strategy", "RiskManagement"],
    gain: 8.7
  }
];

const leaderboard = [
  { rank: 1, user: "CryptoKing", avatar: "CK", gain: 45.2, trades: 156 },
  { rank: 2, user: "WallStreetPro", avatar: "WP", gain: 38.7, trades: 89 },
  { rank: 3, user: "DayTraderJoe", avatar: "DJ", gain: 32.1, trades: 234 },
  { rank: 4, user: "StockMaster", avatar: "SM", gain: 28.9, trades: 67 },
  { rank: 5, user: "MarketGuru", avatar: "MG", gain: 25.4, trades: 123 }
];

export function CommunityHub() {
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) {
      toast.error("Please write something before posting");
      return;
    }
    
    toast.success("Posted to community!");
    setNewPost("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Community Feed */}
      <div className="lg:col-span-2 space-y-6">
        {/* New Post */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle>Share Your Thoughts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your trading insights, strategies, or market observations..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline">#Trading</Badge>
                <Badge variant="outline">#MarketAnalysis</Badge>
              </div>
              <Button onClick={handlePost} className="bg-primary hover:bg-primary/90">
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Posts */}
        <div className="space-y-4">
          {communityPosts.map((post) => (
            <Card key={post.id} className="bg-gradient-to-br from-card to-card/80 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>{post.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.user}</span>
                        <span className="text-sm text-muted-foreground">{post.time}</span>
                        {post.gain && (
                          <Badge 
                            variant={post.gain > 0 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {post.gain > 0 ? '+' : ''}{post.gain}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-foreground">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-6 pt-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Leaderboard */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Traders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((trader) => (
                <div key={trader.rank} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {trader.rank}
                    </div>
                    <div>
                      <div className="font-medium">{trader.user}</div>
                      <div className="text-xs text-muted-foreground">{trader.trades} trades</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-bull">+{trader.gain}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Sentiment */}
        <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
          <CardHeader>
            <CardTitle>Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Bullish</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-bull" />
                <span className="font-semibold text-bull">68%</span>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-bull h-2 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Bearish</span>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-bear" />
                <span className="font-semibold text-bear">32%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
