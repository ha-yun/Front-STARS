import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import { getEventList } from "../../api/starsApi";

interface TourList {
    category: string;
    gu: string;
    event_name: string;
    start_date: string;
    end_date: string;
    is_free: boolean;
}

interface GetTourList {
    category: string;
    address: string;
    event_name: string;
    start_date: string;
    end_date: string;
    event_fee: string;
}

const AdminTour = () => {
    // 상태 관리
    const [list, setList] = useState<TourList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // 데이터 로드 함수
    const fetchEvents = async () => {
        setLoading(true);
        setError(null);

        try {
            const response: GetTourList[] = await getEventList();

            // 데이터 변환
            if (response && response.length > 0) {
                const tourData: TourList[] = response.map((e) => ({
                    category: e.category,
                    gu: e.address,
                    event_name: e.event_name,
                    start_date: e.start_date,
                    end_date: e.end_date,
                    is_free: e.event_fee === "",
                }));

                setList(tourData);
            } else {
                setError("이벤트 데이터가 비어있거나 정의되지 않았습니다.");
            }
        } catch (err) {
            console.error("Failed to fetch events:", err);
            setError("문화 행사 데이터를 불러오는데 실패했습니다.");
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        console.log("Tour Info component mounted");
        fetchEvents();
    }, []);

    // 필터링 로직
    const filteredList = list.filter((item) => {
        const matchesCategory = filterCategory
            ? item.category === filterCategory
            : true;
        const matchesSearch = searchTerm
            ? item.event_name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        return matchesCategory && matchesSearch;
    });

    // 고유한 카테고리 목록 추출
    const categories = Array.from(new Set(list.map((item) => item.category)));

    // 로딩 스켈레톤 컴포넌트
    const TableRowSkeleton = () => (
        <tr className="animate-pulse">
            <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
            </td>
            <td className="px-2 md:px-4 py-3 whitespace-nowrap">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
            </td>
        </tr>
    );

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col w-full overflow-y-auto">
            {/* Header */}
            <AdminHeader path={"/manage"} />
            {/* End of Header */}

            {/* Main Container */}
            <div className="flex flex-col p-4">
                {/* 에러 메시지 표시 */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                        <strong className="font-bold">오류 발생!</strong>
                        <span className="block sm:inline"> {error}</span>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                            onClick={() => fetchEvents()}
                        >
                            재시도
                        </button>
                    </div>
                )}

                {/* 필터 섹션 */}
                <div className="bg-white rounded-lg shadow p-3 w-full mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* 카테고리 필터 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                카테고리
                            </label>
                            <select
                                className="w-full p-1.5 bg-white text-black text-sm border border-gray-300 rounded-md"
                                value={filterCategory}
                                onChange={(e) =>
                                    setFilterCategory(e.target.value)
                                }
                            >
                                <option value="">전체 카테고리</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 제목 검색 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                제목 검색
                            </label>
                            <input
                                type="text"
                                placeholder="행사 제목 검색..."
                                className="w-full p-1.5 text-sm border bg-white text-black border-gray-300 rounded-md"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* 필터 리셋 및 새로고침 버튼 */}
                        <div className="flex items-end space-x-2">
                            <button
                                className="bg-gray-500 hover:bg-gray-700 text-white text-sm py-1.5 px-3 rounded"
                                onClick={() => {
                                    setFilterCategory("");
                                    setSearchTerm("");
                                }}
                            >
                                초기화
                            </button>
                            <button
                                className={`flex items-center bg-blue-500 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={fetchEvents}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        새로고침
                                    </>
                                ) : (
                                    "새로고침"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 문화 행사 목록 테이블 */}
                <div className="bg-white rounded-lg shadow p-4 w-full">
                    <h2 className="text-xl font-semibold mb-4">
                        문화 행사 목록
                        <span className="text-gray-500 text-base ml-2">
                            총 {list.length}개 중 {filteredList.length}개 표시
                            중
                        </span>
                        {loading && (
                            <span className="text-sm text-blue-500 font-normal ml-2 flex items-center inline-flex">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                로딩 중
                            </span>
                        )}
                    </h2>

                    {/* 로딩 중 && 데이터 없음 표시 */}
                    {loading && list.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            데이터를 불러오는 중입니다...
                        </div>
                    )}

                    {/* 필터링 후 결과 없음 */}
                    {!loading && filteredList.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {list.length > 0
                                ? "검색 조건에 맞는 행사가 없습니다."
                                : "사용 가능한 행사 데이터가 없습니다."}
                        </div>
                    )}

                    {/* 데이터 테이블 - 스크롤 기능 개선 */}
                    <div className="relative">
                        {/* 테이블 헤더 - 고정 */}
                        <div className="overflow-x-auto">
                            <table className="w-full table-fixed">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="w-16 md:w-24 px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            카테고리
                                        </th>
                                        <th className="w-16 md:w-24 px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            장소
                                        </th>
                                        <th className="w-32 md:w-48 px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            제목
                                        </th>
                                        <th className="w-20 md:w-28 px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            시작일
                                        </th>
                                        <th className="w-20 md:w-28 px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            종료일
                                        </th>
                                        <th className="w-16 px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            요금
                                        </th>
                                    </tr>
                                </thead>
                            </table>
                        </div>

                        {/* 테이블 본문 - 스크롤 */}
                        <div
                            className="overflow-x-auto overflow-y-auto"
                            style={{ maxHeight: "500px" }}
                        >
                            <table className="w-full table-fixed">
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading && list.length === 0
                                        ? // 로딩 스켈레톤
                                          [...Array(10)].map((_, index) => (
                                              <TableRowSkeleton key={index} />
                                          ))
                                        : // 실제 데이터
                                          filteredList.map((item, index) => (
                                              <tr
                                                  key={index}
                                                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition-colors`}
                                              >
                                                  <td className="w-16 md:w-24 px-2 md:px-4 py-3 text-sm text-gray-900 truncate">
                                                      {item.category}
                                                  </td>
                                                  <td className="w-16 md:w-24 px-2 md:px-4 py-3 text-sm text-gray-900 truncate">
                                                      {item.gu}
                                                  </td>
                                                  <td className="w-32 md:w-48 px-2 md:px-4 py-3 text-sm text-gray-900 font-medium truncate">
                                                      <div
                                                          className="truncate max-w-xs"
                                                          title={
                                                              item.event_name
                                                          }
                                                      >
                                                          {item.event_name}
                                                      </div>
                                                  </td>
                                                  <td className="w-20 md:w-28 px-2 md:px-4 py-3 text-sm text-gray-900 truncate">
                                                      {formatDate(
                                                          item.start_date
                                                      )}
                                                  </td>
                                                  <td className="w-20 md:w-28 px-2 md:px-4 py-3 text-sm text-gray-900 truncate">
                                                      {formatDate(
                                                          item.end_date
                                                      )}
                                                  </td>
                                                  <td className="w-16 px-2 md:px-4 py-3 text-sm text-gray-900">
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
                    </div>
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
        console.error("날짜 형식 변환 오류:", error);
        return dateString; // 오류 발생 시 원본 문자열 반환
    }
};

export default AdminTour;
