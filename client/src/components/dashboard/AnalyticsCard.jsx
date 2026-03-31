export default function AnalyticsCard({ title, value, hint, accent = "bg-brand-ink" }) {
  return (
    <div className="glass-card overflow-hidden p-5">
      <div className={`h-1.5 w-20 rounded-full ${accent}`} />
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue/55">{title}</p>
      <h3 className="mt-3 font-display text-4xl text-brand-ink">{value}</h3>
      <p className="mt-3 text-sm text-brand-ink/60">{hint}</p>
    </div>
  );
}
