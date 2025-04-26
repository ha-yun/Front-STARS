import { useEffect } from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import MapSection from "../pages/stars/MapSectionPage";
import Dashboard from "../pages/stars/DashboardPage";
import AdminLogin from "../pages/admin/AdminLoginPage";

export default function FullPageLayout() {
    useEffect(() => {
        const disableScroll = () => {
            if (window.fullpage_api) {
                window.fullpage_api.setAllowScrolling(false);
                window.fullpage_api.setKeyboardScrolling(false);
            }
        };
        setTimeout(disableScroll, 500);
    }, []);

    return (
        <ReactFullpage
            scrollingSpeed={700}
            controlArrows={false}
            credits={{ enabled: false }}
            render={() => (
                <ReactFullpage.Wrapper>
                    <div className="section">
                        <div className="slide">
                            <MapSection />
                        </div>
                        <div className="slide">
                            <AdminLogin />
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
