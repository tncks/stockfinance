import {useState, useEffect} from "react";
import {PortfolioCard} from "@/features/portfolio-card";
import {TradingInterface} from "@/features/trading-interface";
import {OrderBookBox} from "@/features/order-book-box";
import {StockDashboard} from "@/features/stock-dashboard";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import { supabase } from '@/shared/lib/supabaseClient';
import type { accounts, CredentialResponse } from 'google-one-tap'
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
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error getting session", error);
            }

            if (typeof window !== "undefined" && (window as any).google) {
                (window as any).google.accounts.id.initialize({
                    client_id: `171446773526-9lsgvbh4hnlhc5nrjp8tbm7scnv3a22l.apps.googleusercontent.com`,
                    callback: async (response: any) => {
                        try {
                            const { data, error } = await supabase.auth.signInWithIdToken({
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
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        // cleanup
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleLogout = /*async*/ () => {
        return;
        //await supabase.auth.signOut();
        //setUser(null);
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold" style={{backgroundColor:"white"}}>
                            <img src="/stock_web_logo.svg" alt="로고" className="h-20 min-w-20"/>
                        </h1>
                        <p className="text-muted-foreground mt-2">&nbsp;</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/*<Badge variant="secondary" className="text-lg px-4 py-2">*/}
                        {/*    모의예수금: &#8361;5,000,000*/}
                        {/*</Badge>*/}
                        {user ? (
                            <>
                                <span className="text-sm">👋 {user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <GoogleLoginButton />
                        )}
                    </div>
                </div>

                {/* (debug info: This component is currently disabled) Portfolio Summary */}
                {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
                {/*    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">*/}
                {/*        <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
                {/*            <CardTitle className="text-sm font-medium">포트폴리오 자산</CardTitle>*/}
                {/*            <DollarSign className="h-4 w-4 text-muted-foreground"/>*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</div>*/}
                {/*            <p className="text-xs text-muted-foreground">합산투자금액(예상값)</p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}

                {/*    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">*/}
                {/*        <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
                {/*            <CardTitle className="text-sm font-medium">오늘의 등락</CardTitle>*/}
                {/*            {totalGain >= 0 ?*/}
                {/*                <TrendingUp className="h-4 w-4 text-bull"/> :*/}
                {/*                <TrendingDown className="h-4 w-4 text-bear"/>*/}
                {/*            }*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-bull' : 'text-bear'}`}>*/}
                {/*                {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)}*/}
                {/*            </div>*/}
                {/*            <p className="text-xs text-muted-foreground">*/}
                {/*                {totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%*/}
                {/*            </p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}

                {/*    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">*/}
                {/*        <CardHeader className="flex flex-row items-center justify-between pb-2">*/}
                {/*            <CardTitle className="text-sm font-medium">랭킹</CardTitle>*/}
                {/*            <Users className="h-4 w-4 text-muted-foreground"/>*/}
                {/*        </CardHeader>*/}
                {/*        <CardContent>*/}
                {/*            <div className="text-2xl font-bold text-accent">#127</div>*/}
                {/*            <p className="text-xs text-muted-foreground">글로벌 리더보드</p>*/}
                {/*        </CardContent>*/}
                {/*    </Card>*/}
                {/*</div>*/}
                {/* end of display disabled comment */}

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
                        <TabsTrigger value="overview">컴포넌트-A(오버뷰)</TabsTrigger>
                        <TabsTrigger value="trade">컴포넌트-B(트레이드)</TabsTrigger>
                        <TabsTrigger value="portfolio">컴포넌트-C(포트폴리오)</TabsTrigger>
                        <TabsTrigger value="orderbookx">컴포넌트-D(호가)</TabsTrigger>
                        <TabsTrigger value="sboard">컴포넌트-E(차트)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Featured Stock Chart */}
                        {/*<StockChart*/}
                        {/*    symbol="AAPL"*/}
                        {/*    data={stockData}*/}
                        {/*    currentPrice={163}*/}
                        {/*    change={13}*/}
                        {/*    changePercent={9.17}*/}
                        {/*/>*/}


                        {/* Quick Portfolio Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {portfolioItems.map((item) => (
                                <PortfolioCard key={item.symbol} item={item}/>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="trade">
                        <TradingInterface/>
                    </TabsContent>

                    <TabsContent value="portfolio" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {portfolioItems.map((item) => (
                                <PortfolioCard key={item.symbol} item={item}/>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="orderbookx">
                        <OrderBookBox/>
                    </TabsContent>

                    <TabsContent value="sboard">
                        <StockDashboard/>
                    </TabsContent>
                </Tabs>


            </div>
        </div>
    );
}
