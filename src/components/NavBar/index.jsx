import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./NavBar.css"; // External CSS file for styling

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/home">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="navbar-logo-img"
          />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/home" className="navbar-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="navbar-link">
            Jobs
          </Link>
        </li>
      </ul>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
