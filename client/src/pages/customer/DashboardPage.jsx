import { FileCheck2, FilePlus2, Hourglass, Shapes } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { requestApi } from "../../api/requestApi";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import ChangePasswordCard from "../../components/dashboard/ChangePasswordCard";
import RequestCard from "../../components/dashboard/RequestCard";
import { useAuth } from "../../hooks/useAuth";

export default function DashboardPage() {
  const { refreshNotifications } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await requestApi.getMyRequests();
        setRequests(data.requests);
        refreshNotifications();
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading your applications..." />;
  }

  const completed = requests.filter((request) => request.status === "Completed").length;
  const waitingOnYou = requests.filter((request) => request.status === "Documents Required").length;
  const active = requests.filter((request) => !["Completed", "Rejected"].includes(request.status)).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard title="Total Requests" value={requests.length} hint="Applications submitted through your account" accent="bg-brand-ink" />
        <AnalyticsCard title="Active" value={active} hint="Requests currently in progress" accent="bg-brand-blue" />
        <AnalyticsCard title="Need Documents" value={waitingOnYou} hint="Requests waiting for your uploads" accent="bg-brand-coral" />
        <AnalyticsCard title="Completed" value={completed} hint="Certificates ready or already delivered" accent="bg-emerald-500" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Recent applications</p>
              <h3 className="mt-2 font-display text-3xl text-brand-ink">Your latest request activity</h3>
            </div>
            <Link to="/services/request" className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white">
              New request
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {requests.length ? (
              requests.slice(0, 4).map((request) => <RequestCard key={request._id} request={request} />)
            ) : (
              <EmptyState
                title="No service requests yet"
                description="Start your first application to track status updates, upload documents, and receive final certificates online."
                action={
                  <Link to="/services/request" className="rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white">
                    Create request
                  </Link>
                }
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card bg-brand-ink p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">Your workflow</p>
            <div className="mt-6 space-y-4">
              {[
                { icon: FilePlus2, title: "Apply", copy: "Raise a request with service details and purpose." },
                { icon: Shapes, title: "Respond", copy: "Upload proofs when documents are requested by the admin." },
                { icon: Hourglass, title: "Track", copy: "Follow each change from review to completion." },
                { icon: FileCheck2, title: "Download", copy: "Collect the final approved certificate online." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[22px] bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <p className="text-sm font-bold">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/75">{item.copy}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Action needed</p>
            <div className="mt-4 space-y-3">
              {requests
                .filter((request) => request.status === "Documents Required")
                .slice(0, 3)
                .map((request) => (
                  <Link
                    key={request._id}
                    to={`/applications/${request._id}/upload`}
                    className="block rounded-[22px] bg-rose-50 p-4 transition hover:-translate-y-0.5"
                  >
                    <p className="text-sm font-bold text-brand-ink">{request.serviceName}</p>
                    <p className="mt-1 text-sm text-brand-ink/65">Upload the requested documents to keep processing moving.</p>
                  </Link>
                ))}
              {!requests.some((request) => request.status === "Documents Required") ? (
                <p className="rounded-[22px] bg-brand-cream/70 p-4 text-sm text-brand-ink/65">
                  No pending document uploads right now.
                </p>
              ) : null}
            </div>
          </div>

          <ChangePasswordCard
            title="Security settings"
            copy="Change your login password anytime using your current password."
          />
        </div>
      </div>
    </div>
  );
}
