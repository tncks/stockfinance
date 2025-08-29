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
        <>
            {/* IMPROVEMENT: Added a style tag for scrollbar-hide and fade-in animation */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }                
            `}</style>
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
                                        className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
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

                    {/* Main Content with Vertical Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col md:flex-row gap-6">
                        {/* IMPROVEMENT: Mobile optimized TabsList as suggested */}
                        <TabsList
                            className="flex flex-row overflow-x-auto md:flex-col md:w-48 p-2 bg-muted/50 rounded-lg scrollbar-hide">
                            <TabsTrigger value="overview">
                                <span className="md:hidden">오버뷰</span>
                                <span className="hidden md:inline">컴포넌트-A(오버뷰)</span>
                            </TabsTrigger>
                            <TabsTrigger value="trade">
                                <span className="md:hidden">트레이드</span>
                                <span className="hidden md:inline">컴포넌트-B(트레이드)</span>
                            </TabsTrigger>
                            <TabsTrigger value="portfolio">
                                <span className="md:hidden">포트폴리오</span>
                                <span className="hidden md:inline">컴포넌트-C(포트폴리오)</span>
                            </TabsTrigger>
                            <TabsTrigger value="orderbookx">
                                <span className="md:hidden">호가</span>
                                <span className="hidden md:inline">컴포넌트-D(호가)</span>
                            </TabsTrigger>
                            <TabsTrigger value="sboard">
                                <span className="md:hidden">차트</span>
                                <span className="hidden md:inline">컴포넌트-E(차트)</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab Content Area */}
                        <div className="flex-1 min-w-0">
                            <TabsContent value="overview"
                                         className="mt-0 space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {portfolioItems.map((item) => (
                                        <PortfolioCard key={item.symbol} item={item}/>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="trade" className="mt-0 animate-fade-in">
                                <TradingInterface/>
                            </TabsContent>

                            <TabsContent value="portfolio"
                                         className="mt-0 space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {portfolioItems.map((item) => (
                                        <PortfolioCard key={item.symbol} item={item}/>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="orderbookx" className="mt-0 animate-fade-in">
                                <OrderBookBox/>
                            </TabsContent>

                            <TabsContent value="sboard" className="mt-0 animate-fade-in">
                                <StockDashboard/>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </>
    );
}


//
// export function TradingDashboard() {
//
//
//     const [activeTab, setActiveTab] = useState("overview");
//     const [user, setUser] = useState<any>(null);
//
//     const totalPortfolioValue = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
//     const totalGain = portfolioItems.reduce((sum, item) => sum + item.gain, 0);
//     const totalGainPercent = (totalGain / (totalPortfolioValue - totalGain)) * 100;
//
//
//     // 로그인/로그아웃 상태 감지
//     useEffect(() => {
//         const {
//             data: {subscription},
//         } = supabase.auth.onAuthStateChange((_event, session) => {
//             setUser(session?.user ?? null);
//         });
//
//         // cleanup
//         return () => {
//             subscription.unsubscribe();
//         };
//     }, []);
//
//     const handleLogout = /*async*/ () => {
//         return;
//         //await supabase.auth.signOut();
//         //setUser(null);
//     };
//
//
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
//             <div className="container mx-auto p-6 space-y-6">
//                 {/* Header */}
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h1 className="text-4xl font-bold" style={{backgroundColor: "white"}}>
//                             <img src="/stock_web_logo.svg" alt="로고" className="h-20 min-w-20"/>
//                         </h1>
//                         <p className="text-muted-foreground mt-2">&nbsp;</p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         {/*<Badge variant="secondary" className="text-lg px-4 py-2">*/}
//                         {/*    모의예수금: &#8361;5,000,000*/}
//                         {/*</Badge>*/}
//                         {user ? (
//                             <>
//                                 <span className="text-sm">👋 {user.email}</span>
//                                 <button
//                                     onClick={handleLogout}
//                                     className="px-4 py-2 bg-red-500 text-white rounded-lg"
//                                 >
//                                     로그아웃
//                                 </button>
//                             </>
//                         ) : (
//
//                             <div>
//                                 <GoogleLoginButton/>
//                                 <>
//                                     <div
//                                         id="g_id_onload"
//                                         data-client_id="<client ID>"
//                                         data-context="signin"
//                                         data-ux_mode="popup"
//                                         data-callback="handleSignInWithGoogle"
//                                         data-nonce=""
//                                         data-auto_select="true"
//                                         data-itp_support="true"
//                                         data-use_fedcm_for_prompt="true"
//                                         style={{visibility: 'hidden'}}
//                                     ></div>
//                                     <div
//                                         className="g_id_signin"
//                                         data-type="standard"
//                                         data-shape="pill"
//                                         data-theme="outline"
//                                         data-text="signin_with"
//                                         data-size="large"
//                                         data-logo_alignment="left"
//                                         style={{visibility: 'hidden'}}
//                                     ></div>
//                                 </>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//
//                 {/* Main Content Tabs */}
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//                     <TabsList className="grid w-full grid-cols-5 bg-secondary/50">
//                         <TabsTrigger value="overview">컴포넌트-A(오버뷰)</TabsTrigger>
//                         <TabsTrigger value="trade">컴포넌트-B(트레이드)</TabsTrigger>
//                         <TabsTrigger value="portfolio">컴포넌트-C(포트폴리오)</TabsTrigger>
//                         <TabsTrigger value="orderbookx">컴포넌트-D(호가)</TabsTrigger>
//                         <TabsTrigger value="sboard">컴포넌트-E(차트)</TabsTrigger>
//                     </TabsList>
//
//                     <TabsContent value="overview" className="space-y-6">
//                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                             {portfolioItems.map((item) => (
//                                 <PortfolioCard key={item.symbol} item={item}/>
//                             ))}
//                         </div>
//                     </TabsContent>
//
//                     <TabsContent value="trade">
//                         <TradingInterface/>
//                     </TabsContent>
//
//                     <TabsContent value="portfolio" className="space-y-6">
//                         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                             {portfolioItems.map((item) => (
//                                 <PortfolioCard key={item.symbol} item={item}/>
//                             ))}
//                         </div>
//                     </TabsContent>
//
//                     <TabsContent value="orderbookx">
//                         <OrderBookBox/>
//                     </TabsContent>
//
//                     <TabsContent value="sboard">
//                         <StockDashboard/>
//                     </TabsContent>
//                 </Tabs>
//
//                 <div><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/><hr/></div>
//
//
//             </div>
//         </div>
//     );
// }
