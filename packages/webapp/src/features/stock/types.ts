export const CONSTANTS = {
    DB_TABLES: {
        LIVE_PRICES: "StockLivePrice",
        DAILY_PRICES: "DailyPrices",
    },
    API_KEYS: {
        STOCK_CODE: "종목코드",
        STOCK_NAME: "종목명",
        HIGH_PRICE: "고가",
        LOW_PRICE: "저가",
        BASE_DATE: "기준일자",
    },
} as const;

export type Stock = {
    code: string;
    name: string;
    high: number;
    low: number;
};

export type StockApiResponse = Record<typeof CONSTANTS.API_KEYS[keyof typeof CONSTANTS.API_KEYS], any>;

export type AsyncState<T> = {
    status: "idle" | "loading" | "success" | "error";
    data: T | null;
    error: string | null;
};
