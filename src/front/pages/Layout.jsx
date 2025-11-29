import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

export const Layout = () => {
    return (
        <ScrollToTop>
            <Outlet />
        </ScrollToTop>
    );
};
