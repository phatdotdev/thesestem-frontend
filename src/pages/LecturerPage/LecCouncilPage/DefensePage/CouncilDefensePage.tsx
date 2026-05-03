import { useNavigate, useParams } from "react-router-dom";
import {
  useGetDefenseByIdForMentorQuery,
  useDeleteMinutesFileMutation,
  useScoreThesisMutation,
  useUploadMinutesFileMutation,
} from "../../../../services/defenseApi";
import AvatarInitial from "../../../../components/UI/AvatarInitial";
import {
  BookOpen,
  Star,
  FileText,
  History,
  FileImage,
  FileCode,
  File,
  FileArchive,
  Bot,
  Upload,
  Trash2,
  FileDown,
  Eye,
  MoveLeft,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import Input from "../../../../components/UI/Input";
import Textarea from "../../../../components/UI/TextArea";
import ScoreCard from "./ScoreCard";
import { useGetSubmissionsByThesisQuery } from "../../../../services/thesisApi";
import { formatDateTimeVN } from "../../../../utils/formatters";
import { useFileDownloader } from "../../../../hooks/useFileDownloader";
import AIChatRightPanelLayout from "../../../../components/AIChat/AIChatPanel";
import FileItem from "../../../../components/UI/FileItem";
import type { FileAssetResponse } from "../../../../types/thesis";
import Select from "../../../../components/UI/Select";
import Button from "../../../../components/UI/Button";
import ConfirmModal from "../../../../components/UI/ConfirmModal";
import { useAppDispatch } from "../../../../app/hook";
import { addToast } from "../../../../features/notification/toastSlice";
import Modal from "../../../../components/UI/Modal";
import FilePreview from "../../../../components/UI/FilePreview";

/* ── Section wrapper ── */
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
      <span className="text-gray-400 dark:text-gray-500">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {title}
      </h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/* ── Tab ── */
const Tab = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150
      ${
        active
          ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-800/60"
      }`}
  >
    <span
      className={
        active
          ? "text-gray-600 dark:text-gray-300"
          : "text-gray-400 dark:text-gray-500"
      }
    >
      {icon}
    </span>
    {label}
  </button>
);

/* ── File icon helper ── */
const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
    return <FileImage size={15} className="text-pink-400 dark:text-pink-300" />;
  }

  if (["pdf"].includes(ext)) {
    return <FileText size={15} className="text-red-400 dark:text-red-300" />;
  }

  if (["doc", "docx"].includes(ext)) {
    return <FileText size={15} className="text-blue-500 dark:text-blue-300" />;
  }

  if (["zip", "rar", "7z", "tar"].includes(ext)) {
    return (
      <FileArchive size={15} className="text-amber-500 dark:text-amber-300" />
    );
  }

  if (["js", "ts", "jsx", "tsx", "py", "java", "cpp", "c"].includes(ext)) {
    return (
      <FileCode size={15} className="text-emerald-500 dark:text-emerald-300" />
    );
  }

  return <File size={15} className="text-gray-400 dark:text-gray-500" />;
};

/* ── Page ── */
const CouncilDefensePage = () => {
  const navigate = useNavigate();
  const {
    "org-code": code,
    "council-id": councilId,
    "defense-id": id,
  } = useParams();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: defenseResponse, isLoading } = useGetDefenseByIdForMentorQuery(
    id as string,
  );

  const [scoreThesis] = useScoreThesisMutation();
  const [uploadMinutesFile, { isLoading: isUploadingMinutes }] =
    useUploadMinutesFileMutation();
  const [deleteMinutesFile, { isLoading: isDeletingMinutes }] =
    useDeleteMinutesFileMutation();

  const [activeTab, setActiveTab] = useState<"score" | "content">("score");
  const [editing, setEditing] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [analyzingFile, setAnalyzingFile] = useState<FileAssetResponse | null>(
    null,
  );
  const [selectedSubmissionId, setSelectedSubmissionId] = useState("");
  const [pendingMinutesFile, setPendingMinutesFile] = useState<File | null>(
    null,
  );
  const [openUploadConfirm, setOpenUploadConfirm] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openMinutesPreview, setOpenMinutesPreview] = useState(false);

  const [form, setForm] = useState({
    score: "",
    comment: "",
  });

  const d = defenseResponse?.data;
  const thesisId = d?.thesis?.id || "";

  const { downloadFile } = useFileDownloader();

  const { data: submissionsResponse, isLoading: isSubmissionsLoading } =
    useGetSubmissionsByThesisQuery(
      { thesisId, form: { page: 0, size: 20 } },
      { skip: !thesisId },
    );

  const submissions = [...(submissionsResponse?.data ?? [])].sort((a, b) => {
    const byVersion = (b.version ?? 0) - (a.version ?? 0);
    if (byVersion !== 0) return byVersion;

    const timeA = new Date(a.submittedAt ?? "").getTime();
    const timeB = new Date(b.submittedAt ?? "").getTime();
    return timeB - timeA;
  });

  useEffect(() => {
    if (submissions.length === 0) {
      setSelectedSubmissionId("");
      return;
    }

    setSelectedSubmissionId((prev) => {
      if (!prev) return submissions[0].id;
      return submissions.some((item) => item.id === prev)
        ? prev
        : submissions[0].id;
    });
  }, [submissions]);

  const selectedSubmission = useMemo(() => {
    if (!submissions.length) return null;
    return (
      submissions.find((item) => item.id === selectedSubmissionId) ||
      submissions[0]
    );
  }, [selectedSubmissionId, submissions]);

  const submissionOptions = useMemo(
    () =>
      submissions.map((item) => ({
        value: item.id,
        label: `v${item.version} • ${formatDateTimeVN(item.submittedAt)}`,
      })),
    [submissions],
  );

  const minutesFile = useMemo<FileAssetResponse | null>(() => {
    const source =
      (d as any)?.minutesFile ??
      (d as any)?.minutes ??
      (d as any)?.minuteFile ??
      null;

    if (!source) {
      return null;
    }

    if (typeof source === "string") {
      const inferredName = source.split("/").pop() || "bien-ban";
      return {
        id: "",
        name: inferredName,
        url: source,
      };
    }

    const sourceRecord = source as Partial<FileAssetResponse> & {
      fileName?: string;
      originalName?: string;
      fileUrl?: string;
      downloadUrl?: string;
    };

    const url =
      sourceRecord.url ||
      sourceRecord.fileUrl ||
      sourceRecord.downloadUrl ||
      "";
    const id = sourceRecord.id || "";
    const name =
      sourceRecord.name ||
      sourceRecord.fileName ||
      sourceRecord.originalName ||
      (url ? url.split("/").pop() : undefined) ||
      "bien-ban";

    if (!url && !id) {
      return null;
    }

    return {
      id,
      name,
      url,
    };
  }, [d]);

  const averageScore = useMemo(() => {
    const valid = (d?.scores || [])
      .map((s) => Number(s.score))
      .filter((s) => !Number.isNaN(s));
    if (!valid.length) return null;
    const total = valid.reduce((sum, value) => sum + value, 0);
    return total / valid.length;
  }, [d?.scores]);

  const submit = async () => {
    await scoreThesis({
      id,
      memberId: d?.member?.id as string,
      data: form,
    });

    setEditing(false);
  };

  const askUploadMinutes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      return;
    }

    setPendingMinutesFile(file);
    setOpenUploadConfirm(true);
    event.target.value = "";
  };

  const confirmUploadMinutes = async () => {
    if (!id || !pendingMinutesFile) {
      return;
    }

    try {
      await uploadMinutesFile({ id, file: pendingMinutesFile }).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: "Tải biên bản lên thành công",
        }),
      );
      setOpenUploadConfirm(false);
      setPendingMinutesFile(null);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Tải biên bản lên thất bại",
        }),
      );
    }
  };

  const confirmDeleteMinutes = async () => {
    if (!id) {
      return;
    }

    try {
      await deleteMinutesFile(id).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: "Xóa biên bản thành công",
        }),
      );
      setOpenDeleteConfirm(false);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Xóa biên bản thất bại",
        }),
      );
    }
  };

  const handleDownloadMinutes = () => {
    if (!minutesFile) {
      return;
    }

    if (minutesFile.id) {
      downloadFile(minutesFile.id);
      return;
    }

    if (minutesFile.url) {
      window.open(minutesFile.url, "_blank", "noopener,noreferrer");
    }
  };

  const handlePreviewMinutes = () => {
    if (!minutesFile) {
      return;
    }

    if (minutesFile.id) {
      setOpenMinutesPreview(true);
      return;
    }

    if (minutesFile.url) {
      window.open(minutesFile.url, "_blank", "noopener,noreferrer");
      return;
    }

    dispatch(
      addToast({
        type: "warning",
        message: "Không thể xem trước biên bản ở thời điểm hiện tại",
      }),
    );
  };

  const scored =
    d?.scores?.some((score) => score.member?.id === d?.member?.id) ?? false;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">
        Đang tải...
      </div>
    );

  if (!d)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">
        Không có dữ liệu
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          label="Quay lại danh sách chấm"
          icon={MoveLeft}
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/${code}/l/councils/${councilId}`)}
        />
      </div>

      {/* ═══ THESIS INFO ═══ */}
      <Section icon={<BookOpen size={15} />} title="Thông tin luận văn">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-snug">
            {d.thesis?.title}
          </h1>

          {d.thesis?.titleEn && (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-1">
              {d.thesis.titleEn}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Sinh viên thực hiện",
              name: d.thesis?.student?.fullName,
              sub: d.thesis?.student?.studentCode,
            },
            {
              label: "Giảng viên hướng dẫn",
              name: d.thesis?.mentor?.fullName,
              sub: d.thesis?.mentor?.lecturerCode,
            },
          ].map(({ label, name, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <AvatarInitial fullName={name} size={36} />

              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">
                  {label}
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {name}
                </p>

                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">
                Biên bản bảo vệ
              </p>

              {minutesFile ? (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">
                  {minutesFile.name}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Chưa có biên bản được tải lên.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {minutesFile && (
                <Button
                  icon={Eye}
                  label="Xem biên bản"
                  variant="outline"
                  size="sm"
                  onClick={handlePreviewMinutes}
                />
              )}

              {minutesFile && (
                <Button
                  icon={FileDown}
                  label="Tải xuống"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadMinutes}
                />
              )}

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={askUploadMinutes}
              />

              <Button
                icon={Upload}
                label={minutesFile ? "Thay biên bản" : "Tải biên bản"}
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              />

              {minutesFile && (
                <Button
                  icon={Trash2}
                  label="Xóa"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenDeleteConfirm(true)}
                />
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ TABS ═══ */}
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-1 p-1.5 border-b border-gray-200 dark:border-gray-700">
          <Tab
            icon={<Star size={14} />}
            label="Chấm điểm"
            active={activeTab === "score"}
            onClick={() => setActiveTab("score")}
          />

          <Tab
            icon={<FileText size={14} />}
            label="Nội dung luận văn"
            active={activeTab === "content"}
            onClick={() => setActiveTab("content")}
          />
        </div>

        {/* ── Tab 1: Chấm điểm ── */}
        {activeTab === "score" && (
          <div className="p-5 space-y-6 bg-white dark:bg-gray-900">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500 font-medium">
                  Điểm trung bình hội đồng
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Tính từ {d.scores?.length || 0} lượt chấm
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {averageScore === null ? "--" : averageScore.toFixed(2)}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  / 10
                </p>
              </div>
            </div>

            {/* ===== LIST SCORES ===== */}
            <div className="space-y-3">
              {d.scores?.length ? (
                d.scores.map((score: any) => (
                  <ScoreCard
                    key={score.id}
                    isMe={score.member.id === d?.member?.id}
                    score={score}
                    onEdit={() => {
                      setForm({
                        score: String(score.score),
                        comment: score.comment,
                      });
                      setEditing(true);
                    }}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 gap-1.5">
                  <span className="text-2xl">🗳️</span>
                  <p className="text-sm">Chưa có điểm nào</p>
                </div>
              )}
            </div>

            {/* ===== FORM ===== */}
            {(!scored || editing) && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Điểm"
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    placeholder="0.0"
                    value={form.score}
                    onChange={(e) =>
                      setForm({ ...form, score: e.target.value })
                    }
                  />
                </div>

                <Textarea
                  rows={4}
                  label="Nhận xét"
                  placeholder="Nhập nhận xét cho luận văn..."
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                />

                <div className="flex justify-end">
                  <button
                    onClick={submit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl 
                    bg-gray-800 text-white text-sm font-medium
                    hover:bg-gray-900 active:scale-[0.98] transition-all duration-150"
                  >
                    <Star size={14} />
                    Lưu điểm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Nội dung luận văn ── */}
        {activeTab === "content" && (
          <div className="p-5 bg-white dark:bg-gray-900 space-y-6">
            {/* Phần mô tả tóm tắt */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[14px] font-bold text-gray-700 dark:text-gray-200">
                    Mô tả tiếng Việt
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {d.thesis?.description?.trim() || "Chưa có nội dung mô tả."}
                  </p>
                </div>

                {d.thesis?.descriptionEn && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                      English Description
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                      {d.thesis.descriptionEn.trim()}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsAiChatOpen(true)}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
              >
                <Bot size={16} />
                AI Assistant
              </button>
            </div>

            {/* ═══ LỊCH SỬ NỘP BÀI (Tiêu đề + Select trên 1 dòng) ═══ */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <History size={16} className="text-gray-500" />
                  </div>
                  <h3 className="text-sm font-bold">Lịch sử nộp bài</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                    {submissions.length}
                  </span>
                </div>

                {submissions.length > 0 && (
                  <div className="w-full sm:w-64">
                    <Select
                      variant="outline"
                      size="sm"
                      value={selectedSubmissionId}
                      options={submissionOptions}
                      onChange={(e) => setSelectedSubmissionId(e.target.value)}
                      // Thêm class để Select trông gọn hơn khi nằm trên dòng tiêu đề
                      className="!py-1.5 text-xs font-medium shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Hiển thị nội dung phiên bản đã chọn */}
              {isSubmissionsLoading ? (
                <div className="py-10 text-center animate-pulse text-sm text-gray-400">
                  Đang tải dữ liệu phiên bản...
                </div>
              ) : submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 py-10 text-gray-400">
                  <History size={32} className="opacity-20" />
                  <p className="text-sm">
                    Chưa có bất kỳ lần nộp nào từ sinh viên.
                  </p>
                </div>
              ) : (
                selectedSubmission && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="rounded-[1.25rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50/50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="px-2 py-0.5 rounded-md bg-gray-700 text-white text-[10px] font-black uppercase tracking-wider">
                            v{selectedSubmission.version}
                          </div>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                            Cập nhật:{" "}
                            {formatDateTimeVN(selectedSubmission.submittedAt)}
                          </p>
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">
                          {selectedSubmission.files?.length || 0} Files được
                          đính kèm
                        </div>
                      </div>

                      <div className="p-4 space-y-4">
                        {selectedSubmission.note && (
                          <div className="relative p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400 text-sm text-gray-600 dark:text-gray-300">
                            <span className="absolute -top-2 left-2 bg-white dark:bg-gray-900 px-2 text-[10px] font-bold text-gray-500 uppercase">
                              Ghi chú
                            </span>
                            {selectedSubmission.note}
                          </div>
                        )}

                        <div className="grid gap-3 md:grid-cols-2">
                          {selectedSubmission.files?.map((file) => (
                            <FileItem
                              key={file.id}
                              file={file}
                              getFileIcon={getFileIcon}
                              onDownload={downloadFile}
                              onAnalyze={() => {
                                setIsAiChatOpen(true);
                                setAnalyzingFile(file);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
      {/* Modals */}
      <AIChatRightPanelLayout
        open={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        file={analyzingFile}
      />

      <Modal
        open={openMinutesPreview}
        onClose={() => setOpenMinutesPreview(false)}
        width="max-w-4xl"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {minutesFile?.name || "Biên bản bảo vệ"}
          </h2>

          {minutesFile?.id ? (
            <FilePreview fileId={minutesFile.id} />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-sm text-gray-500 dark:text-gray-400">
              Không có mã file để xem trực tiếp. Vui lòng dùng nút tải xuống.
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        open={openUploadConfirm}
        onClose={() => {
          setOpenUploadConfirm(false);
          setPendingMinutesFile(null);
        }}
        onConfirm={confirmUploadMinutes}
        type="info"
        title="Xác nhận tải biên bản"
        description={`Bạn có chắc chắn muốn tải file \"${pendingMinutesFile?.name || ""}\" lên làm biên bản bảo vệ?`}
        confirmText="Tải lên"
        cancelText="Hủy"
        loading={isUploadingMinutes}
      />

      <ConfirmModal
        open={openDeleteConfirm}
        onClose={() => setOpenDeleteConfirm(false)}
        onConfirm={confirmDeleteMinutes}
        type="danger"
        title="Xác nhận xóa biên bản"
        description="Bạn có chắc chắn muốn xóa biên bản bảo vệ hiện tại?"
        confirmText="Xóa"
        cancelText="Hủy"
        loading={isDeletingMinutes}
      />
    </div>
  );
};

export default CouncilDefensePage;
