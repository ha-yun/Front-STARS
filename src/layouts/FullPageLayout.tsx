import { useEffect } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import MapSection from "../pages/stars/MapSectionPage";
import Dashboard from "../pages/stars/DashboardPage";
import { initializeAppHeight } from "../utils/setAppHeight";
import MyPage from "../components/user/MyPage";

export default function FullPageLayout() {
    useEffect(() => {
        initializeAppHeight();

        const disableScroll = () => {
            if (window.fullpage_api) {
                window.fullpage_api.setAllowScrolling(false); // 마우스/터치 스크롤 차단
                window.fullpage_api.setKeyboardScrolling(false); // 키보드 방향키 이동 차단
            }
        };
        setTimeout(disableScroll, 500); // fullpage.js가 초기화된 이후 적용
    }, []);

    return (
        <ReactFullpage
            autoScrolling={true} // fullpage.js가 스크롤 제어
            scrollingSpeed={700} // 섹션 이동 속도
            controlArrows={false} // 슬라이드 이동 화살표 비활성화
            scrollOverflow={false} // 내부 overflow 스크롤 비활성화
            credits={{ enabled: false }} // fullpage.js 하단 워터마크 제거
            render={() => (
                <ReactFullpage.Wrapper>
                    <div className="section">
                        <div className="slide">
                            <MapSection />
                        </div>
                        <div className="slide">
                            <MyPage />
                        </div>
                    </div>
                    <div className="section">
                        <Dashboard />
                    </div>
                </ReactFullpage.Wrapper>
            )}
        />
    );
}
