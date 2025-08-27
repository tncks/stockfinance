import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";
import {Textarea} from "@/shared/ui/textarea";
import {Badge} from "@/shared/ui/badge";
import {Avatar, AvatarFallback} from "@/shared/ui/avatar";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/ui/tabs";
import {MessageSquare, TrendingUp, TrendingDown, Heart, Share} from "lucide-react";
import {toast} from "sonner";
export function OrderBookTable({ data }) {
    return (
        <table className="w-full text-right border border-gray-300 border-collapse">
            <thead>
            <tr>
                <th colSpan={2} className="text-red-600">매도잔량</th>
                <th className="font-bold text-red-600">호가</th>
                <th colSpan={2} className="text-blue-600">매수잔량</th>
            </tr>
            </thead>
            <tbody>
            {data.map(({ askVol, askPrice, bidVol, bidPrice }, idx) => (
                <tr key={idx}>
                    <td className="px-2 py-1 text-sm">{askVol.toLocaleString()}</td>
                    <td className="px-2 py-1 font-semibold text-red-600">{askPrice.toLocaleString()}</td>
                    <td className="px-2 py-1 font-semibold text-blue-600">{bidPrice.toLocaleString()}</td>
                    <td className="px-2 py-1 text-sm">{bidVol.toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}