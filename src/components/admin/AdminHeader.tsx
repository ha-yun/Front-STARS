import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
    path: string;
}

export default function AdminHeader({ path }: Props) {
    const navigate = useNavigate();

    return (
        <div className="bg-white px-4 sm:px-6 py-4 flex items-center relative">
            <button
                className="absolute left-2 sm:left-6 bg-white shadow-md px-2 sm:px-4 py-2 text-indigo-500 font-semibold hover:bg-indigo-500 hover:text-white transition rounded-md"
                onClick={() => {
                    navigate(path);
                }}
            >
                <span className="inline-block text-xl"> ← </span>
                <span className="hidden sm:inline-block ml-1">돌아가기</span>
            </button>
            <h1 className="text-xl sm:text-2xl text-center font-bold text-gray-600 w-full">
                STARS 관리자 통합 화면
            </h1>
        </div>
    );
}
