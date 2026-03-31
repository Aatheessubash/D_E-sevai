import { ExternalLink, FileText, ImageIcon } from "lucide-react";
import { formatFileSize } from "../../utils/formatters";
import { getFileUrl, isPdf, isPreviewableImage } from "../../utils/file";

export default function FilePreviewList({ files, title }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl text-brand-ink">{title}</h3>
        <p className="text-sm text-brand-ink/50">{files.length} item(s)</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {files.map((file, index) => {
          const fileUrl = getFileUrl(file.filePath);
          return (
            <div key={`${file.originalName}-${index}`} className="overflow-hidden rounded-[24px] border border-brand-ink/10 bg-brand-cream/60">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-brand-ink">{file.label || file.originalName}</p>
                  <p className="text-xs text-brand-ink/55">{formatFileSize(file.size)}</p>
                </div>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-ink shadow-soft"
                >
                  Open
                  <ExternalLink size={14} />
                </a>
              </div>

              {isPreviewableImage(file.mimeType) ? (
                <img src={fileUrl} alt={file.originalName} className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center bg-white text-brand-blue">
                  {isPdf(file.mimeType) ? <FileText size={50} /> : <ImageIcon size={50} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
