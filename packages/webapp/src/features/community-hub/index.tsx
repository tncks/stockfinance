import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {MessageSquare, TrendingUp, TrendingDown, Heart, Share} from "lucide-react";
import {toast} from "sonner";
import { OrderBookTable, OrderBookRow } from './order-book-table';

const data = [
    { askVol: 91729, askPrice: 70900, bidPrice: 70400, bidVol: 82046 },
    { askVol: 65877, askPrice: 70800, bidPrice: 70300, bidVol: 72087 },
    { askVol: 96919, askPrice: 70700, bidPrice: 70200, bidVol: 64875 },
    { askVol: 100489, askPrice: 70600, bidPrice: 70100, bidVol: 45038 },
    { askVol: 24056, askPrice: 70500, bidPrice: 70000, bidVol: 79493 }
];
// --- 데이터 및 Mockup 정의 ---
const INITIAL_ORDER_BOOK_DATA = [
    { askVol: 91729, askPrice: 70900, bidPrice: 70400, bidVol: 82046 },
    { askVol: 65877, askPrice: 70800, bidPrice: 70300, bidVol: 72087 },
    { askVol: 96919, askPrice: 70700, bidPrice: 70200, bidVol: 64875 },
    { askVol: 100489, askPrice: 70600, bidPrice: 70100, bidVol: 45038 },
    { askVol: 24056, askPrice: 70500, bidPrice: 70000, bidVol: 79493 },
];


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
    }
];

export function CommunityHub() {

    const [newPost, setNewPost] = useState("");


    const handlePost = () => {
        return; // 임시로 비활성화 시킴. 지금은 아무일도 일어나지 않습니다!
        if (!newPost.trim()) {  // 기존 코드들.
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
                        <CardTitle>커뮤1</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="텍스트내용입력.."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <Badge variant="outline">#해시태그배지1</Badge>
                                <Badge variant="outline">#해시태그배지2</Badge>
                            </div>
                            <Button onClick={handlePost} className="bg-primary hover:bg-primary/90">
                                올리기
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

            <div>
                <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
                    <OrderBookTable data={INITIAL_ORDER_BOOK_DATA} />
                </div>
            </div>


        </div>
    );
}
