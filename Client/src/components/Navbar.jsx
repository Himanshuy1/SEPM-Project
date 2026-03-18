import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          <span className="text-gradient">EduSphere</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className={`${isActive("/")} nav-home`}>Home</Link>
          <Link to="/doubts" className={`${isActive("/doubts")} nav-doubts`}>Doubts</Link>
          <Link to="/resources" className={`${isActive("/resources")} nav-resources`}>Resources</Link>
          <Link to="/summariser" className={`${isActive("/summariser")} nav-summariser`}>Summariser</Link>
          <Link to="/chatbot" className={`${isActive("/chatbot")} nav-chatbot`}>Chatbot</Link>
          <Link to="/chat" className={`${isActive("/chat")} nav-chat`}>Messages</Link>
          <Link to="/profile" className={`${isActive("/profile")} nav-profile`}>Profile</Link>
          {user && (
            <button onClick={logout} className="btn btn-outline nav-logout" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
