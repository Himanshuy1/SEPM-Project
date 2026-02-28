import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RequireAuth = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    console.log("RequireAuth: Checking user", user ? "Logged in" : "Not logged in", "Loading:", loading);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log("RequireAuth: No user, redirecting to /login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
