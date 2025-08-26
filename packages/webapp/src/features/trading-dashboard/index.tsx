import {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Badge} from "@/shared/ui/badge";
// import {StockChart} from "@/shared/ui/stock-chart";
import {PortfolioCard} from "@/features/portfolio-card";
import {TradingInterface} from "@/features/trading-interface";
import {CommunityHub} from "@/features/community-hub";
import {StockDashboard} from "@/features/stock-dashboard";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {DollarSign, TrendingUp, TrendingDown, AlertCircle, Users} from "lucide-react";
import {createChart, LineSeries} from 'lightweight-charts';  // , CandlestickSeries


function myChartFun() {
    const chartOptions = {
        height: 600,
        layout: {
            background: {
                color: '#000000', // 배경을 검정색으로 설정
            },
            textColor: '#FFFFFF'
        },
        grid: {
            vertLines: { color: '#444444' },    // 수직 그리드 회색
            horzLines: { color: '#444444' },    // 수평 그리드 회색
        },
    };
    const ele = document.getElementById('my-container');
    const chart = createChart(ele, chartOptions);
    const lineSeries = chart.addSeries(LineSeries,{
        autoscaleInfoProvider: undefined,
        baseLineColor: "#ffff00",
        baseLineStyle: undefined,
        baseLineVisible: true,
        baseLineWidth: undefined,
        color: "#00ff00",
        crosshairMarkerBackgroundColor: "#000000",
        crosshairMarkerBorderColor: "#ff0000",
        crosshairMarkerBorderWidth: 0,
        crosshairMarkerRadius: 0,
        crosshairMarkerVisible: true,
        lastPriceAnimation: undefined,
        lastValueVisible: true,
        lineStyle: undefined,
        lineType: undefined,
        lineVisible: true,
        lineWidth: 2,
        pointMarkersRadius: 0,
        pointMarkersVisible: false,
        priceFormat: { type: 'price', precision: 0, minMove: 1 },
        priceLineColor: "#ff0000",
        priceLineSource: undefined,
        priceLineStyle: undefined,
        priceLineVisible: true,
        priceLineWidth: 1,
        priceScaleId: "",
        title: "",
        visible: true,
    });
    lineSeries.setData([
        {time: '2024-12-22', value: 32},
        {time: '2024-12-23', value: 31},
        {time: '2024-12-24', value: 27},
        {time: '2024-12-25', value: 27},
        {time: '2024-12-26', value: 25},
        {time: '2024-12-27', value: 28},
        {time: '2024-12-28', value: 25},
        {time: '2024-12-29', value: 23},
        {time: '2024-12-30', value: 22},
        {time: '2024-12-31', value: 22},
    ]);

    // const candlestickSeries = chart.addSeries(CandlestickSeries, {
    //     upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    //     wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    // });
    // candlestickSeries.setData([
    //     {time: '2024-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72},
    //     {time: '2024-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09},
    //     {time: '2024-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29},
    //     {time: '2024-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50},
    //     {time: '2024-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04},
    //     {time: '2024-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40},
    //     {time: '2024-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25},
    //     {time: '2024-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43},
    //     {time: '2024-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10},
    //     {time: '2024-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26},
    // ]);

    chart.timeScale().fitContent();
    // logo 최소화 숨기기 실행
    const logo = document.getElementById('tv-attr-logo');
    if (logo) {
        logo.style.width = '1px';   // width를 1px로
        logo.style.overflow = 'hidden';
    }

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

// 구글 로그인 훅
const useGoogleAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.authToken) {
                localStorage.setItem('authToken', event.data.authToken);
                setUser(event.data.user); // 필요시 사용자 정보
            }
        };
        window.addEventListener('message', handleMessage);

        checkAuthStatus();
        // URL 파라미터에서 로그인 결과 확인
        handleAuthCallback();

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const checkAuthStatus = async () => {
        const myUrl = `http://49.50.132.4:3000`;
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                console.log('checkAuthStatus 함수 내부: token이 실제 정상 존재합니다! 성공.')
                // 토큰 검증 및 사용자 정보 가져오기
                const response = await fetch(myUrl + '/api/v1/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else {
                    localStorage.removeItem('authToken');
                }
            } else {
                console.log('checkAuthStatus 함수 내부: token이 존재하지 않습니다.. 실패.');
            }
        } catch (err) {
            console.log('checkAuthStatus 함수 내부: token이 존재하지 않는 것 같고 에러가 난 것 같습니다.. 실패.');
            console.error('Auth status check failed:', err);
        }
    };

    const handleAuthCallback = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (token) {
            localStorage.setItem('authToken', token);
            // URL에서 파라미터 제거
            window.history.replaceState({}, document.title, window.location.pathname);
            checkAuthStatus();
        } else if (error) {
            setError(`로그인 실패: ${error}`);
        }
    };

    const initiateGoogleLogin = () => {
        setIsLoading(true);
        setError(null);

        // 환경 변수 설정
        const API_BASE_URL = `http://49.50.132.4:3000`;

        // 현재 페이지 URL을 redirect_uri로 설정
        const currentUrl = window.location.origin + window.location.pathname;
        const authUrl = `${API_BASE_URL}/api/v1/auth/google?redirect_uri=${encodeURIComponent(currentUrl)}`;

        // 팝업으로 로그인 창 열기 (404 에러 방지)
        const popup = window.open(authUrl, 'googleLogin', 'width=500,height=600');

        // 팝업 상태 모니터링
        const checkPopup = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(checkPopup);
                    setIsLoading(false);
                    checkAuthStatus(); // 로그인 상태 재확인
                }
            } catch (err) {
                // 팝업이 다른 도메인으로 리다이렉트되면 접근 불가
                clearInterval(checkPopup);
                setIsLoading(false);
            }
        }, 1000);

        // 타임아웃 설정
        setTimeout(() => {
            if (!popup.closed) {
                popup.close();
                clearInterval(checkPopup);
                setIsLoading(false);
                setError('로그인 시간이 초과되었습니다.');
            }
        }, 60000);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setError(null);
    };

    return {user, isLoading, error, initiateGoogleLogin, logout};
};

// 구글 로그인 버튼 컴포넌트
const GoogleLoginButton = () => {
    const {user, isLoading, error, initiateGoogleLogin, logout} = useGoogleAuth();

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span>&nbsp;.&nbsp;</span>
                    <span>안녕하세요 신규유저님</span>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    <span>&nbsp;.&nbsp;</span>
                    <span>로그아웃</span>
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4"/>
                    {error}
                </div>
            )}
            {/*기존         : disabled={isLoading}*/}
            {/*임시(비활성중): disabled={true}*/}
            <button
                onClick={initiateGoogleLogin}
                disabled={true}
                className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                )}
                <span className="text-gray-700 font-medium">
          {isLoading ? '로그인 중...' : 'Google로 시작하기'}
        </span>
            </button>
        </div>
    );
};

export function TradingDashboard() {


    const [activeTab, setActiveTab] = useState("overview");

    const totalPortfolioValue = portfolioItems.reduce((sum, item) => sum + item.totalValue, 0);
    const totalGain = portfolioItems.reduce((sum, item) => sum + item.gain, 0);
    const totalGainPercent = (totalGain / (totalPortfolioValue - totalGain)) * 100;

    setTimeout(() => {
        console.log(' ');  // 차트 프론트에 보여주기 기능은 임시 비활성화 상태
        myChartFun();
    }, 1300); //1300 == 1.3초임.

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
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                            모의예수금: &#8361;5,000,000
                        </Badge>
                        <GoogleLoginButton/>
                    </div>
                </div>

                {/* Portfolio Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">포트폴리오 자산</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">합산투자금액(예상값)</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">오늘의 등락</CardTitle>
                            {totalGain >= 0 ?
                                <TrendingUp className="h-4 w-4 text-bull"/> :
                                <TrendingDown className="h-4 w-4 text-bear"/>
                            }
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-bull' : 'text-bear'}`}>
                                {totalGain >= 0 ? '+' : ''}${totalGain.toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {totalGain >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">랭킹</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground"/>
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
                        <TabsTrigger value="sboard">컴포넌트-E(종목화면)</TabsTrigger>
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
                        {/* My Stock Chart */}
                        <div className="space-y-6">
                            {/* Debug:Testing chart... */}
                            <div className="space-y-4">
                                <br/>
                                <div id="my-container"></div>
                                <br/>
                            </div>


                        </div>

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

                    <TabsContent value="community">
                        <CommunityHub/>
                    </TabsContent>

                    <TabsContent value="sboard">
                        <StockDashboard/>
                    </TabsContent>
                </Tabs>


            </div>
        </div>
    );
}
