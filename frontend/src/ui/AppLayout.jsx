import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { clearAuth } from "../lib/auth";
import { useAuth } from "../context/AuthContext.jsx";

const linkClass = ({ isActive }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

export function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    clearAuth();
    navigate("/login");
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: "👨‍💼 Admin",
      engineer: "👷 Engineer",
      quality: "🔬 Quality",
      customer: "🏢 Customer",
    };
    return labels[role] || role;
  };

  // Role-based visibility for navigation
  const role = user?.role;
  const canViewProduction = role === "admin" || role === "engineer"; // Admin + Engineer
  const canViewQuality = role === "admin" || role === "quality";     // Admin + Quality
  const canViewInventory = role === "admin";                         // Admin only

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/dashboard" className="brand">
          FactoryIQ
        </Link>
        <nav className="nav">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={linkClass}>
            Projects
          </NavLink>
          {canViewProduction && (
            <NavLink to="/production" className={linkClass}>
              Production
            </NavLink>
          )}
          {canViewQuality && (
            <NavLink to="/quality" className={linkClass}>
              Quality
            </NavLink>
          )}
          {canViewInventory && (
            <NavLink to="/inventory" className={linkClass}>
              Inventory
            </NavLink>
          )}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            title={`Role: ${user?.role}`}
            style={{
              fontSize: "12px",
              padding: "6px 10px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "4px",
            }}
          >
            {getRoleLabel(user?.role)}
          </span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
