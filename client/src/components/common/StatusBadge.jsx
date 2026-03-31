import clsx from "clsx";

const statusClasses = {
  "Pending Request": "bg-amber-100 text-amber-700",
  "Documents Required": "bg-rose-100 text-rose-700",
  "Documents Submitted": "bg-sky-100 text-sky-700",
  "Under Review": "bg-indigo-100 text-indigo-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-slate-100 text-slate-600",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide",
        statusClasses[status] || "bg-brand-sand text-brand-ink",
      )}
    >
      {status}
    </span>
  );
}
