import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { requestApi } from "../../api/requestApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ServiceCard from "../../components/dashboard/ServiceCard";

export default function RequestServicePage() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    requestApi
      .getServices()
      .then(({ data }) => {
        setServices(data.services);
        setSelectedService(data.services[0]?.name || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const { data } = await requestApi.createRequest({ serviceName: selectedService, description });
      toast.success("Service request submitted");
      navigate(`/applications/${data.request._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading service catalog..." />;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Submit a new application</p>
        <h3 className="mt-2 font-display text-3xl text-brand-ink">Choose a service and describe your request</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-brand-ink/65">
          After submission, the admin reviews your request and asks for specific documents if needed.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <button
              key={service.name}
              type="button"
              onClick={() => setSelectedService(service.name)}
              className={`text-left ${selectedService === service.name ? "ring-2 ring-brand-coral ring-offset-2 ring-offset-brand-cream" : ""}`}
            >
              <ServiceCard
                service={service}
                action={
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      selectedService === service.name ? "bg-brand-coral text-white" : "bg-brand-cream text-brand-ink"
                    }`}
                  >
                    {selectedService === service.name ? "Selected" : "Choose"}
                  </span>
                }
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="glass-card h-fit p-6">
          <h4 className="font-display text-3xl text-brand-ink">Application details</h4>
          <div className="mt-6 rounded-[24px] bg-brand-cream/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue/55">Selected service</p>
            <p className="mt-2 text-xl font-bold text-brand-ink">{selectedService}</p>
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block text-sm font-semibold text-brand-ink">Description / purpose</span>
            <textarea
              required
              rows={7}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-[24px] border border-brand-ink/10 bg-white px-4 py-4 outline-none"
              placeholder="Explain why you need this service and any relevant background."
            />
          </label>

          <button
            type="submit"
            disabled={!selectedService || !description || submitting}
            className="mt-6 w-full rounded-2xl bg-brand-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit request"}
          </button>
        </form>
      </div>
    </div>
  );
}
