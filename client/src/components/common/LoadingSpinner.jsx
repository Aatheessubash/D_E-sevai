export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[240px] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-brand-blue/10 bg-white/80 px-5 py-3 text-sm font-semibold text-brand-ink shadow-soft">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-coral" />
        {label}
      </div>
    </div>
  );
}
