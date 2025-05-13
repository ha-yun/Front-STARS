import React from "react";

interface CongestionTagProps {
    level: string;
    size?: "sm" | "md" | "lg";
}

const CongestionTag: React.FC<CongestionTagProps> = ({
    level,
    size = "md",
}) => {
    // 혼잡도 레벨에 따른 스타일 결정
    const getTagStyle = () => {
        switch (level) {
            case "여유":
                return "bg-green-100 text-green-800 border-green-400";
            case "보통":
                return "bg-yellow-100 text-yellow-800 border-yellow-400";
            case "약간 붐빔":
                return "bg-orange-100 text-orange-800 border-orange-400";
            case "붐빔":
                return "bg-red-100 text-red-800 border-red-400";
            default:
                return "bg-gray-100 text-gray-800 border-gray-400";
        }
    };

    // 사이즈에 따른 패딩과 폰트 크기 설정
    const getSizeStyle = () => {
        switch (size) {
            case "sm":
                return "text-xs py-0.5 px-2";
            case "lg":
                return "text-base py-1.5 px-4";
            case "md":
            default:
                return "text-sm py-1 px-3";
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border ${getTagStyle()} ${getSizeStyle()} font-medium`}
        >
            <span
                className={`mr-1 h-2 w-2 rounded-full ${level === "여유" ? "bg-green-500" : level === "보통" ? "bg-yellow-500" : level === "약간 붐빔" ? "bg-orange-500" : "bg-red-500"}`}
            ></span>
            {level}
        </span>
    );
};

export default CongestionTag;
