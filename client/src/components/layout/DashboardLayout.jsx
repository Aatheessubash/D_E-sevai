import { ClipboardList, LayoutDashboard, LogOut, PlusSquare, Shield, Upload, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import NotificationDrawer from "../common/NotificationDrawer";
import { useAuth } from "../../hooks/useAuth";

const userNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/services/request", label: "Request Service", icon: PlusSquare },
];

const adminNav = [
  { to: "/admin/dashboard", label: "Overview", icon: Shield },
  { to: "/admin/requests", label: "Request List", icon: ClipboardList },
];

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const navigation = role === "admin" ? adminNav : userNav;

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        <aside className="glass-card h-fit overflow-hidden">
          <div className="bg-brand-ink bg-mesh-radial px-6 py-8 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">{role === "admin" ? "Admin Panel" : "Citizen Desk"}</p>
            <h1 className="mt-3 font-display text-3xl">{user?.name}</h1>
            <p className="mt-2 text-sm text-white/75">{user?.email}</p>
          </div>

          <div className="space-y-3 p-5">
            <div className="rounded-2xl bg-brand-cream/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-ink/45">Account</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-brand-blue shadow-soft">
                  <UserRound size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-ink">{user?.role === "admin" ? "Administrator" : "Customer"}</p>
                  <p className="text-xs text-brand-ink/60">{user?.phone}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:flex-col">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                        isActive ? "bg-brand-ink text-white" : "bg-brand-cream/60 text-brand-ink hover:bg-white"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>

            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-coral px-4 py-3 text-sm font-semibold text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue/60">Digital service workflow</p>
              <h2 className="mt-2 font-display text-4xl text-brand-ink">
                {role === "admin" ? "Track every application with confidence" : "Manage your requests in one place"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {role === "user" ? (
                <NavLink
                  to="/services/request"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white shadow-soft"
                >
                  <Upload size={16} />
                  New request
                </NavLink>
              ) : null}
              <NotificationDrawer />
            </div>
          </div>

          <Outlet />
        </section>
      </div>
    </div>
  );
}
