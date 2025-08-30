import React from "react";

export function GreetingCard() {
    return (
        <div
            className="bg-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
                <p className="text-lg font-bold text-gray-900 mb-1">안녕하세요, 주리니님!</p>
                <p className="text-2xl font-extrabold text-gray-900 mb-3">주식 잠수 {1}일차에요!</p>
                <p className="text-sm text-gray-600">오늘의 미션에 도전해 봐요!</p>
                <button
                    className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition duration-300 ease-in-out shadow-md">
                    시작하기
                </button>
            </div>
            <div
                className="relative p-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium whitespace-nowrap">
                장식
                <div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-purple-200 rounded-full opacity-50"></div>
            </div>
        </div>
    );
}

