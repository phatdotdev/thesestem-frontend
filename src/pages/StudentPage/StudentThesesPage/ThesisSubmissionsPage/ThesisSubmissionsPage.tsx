import { useParams } from "react-router-dom";
import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  FileText,
  FolderUp,
  History,
  Loader2,
  Trash2,
  UploadCloud,
  File,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  useGetStudentThesisByIdQuery,
  useGetStudentThesisDraftQuery,
  useGetSubmissionsByThesisQuery,
  useSubmitThesisMutation,
} from "../../../../services/thesisApi";
import Button from "../../../../components/UI/Button";
import Badge from "../../../../components/UI/Badge";
import Select from "../../../../components/UI/Select";
import FileItem from "../../../../components/UI/FileItem";
import Loader from "../../../../components/UI/Loader";
import { formatDateTimeVN } from "../../../../utils/formatters";
import { useFileDownloader } from "../../../../hooks/useFileDownloader";
import { fileTypes } from "../../../../utils/fileType";

/* ── Format bytes ── */
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const baseClass = "w-4 h-4";

  const fileType = fileTypes[ext];

  if (fileType) {
    return (
      <span className={`${baseClass} ${fileType.color}`}>{fileType.icon}</span>
    );
  }

  return <File className={`${baseClass} text-gray-500`} />;
};

/* ── Selected file chip ── */
const SelectedFileChip = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => (
  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
    {getFileIcon(file.name)}
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
        {file.name}
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
        {formatFileSize(file.size)}
      </p>
    </div>
    <button
      onClick={onRemove}
      className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
    >
      <Trash2 size={13} />
    </button>
  </div>
);

/* ── Submission history with version picker ── */
const SubmissionHistory = ({
  submissions,
  downloadFile,
}: {
  submissions: any[];
  downloadFile: (id: string) => void;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-10 text-gray-400 dark:text-gray-500">
        <History size={24} className="text-gray-200 dark:text-gray-700" />
        <p className="text-sm">Chưa có lần nộp nào</p>
      </div>
    );
  }

  const safeSelectedIndex = Math.min(selectedIndex, submissions.length - 1);
  const selected = submissions[safeSelectedIndex];
  const versionOptions = submissions.map((s, i) => ({
    value: i,
    label: `v${s.version} • ${formatDateTimeVN(s.submittedAt)} • ${s.files?.length || 0} file`,
  }));

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <History size={14} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
            Lịch sử nộp bài
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
            {submissions.length} phiên bản
          </span>
        </div>
      </div>

      {/* Version select */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
        <Select
          size="sm"
          value={safeSelectedIndex}
          options={versionOptions}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
          containerClassName="max-w-xl"
        />
      </div>

      {/* Selected version detail */}
      <div className="px-4 py-4 space-y-3">
        {/* Meta */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-[11px] font-bold text-blue-600 dark:text-blue-400">
              v{selected.version}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                Phiên bản {selected.version}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {formatDateTimeVN(selected.submittedAt)}
              </p>
            </div>
          </div>
          <Badge
            label={`${selected.files?.length || 0} file`}
            variant="secondary"
            size="sm"
          />
        </div>

        {/* Note */}
        {selected.note && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-2 border-blue-300 dark:border-blue-700">
            <Info size={13} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {selected.note}
            </p>
          </div>
        )}

        {/* Files */}
        {!selected.files?.length ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Không có file trong lần nộp này.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {selected.files.map((file: any) => (
              <FileItem
                key={file.id}
                file={{
                  id: file.id,
                  name: file.name,
                  size: file.size,
                  uploadedAt: file.uploadedAt
                    ? formatDateTimeVN(file.uploadedAt)
                    : undefined,
                }}
                getFileIcon={getFileIcon}
                onDownload={() => downloadFile(file.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══ PAGE ═══ */
const ThesisSubmissionsPage = () => {
  const { "thesis-id": id } = useParams();
  const thesisId = id || "";

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitThesis] = useSubmitThesisMutation();

  const { data: draftResponse } = useGetStudentThesisDraftQuery(thesisId, {
    skip: !thesisId,
  });
  const {
    data: submissionsResponse,
    isLoading,
    refetch: refetchSubmissions,
  } = useGetSubmissionsByThesisQuery(
    { thesisId, form: { page: 0, size: 10 } },
    { skip: !thesisId },
  );

  const { downloadFile } = useFileDownloader();

  const { data: thesisResponse } = useGetStudentThesisByIdQuery(thesisId, {
    skip: !thesisId,
  });
  const thesis = thesisResponse?.data;

  const submissions = submissionsResponse?.data ?? [];
  const rootFolderId = draftResponse?.data?.id as string | undefined;

  const totalSelectedSize = useMemo(
    () => selectedFiles.reduce((acc, f) => acc + f.size, 0),
    [selectedFiles],
  );

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
    if (!thesisId || !selectedFiles.length || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      selectedFiles.forEach((f) => formData.append("files", f));
      await submitThesis({ id: thesisId, formData }).unwrap();
      setSelectedFiles([]);
      await refetchSubmissions();
    } catch (err) {
      console.error("Submit thesis failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="mt-6 space-y-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl border border-blue-100 dark:border-blue-900/70 bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FolderUp size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Nộp bản luận văn
            </h1>
            <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
              Chọn nhiều file trong một lần nộp để tạo phiên bản mới.
            </p>
          </div>
        </div>
        <Badge
          label={`${submissions.length} lần nộp`}
          variant="info"
          size="sm"
          dot
        />
      </div>

      {thesis?.status === "PROPOSAL" || thesis?.status === "IN_PROGRESS" ? (
        <div>
          <Badge label="Luận văn bạn chưa hoàn thành, chưa thể nộp!" />
        </div>
      ) : (
        <>
          {/* ── Upload zone ── */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <UploadCloud size={16} className="text-gray-400" />
                <h2 className="text-sm font-semibold">Chọn file để nộp</h2>
              </div>
              <div className="flex gap-2">
                <Button
                  label="Chọn file"
                  icon={FileText}
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                />
                <Button
                  label={isSubmitting ? "Đang nộp..." : "Nộp bài"}
                  icon={CheckCircle2}
                  variant="primary"
                  size="sm"
                  loading={isSubmitting}
                  disabled={!selectedFiles.length || !rootFolderId}
                  onClick={handleSubmit}
                />
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={handleSelectFiles}
            />

            {!rootFolderId && (
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-3 py-2.5 text-sm text-amber-700 dark:text-amber-300">
                <AlertTriangle size={15} className="shrink-0" />
                Chưa khởi tạo được thư mục bản thảo. Vui lòng thử lại sau.
              </div>
            )}

            {selectedFiles.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-8 text-gray-400 dark:text-gray-500 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 transition-all"
              >
                <UploadCloud
                  size={24}
                  className="text-gray-300 dark:text-gray-600"
                />
                <p className="text-sm">
                  Click để chọn file hoặc kéo thả vào đây
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 px-1">
                  <span>{selectedFiles.length} file đã chọn</span>
                  <span>Tổng: {formatFileSize(totalSelectedSize)}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {selectedFiles.map((file, index) => (
                    <SelectedFileChip
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
              </div>
            )}
          </div>

          {/* ── Submission history ── */}
          <SubmissionHistory
            submissions={submissions}
            downloadFile={downloadFile}
          />

          {/* ── Submitting toast ── */}
          {isSubmitting && (
            <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 shadow-lg">
              <Loader2
                size={15}
                className="animate-spin text-blue-500 shrink-0"
              />
              Đang tải file và nộp phiên bản...
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThesisSubmissionsPage;
