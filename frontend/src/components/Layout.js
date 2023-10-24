import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { SnackbarProvider } from "notistack";

function Layout({ isProtected = true }) {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (isProtected && !user.isAuthenticated) {
            navigate('/login');
        }
    }, [isProtected, user, navigate]);

    return (!isProtected || user.isAuthenticated) ? (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <Outlet />
            <Footer />
        </div>
    ) : <span>Vous devez être connecté pour accéder à cette page</span>;
}

export default Layout;