import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login({ ...form, role: "admin" });
      navigate(location.state?.from?.pathname || "/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login as admin");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="glass-card bg-brand-ink p-8 text-white md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Admin workspace</p>
          <h1 className="mt-4 font-display text-5xl">Review applications, request documents, and complete services.</h1>
          <p className="mt-6 text-sm leading-8 text-white/75">
            The admin dashboard gives you a full queue view, analytics, file preview, and certificate upload controls.
          </p>
          <div className="mt-8 rounded-[28px] bg-white/10 p-5 text-sm text-white/75">
            Default local admin credentials are seeded from the backend environment values.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-sand p-3 text-brand-ink">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="font-display text-3xl text-brand-ink">Administrator sign in</h2>
              <p className="text-sm text-brand-ink/60">Only accounts with admin role can continue.</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Admin email</span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                placeholder="admin@esevai.local"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Password</span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                placeholder="Enter admin password"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full rounded-2xl bg-brand-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Login as admin"}
          </button>
        </form>
      </div>
    </section>
  );
}
