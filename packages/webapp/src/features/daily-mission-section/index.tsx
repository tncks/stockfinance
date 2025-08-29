import React from "react";
import {Card, CardContent} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";


interface DailyMissionSectionProps {
    title: string;
    description: string;
    backgroundColor: string;
    textColor?: string;
}
export function DailyMissionSection({ title, description, backgroundColor, textColor = "text-gray-700" }: DailyMissionSectionProps) {
    return (
        <Card className={`${backgroundColor} border-none shadow-sm cursor-pointer hover:shadow-md transition-all duration-200`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-2 ${textColor}`}>{title}</h3>
                        <p className={`text-sm ${textColor}`}>{description}</p>
                    </div>
                    <div className="ml-4">
                        <img src="https://placehold.co/150x60/FF0000/FFFFFF?text=MyLogo" alt={title} className="w-16 h-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
//
// {/* Welcome Message */}
// <div className="space-y-2">
//     <h1 className="text-2xl font-bold">안녕하세요, {userName}님!</h1>
//     <h2 className="text-xl font-bold">주식 잠수 {dayCount}일차에요!</h2>
//     <p className="text-gray-600">오늘의 미션에 도전해 봐요!</p>
// </div>
//
//
// {/* Start Button and Link */}
// <div className="flex justify-between items-center">
//     <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-md">
//         시작하기
//     </Button>
//     <div className="text-purple-600 font-medium">연 쓴 리니</div>
// </div>
