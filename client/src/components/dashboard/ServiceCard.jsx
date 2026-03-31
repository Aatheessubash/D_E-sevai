import { Clock3 } from "lucide-react";

export default function ServiceCard({ service, action }) {
  return (
    <div className="glass-card group overflow-hidden p-6 transition duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Government Service</p>
          <h3 className="mt-3 font-display text-2xl text-brand-ink">{service.name}</h3>
        </div>
        <div className="rounded-2xl bg-brand-sand px-3 py-2 text-xs font-bold text-brand-ink">
          {service.turnaroundDays} days
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-brand-ink/70">{service.summary}</p>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue/60">
          <Clock3 size={14} />
          Estimated turnaround
        </div>
        {action}
      </div>
    </div>
  );
}
