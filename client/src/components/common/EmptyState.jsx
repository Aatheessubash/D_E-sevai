export default function EmptyState({ title, description, action }) {
  return (
    <div className="glass-card border-dashed p-10 text-center">
      <h3 className="font-display text-2xl text-brand-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-brand-ink/65">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
