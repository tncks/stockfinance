import {useState, useEffect} from "react";
import {PortfolioCard} from "@/features/portfolio-card";
import {TradingInterface} from "@/features/trading-interface";
import {OrderBookBox} from "@/features/order-book-box";
import {StockDashboard} from "@/features/stock-dashboard";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {supabase} from '@/shared/lib/supabaseClient';
import type {accounts, CredentialResponse} from 'google-one-tap'

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
                            <img src="https://placehold.co/150x60/white/black?text=Logo" alt="로고" className="h-16 min-w-16"/>
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
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {portfolioItems.map((item) => (
                                        <PortfolioCard key={item.symbol} item={item}/>
                                    ))}
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
