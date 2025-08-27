import { useState, useEffect } from "react";
import { stockService } from "./service";
import { Stock, AsyncState } from "./types";

export function useStockList() {
    const [state, setState] = useState<AsyncState<Stock[]>>({
        status: "idle",
        data: null,
        error: null,
    });

    useEffect(() => {
        setState((s) => ({ ...s, status: "loading", data: null }));
        stockService.getStocks()
            .then((data) => {
                setState({ status: "success", data, error: null });
            })
            .catch((error) => {
                setState({ status: "error", data: null, error: error.message });
            });
    }, []);

    return state;
}
