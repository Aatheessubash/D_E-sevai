import { Menu, ShieldCheck } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItemClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? "bg-brand-ink text-white" : "text-brand-ink/70 hover:bg-white/70"
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-brand-cream/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-ink text-white shadow-soft">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="font-display text-xl font-bold leading-none text-brand-ink">Digital e-Sevai</p>
            <p className="text-xs tracking-[0.24em] text-brand-ink/50">SERVICE PORTAL</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <NavLink to="/" className={navItemClass}>
            Home
          </NavLink>
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={navItemClass}>
                Customer Login
              </NavLink>
              <NavLink to="/register" className={navItemClass}>
                Register
              </NavLink>
              <NavLink to="/admin/login" className={navItemClass}>
                Admin
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} className={navItemClass}>
                Dashboard
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white transition hover:translate-y-[-1px]"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <details className="lg:hidden">
          <summary className="flex list-none items-center justify-center rounded-full border border-brand-ink/10 bg-white/75 p-3 text-brand-ink shadow-soft">
            <Menu size={18} />
          </summary>
          <div className="absolute right-4 mt-3 flex min-w-56 flex-col gap-2 rounded-3xl border border-brand-ink/10 bg-white p-3 shadow-soft">
            <NavLink to="/" className={navItemClass}>
              Home
            </NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navItemClass}>
                  Customer Login
                </NavLink>
                <NavLink to="/register" className={navItemClass}>
                  Register
                </NavLink>
                <NavLink to="/admin/login" className={navItemClass}>
                  Admin Login
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"} className={navItemClass}>
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </details>
      </div>
    </header>
  );
}
