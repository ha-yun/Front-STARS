import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import { events } from "../../data/adminTourData";

interface TourList {
    category: string;
    gu: string;
    title: string;
    start_date: string;
    end_date: string;
    is_free: boolean;
}

const AdminTour = () => {
    // 초기 상태를 빈 배열로 설정
    const [list, setList] = useState<TourList[]>([]);

    useEffect(() => {
        // 데이터 로드 직전에 콘솔 로그
        console.log("AdminTour 컴포넌트 마운트 - 데이터 로드 시작");
        console.log("원본 이벤트 데이터:", events);

        if (events && events.length > 0) {
            const tourData = events.map((e) => ({
                category: e.category,
                gu: e.gu,
                title: e.title,
                start_date: e.start_date,
                end_date: e.end_date,
                is_free: e.is_free !== "유료",
            }));

            console.log("변환된 데이터:", tourData);
            setList(tourData);
        } else {
            console.warn("이벤트 데이터가 비어있거나 정의되지 않았습니다.");
        }
    }, []);

    // 렌더링 직전 상태 확인
    console.log("현재 list 상태:", list);

    // 테이블 헤더 및 열 이름 정의
    const tableHeaders = [
        "카테고리",
        "지역구",
        "제목",
        "시작일",
        "종료일",
        "요금",
    ];

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col w-full overflow-y-auto">
            {/* Header */}
            <AdminHeader path={"/manage"} />
            {/* End of Header */}

            {/* Main Container */}
            <div className="flex flex-col p-4">
                <div className="bg-white rounded-lg shadow p-4 w-full">
                    <h2 className="text-xl font-semibold mb-4">
                        문화 행사 목록 ({list.length}개)
                    </h2>

                    {/* 데이터 없음 표시 */}
                    {list.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            데이터를 불러오는 중이거나 사용 가능한 데이터가
                            없습니다.
                        </div>
                    )}

                    {/* 데이터 있을 때만 테이블 표시 */}
                    {list.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {tableHeaders.map((header, index) => (
                                            <th
                                                key={index}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {list.map((item, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                index % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-gray-50"
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.category}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.gu}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.start_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {item.end_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        item.is_free
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {item.is_free
                                                        ? "무료"
                                                        : "유료"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
    if (!dateString) return "날짜 없음";

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch (error) {
        return error; // 오류 발생 시 원본 문자열 반환
    }
};

export default AdminTour;
