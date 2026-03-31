import { ArrowRight, CheckCircle2, FileBadge2, Files, Landmark, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { requestApi } from "../api/requestApi";
import ServiceCard from "../components/dashboard/ServiceCard";

const workflowSteps = [
  {
    title: "Submit a request",
    description: "Citizens choose a service, share the purpose, and create an online application in minutes.",
    icon: Landmark,
  },
  {
    title: "Share documents online",
    description: "Admins review the application, request proofs, and customers upload them securely from any device.",
    icon: Files,
  },
  {
    title: "Track and download",
    description: "Status changes are visible in real time and the final certificate is delivered through the portal.",
    icon: FileBadge2,
  },
];

export default function HomePage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    requestApi
      .getServices()
      .then(({ data }) => setServices(data.services))
      .catch(() => setServices([]));
  }, []);

  return (
    <div className="pb-10">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-card overflow-hidden p-8 md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-sand px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-brand-ink">
              <ShieldCheck size={16} />
              Citizen Services Digitized
            </div>
            <h1 className="mt-8 max-w-3xl font-display text-5xl leading-tight text-brand-ink md:text-7xl">
              Government service requests, document checks, and final delivery in one portal.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-brand-ink/70">
              Digital e-Sevai Service Portal helps citizens request certificates online while giving administrators a
              clean workflow to collect documents, verify details, and complete services faster.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-ink px-6 py-3 text-sm font-semibold text-white shadow-soft"
              >
                Create account
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center rounded-full border border-brand-ink/10 bg-white px-6 py-3 text-sm font-semibold text-brand-ink"
              >
                Admin access
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {["JWT secured", "Document upload", "Real-time status tracking"].map((item) => (
                <div key={item} className="rounded-3xl bg-brand-cream/75 p-4">
                  <CheckCircle2 className="text-brand-coral" size={18} />
                  <p className="mt-3 text-sm font-semibold text-brand-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue/60">How it works</p>
              <div className="mt-6 space-y-5">
                {workflowSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="rounded-[24px] bg-brand-cream/80 p-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white p-3 text-brand-blue shadow-soft">
                          <Icon size={20} />
                        </div>
                        <h3 className="font-display text-2xl text-brand-ink">{step.title}</h3>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-brand-ink/65">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card bg-brand-ink p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">Why teams like it</p>
              <p className="mt-4 font-display text-3xl">Admins can request exactly the right documents without messy follow-up.</p>
              <p className="mt-4 text-sm leading-7 text-white/75">
                The workflow is built around the real life exchange between citizen and admin, from pending request to completed certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue/60">Available Services</p>
            <h2 className="section-title mt-3">Most-requested e-Sevai applications</h2>
          </div>
          <p className="section-copy">
            The service catalog below is backed by the API, so the same offerings show up inside the customer request form.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.name}
              service={service}
              action={
                <Link to="/register" className="rounded-full bg-brand-ink px-4 py-2 text-sm font-semibold text-white">
                  Apply
                </Link>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
