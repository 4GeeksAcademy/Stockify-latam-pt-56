import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

export const Layout = () => {
    return (
        <ScrollToTop>
            <Outlet />
            <footer
                className="text-center py-3"
                style={{ backgroundColor: "white", borderTop: "4px solid #b8860b" }}
            >
                <p className="mb-1 fw-lighter">© 2025 Stockify. Todos los derechos reservados.</p>
                <p className="fw-lighter">Impulsando negocios inteligentes</p>
            </footer>
        </ScrollToTop>
    );
};
