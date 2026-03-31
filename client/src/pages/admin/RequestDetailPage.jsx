import { Download, Send, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { adminApi } from "../../api/adminApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StatusBadge from "../../components/common/StatusBadge";
import FilePreviewList from "../../components/dashboard/FilePreviewList";
import { formatDateTime } from "../../utils/formatters";
import { getFileUrl } from "../../utils/file";

const reviewStatuses = ["Pending Request", "Documents Required", "Documents Submitted", "Under Review", "Rejected"];

export default function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [documentList, setDocumentList] = useState("");
  const [docNotes, setDocNotes] = useState("");
  const [statusForm, setStatusForm] = useState({ status: "Under Review", adminNotes: "", verificationState: "Approved" });
  const [finalDocument, setFinalDocument] = useState(null);
  const [finalNotes, setFinalNotes] = useState("");

  const loadRequest = async () => {
    const { data } = await adminApi.getRequestById(id);
    setRequest(data.request);
    setStatusForm({
      status: data.request.status,
      adminNotes: data.request.adminNotes || "",
      verificationState: data.request.verificationState || "Pending",
    });
  };

  useEffect(() => {
    loadRequest().finally(() => setLoading(false));
  }, [id]);

  const handleDocumentRequest = async (event) => {
    event.preventDefault();

    try {
      await adminApi.requestDocuments(id, {
        requestedDocuments: documentList
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        adminNotes: docNotes,
      });
      toast.success("Requested documents sent to customer");
      setDocumentList("");
      setDocNotes("");
      await loadRequest();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to request documents");
    }
  };

  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    try {
      await adminApi.updateStatus(id, statusForm);
      toast.success("Request status updated");
      await loadRequest();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const handleFinalUpload = async (event) => {
    event.preventDefault();

    if (!finalDocument) {
      toast.error("Please choose the completed certificate to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("completedFile", finalDocument);
      formData.append("adminNotes", finalNotes);
      await adminApi.uploadFinalDocument(id, formData);
      toast.success("Final document uploaded");
      setFinalDocument(null);
      setFinalNotes("");
      await loadRequest();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload final document");
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading request detail..." />;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-blue/55">Request detail</p>
            <h3 className="mt-2 font-display text-4xl text-brand-ink">{request.serviceName}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-brand-ink/65">{request.description}</p>
          </div>
          <div className="space-y-2">
            <StatusBadge status={request.status} />
            <p className="text-xs text-brand-ink/50">Verification: {request.verificationState}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Applicant details</h4>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-brand-cream/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue/55">Name</p>
                <p className="mt-2 text-lg font-bold text-brand-ink">{request.userId?.name}</p>
              </div>
              <div className="rounded-[24px] bg-brand-cream/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue/55">Email</p>
                <p className="mt-2 text-lg font-bold text-brand-ink">{request.userId?.email}</p>
              </div>
              <div className="rounded-[24px] bg-brand-cream/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue/55">Phone</p>
                <p className="mt-2 text-lg font-bold text-brand-ink">{request.userId?.phone}</p>
              </div>
              <div className="rounded-[24px] bg-brand-cream/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue/55">Submitted</p>
                <p className="mt-2 text-lg font-bold text-brand-ink">{formatDateTime(request.createdAt)}</p>
              </div>
            </div>
          </div>

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
                    <p className="mt-1 text-sm leading-7 text-brand-ink/65">{event.note}</p>
                    <p className="mt-2 text-xs text-brand-ink/50">{formatDateTime(event.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {request.uploadedDocuments.length ? <FilePreviewList files={request.uploadedDocuments} title="Uploaded documents" /> : null}
        </div>

        <div className="space-y-6">
          <form onSubmit={handleDocumentRequest} className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Ask for documents</h4>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Document list</span>
              <textarea
                rows={4}
                value={documentList}
                onChange={(event) => setDocumentList(event.target.value)}
                className="w-full rounded-[24px] border border-brand-ink/10 bg-white px-4 py-4 outline-none"
                placeholder="Aadhaar Card, Passport Size Photo, Address Proof"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Admin note</span>
              <textarea
                rows={3}
                value={docNotes}
                onChange={(event) => setDocNotes(event.target.value)}
                className="w-full rounded-[24px] border border-brand-ink/10 bg-white px-4 py-4 outline-none"
                placeholder="Explain any special format or validation instructions."
              />
            </label>
            <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-coral px-4 py-3 text-sm font-semibold text-white">
              <Send size={16} />
              Send document request
            </button>
          </form>

          <form onSubmit={handleStatusUpdate} className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Review and status update</h4>
            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-ink">Status</span>
                <select
                  value={statusForm.status}
                  onChange={(event) => setStatusForm((current) => ({ ...current, status: event.target.value }))}
                  className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                >
                  {reviewStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-ink">Verification state</span>
                <select
                  value={statusForm.verificationState}
                  onChange={(event) => setStatusForm((current) => ({ ...current, verificationState: event.target.value }))}
                  className="w-full rounded-2xl border border-brand-ink/10 bg-white px-4 py-3 outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-brand-ink">Admin note</span>
                <textarea
                  rows={4}
                  value={statusForm.adminNotes}
                  onChange={(event) => setStatusForm((current) => ({ ...current, adminNotes: event.target.value }))}
                  className="w-full rounded-[24px] border border-brand-ink/10 bg-white px-4 py-4 outline-none"
                  placeholder="Record verification results or rejection reasons."
                />
              </label>
            </div>

            <button type="submit" className="mt-5 rounded-2xl bg-brand-ink px-4 py-3 text-sm font-semibold text-white">
              Update status
            </button>
          </form>

          <form onSubmit={handleFinalUpload} className="glass-card p-6">
            <h4 className="font-display text-3xl text-brand-ink">Upload final certificate</h4>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Completed document</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                onChange={(event) => setFinalDocument(event.target.files?.[0] || null)}
                className="block w-full text-sm text-brand-ink file:mr-4 file:rounded-full file:border-0 file:bg-brand-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-brand-ink">Completion note</span>
              <textarea
                rows={3}
                value={finalNotes}
                onChange={(event) => setFinalNotes(event.target.value)}
                className="w-full rounded-[24px] border border-brand-ink/10 bg-white px-4 py-4 outline-none"
                placeholder="Mention collection instructions or completion details."
              />
            </label>
            <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white">
              <Upload size={16} />
              Upload final document
            </button>

            {request.completedFile ? (
              <a
                href={getFileUrl(request.completedFile.filePath)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-cream px-4 py-2 text-sm font-semibold text-brand-ink"
              >
                <Download size={16} />
                Open current completed file
              </a>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
