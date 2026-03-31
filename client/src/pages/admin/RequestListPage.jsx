import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import RequestCard from "../../components/dashboard/RequestCard";

const statuses = ["", "Pending Request", "Documents Required", "Documents Submitted", "Under Review", "Completed", "Rejected"];

export default function RequestListPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "" });

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const { data } = await adminApi.getRequests(filters);
        setRequests(data.requests);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(loadRequests, 250);
    return () => clearTimeout(debounce);
  }, [filters.search, filters.status]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink/35" size={18} />
            <input
              type="text"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="Search by customer, email, service, or description"
              className="w-full rounded-2xl border border-brand-ink/10 bg-white px-12 py-3 outline-none"
            />
          </label>

          <select
            value={filters.status}
            onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            className="rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
          >
            {statuses.map((status) => (
              <option key={status || "all"} value={status}>
                {status || "All statuses"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading request queue..." />
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestCard key={request._id} request={request} admin />
          ))}
        </div>
      ) : (
        <EmptyState title="No requests found" description="Try adjusting the search term or status filter." />
      )}
    </div>
  );
}
