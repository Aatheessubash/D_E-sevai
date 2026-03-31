import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import ChangePasswordCard from "../../components/dashboard/ChangePasswordCard";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDateTime } from "../../utils/formatters";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getAnalytics()
      .then(({ data }) => setAnalytics(data.analytics))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard title="Requests" value={analytics.totalRequests} hint="All citizen applications" accent="bg-brand-ink" />
        <AnalyticsCard title="Completed" value={analytics.completedRequests} hint="Finished services delivered" accent="bg-emerald-500" />
        <AnalyticsCard title="Completion Rate" value={`${analytics.completionRate}%`} hint="End-to-end completion efficiency" accent="bg-brand-blue" />
        <AnalyticsCard title="Pending Actions" value={analytics.pendingActions} hint="Applications needing admin attention" accent="bg-brand-coral" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Recent applications</p>
              <h3 className="mt-2 font-display text-3xl text-brand-ink">Latest submissions</h3>
            </div>
            <Link to="/admin/requests" className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white">
              Open queue
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {analytics.recentRequests.length ? (
              analytics.recentRequests.map((request) => (
                <Link key={request._id} to={`/admin/requests/${request._id}`} className="block rounded-[24px] bg-brand-cream/70 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-bold text-brand-ink">{request.serviceName}</p>
                      <p className="mt-1 text-sm text-brand-ink/65">{request.userId?.name}</p>
                    </div>
                    <div className="flex flex-col gap-2 md:items-end">
                      <StatusBadge status={request.status} />
                      <p className="text-xs text-brand-ink/50">{formatDateTime(request.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState title="No applications yet" description="New requests will appear here once customers start applying." />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Status distribution</p>
            <div className="mt-5 space-y-4">
              {analytics.statusBuckets.map((item) => (
                <div key={item._id}>
                  <div className="mb-2 flex items-center justify-between text-sm font-semibold text-brand-ink">
                    <span>{item._id}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-brand-cream">
                    <div
                      className="h-3 rounded-full bg-brand-ink"
                      style={{ width: `${analytics.totalRequests ? (item.count / analytics.totalRequests) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Most requested services</p>
            <div className="mt-5 space-y-3">
              {analytics.serviceBuckets.map((item) => (
                <div key={item._id} className="rounded-[22px] bg-brand-cream/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-brand-ink">{item._id}</p>
                    <p className="text-sm text-brand-ink/60">{item.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ChangePasswordCard
            title="Admin password"
            copy="Keep your administrator account secure by rotating its password here."
          />
        </div>
      </div>
    </div>
  );
}
