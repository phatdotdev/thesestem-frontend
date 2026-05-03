import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  File,
  Check,
  GraduationCap,
  User,
  Mail,
  Fingerprint,
  Calendar,
  SearchCode, // Thêm import này
  Download, // Thêm import này
} from "lucide-react";

import Button from "../../../../components/UI/Button";
import Input from "../../../../components/UI/Input";
import ConfirmModal from "../../../../components/UI/ConfirmModal";
import { useFileDownloader } from "../../../../hooks/useFileDownloader";
import { fileTypes } from "../../../../utils/fileType";
import { useAppDispatch } from "../../../../app/hook";
import { addToast } from "../../../../features/notification/toastSlice";

import {
  useApproveThesisMutation,
  useGetSubmissionsByThesisQuery,
  useGetThesisByIdAndGroupQuery,
  useUpdateThesisMutation,
} from "../../../../services/thesisApi";

// Helper components
const getStatusStyles = (status?: string) => {
  const map: Record<string, string> = {
    proposal:
      "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    in_progress:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800",
    approved:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800",
    submitted:
      "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400 border-sky-100 dark:border-sky-800",
    graded:
      "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700",
  };
  return (
    map[status?.toLowerCase() || ""] ||
    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
  );
};

const getStatusLabel = (status?: string) => {
  const statusMap: Record<string, string> = {
    proposal: "Đề xuất",
    in_progress: "Đang thực hiện",
    approved: "Đã duyệt",
    submitted: "Đã nộp",
    graded: "Đã chấm điểm",
  };
  return statusMap[status?.toLowerCase() || ""] || status || "Không xác định";
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  const baseClass = "w-4 h-4";
  const fileType = fileTypes[ext];
  if (fileType)
    return (
      <span className={`${baseClass} ${fileType.color}`}>{fileType.icon}</span>
    );
  return <File className={`${baseClass} text-gray-500`} />;
};

const ThesisDetailsPage = () => {
  const { "group-id": groupId, "thesis-id": thesisId } = useParams();
  const [activeTab, setActiveTab] = useState<"details" | "submission">(
    "details",
  );
  const [progressPercent, setProgressPercent] = useState(0);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [analyzingFileId, setAnalyzingFileId] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const {
    data: thesisResponse,
    isLoading,
    isError,
    refetch,
  } = useGetThesisByIdAndGroupQuery(
    { thesisId: thesisId as string, groupId: groupId as string },
    { skip: !groupId || !thesisId },
  );

  const thesis = thesisResponse?.data;
  const [updateThesis, { isLoading: isUpdating }] = useUpdateThesisMutation();
  const [approveThesis] = useApproveThesisMutation();
  const { downloadFile } = useFileDownloader();

  const { data: submissionsResponse } = useGetSubmissionsByThesisQuery(
    { thesisId: thesisId as string, form: {} },
    { skip: !thesisId },
  );
  const submissions = submissionsResponse?.data || [];

  useEffect(() => {
    if (thesis?.progressPercent !== undefined) {
      setProgressPercent(thesis.progressPercent);
    }
  }, [thesis]);

  const safeProgress = useMemo(
    () => Math.max(0, Math.min(progressPercent || 0, 100)),
    [progressPercent],
  );

  const handleUpdateProgress = async () => {
    if (!thesis) return;
    try {
      await updateThesis({
        id: thesis.id,
        data: { ...thesis, progressPercent: safeProgress },
      }).unwrap();
      refetch();
      dispatch(
        addToast({ type: "success", message: "Cập nhật tiến độ thành công" }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeFile = async (fileId: string) => {
    try {
      setAnalyzingFileId(fileId);
      dispatch(addToast({ type: "info", message: "Đang phân tích file..." }));
      console.log("Analyzing file:", fileId);
    } finally {
      setAnalyzingFileId(null);
    }
  };

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse text-gray-400">
        Đang tải dữ liệu luận văn...
      </div>
    );
  if (isError || !thesis)
    return (
      <div className="p-20 text-center text-red-500">
        Không tìm thấy thông tin luận văn
      </div>
    );

  return (
    <div className="mt-6 space-y-6">
      {/* HEADER CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {thesis.title}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${getStatusStyles(thesis.status)}`}
                >
                  {getStatusLabel(thesis.status)}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} /> Cập nhật:{" "}
                  {new Date().toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          {thesis.status === "IN_PROGRESS" && (
            <Button
              variant="success"
              label="Duyệt luận văn"
              icon={Check}
              onClick={() => setShowApproveModal(true)}
              className="rounded-xl"
            />
          )}
        </div>

        {/* TAB NAVIGATION */}
        <div className="mt-6 inline-flex w-full flex-col gap-2 rounded-2xl bg-gray-100/90 p-2 dark:bg-gray-800/80 sm:w-auto sm:flex-row">
          {(["details", "submission"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow dark:bg-gray-900 dark:text-blue-300"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
              }`}
            >
              {tab === "details"
                ? "Thông tin chi tiết"
                : `Tài liệu nộp (${submissions.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === "details" ? (
          <>
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Mô tả luận văn
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {thesis.description || "Chưa có mô tả."}
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <User size={16} className="text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Sinh viên thực hiện
                      </p>
                      <p className="text-sm font-medium">
                        {thesis.student?.fullName || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <Fingerprint size={16} className="text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Mã số sinh viên
                      </p>
                      <p className="text-sm font-medium">
                        {thesis.student?.studentCode || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <Mail size={16} className="text-gray-500" />
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Email liên hệ
                      </p>
                      <p className="text-sm font-medium">
                        {thesis.student?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Tiến độ thực hiện
                  </h3>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
                    {safeProgress}%
                  </span>
                </div>
                <div className="space-y-6">
                  <input
                    type="range"
                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600 dark:bg-gray-800"
                    value={safeProgress}
                    onChange={(e) => setProgressPercent(Number(e.target.value))}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={progressPercent}
                      onChange={(e) =>
                        setProgressPercent(Number(e.target.value))
                      }
                      className="text-center font-bold"
                    />
                    <Button
                      label="Cập nhật"
                      onClick={handleUpdateProgress}
                      disabled={isUpdating}
                      className="w-full rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-3 space-y-4">
            {submissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-20 text-center dark:border-gray-700">
                <File size={40} className="mx-auto text-gray-200 mb-2" />
                <p className="text-gray-400 text-sm">
                  Chưa có phiên bản nào được nộp.
                </p>
              </div>
            ) : (
              submissions.map((sub: any, index: number) => (
                <div
                  key={sub.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                        Phiên bản {sub.version}
                      </span>
                      {index === 0 && (
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                          Mới nhất
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 italic">
                      Đã nộp:{" "}
                      {new Date(sub.submittedAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    {sub.files?.map((file: any) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group dark:border-gray-800 dark:hover:bg-blue-900/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                            {getFileIcon(file.name || "")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                              {file.name || "tailieu_luanvan.pdf"}
                            </p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleAnalyzeFile(file.id)}
                            className="p-2 hover:text-blue-600 text-gray-400"
                            title="Phân tích AI"
                          >
                            <SearchCode size={18} />
                          </button>
                          <button
                            onClick={() => downloadFile(file.id)}
                            className="p-2 hover:text-blue-600 text-gray-400"
                            title="Tải xuống"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={showApproveModal}
        title="Duyệt luận văn"
        description="Xác nhận rằng sinh viên đã hoàn thành đầy đủ các yêu cầu và luận văn này đủ điều kiện nộp bản chính thức?"
        onClose={() => setShowApproveModal(false)}
        onConfirm={async () => {
          await approveThesis(thesis.id).unwrap();
          setShowApproveModal(false);
          refetch();
        }}
      />
    </div>
  );
};

export default ThesisDetailsPage;
