import { Download, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { requestApi } from "../../api/requestApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import FilePreviewList from "../../components/dashboard/FilePreviewList";
import { formatDateTime } from "../../utils/formatters";
import { getFileUrl } from "../../utils/file";

export default function ApplicationStatusPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestApi
      .getRequestById(id)
      .then(({ data }) => setRequest(data.request))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading application timeline..." />;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Application status</p>
            <h3 className="mt-2 font-display text-3xl text-brand-ink">{request.serviceName}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-brand-ink/65">{request.description}</p>
          </div>
          <div className="space-y-2">
            <StatusBadge status={request.status} />
            <p className="text-xs text-brand-ink/50">Verification: {request.verificationState}</p>
          </div>
        </div>

        {request.status === "Documents Required" ? (
          <div className="mt-6 flex flex-col gap-3 rounded-[24px] bg-rose-50 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-brand-ink">Documents have been requested by the admin.</p>
              <p className="mt-1 text-sm text-brand-ink/65">Upload the required files so the application can move forward.</p>
            </div>
            <Link
              to={`/applications/${request._id}/upload`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-coral px-5 py-3 text-sm font-semibold text-white"
            >
              <UploadCloud size={16} />
              Upload now
            </Link>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Timeline</h4>
            <div className="mt-6 space-y-4">
              {request.timeline.map((event, index) => (
                <div key={`${event.status}-${index}`} className="flex gap-4">
                  <div className="mt-1 flex flex-col items-center">
                    <span className="h-3.5 w-3.5 rounded-full bg-brand-coral" />
                    {index !== request.timeline.length - 1 ? <span className="mt-2 h-full w-px bg-brand-ink/10" /> : null}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-bold text-brand-ink">{event.status}</p>
                    <p className="mt-1 text-sm leading-7 text-brand-ink/65">{event.note || "Status updated"}</p>
                    <p className="mt-2 text-xs text-brand-ink/50">{formatDateTime(event.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Requested documents</h4>
            <div className="mt-5 space-y-3">
              {request.requestedDocuments.length ? (
                request.requestedDocuments.map((document) => (
                  <div key={document.name} className="rounded-[22px] bg-brand-cream/70 px-4 py-3 text-sm font-semibold text-brand-ink">
                    {document.name}
                  </div>
                ))
              ) : (
                <p className="rounded-[22px] bg-brand-cream/70 p-4 text-sm text-brand-ink/65">No documents requested yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {request.uploadedDocuments.length ? <FilePreviewList files={request.uploadedDocuments} title="Uploaded documents" /> : null}

          <div className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Admin notes</h4>
            <p className="mt-4 rounded-[24px] bg-brand-cream/70 p-5 text-sm leading-7 text-brand-ink/70">
              {request.adminNotes || "No notes from the admin yet."}
            </p>
          </div>

          <div className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Completed certificate</h4>
            {request.completedFile ? (
              <div className="mt-5 rounded-[24px] bg-emerald-50 p-5">
                <p className="text-sm font-bold text-brand-ink">{request.completedFile.originalName}</p>
                <a
                  href={getFileUrl(request.completedFile.filePath)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  <Download size={16} />
                  Download final document
                </a>
              </div>
            ) : (
              <p className="mt-4 rounded-[24px] bg-brand-cream/70 p-5 text-sm leading-7 text-brand-ink/65">
                The final document will appear here after the admin completes processing.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
