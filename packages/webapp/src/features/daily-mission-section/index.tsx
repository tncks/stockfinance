import React from "react";
import {Card, CardContent} from "@/shared/ui/card";
import {Button} from "@/shared/ui/button";

interface DailyMissionSectionProps {
    userName?: string;
    dayCount?: number;
}

export function DailyMissionSection({
                                        userName = "길동",
                                        dayCount = 1,
                                    }: DailyMissionSectionProps) {
    return (
        <div>

            {/*<div>*/}
            {/*    <p>Today-Course</p>*/}
            {/*</div>*/}
            {/* Mission Card */}
            <Card className="mt-8 bg-orange-50 border-none overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex justify-between items-center p-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">오늘의 MISSION</h3>
                            <p className="text-sm text-gray-700">
                                이전 첫번째 lesson, 금융 관련 주식 뉴스 찾아보고 3개 사보기
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200&q=80"
                                alt="Mission Character"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stock Terms Card */}
            <Card className="bg-orange-50 border-none overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex justify-between items-center p-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">오늘의 주식 용어</h3>
                            <p className="text-sm text-gray-700">
                                주식? 매도? 무슨 뜻일까? 찾아보러 가기
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=bear1"
                                alt="Stock Terms Character"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Article Card */}
            <Card className="bg-orange-50 border-none overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex justify-between items-center p-4">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">오늘의 ARTICLE</h3>
                            <p className="text-sm text-gray-700">
                                주식과 관련된 아티클 보러가기
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=bear2"
                                alt="Article Character"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
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
