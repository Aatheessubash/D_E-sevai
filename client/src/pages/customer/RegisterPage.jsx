import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_0.95fr]">
        <form onSubmit={handleSubmit} className="glass-card order-2 p-8 md:p-10 lg:order-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-sand p-3 text-brand-ink">
              <UserPlus size={22} />
            </div>
            <div>
              <h1 className="font-display text-3xl text-brand-ink">Create your citizen account</h1>
              <p className="text-sm text-brand-ink/60">Start submitting applications online.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Full name</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                placeholder="Enter your name"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Phone</span>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                placeholder="9876543210"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                placeholder="Minimum 6 characters"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-2xl bg-brand-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {submitting ? "Creating account..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-brand-ink/65">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-brand-blue">
              Login here
            </Link>
          </p>
        </form>

        <div className="glass-card order-1 bg-brand-ink p-8 text-white md:p-10 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Simple citizen onboarding</p>
          <h2 className="mt-4 font-display text-5xl">One account for multiple certificate and land record services.</h2>
          <ul className="mt-8 space-y-4 text-sm leading-7 text-white/75">
            <li>Track request status from submission to completion.</li>
            <li>Receive alerts when the admin asks for supporting documents.</li>
            <li>Download completed certificates directly from the portal.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
