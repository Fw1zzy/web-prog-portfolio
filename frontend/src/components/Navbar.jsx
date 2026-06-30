// src/components/Navbar.jsx

import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "home-outline" },
  { to: "/about", label: "About", icon: "person-outline" },
  { to: "/contact", label: "Contact", icon: "mail-outline" },
];

const authItems = [
  { to: "/posts", label: "Posts", icon: "file-tray-outline" },
  { to: "/profile", label: "Profile", icon: "person-circle-outline" },
];

export function getNavIcon(item) {
  return item.icon;
}

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {navItems.map((item) => (
          <li className="navbar-item" key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `navbar-link${isActive ? " active" : ""}`
              }
            >
              <ion-icon name={item.icon} className="navbar-icon"></ion-icon>
              <span className="navbar-text">{item.label}</span>
            </NavLink>
          </li>
        ))}
        {user
          ? [
              ...authItems.map((item) => ({
                ...item,
                type: "link",
              })),
              ...(user.role === "admin"
                ? [{ to: "/admin", label: "Admin", icon: "shield-outline", type: "link" }]
                : []),
              { label: "Logout", icon: "log-out-outline", type: "button", onClick: onLogout },
            ].map((item) => (
              <li className="navbar-item" key={item.to || item.label}>
                {item.type === "button" ? (
                  <button
                    type="button"
                    className="navbar-link"
                    onClick={item.onClick}
                  >
                    <ion-icon name={item.icon} className="navbar-icon"></ion-icon>
                    <span className="navbar-text">{item.label}</span>
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `navbar-link${isActive ? " active" : ""}`
                    }
                  >
                    <ion-icon name={item.icon} className="navbar-icon"></ion-icon>
                    <span className="navbar-text">{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))
          : [
              { to: "/login", label: "Login", icon: "log-in-outline" },
              { to: "/register", label: "Register", icon: "person-add-outline" },
            ].map((item) => (
              <li className="navbar-item" key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `navbar-link${isActive ? " active" : ""}`
                  }
                >
                  <ion-icon name={item.icon} className="navbar-icon"></ion-icon>
                  <span className="navbar-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
      </ul>
    </nav>
  );
}

export default Navbar;
