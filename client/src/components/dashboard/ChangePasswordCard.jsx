import { KeyRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "../../api/authApi";

const initialFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordCard({ title = "Change password", copy = "Update your account password securely." }) {
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await authApi.changePassword(form);
      toast.success(data.message || "Password changed successfully");
      setForm(initialFormState);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-brand-sand p-3 text-brand-ink">
          <KeyRound size={20} />
        </div>
        <div>
          <p className="font-display text-3xl text-brand-ink">{title}</p>
          <p className="text-sm text-brand-ink/60">{copy}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-brand-ink">Current password</span>
          <input
            type="password"
            required
            value={form.currentPassword}
            onChange={(event) => handleChange("currentPassword", event.target.value)}
            className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
            placeholder="Enter current password"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-brand-ink">New password</span>
          <input
            type="password"
            required
            minLength={6}
            value={form.newPassword}
            onChange={(event) => handleChange("newPassword", event.target.value)}
            className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
            placeholder="Enter new password"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-brand-ink">Confirm new password</span>
          <input
            type="password"
            required
            minLength={6}
            value={form.confirmPassword}
            onChange={(event) => handleChange("confirmPassword", event.target.value)}
            className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
            placeholder="Re-enter new password"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 rounded-2xl bg-brand-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
      >
        {submitting ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
