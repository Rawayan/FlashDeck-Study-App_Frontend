import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          FlashDeck
        </Link>

        {isAuthenticated && (
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/decks">Decks</Link>

            <span className="username">
              {user?.username}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;