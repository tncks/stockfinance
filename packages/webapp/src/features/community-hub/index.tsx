import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {MessageSquare, TrendingUp, TrendingDown, Heart, Share} from "lucide-react";
import {toast} from "sonner";
import {createChart, AreaSeries, CandlestickSeries} from 'lightweight-charts';

const communityPosts = [
    {
        id: 1,
        user: "TraderMike",
        avatar: "TM",
        time: "2 hours ago",
        content: "Just made a great call",
        likes: 24,
        comments: 8,
        tags: ["AAPL", "BullishCall"],
        gain: 15
    },
    {
        id: 2,
        user: "StockWizard",
        avatar: "SW",
        time: "4 hours ago",
        content: "TSLA looking bearish on the tech",
        likes: 18,
        comments: 12,
        tags: ["TSLA", "TechnicalAnalysis"],
        gain: -3
    },
    {
        id: 3,
        user: "InvestorSarah",
        avatar: "IS",
        time: "6 hours ago",
        content: "Diversification is key",
        likes: 31,
        comments: 15,
        tags: ["Strategy", "RiskManagement"],
        gain: 8
    }
];



function myChartFun() {
    const chartOptions = {width: 320, height: 240};
    const ele = document.getElementById('my-container');
    const chart = createChart(ele, chartOptions);
    const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: '#2962FF', topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)',
    });
    areaSeries.setData([
        {time: '2024-12-22', value: 32.51},
        {time: '2024-12-23', value: 31.11},
        {time: '2024-12-24', value: 27.02},
        {time: '2024-12-25', value: 27.32},
        {time: '2024-12-26', value: 25.17},
        {time: '2024-12-27', value: 28.89},
        {time: '2024-12-28', value: 25.46},
        {time: '2024-12-29', value: 23.92},
        {time: '2024-12-30', value: 22.68},
        {time: '2024-12-31', value: 22.67},
    ]);

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
        wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    });
    candlestickSeries.setData([
        {time: '2024-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72},
        {time: '2024-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09},
        {time: '2024-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29},
        {time: '2024-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50},
        {time: '2024-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04},
        {time: '2024-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40},
        {time: '2024-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25},
        {time: '2024-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43},
        {time: '2024-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10},
        {time: '2024-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26},
    ]);

    chart.timeScale().fitContent();
    // logo 최소화 숨기기 실행
    const logo = document.getElementById('tv-attr-logo');
    if (logo) {
        logo.style.width = '1px';   // width를 1px로
        logo.style.overflow = 'hidden';
    }

}


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

    setTimeout(() => {
      console.log(' ');  // 차트 프론트에 보여주기 기능은 임시 비활성화 상태
        //myChartFun();
    }, 1600); //1600 == 1.6초임.
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
                                                <Heart className="h-4 w-4"/>
                                                {post.likes}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <MessageSquare className="h-4 w-4"/>
                                                {post.comments}
                                            </Button>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <Share className="h-4 w-4"/>
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
                {/* Debug:Testing chart... */}
                <div className="space-y-4">
                    <br/>
                    <div id="my-container"></div>
                    <br/>
                </div>


            </div>
        </div>
    );
}
