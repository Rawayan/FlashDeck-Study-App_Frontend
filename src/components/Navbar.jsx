import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          FlashDeck
        </Link>

        {user && (
          <div className="nav-links">
            <Link to="/">Dashboard</Link>

            <Link to="/decks">Decks</Link>

            <span className="username">
              {user.username}
            </span>

            <button
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;