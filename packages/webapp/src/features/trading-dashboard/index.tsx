import {useState, useEffect} from "react";
import {PortfolioCard} from "@/features/portfolio-card";
import {TradingInterface} from "@/features/trading-interface";
import {OrderBookBox} from "@/features/order-book-box";
import {StockDashboard} from "@/features/stock-dashboard";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {supabase} from '@/shared/lib/supabaseClient';
import type {accounts, CredentialResponse} from 'google-one-tap';
import {DailyMissionSection} from "@/features/daily-mission-section";

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
                                    {/*<WelcomeSection/>==*/}
                                    <div
                                        className="bg-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                                        <div className="flex-1">
                                            <p className="text-lg font-bold text-gray-800 mb-1">안녕하세요, 주리니님!</p>
                                            <p className="text-2xl font-extrabold text-gray-900 mb-3">주식 잡수 1일차에요!</p>
                                            <p className="text-sm text-gray-600">오늘의 미션에 도전해 봐요!</p>
                                            <p className="text-xs text-gray-500 mt-1">시작하기를 누르면 모의투자 페이지로 이동하게 됨.</p>
                                            <button
                                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md">
                                                시작하기
                                            </button>
                                        </div>
                                        <div
                                            className="relative p-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium whitespace-nowrap">
                                            연꽃잎 머리에 쓴 린니
                                            {/* PNG 이미지의 추상적인 요소 구현 */}
                                            <div
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-purple-200 rounded-full opacity-50"></div>
                                        </div>
                                    </div>


                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Today Course</h2>
                                        <div className="space-y-4">
                                            <DailyMissionSection
                                                title="오늘의 MISSION"
                                                description="이건 첫번째 lesson, 금융 관련 주식 뉴스 찾아보고 3개 사보기"
                                                backgroundColor="bg-green-100"
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
                                                backgroundColor="bg-pink-100"
                                                textColor="text-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>


                                <div className="flex flex-col space-y-6 flex-shrink-0 md:basis-[40%]">
                                    {/* Profile Section */}
                                    <div className="bg-orange-light/30 rounded-xl p-6 mb-6 relative overflow-hidden">
                                        <div className="absolute top-4 right-4">
                                            <div className="w-24 h-16 bg-orange-secondary/40 rounded-full"></div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <img src="https://placehold.co/150x60/FF0000/FFFFFF?text=MyLogo"
                                                 alt="place logo" className="w-16 h-16"/>
                                            <div>
                                                <p className="text-purple-600 text-sm mb-1">한국 수 익어 월스트리트</p>
                                                <h3 className="font-bold text-lg">나의 자산 현황</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Asset Information */}
                                    <div className="space-y-4">
                                        {/* Total Assets */}
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">총 자산</p>
                                            <p className="text-2xl font-bold text-orange-primary">1 원</p>
                                        </div>

                                        {/* Performance Metrics */}
                                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                                            <div>
                                                <p className="text-muted-foreground">어제까지</p>
                                                <p className="text-red-500 font-semibold">0원</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">손익</p>
                                                <p className="text-orange-primary font-semibold">0원</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">수익률</p>
                                                <p className="text-orange-primary font-semibold">0.01%</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">보유 종목</p>
                                                <p className="font-medium">국내</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">평가손익</p>
                                            </div>
                                        </div>

                                        {/* Holdings */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center py-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                                    <span className="font-medium">삼성증권</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">100,200원</p>
                                                    <p className="text-red-500 text-xs">+200원 200%</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center py-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                                    <span className="font-medium">엘지전자</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">200,200원</p>
                                                    <p className="text-blue-500 text-xs">-200원 -200%</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center py-2">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                                    <span className="font-medium">예술</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">100,200원</p>
                                                    <p className="text-xs text-muted-foreground">+200원 100%</p>
                                                </div>
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
