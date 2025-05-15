// 사고 인터페이스
import { AccidentData } from "../../../data/adminData";

interface AccidentCardProps {
    datas: AccidentData;
}

const AccidentCard = ({ datas }: AccidentCardProps) => {
    // 사고 발생 시간과 예상 해결 시간 포맷팅
    const formatTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    // 사고 유형에 따른 배경색 설정
    const getTypeBackgroundColor = (type: string) => {
        switch (type) {
            case "차량고장":
                return "bg-yellow-100";
            case "공사":
                return "bg-blue-100";
            case "추돌사고":
                return "bg-red-100";
            default:
                return "bg-gray-100";
        }
    };

    // 사고 발생일로부터 얼마나 지났는지 계산
    const getTimeElapsed = () => {
        const occurrenceTime = new Date(datas.acdnt_occr_dt).getTime();
        const currentTime = new Date().getTime();
        const elapsedMs = currentTime - occurrenceTime;

        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const minutes = Math.floor(
            (elapsedMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (hours > 0) {
            return `${hours}시간 ${minutes}분 전`;
        }
        return `${minutes}분 전`;
    };

    // 남은 시간 계산
    const getTimeRemaining = () => {
        const clearTime = new Date(datas.exp_clr_dt).getTime();
        const currentTime = new Date().getTime();
        const remainingMs = clearTime - currentTime;

        if (remainingMs <= 0) {
            return "해결 완료";
        }

        const hours = Math.floor(remainingMs / (1000 * 60 * 60));
        const minutes = Math.floor(
            (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
        );

        if (hours > 0) {
            return `${hours}시간 ${minutes}분 남음`;
        }
        return `${minutes}분 남음`;
    };

    return (
        <div
            className="border-l-4 border-gray-300 bg-white p-3 mb-2 hover:bg-gray-50 transition-colors duration-200"
            style={{
                borderLeftColor:
                    datas.acdnt_type === "차량고장"
                        ? "#FBBF24"
                        : datas.acdnt_type === "공사"
                          ? "#60A5FA"
                          : datas.acdnt_type === "추돌 사고"
                            ? "#EF4444"
                            : "#9CA3AF",
            }}
        >
            {/* 헤더 영역: 지역명과 타입 */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">
                        {datas.area_nm}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                        {datas.acdnt_dtype}
                    </span>
                </div>
                <span className="text-xs text-gray-500">
                    {getTimeElapsed()}
                </span>
            </div>

            {/* 사고 정보 */}
            <p className="text-sm text-gray-700 mb-2">{datas.acdnt_info}</p>

            {/* 시간 정보와 상태 */}
            <div className="flex items-center justify-between text-xs">
                <div className="flex gap-3">
                    <span>발생: {formatTime(datas.acdnt_occr_dt)}</span>
                    <span>예상해결: {formatTime(datas.exp_clr_dt)}</span>
                </div>
                <span className="text-green-600 font-medium">
                    {getTimeRemaining()}
                </span>
            </div>
        </div>
    );
};

export default AccidentCard;
