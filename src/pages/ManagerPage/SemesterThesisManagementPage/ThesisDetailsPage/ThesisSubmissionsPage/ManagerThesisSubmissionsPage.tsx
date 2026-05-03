import { useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  FileText,
  FolderUp,
  History,
  FileImage,
  FileCode,
  File,
  FileArchive,
  Download,
} from "lucide-react";
import { useGetSubmissionsByThesisQuery } from "../../../../../services/thesisApi";
import Badge from "../../../../../components/UI/Badge";
import Loader from "../../../../../components/UI/Loader";
import { formatDateTimeVN } from "../../../../../utils/formatters";
import { useFileDownloader } from "../../../../../hooks/useFileDownloader";

/* ── File icon helper ── */
const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return <FileImage size={15} className="text-pink-400 shrink-0" />;
  if (["pdf"].includes(ext))
    return <FileText size={15} className="text-red-400 shrink-0" />;
  if (["doc", "docx"].includes(ext))
    return <FileText size={15} className="text-blue-400 shrink-0" />;
  if (["zip", "rar", "7z", "tar"].includes(ext))
    return <FileArchive size={15} className="text-amber-400 shrink-0" />;
  if (["js", "ts", "jsx", "tsx", "py", "java", "cpp", "c"].includes(ext))
    return <FileCode size={15} className="text-emerald-400 shrink-0" />;
  return <File size={15} className="text-gray-400 shrink-0" />;
};

/* ── Format bytes ── */
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/* ── Submission file row ── */
const SubmissionFileRow = ({
  file,
  onDownload,
}: {
  file: any;
  onDownload: () => void;
}) => (
  <button
    onClick={onDownload}
    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-left w-full hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 group transition-all"
  >
    {getFileIcon(file.name)}
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {file.name}
      </p>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
        {formatFileSize(file.size)}
      </p>
    </div>
    <Download
      size={15}
      className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
    />
  </button>
);

const ManagerThesisSubmissionsPage = () => {
  const { ["thesis-id"]: id } = useParams();
  const { data: submissionsResponse, isLoading } =
    useGetSubmissionsByThesisQuery(id as string);

  const { downloadFile } = useFileDownloader();

  const submissions = useMemo(() => {
    if (!submissionsResponse?.data) return [];
    return submissionsResponse.data;
  }, [submissionsResponse]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 shrink-0">
            <FolderUp size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Nộp chính thức
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Các phiên bản luận văn đã nộp
            </p>
          </div>
        </div>

        {submissions.length > 0 && (
          <Badge
            label={`${submissions.length} phiên bản`}
            variant="secondary"
          />
        )}
      </div>

      {/* CONTENT */}
      {submissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4">
            <History size={24} className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Chưa có bài nộp nào
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission: any, index: number) => (
            <div
              key={submission.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 text-sm font-semibold">
                    v{submission.version || index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Phiên bản {submission.version || index + 1}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDateTimeVN(submission.submittedAt)}
                    </p>
                  </div>
                </div>
                {index === 0 && <Badge label="Mới nhất" variant="success" />}
              </div>

              {/* Files */}
              <div className="p-4 space-y-2">
                {submission.files && submission.files.length > 0 ? (
                  <>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">
                      {submission.files.length} file đính kèm
                    </p>
                    <div className="grid gap-2">
                      {submission.files.map((file: any) => (
                        <SubmissionFileRow
                          key={file.id}
                          file={file}
                          onDownload={() => downloadFile(file.id)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    Không có file trong phiên bản này
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerThesisSubmissionsPage;
