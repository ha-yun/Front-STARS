import { useState, useMemo } from "react";
import { menuDummyData, MenuItem } from "../../../data/menuDummyData";

interface MenuProps {
    isOpen: boolean;
}

export default function Menu({ isOpen }: MenuProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [genderOpen, setGenderOpen] = useState(false);
    const [ageOpen, setAgeOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] =
        useState<string>("카테고리");
    const [selectedGender, setSelectedGender] = useState<string>("성별");
    const [selectedAge, setSelectedAge] = useState<string>("나이");

    const filteredData = useMemo(() => {
        return menuDummyData.filter((item) => {
            const categoryMatch =
                selectedCategory === "카테고리" ||
                item.category === selectedCategory;
            const genderMatch =
                selectedGender === "성별" ||
                item.preferredGender === selectedGender;
            const ageMatch =
                selectedAge === "나이" ||
                item.preferredAgeGroup === selectedAge;
            return categoryMatch && genderMatch && ageMatch;
        });
    }, [selectedCategory, selectedGender, selectedAge]);

    return (
        <div
            className={`absolute top-28 w-96 bg-white shadow-lg rounded-2xl bg-opacity-90 transition-transform duration-300 z-20 ${
                isOpen
                    ? "translate-x-6 opacity-100 pointer-events-auto"
                    : "-translate-x-full pointer-events-none"
            }`}
        >
            <div className="p-4 max-h-[80vh] flex flex-col">
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
                            categoryOpen,
                            setCategoryOpen,
                            selectedCategory,
                            setSelectedCategory,
                            [
                                "카테고리",
                                "카페",
                                "학교",
                                "공원",
                                "행사",
                                "음식점",
                                "펍",
                                "관광지",
                                "테마파크",
                                "쇼핑몰",
                                "산책로",
                            ]
                        )}
                        {renderDropdown(
                            "성별",
                            genderOpen,
                            setGenderOpen,
                            selectedGender,
                            setSelectedGender,
                            ["성별", "남성", "여성"]
                        )}
                        {renderDropdown(
                            "나이",
                            ageOpen,
                            setAgeOpen,
                            selectedAge,
                            setSelectedAge,
                            [
                                "나이",
                                "10대",
                                "20대",
                                "30대",
                                "40대",
                                "50대",
                                "60대",
                                "70대",
                                "80대",
                            ]
                        )}
                    </div>
                </div>

                {/* 리스트 */}
                <ul className="overflow-y-auto">
                    {filteredData.length === 0 ? (
                        <li className="py-4 text-base text-gray-500 text-center">
                            조건에 맞는 명소가 없습니다.
                        </li>
                    ) : (
                        filteredData.map((item: MenuItem) => (
                            <li
                                key={item.id}
                                className="py-6 border-b flex justify-center items-center"
                            >
                                <div className="text-center flex-1">
                                    <div className="font-semibold text-gray-800 text-xl">
                                        {item.name}
                                    </div>
                                    <div className="text-gray-600 text-lg mt-1">
                                        {item.address}
                                    </div>
                                </div>
                                <div className="text-center items-center text-gray-500 flex-1 flex-col mr-2">
                                    <div className="text-sm">
                                        {item.category}
                                    </div>
                                    <div className="text-sm mt-1">
                                        {item.preferredGender}{" "}
                                        {item.preferredAgeGroup} 선호
                                    </div>
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
    setOpen: (open: boolean) => void,
    selected: string,
    setSelected: (value: string) => void,
    options: string[]
) {
    return (
        <div className="relative">
            <div
                onClick={() => setOpen(!isOpen)}
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
                                    setOpen(false);
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
