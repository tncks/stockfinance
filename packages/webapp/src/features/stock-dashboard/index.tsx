import {Button} from "@/shared/ui/button";
import {Input} from "@/shared/ui/input";
import {Badge} from "@/shared/ui/badge";
import {ScrollArea} from "@/shared/ui/scroll-area";
import {Bot, Send} from "lucide-react";
import {useEffect, useState} from 'react';
import {supabase} from '@/shared/lib/supabaseClient';
import {Card, CardContent, CardHeader, CardTitle} from '@/shared/ui/card';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/shared/ui/table';


export function BIAssistant() {

    const [inputMessage, setInputMessage] = useState("");

    const handleSendMessage = () => {
        return;


    };



    type Stock = {
        stock_code: string;
        stock_name: string;
    };


    const [stocks, setStocks] = useState<Stock[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchStockData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all columns and all rows from the 'daily_prices' table
                const {data, error: supabaseError} = await supabase
                    .from('daily_prices')
                    .select("종목코드, 종목명");


                console.log('data:');
                console.log(data);
                if (data) {
                    const mapped = data.map((row) => ({
                        stock_code: row["종목코드"],
                        stock_name: row["종목명"],
                    })) as Stock[];
                    console.log('map:');
                    console.log(mapped);
                    setStocks(mapped);
                }

                if (supabaseError) {
                    // If Supabase returns an error, throw it to be caught by the catch block
                    throw supabaseError;
                }

                // if (data) {   // error block
                //     // If data is successfully fetched, update the state
                //     // @ts-ignore
                //     setStocks(data);
                // }  // error block end (troubleshooted)
            } catch (err: any) {
                // If any error occurs during the process, update the error state
                console.error("Error fetching stock data:", err);
                setError(`Failed to load data: ${err.message}`);
            } finally {
                // Whether it succeeds or fails, stop loading
                setLoading(false);
            }
        };

        fetchStockData();
    }, []); // The empty dependency array [] means this effect runs only once on mount


     if (loading) {
         return <div className="p-4">..</div>;
     }

     if (error) {
         return <div className="p-4 text-red-500">{error}</div>;
     }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Custom Dashboard Interface */}
            <Card className="lg:col-span-3 bg-gradient-to-br from-card to-card/80 border-border/50 flex flex-col">
                <CardHeader className="border-b border-border/50">
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 bg-accent/10 rounded-full">
                            <Bot className="h-5 w-5 text-accent"/>
                        </div>
                        BILLY - AI Trading Assistant
                        <Badge variant="secondary" className="ml-auto">Online</Badge>
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-4">



                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stocks != null ? stocks.map((stock) => (
                                        <TableRow key={stock.stock_code}>
                                            <TableCell>
                                                <div className="font-medium">{stock.stock_name}</div>
                                                <div
                                                    className="text-sm text-muted-foreground">{stock.stock_code}</div>
                                            </TableCell>

                                        </TableRow>
                                    )) : 0+0 }
                                </TableBody>
                            </Table>



                        </div>
                    </ScrollArea>

                    <div className="p-6 border-t border-border/50">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ask BILLY about stocks, trading strategies, or market analysis..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage} className="bg-accent hover:bg-accent/90">
                                <Send className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>


        </div>
    );


}