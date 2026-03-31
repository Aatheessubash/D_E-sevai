import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { requestApi } from "../../api/requestApi";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import { formatFileSize } from "../../utils/formatters";

export default function UploadDocumentsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    requestApi
      .getRequestById(id)
      .then(({ data }) => setRequest(data.request))
      .finally(() => setLoading(false));
  }, [id]);

  const requestedDocuments = request?.requestedDocuments || [];
  const chosenFiles = Object.entries(selectedFiles).filter(([, file]) => file);

  const handleFileChange = (label, file) => {
    setSelectedFiles((current) => ({
      ...current,
      [label]: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!chosenFiles.length) {
      toast.error("Please choose at least one document to upload");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      const labels = [];

      chosenFiles.forEach(([label, file]) => {
        formData.append("documents", file);
        labels.push(label);
      });

      formData.append("documentLabels", JSON.stringify(labels));
      await requestApi.uploadDocuments(id, formData);
      toast.success("Documents uploaded successfully");
      navigate(`/applications/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading request details..." />;
  }

  if (!request) {
    return <EmptyState title="Request not found" description="The selected application could not be loaded." />;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Upload requested proofs</p>
            <h3 className="mt-2 font-display text-3xl text-brand-ink">{request.serviceName}</h3>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </div>

      {!requestedDocuments.length ? (
        <EmptyState
          title="No document list available"
          description="The admin has not requested any supporting documents for this application yet."
          action={
            <Link to={`/applications/${id}`} className="rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white">
              Back to application
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="glass-card p-6">
            <div className="space-y-5">
              {requestedDocuments.map((document) => (
                <label key={document.name} className="block rounded-[24px] border border-brand-ink/10 bg-brand-cream/70 p-5">
                  <span className="block text-lg font-bold text-brand-ink">{document.name}</span>
                  <span className="mt-1 block text-sm text-brand-ink/60">PDF, image, or Word document up to 10MB</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                    onChange={(event) => handleFileChange(document.name, event.target.files?.[0] || null)}
                    className="mt-4 block w-full text-sm text-brand-ink file:mr-4 file:rounded-full file:border-0 file:bg-brand-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-ink px-4 py-3 text-sm font-semibold text-white disabled:opacity-70"
            >
              <UploadCloud size={16} />
              {submitting ? "Uploading..." : "Submit documents"}
            </button>
          </form>

          <div className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Selected files</h4>
            <div className="mt-5 space-y-4">
              {chosenFiles.length ? (
                chosenFiles.map(([label, file]) => (
                  <div key={label} className="rounded-[24px] bg-white p-4 shadow-soft">
                    <p className="text-sm font-bold text-brand-ink">{label}</p>
                    <p className="mt-1 text-sm text-brand-ink/65">{file.name}</p>
                    <p className="mt-1 text-xs text-brand-ink/50">{formatFileSize(file.size)}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-[24px] bg-brand-cream/70 p-4 text-sm text-brand-ink/65">
                  Choose files on the left to preview their names here before submission.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
