import { z } from "zod"

export const tradeOrderSchema = z.object({
  symbol: z.string().min(1, "Please select a stock"),
  quantity: z.string()
    .min(1, "Quantity is required")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 10000, {
      message: "Quantity must be between 1 and 10,000 shares"
    }),
  price: z.string()
    .optional()
    .transform((val) => val ? parseFloat(val) : undefined)
    .refine((val) => val === undefined || (val > 0 && val <= 50000), {
      message: "Price must be between $0.01 and $50,000"
    }),
  orderType: z.enum(["market", "limit"]),
  action: z.enum(["buy", "sell"])
})

export type TradeOrder = z.infer<typeof tradeOrderSchema>