import { useMemo, useState } from "react";

interface SearchDataItem {
    id?: number;
    name: string;
    category: string;
    address: string;
}

interface MenuProps {
    isOpen: boolean;
    searchData?: SearchDataItem[];
}

type DropdownType = "category" /* | "gender" | "age" */ | null;

// ✅ 카테고리 매핑 (영문 → 한글)
const categoryMap: Record<string, string> = {
    accommodation: "숙박",
    attraction: "관광명소",
    cafe: "카페",
    restaurant: "음식점",
    culturalevent: "문화행사",
};

const categoryColorMap: Record<string, string> = {
    숙박: "text-blue-700",
    관광명소: "text-green-700",
    카페: "text-pink-700",
    음식점: "text-yellow-700",
    문화행사: "text-purple-700",
};

const reverseCategoryMap: Record<string, string> = Object.entries(
    categoryMap
).reduce(
    (acc, [key, value]) => {
        acc[value] = key;
        return acc;
    },
    {} as Record<string, string>
);

export default function Menu({ isOpen, searchData }: MenuProps) {
    const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
    const [selectedCategory, setSelectedCategory] =
        useState<string>("카테고리");

    // ✅ 필터링된 더미 데이터
    // 필터 적용된 데이터 (검색결과가 있으면 그걸 기준으로 카테고리 필터)
    const dataToShow = useMemo(() => {
        if (!searchData || searchData.length === 0) return [];

        return searchData.filter((item) => {
            return (
                selectedCategory === "카테고리" ||
                item.category === reverseCategoryMap[selectedCategory]
            );
        });
    }, [searchData, selectedCategory]);
    return (
        <div
            className={`absolute md:top-28 top-24 max-h-[80vh] md:w-96 w-11/12 bg-white shadow-lg rounded-2xl transition-transform duration-300 z-20 ${
                isOpen
                    ? "translate-x-6 opacity-100 pointer-events-auto"
                    : "-translate-x-full pointer-events-none"
            }`}
        >
            <div className="p-4 h-full flex flex-col overflow-y-auto min-h-[30vh] max-h-[80vh]">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-4 sticky top-0 z-10">
                    <div className="flex items-center">
                        <img
                            src="/aiImage.png"
                            alt="추천 명소 아이콘"
                            className="w-6 h-6 mr-2"
                        />
                        <h2 className="text-lg font-bold text-gray-800">
                            추천 명소
                        </h2>
                    </div>

                    <div className="flex gap-2">
                        {renderDropdown(
                            "카테고리",
                            openDropdown === "category",
                            () =>
                                setOpenDropdown(
                                    openDropdown === "category"
                                        ? null
                                        : "category"
                                ),
                            selectedCategory,
                            (v) => setSelectedCategory(v),
                            [
                                "카테고리",
                                "숙박",
                                "관광명소",
                                "카페",
                                "음식점",
                                "문화행사",
                            ]
                        )}

                        {/* 성별, 나이 필터 주석 처리 */}
                        {/*
                        {renderDropdown(... 성별 ...)}
                        {renderDropdown(... 나이 ...)}
                        */}
                    </div>
                </div>

                {/* 리스트 */}
                <ul className="overflow-y-auto">
                    {dataToShow.length === 0 ? (
                        (!searchData || searchData.length === 0) &&
                        selectedCategory === "카테고리" ? (
                            [
                                <li
                                    key="guide-1"
                                    className="py-4 mt-6 text-xl text-gray-600 text-center"
                                >
                                    반가워요 또 찾아주셨네요.
                                </li>,
                                <li
                                    key="guide-2"
                                    className="py-4 text-base text-gray-400 text-center"
                                >
                                    장소를 입력하여 찾아주세요!
                                </li>,
                            ]
                        ) : (
                            <li className="py-4 text-base text-gray-500 text-center">
                                조건에 맞는 명소가 없습니다.
                            </li>
                        )
                    ) : (
                        dataToShow.map((item, idx) => (
                            <li
                                key={
                                    item.id ??
                                    `${item.name}-${item.address}-${idx}`
                                }
                                className="py-6 border-b flex items-center"
                            >
                                <div className="flex-[3] flex flex-col items-center justify-center text-center">
                                    <div className="font-semibold text-gray-800 text-lg">
                                        {item.name}
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1">
                                        {item.address}
                                    </div>
                                </div>

                                <div
                                    className={`
            flex-[1] flex items-center justify-center text-sm px-2 py-1 rounded
            ${categoryColorMap[categoryMap[item.category] ?? item.category] ?? "text-gray-700"}
        `}
                                >
                                    {categoryMap[item.category] ??
                                        item.category}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

// 공통 드롭다운 함수
function renderDropdown(
    placeholder: string,
    isOpen: boolean,
    toggleOpen: () => void,
    selected: string,
    setSelected: (value: string) => void,
    options: string[]
) {
    return (
        <div className="relative">
            <div
                onClick={toggleOpen}
                className="flex items-center justify-between text-gray-700 cursor-pointer text-sm transition"
            >
                {selected}
                <svg
                    className="w-3 h-3 ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </div>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-gray-50 shadow-lg rounded-md z-10">
                    <ul className="py-1 text-sm text-gray-700">
                        {options.map((item, index) => (
                            <li
                                key={item}
                                className={`px-3 py-1 hover:bg-gray-200 cursor-pointer ${
                                    index === 0
                                        ? "border-b border-gray-300"
                                        : ""
                                }`}
                                onClick={() => {
                                    setSelected(item);
                                    toggleOpen();
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
