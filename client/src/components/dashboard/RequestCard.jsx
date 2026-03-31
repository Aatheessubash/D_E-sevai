import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDate } from "../../utils/formatters";

export default function RequestCard({ request, admin = false }) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue/55">
            {admin ? request.userId?.name || "Customer" : "Service Request"}
          </p>
          <h3 className="mt-2 font-display text-2xl text-brand-ink">{request.serviceName}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-brand-ink/70">{request.description}</p>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <StatusBadge status={request.status} />
          <p className="text-xs text-brand-ink/50">{formatDate(request.createdAt)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-brand-ink/60">
          {admin ? request.userId?.email : `${request.uploadedDocuments.length} document(s) uploaded`}
        </div>
        <Link
          to={admin ? `/admin/requests/${request._id}` : `/applications/${request._id}`}
          className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white"
        >
          View details
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
