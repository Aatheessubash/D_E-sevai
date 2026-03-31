import { Bell, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { formatDateTime } from "../../utils/formatters";

export default function NotificationDrawer() {
  const { notifications, markAllNotificationsRead, markNotificationRead, user } = useAuth();
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-brand-ink/10 bg-white/75 px-4 py-2 text-sm font-semibold text-brand-ink shadow-soft">
        <Bell size={16} />
        Alerts
        {unreadCount ? (
          <span className="rounded-full bg-brand-coral px-2 py-0.5 text-[11px] font-bold text-white">{unreadCount}</span>
        ) : null}
      </summary>

      <div className="absolute right-0 z-20 mt-3 w-[min(24rem,88vw)] rounded-[24px] border border-brand-ink/10 bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-brand-ink">Notifications</p>
            <p className="text-xs text-brand-ink/60">Latest updates for your account</p>
          </div>
          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1 rounded-full bg-brand-sand px-3 py-1 text-xs font-semibold text-brand-ink"
          >
            <CheckCheck size={14} />
            Mark all
          </button>
        </div>

        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {notifications.length ? (
            notifications.map((notification) => {
              const requestId = notification.metadata?.requestId;
              const destination = requestId
                ? user?.role === "admin"
                  ? `/admin/requests/${requestId}`
                  : `/applications/${requestId}`
                : user?.role === "admin"
                  ? "/admin/requests"
                  : "/dashboard";

              return (
                <Link
                  key={notification._id}
                  to={destination}
                  onClick={() => markNotificationRead(notification._id)}
                  className={`block rounded-2xl border p-3 transition hover:-translate-y-0.5 ${
                    notification.isRead ? "border-brand-ink/10 bg-brand-cream/70" : "border-brand-coral/20 bg-rose-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-brand-ink">{notification.title}</p>
                      <p className="mt-1 text-xs leading-6 text-brand-ink/70">{notification.message}</p>
                    </div>
                    {!notification.isRead ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-coral" /> : null}
                  </div>
                  <p className="mt-2 text-[11px] text-brand-ink/50">{formatDateTime(notification.createdAt)}</p>
                </Link>
              );
            })
          ) : (
            <p className="rounded-2xl bg-brand-cream/70 p-4 text-center text-sm text-brand-ink/60">
              No notifications yet.
            </p>
          )}
        </div>
      </div>
    </details>
  );
}
