// UserFavorite.tsx
import React from "react";

const UserFavorite = () => {
    // 샘플 즐겨찾기 데이터
    const favorites = [
        {
            id: 1,
            name: "애플 맥북 프로 16인치",
            price: "2,900,000원",
            date: "2023-11-10",
        },
        {
            id: 2,
            name: "삼성 갤럭시 S23 울트라",
            price: "1,400,000원",
            date: "2023-12-05",
        },
        {
            id: 3,
            name: "소니 WH-1000XM5 헤드폰",
            price: "390,000원",
            date: "2024-01-15",
        },
    ];

    return (
        <div className="p-4">
            {favorites.length > 0 ? (
                <div className="space-y-4">
                    {favorites.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                            <p className="font-medium text-gray-800">
                                {item.name}
                            </p>
                            <div className="flex justify-between mt-2">
                                <p className="text-gray-600">{item.price}</p>
                                <p className="text-gray-500 text-sm">
                                    등록일: {item.date}
                                </p>
                            </div>
                            <button className="mt-3 text-indigo-500 text-sm hover:text-indigo-700 transition-colors">
                                삭제하기
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 p-4 text-center">
                    즐겨찾기 항목이 없습니다.
                </p>
            )}

            <div className="mt-4 text-center">
                <p className="text-gray-600 mb-2">
                    총 {favorites.length}개의 즐겨찾기 항목이 있습니다.
                </p>
                <button className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition-colors">
                    모두 비우기
                </button>
            </div>
        </div>
    );
};

export default UserFavorite;
