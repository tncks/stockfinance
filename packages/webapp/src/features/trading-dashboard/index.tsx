import React, {useState, useEffect} from "react";
import {PortfolioCard} from "@/features/portfolio-card";
import {TradingInterface} from "@/features/trading-interface";
import {OrderBookBox} from "@/features/order-book-box";
import {StockDashboard} from "@/features/stock-dashboard";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {supabase} from '@/shared/lib/supabaseClient';
import type {accounts, CredentialResponse} from 'google-one-tap';
import {DailyMissionSection} from "@/features/daily-mission-section";
import {GreetingCard} from "@/features/greeting-card";
import {Card, CardContent, CardHeader} from "@/shared/ui/card.tsx";
import {Input} from "@/shared/ui/input.tsx";
import {ScrollArea} from "@/shared/ui/scroll-area.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table.tsx";

declare const google: { accounts: accounts }
const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return [nonce, hashedNonce]
}


const portfolioItems = [
    {
        symbol: 'AAPL',
        name: '애플',
        shares: 10,
        avgPrice: 150,
        currentPrice: 163,
        totalValue: 1637,
        gain: 137,
        gainPercent: 9.17
    },
    {
        symbol: 'TSLA',
        name: '테슬라',
        shares: 5,
        avgPrice: 800,
        currentPrice: 750,
        totalValue: 3751,
        gain: -248,
        gainPercent: -6.22
    },
    {
        symbol: 'GOOGL',
        name: '알파벳',
        shares: 3,
        avgPrice: 2500,
        currentPrice: 2650,
        totalValue: 7952,
        gain: 452,
        gainPercent: 6.03
    }
];


const GoogleLoginButton = () => {
    useEffect(() => {
        const initializeGoogleOneTap = async () => {
            console.log("Initializing Google One Tap");
            const [nonce, hashedNonce] = await generateNonce();
            console.log("Nonce: ", nonce, hashedNonce);

            // 세션 확인
            const {data, error} = await supabase.auth.getSession();
            if (error) {
                console.error("Error getting session", error);
            }

            if (typeof window !== "undefined" && (window as any).google) {
                (window as any).google.accounts.id.initialize({
                    client_id: `171446773526-9lsgvbh4hnlhc5nrjp8tbm7scnv3a22l.apps.googleusercontent.com`,
                    callback: async (response: any) => {
                        try {
                            const {data, error} = await supabase.auth.signInWithIdToken({
                                provider: "google",
                                token: response.credential,
                                nonce, // 문자열만 전달
                            });
                            if (error) throw error;
                            console.log("Session data: ", data);
                            console.log("Successfully logged in with Google One Tap");
                        } catch (error) {
                            console.error("Error logging in with Google One Tap", error);
                        }
                    },
                    nonce: hashedNonce,
                    use_fedcm_for_prompt: true,
                });
                (window as any).google.accounts.id.prompt();
            }
        };
        // gsi 스크립트 로드
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleOneTap;
        document.body.appendChild(script);
    }, []);

    return null;
};


export function TradingDashboard() {


    const [activeTab, setActiveTab] = useState("overview");
    const [user, setUser] = useState<any>(null);

    const totalPortfolioValue = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
    const totalGain = portfolioItems.reduce((sum, item) => sum + item.gain, 0);
    const totalGainPercent = (totalGain / (totalPortfolioValue - totalGain)) * 100;

    // 로그인/로그아웃 상태 감지
    useEffect(() => {
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = /*async*/ () => {
        return;
        //await supabase.auth.signOut();
        //setUser(null);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="container mx-auto p-4 md:p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold">
                            <img src="https://placehold.co/150x60/white/black?text=Logo" alt="로고"
                                 className="h-16 min-w-16"/>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-muted-foreground">👋 {user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <div>
                                <GoogleLoginButton/>
                                <div className="px-4 py-2 border rounded-lg">로그인 해주세요</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content with Fixed Sidebar Layout */}
                <div className="flex gap-6">
                    {/* Fixed Left Sidebar */}
                    <div className="w-60 flex-shrink-0">
                        <div className="bg-muted/50 rounded-lg p-2 space-y-1">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`w-full px-4 py-3 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                                    activeTab === "overview"
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "hover:bg-muted"
                                }`}
                            >
                                컴포넌트-A(오버뷰)
                            </button>
                            <button
                                onClick={() => setActiveTab("trade")}
                                className={`w-full px-4 py-3 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                                    activeTab === "trade"
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "hover:bg-muted"
                                }`}
                            >
                                컴포넌트-B(트레이드)
                            </button>
                            <button
                                onClick={() => setActiveTab("portfolio")}
                                className={`w-full px-4 py-3 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                                    activeTab === "portfolio"
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "hover:bg-muted"
                                }`}
                            >
                                컴포넌트-C(포트폴리오)
                            </button>
                            <button
                                onClick={() => setActiveTab("orderbookx")}
                                className={`w-full px-4 py-3 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                                    activeTab === "orderbookx"
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "hover:bg-muted"
                                }`}
                            >
                                컴포넌트-D(호가)
                            </button>
                            <button
                                onClick={() => setActiveTab("sboard")}
                                className={`w-full px-4 py-3 text-left rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${
                                    activeTab === "sboard"
                                        ? "bg-primary text-primary-foreground font-semibold"
                                        : "hover:bg-muted"
                                }`}
                            >
                                컴포넌트-E(차트)
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {activeTab === "overview" && (
                            <div className="flex flex-col md:flex-row md:space-y-0">
                                <div className="flex flex-col space-y-6 flex-shrink-0 md:basis-[60%]">
                                    <GreetingCard/>


                                    <div>
                                        <h2 className="text-xl font-semibold text-white mb-4">Today Course</h2>
                                        <div className="space-y-4">
                                            <DailyMissionSection
                                                title="오늘의 MISSION"
                                                description="이건 첫번째 lesson, 금융 관련 주식 뉴스 찾아보고 3개 사보기"
                                                backgroundColor="bg-orange-100"
                                                textColor="text-gray-700"
                                            />


                                            <DailyMissionSection
                                                title="오늘의 주식 용어"
                                                description="주식? 배당? 무슨 뜻일까? 찾아보러 가기"
                                                backgroundColor="bg-orange-100"
                                                textColor="text-gray-700"
                                            />


                                            <DailyMissionSection
                                                title="오늘의 ARTICLE"
                                                description="주식과 관련된 아티클 보러가기"
                                                backgroundColor="bg-orange-100"
                                                textColor="text-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="flex flex-col space-y-6 flex-shrink-0 md:basis-[2%]">
                                    <div className="bg-black p-0.5">

                                        <div className="space-y-1">
                                            {/* Empty for margin space */}
                                        </div>

                                    </div>

                                </div>


                                <div className="flex flex-col space-y-6 flex-shrink-0 md:basis-[38%]">
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="text-left">
                                                    <p className="text-muted-foreground">보유 종목</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-muted-foreground text-right">평가손익</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center py-2 px-1.5">
                                                    <div className="flex items-center space-x-2">

                                                        <span className="text-black font-medium">삼성증권</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-black font-semibold">0원</p>
                                                        <p className="text-black text-xs">+200원 200%</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 px-1.5">
                                                    <div className="flex items-center space-x-2">

                                                        <span className="text-black font-medium">엘지전자</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-black font-semibold">0원</p>
                                                        <p className="text-black text-xs">-200원 -200%</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center py-2 px-1.5">
                                                    <div className="flex items-center space-x-2">

                                                        <span className="text-black font-medium">현대자동차</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-black font-semibold">0원</p>
                                                        <p className="text-black text-xs">+200원 100%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="h-0.5 bg-gray-100 border-gray-100"/>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="text-left">
                                                    <p className="text-muted-foreground">&nbsp;</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-muted-foreground text-right">&nbsp;</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Card className="bg-white lg:col-span-1 flex flex-col h-full border-white">
                                                    <CardHeader className="text-black h-0.5 max-h-0.5 pt-0 pb-0 pl-0 pr-0 mt-0 mb-0 ml-0 mr-0">
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div className="text-left">
                                                                <p className="text-muted-foreground text-sm">보유 종목</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-muted-foreground text-right text-sm">평가손익</p>
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="flex-1 p-0">
                                                        <ScrollArea className="h-[200px]">
                                                            <Table className="border-0 border-white">
                                                                <TableHeader className="border-0 border-white">
                                                                    <TableRow className="hover:bg-muted/95 transition-colors border-0 border-white">
                                                                        <TableHead className="text-muted-foreground">&nbsp;</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody className="border-0 border-white">
                                                                    <TableRow className={`cursor-pointer hover:bg-muted/50 transition-colors border-0 border-white`}>
                                                                        <TableCell>
                                                                            <div className="flex justify-between items-center">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-black font-medium text-base">{`삼성`}</span>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow className={`cursor-pointer hover:bg-muted/50 transition-colors border-0 border-white`}>
                                                                        <TableCell>
                                                                            <div className="flex justify-between items-center">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-black font-medium text-base">{`엘지`}</span>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow className={`cursor-pointer hover:bg-muted/50 transition-colors border-0 border-white`}>
                                                                        <TableCell>
                                                                            <div className="flex justify-between items-center">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-black font-medium text-base">{`현대`}</span>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow className={`cursor-pointer hover:bg-muted/50 transition-colors border-0 border-white`}>
                                                                        <TableCell>
                                                                            <div className="flex justify-between items-center">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-black font-medium text-base">{`기아`}</span>
                                                                                </div>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                            </Table>
                                                        </ScrollArea>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        )}

                        {activeTab === "trade" && <TradingInterface/>}

                        {activeTab === "portfolio" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {portfolioItems.map((item) => (
                                        <PortfolioCard key={item.symbol} item={item}/>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "orderbookx" && <OrderBookBox/>}

                        {activeTab === "sboard" && <StockDashboard/>}
                    </div>
                </div>
            </div>
        </div>
    );
}








