// src/components/Navbar.jsx

import { NavLink } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar-link${isActive ? " active" : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `navbar-link${isActive ? " active" : ""}`
            }
          >
            About
          </NavLink>
        </li>
        <li className="navbar-item">
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `navbar-link${isActive ? " active" : ""}`
            }
          >
            Contact
          </NavLink>
        </li>
        {user ? (
          <>
            <li className="navbar-item">
              <NavLink
                to="/posts"
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
              >
                Posts
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
              >
                Profile
              </NavLink>
            </li>
            {user.role === "admin" && (
              <li className="navbar-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `navbar-link${isActive ? " active" : ""}`
                  }
                >
                  Admin
                </NavLink>
              </li>
            )}
            <li className="navbar-item">
              <button type="button" className="navbar-link" onClick={onLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="navbar-item">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
              >
                Login
              </NavLink>
            </li>
            <li className="navbar-item">
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `navbar-link${isActive ? " active" : ""}`
                }
              >
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
