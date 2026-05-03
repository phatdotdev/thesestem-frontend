import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Download,
  File,
  FileArchive,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  ClipboardList,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../../../components/UI/Badge";
import Button from "../../../../components/UI/Button";
import Loader from "../../../../components/UI/Loader";
import Select from "../../../../components/UI/Select";
import { useAppDispatch } from "../../../../app/hook";
import { addToast } from "../../../../features/notification/toastSlice";
import { useFileDownloader } from "../../../../hooks/useFileDownloader";
import {
  useGetAssignmentDetailQuery,
  useGetStudentAssignmentSubmissionsQuery,
  useSubmitAssignmentMutation,
} from "../../../../services/groupApi";
import { formatDateTimeVN } from "../../../../utils/formatters";
import AssignmentUploadModal from "./AssignmentUploadModal";

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

/* ── File row (download) ── */
const FileRow = ({
  file,
  onDownload,
}: {
  file: any;
  onDownload: () => void;
}) => (
  <button
    type="button"
    onClick={onDownload}
    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-left hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-150"
  >
    <div className="flex min-w-0 items-center gap-2.5">
      {getFileIcon(file.name)}
      <span className="truncate text-sm text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {file.name}
      </span>
    </div>
    <span className="flex items-center gap-1 text-[11px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors shrink-0">
      <Download size={12} />
      Tải xuống
    </span>
  </button>
);

/* ── Section wrapper ── */
const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-3xl border border-gray-200/80 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

/* ═══ PAGE ═══ */
const AssignmentDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { "assignment-id": assignmentId, "group-id": groupId } = useParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const safeGroupId = groupId || "";
  const safeAssignmentId = assignmentId || "";

  const { data: assignmentResponse, isLoading: isAssignmentLoading } =
    useGetAssignmentDetailQuery(
      { groupId: safeGroupId, assignmentId: safeAssignmentId },
      { skip: !safeGroupId || !safeAssignmentId },
    );

  const {
    data: submissionResponse,
    isLoading: isSubmissionLoading,
    refetch: refetchSubmission,
  } = useGetStudentAssignmentSubmissionsQuery(
    { groupId: safeGroupId, assignmentId: safeAssignmentId },
    { skip: !safeGroupId || !safeAssignmentId },
  );

  const [submitAssignment] = useSubmitAssignmentMutation();
  const { downloadFile } = useFileDownloader();

  const assignment = assignmentResponse?.data;
  const isOpen = assignment?.status === "OPEN";

  const submissions = useMemo(() => {
    const data = submissionResponse?.data ?? [];
    return [...data].sort(
      (a, b) =>
        new Date(b.submittedAt || "").getTime() -
        new Date(a.submittedAt || "").getTime(),
    );
  }, [submissionResponse]);

  const latestSubmission = submissions[0] ?? null;
  const hasSubmitted = submissions.length > 0;

  useEffect(() => {
    if (!submissions.length) {
      setSelectedSubmissionId("");
      return;
    }
    setSelectedSubmissionId((prev) => {
      if (!prev) return submissions[0].id;
      return submissions.some((s) => s.id === prev) ? prev : submissions[0].id;
    });
  }, [submissions]);

  const selectedSubmission = useMemo(
    () =>
      submissions.find((s) => s.id === selectedSubmissionId) ??
      latestSubmission,
    [latestSubmission, selectedSubmissionId, submissions],
  );

  const submittedAtOptions = useMemo(
    () =>
      submissions.map((s) => ({
        label: formatDateTimeVN(s.submittedAt),
        value: s.id,
      })),
    [submissions],
  );

  const handleOpenUploadModal = () => {
    if (!isOpen) {
      dispatch(
        addToast({
          type: "warning",
          message: "Bài tập đã kết thúc, không thể nộp thêm.",
        }),
      );
      return;
    }
    setIsUploadModalOpen(true);
  };

  if (isAssignmentLoading || isSubmissionLoading) return <Loader />;

  if (!assignment)
    return (
      <Section className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Không tìm thấy bài tập.
      </Section>
    );

  return (
    <div className="mt-6 space-y-4">
      {/* Back */}
      <Button
        label="Quay lại"
        icon={ArrowLeft}
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
      />

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-4 py-3">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Trạng thái
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              label={isOpen ? "Đang nhận bài" : "Đã kết thúc"}
              variant={isOpen ? "success" : "danger"}
              size="sm"
              dot
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-4 py-3">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Bài nộp
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              label={hasSubmitted ? "Đã nộp" : "Chưa nộp"}
              variant={hasSubmitted ? "success" : "warning"}
              size="sm"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 px-4 py-3">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Hạn nộp
          </p>
          <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            {formatDateTimeVN(assignment.deadline)}
          </p>
        </div>
      </div>

      {/* ── Assignment info ── */}
      <Section>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="shrink-0 w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <ClipboardList size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
                {assignment.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400 dark:text-gray-500">
                <CalendarClock size={13} />
                <span>Hạn nộp: {formatDateTimeVN(assignment.deadline)}</span>
              </div>
            </div>
          </div>
        </div>

        {assignment.description && (
          <>
            <div className="my-4 h-px bg-gray-100 dark:bg-gray-800" />
            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-gray-300">
              {assignment.description}
            </p>
          </>
        )}
      </Section>

      {/* ── Submission area ── */}
      {!hasSubmitted ? (
        <Section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Bài nộp của bạn
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Bạn chưa nộp bài. Nhấn nút để thêm file.
              </p>
            </div>
            <Button
              label="Nộp bài"
              icon={UploadCloud}
              variant="primary"
              size="sm"
              disabled={!isOpen}
              onClick={handleOpenUploadModal}
            />
          </div>
        </Section>
      ) : (
        <Section>
          {/* Submitted header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Bài nộp của bạn
              </h2>
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500">
                {submissions.length} lần nộp
              </span>
            </div>
            <Button
              label="Nộp lại"
              icon={UploadCloud}
              variant="outline"
              size="xs"
              disabled={!isOpen}
              onClick={handleOpenUploadModal}
            />
          </div>

          {/* Submission selector */}
          <div className="max-w-sm mb-4">
            <Select
              label="Phiên bản nộp"
              iconLeft={CalendarClock}
              variant="outline"
              size="sm"
              value={selectedSubmission?.id ?? ""}
              options={submittedAtOptions}
              onChange={(e) => setSelectedSubmissionId(e.target.value)}
            />
          </div>

          {/* Files */}
          {selectedSubmission?.files?.length ? (
            <div className="space-y-2">
              {selectedSubmission.files.map((file: any) => (
                <FileRow
                  key={file.id}
                  file={file}
                  onDownload={() => downloadFile(file.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có file trong lần nộp này.
            </p>
          )}
        </Section>
      )}

      {/* ── Upload modal ── */}
      <AssignmentUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        isSubmitting={isSubmitting}
        hasSubmitted={hasSubmitted}
        isOpen={isOpen}
        onSubmit={async (files) => {
          if (!safeGroupId || !safeAssignmentId) return;

          try {
            setIsSubmitting(true);

            const form = new FormData();

            files.forEach((f) => form.append("files", f));

            await submitAssignment({
              groupId: safeGroupId,
              assignmentId: safeAssignmentId,
              form,
            }).unwrap();

            dispatch(
              addToast({
                type: "success",
                message: "Nộp bài thành công.",
              }),
            );

            setIsUploadModalOpen(false);

            await refetchSubmission();
          } catch {
            dispatch(
              addToast({
                type: "error",
                message: "Nộp bài thất bại.",
              }),
            );
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </div>
  );
};

export default AssignmentDetailsPage;
