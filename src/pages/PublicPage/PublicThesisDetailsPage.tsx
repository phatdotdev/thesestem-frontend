import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BookOpen, File, User, TrendingUp } from "lucide-react";

import Badge from "../../components/UI/Badge";
import FileItem from "../../components/UI/FileItem";
import Loader from "../../components/UI/Loader";
import { useGetPublicThesisByIdQuery } from "../../services/thesisApi";
import { fileTypes } from "../../utils/fileType";
import { formatDateTimeVN } from "../../utils/formatters";
import { useFileDownloader } from "../../hooks/useFileDownloader";

const PublicThesisDetailsPage = () => {
  const { "thesis-id": thesisId } = useParams();

  const {
    data: thesisResponse,
    isLoading,
    isError,
  } = useGetPublicThesisByIdQuery(thesisId as string, { skip: !thesisId });

  const thesis = thesisResponse?.data;
  const isSubmissionsLoading = false;
  const submissions = thesis?.submissions || [];

  const [activeTab, setActiveTab] = useState<"details" | "submission">(
    "details",
  );
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    if (!thesis) return;
    setProgressPercent(Math.max(0, Math.min(thesis.progressPercent || 0, 100)));
  }, [thesis]);

  const safeProgress = useMemo(
    () => Math.max(0, Math.min(progressPercent || 0, 100)),
    [progressPercent],
  );

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const baseClass = "w-4 h-4";

    const fileType = fileTypes[ext];

    if (fileType) {
      return (
        <span className={`${baseClass} ${fileType.color}`}>
          {fileType.icon}
        </span>
      );
    }

    return <File className={`${baseClass} text-gray-500`} />;
  };

  const { downloadFile } = useFileDownloader();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-72">
          <Loader />
        </div>
      </div>
    );
  }

  if (isError || !thesis) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
        Không thể tải chi tiết luận văn. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="mt-10 mx-10 space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <BookOpen size={18} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Chi tiết luận văn
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Xem thông tin và các lần nộp đã công khai.
            </p>
          </div>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {thesis.status}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("details")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "details"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 dark:text-gray-400"
          }`}
        >
          Thông tin luận văn
        </button>

        <button
          onClick={() => setActiveTab("submission")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === "submission"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 dark:text-gray-400"
          }`}
        >
          Nộp luận văn
        </button>
      </div>

      {/* DETAILS TAB */}
      {activeTab === "details" && (
        <div className="space-y-4">
          <section className="space-y-2 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {thesis.title || "-"}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {thesis.titleEn || "-"}
            </p>

            <p className="pt-1 text-sm text-gray-700 dark:text-gray-300">
              {thesis.description || "-"}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {thesis.descriptionEn || "-"}
            </p>
          </section>

          <section className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Thông tin sinh viên
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <User size={14} className="text-gray-400" />
                <span>{thesis.student?.fullName}</span>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                MSSV: {thesis.student?.studentCode}
              </p>

              <p className="text-gray-600 dark:text-gray-400">
                Email: {thesis.student?.email}
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <TrendingUp size={13} />
              Tiến độ
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>

                <span className="text-sm font-semibold text-blue-600">
                  {safeProgress}%
                </span>
              </div>
            </div>
          </section>

          {thesis.organization?.name && (
            <Badge
              label={`Tổ chức: ${thesis.organization.name}`}
              variant="info"
            />
          )}
        </div>
      )}

      {/* SUBMISSION TAB */}
      {activeTab === "submission" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tài liệu đã nộp
            </h3>
            {isSubmissionsLoading && (
              <span className="text-xs text-gray-500">Đang tải...</span>
            )}
          </div>

          {submissions.length === 0 && !isSubmissionsLoading && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chưa có tài liệu nào được nộp.
              </p>
            </div>
          )}

          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
            >
              <div className="mb-3 flex justify-between">
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  Phiên bản {submission.version}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDateTimeVN(submission.submittedAt)}
                </span>
              </div>

              {submission.note && (
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  {submission.note}
                </p>
              )}

              <div className="space-y-2">
                {submission.files && submission.files.length > 0 ? (
                  submission.files.map((file) => (
                    <FileItem
                      key={file.id}
                      file={file}
                      getFileIcon={getFileIcon}
                      onDownload={async () => downloadFile(file.id)}
                    />
                  ))
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Không có file trong phiên bản này.
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default PublicThesisDetailsPage;
