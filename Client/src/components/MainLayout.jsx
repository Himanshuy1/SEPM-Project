import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
    return (
        <div className="app-shell">
            <Navbar />
            <main className="container" style={{ paddingTop: 'calc(var(--header-height) + var(--space-xl))', minHeight: '80vh' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
