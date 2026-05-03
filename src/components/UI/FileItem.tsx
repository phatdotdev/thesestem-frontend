import { Download, Eye, Loader2 } from "lucide-react";
import { RiGeminiLine } from "react-icons/ri";
import FilePreview from "./FilePreview";
import Modal from "./Modal";
import { useState } from "react";

type FileItemProps = {
  file: {
    id: string;
    name: string;
    size?: number;
    uploadedAt?: string;
  };

  getFileIcon: (name: string) => React.ReactNode;

  onDownload?: (id: string) => void;
  onAnalyze?: (id: string) => void;
  onClick?: (id: string) => void;

  analyzing?: boolean;
  downloading?: boolean;
};

const formatSize = (size?: number) => {
  if (!size) return "";

  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const FileItem = ({
  file,
  getFileIcon,
  onDownload,
  onAnalyze,
  onClick,
  analyzing,
  downloading,
}: FileItemProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  return (
    <div
      onClick={() => onClick?.(file.id)}
      className="
        group
        w-full rounded-xl border
        border-gray-200 dark:border-gray-700
        bg-gray-50 dark:bg-gray-800/60
        px-3 py-2.5
        hover:border-blue-300 dark:hover:border-blue-700
        hover:bg-white dark:hover:bg-gray-800
        transition
        cursor-pointer
      "
    >
      <div className="flex items-center gap-3">
        {/* icon */}
        <div className="shrink-0">{getFileIcon(file.name)}</div>

        {/* file info */}
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="
            text-sm font-medium
            text-gray-700 dark:text-gray-200
            truncate
          "
          >
            {file.name}
          </span>

          {(file.size || file.uploadedAt) && (
            <span
              className="
              text-xs text-gray-500 dark:text-gray-400
              truncate
            "
            >
              {formatSize(file.size)}
              {file.size && file.uploadedAt && " • "}
              {file.uploadedAt}
            </span>
          )}
        </div>

        {/* actions */}
        <div
          className="
          flex items-center gap-1
          opacity-0 group-hover:opacity-100
          transition
        "
        >
          {/* preview */}
          <button
            type="button"
            title="Preview"
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewOpen(true);
            }}
            className="
              p-1.5 rounded-lg
              hover:bg-gray-200
              dark:hover:bg-gray-700
              transition
            "
          >
            <Eye size={14} className="text-gray-500" />
          </button>

          {/* analyze */}
          {onAnalyze && (
            <button
              type="button"
              title="AI Analyze"
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze(file.id);
              }}
              className="
                p-1.5 rounded-lg
                hover:bg-blue-100
                dark:hover:bg-blue-900/40
                transition
              "
            >
              {analyzing ? (
                <Loader2 size={14} className="animate-spin text-blue-500" />
              ) : (
                <RiGeminiLine
                  size={14}
                  className="text-blue-500 dark:text-blue-400"
                />
              )}
            </button>
          )}

          {/* download */}
          {onDownload && (
            <button
              type="button"
              title="Download"
              onClick={(e) => {
                e.stopPropagation();
                onDownload(file.id);
              }}
              className="
                p-1.5 rounded-lg
                hover:bg-gray-200
                dark:hover:bg-gray-700
                transition
              "
            >
              {downloading ? (
                <Loader2 size={14} className="animate-spin text-gray-500" />
              ) : (
                <Download size={14} className="text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* PREVIEW MODAL */}
      <Modal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        width="max-w-4xl"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {file.name}
          </h2>
          <FilePreview fileId={file.id} />
        </div>
      </Modal>
    </div>
  );
};

export default FileItem;
