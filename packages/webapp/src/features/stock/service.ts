import { supabase } from "@/shared/lib/supabaseClient.ts";
import { CONSTANTS, Stock, StockApiResponse } from "./types";

export const stockService = {
    async getStocks(): Promise<Stock[]> {
        const { data, error } = await supabase
            .from(CONSTANTS.DB_TABLES.LIVE_PRICES)
            .select("종목코드,종목명,고가,저가")
            .order("종목명");

        if (error) throw new Error(error.message);
        if (!data) throw new Error("주식 목록 데이터가 없습니다.");

        return data.map(this.transformStock);
    },

    transformStock(apiStock: StockApiResponse): Stock {
        return {
            code: apiStock[CONSTANTS.API_KEYS.STOCK_CODE],
            name: apiStock[CONSTANTS.API_KEYS.STOCK_NAME],
            high: apiStock[CONSTANTS.API_KEYS.HIGH_PRICE],
            low: apiStock[CONSTANTS.API_KEYS.LOW_PRICE],
        };
    },
};
