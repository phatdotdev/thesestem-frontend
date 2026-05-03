import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  X,
  File,
  FileArchive,
  FileCode,
  FileImage,
  FileSpreadsheet,
} from "lucide-react";

import Button from "../../../../components/UI/Button";
import Modal from "../../../../components/UI/Modal";

/* ── File icon ── */
const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext))
    return <FileImage size={15} className="text-pink-400 shrink-0" />;

  if (["pdf"].includes(ext))
    return <FileText size={15} className="text-red-400 shrink-0" />;

  if (["doc", "docx"].includes(ext))
    return <FileText size={15} className="text-blue-400 shrink-0" />;

  if (["xls", "xlsx", "csv"].includes(ext))
    return <FileSpreadsheet size={15} className="text-emerald-400 shrink-0" />;

  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <FileArchive size={15} className="text-amber-400 shrink-0" />;

  if (
    ["js", "ts", "jsx", "tsx", "java", "py", "cpp", "c", "cs", "go"].includes(
      ext,
    )
  )
    return <FileCode size={15} className="text-indigo-400 shrink-0" />;

  return <File size={15} className="text-gray-400 shrink-0" />;
};

/* ── Selected file row ── */
const SelectedFileRow = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => (
  <div className="flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5">
    {getFileIcon(file.name)}
    <span className="truncate flex-1 text-sm text-gray-700 dark:text-gray-200">
      {file.name}
    </span>

    <button
      type="button"
      onClick={onRemove}
      className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
    >
      <X size={12} />
    </button>
  </div>
);

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (files: File[]) => Promise<void>;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  isOpen: boolean;
}

/* ═══ COMPONENT ═══ */
const AssignmentUploadModal = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  hasSubmitted,
  isOpen,
}: Props) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);

    if (!incoming.length) return;

    setSelectedFiles((prev) => {
      const map = new Map<string, File>();

      [...prev, ...incoming].forEach((f) =>
        map.set(`${f.name}-${f.size}-${f.lastModified}`, f),
      );

      return Array.from(map.values());
    });

    e.target.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length || !isOpen) return;

    await onSubmit(selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
            {hasSubmitted ? "Nộp lại bài" : "Nộp bài"}
          </h3>

          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
            Chọn file để nộp. Hệ thống sẽ lưu thành lần nộp mới.
          </p>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* File picker */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              label="Chọn file"
              icon={FileText}
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            />

            {selectedFiles.length > 0 && (
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {selectedFiles.length} file đã chọn
              </span>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleSelectFiles}
          />

          {selectedFiles.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-8 text-gray-400 dark:text-gray-500 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
            >
              <UploadCloud
                size={22}
                className="text-gray-300 dark:text-gray-600"
              />
              <p className="text-sm">Click để chọn file</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <SelectedFileRow
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  file={file}
                  onRemove={() =>
                    setSelectedFiles((prev) =>
                      prev.filter((_, i) => i !== index),
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button label="Hủy" variant="outline" size="sm" onClick={onClose} />

          <Button
            label={isSubmitting ? "Đang nộp..." : "Lưu và nộp"}
            icon={UploadCloud}
            variant="primary"
            size="sm"
            loading={isSubmitting}
            disabled={!selectedFiles.length || !isOpen}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AssignmentUploadModal;
