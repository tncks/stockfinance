import { PrismaClient } from '@prisma/client';

let myprisma: PrismaClient;





async function simplemain() {
    myprisma = new PrismaClient();
    const fetchedTestData = await myprisma.stockInfo.findMany({
        take: 1
    });
    if (fetchedTestData) {
        console.log(fetchedTestData[0]);
    }
}

simplemain();


// (프론트 예시)   (packages/webapp여기맞겟지경로?)
// 나중에 이 작업 해주면 됨. 아무데나 컴포넌트 만들고 연결해주면, 테이블 이쁘게
// (나올거임)
//
//
//
// // src/components/StockTable.tsx
// import { useEffect, useState } from 'react';
//
// type Stock = {
//     stockCodeKr: string;
//     stockCode: string;
//     stockName: string;
//     stockShort: string;
//     stockNameEn: string;
//     listingDate: string; // BigInt -> string
//     marketType: string;
//     securityType: string;
//     dept: string;
//     stockClass: string;
//     faceValue: string; // BigInt -> string
//     listedShares: string; // BigInt -> string
// };
//
// export default function StockTable() {
//     const [stocks, setStocks] = useState<Stock[]>([]);
//
//     useEffect(() => {
//         async function fetchData() {
//             const res = await fetch('/api/stock-info'); // 백엔드에서 JSON 반환
//             const data = await res.json();
//
//             // BigInt를 문자열로 변환
//             const formatted = data.map((item: any) => ({
//                 ...item,
//                 listingDate: item.listingDate.toString(),
//                 faceValue: item.faceValue.toString(),
//                 listedShares: item.listedShares.toString(),
//             }));
//             setStocks(formatted);
//         }
//         fetchData();
//     }, []);
//
//     return (
//         <div className="overflow-x-auto">
//         <table className="min-w-full table-auto border border-gray-300">
//         <thead className="bg-gray-100">
//         <tr>
//             <th className="px-4 py-2 border">Stock Code KR</th>
//     <th className="px-4 py-2 border">Stock Code</th>
//     <th className="px-4 py-2 border">Stock Name</th>
//     <th className="px-4 py-2 border">Stock Short</th>
//     <th className="px-4 py-2 border">Listing Date</th>
//     <th className="px-4 py-2 border">Face Value</th>
//     <th className="px-4 py-2 border">Listed Shares</th>
//     </tr>
//     </thead>
//     <tbody>
//     {stocks.map((s) => (
//             <tr key={s.stockCode}>
//             <td className="px-4 py-2 border">{s.stockCodeKr}</td>
//                 <td className="px-4 py-2 border">{s.stockCode}</td>
//             <td className="px-4 py-2 border">{s.stockName}</td>
//             <td className="px-4 py-2 border">{s.stockShort}</td>
//             <td className="px-4 py-2 border">{s.listingDate}</td>
//             <td className="px-4 py-2 border">{s.faceValue}</td>
//             <td className="px-4 py-2 border">{s.listedShares}</td>
//             </tr>
// ))}
//     </tbody>
//     </table>
//     </div>
// );
// }




// api 라우터 쪽 코드는 따로
// 이렇게 잡아주면 됨 (packages/server)

// 백엔드 예시  (.js or .ts)
// app.get('/api/stock-info', async (req, res) => {
//     const data = await prisma.stockInfo.findMany({ take: 1 });
//     res.json(
//         data.map(item => ({
//             ...item,   // 아래 3개 제외하고, 나머지 전체 컬럼을 의미. 아래 3개 컬럼은 전처리가 따로 들어감..
//             listingDate: item.listingDate?.toString(),
//             faceValue: item.faceValue?.toString(),
//             listedShares: item.listedShares?.toString(),
//         }))
//     );
// });