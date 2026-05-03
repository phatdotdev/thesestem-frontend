import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Download,
  File,
  FileArchive,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../../../components/UI/Badge";
import Button from "../../../../components/UI/Button";
import Loader from "../../../../components/UI/Loader";
import Select from "../../../../components/UI/Select";
import {
  useGetAssignmentDetailQuery,
  useGetAssignmentSubmissionsQuery,
} from "../../../../services/groupApi";
import { formatDateTimeVN } from "../../../../utils/formatters";

const getFileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) {
    return (
      <FileImage
        size={16}
        className="text-pink-500 dark:text-pink-400 shrink-0"
      />
    );
  }

  if (["pdf"].includes(ext)) {
    return (
      <FileText size={16} className="text-red-500 dark:text-red-400 shrink-0" />
    );
  }

  if (["doc", "docx"].includes(ext)) {
    return (
      <FileText
        size={16}
        className="text-blue-500 dark:text-blue-400 shrink-0"
      />
    );
  }

  if (["xls", "xlsx", "csv"].includes(ext)) {
    return (
      <FileSpreadsheet
        size={16}
        className="text-emerald-500 dark:text-emerald-400 shrink-0"
      />
    );
  }

  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return (
      <FileArchive
        size={16}
        className="text-amber-500 dark:text-amber-400 shrink-0"
      />
    );
  }

  if (
    ["js", "ts", "jsx", "tsx", "java", "py", "cpp", "c", "cs", "go"].includes(
      ext,
    )
  ) {
    return (
      <FileCode
        size={16}
        className="text-indigo-500 dark:text-indigo-400 shrink-0"
      />
    );
  }

  return (
    <File size={16} className="text-gray-500 dark:text-gray-400 shrink-0" />
  );
};

const MentorAssignmentDetailsPage = () => {
  const navigate = useNavigate();
  const { "group-id": groupId, "assignment-id": assignmentId } = useParams();

  const safeGroupId = groupId || "";
  const safeAssignmentId = assignmentId || "";

  const { data: assignmentResponse, isLoading: isAssignmentLoading } =
    useGetAssignmentDetailQuery(
      { groupId: safeGroupId, assignmentId: safeAssignmentId },
      { skip: !safeGroupId || !safeAssignmentId },
    );

  const { data: submissionsResponse, isLoading: isSubmissionsLoading } =
    useGetAssignmentSubmissionsQuery(
      { groupId: safeGroupId, assignmentId: safeAssignmentId },
      { skip: !safeGroupId || !safeAssignmentId },
    );

  const assignment = assignmentResponse?.data;
  const submissions = useMemo(() => {
    const data = submissionsResponse?.data ?? [];
    return [...data].sort((a, b) => {
      const timeA = new Date(a.submittedAt || "").getTime();
      const timeB = new Date(b.submittedAt || "").getTime();
      return timeB - timeA;
    });
  }, [submissionsResponse]);

  const submissionsByStudent = useMemo(() => {
    const grouped = new Map<string, typeof submissions>();

    submissions.forEach((submission) => {
      const studentId = submission.student?.id || "unknown-student";
      const current = grouped.get(studentId) ?? [];
      current.push(submission);
      grouped.set(studentId, current);
    });

    return Array.from(grouped.entries()).map(
      ([studentId, studentSubmissions]) => ({
        studentId,
        studentName: studentSubmissions[0]?.student?.fullName || "Sinh viên",
        submissions: studentSubmissions.sort((a, b) => {
          const timeA = new Date(a.submittedAt || "").getTime();
          const timeB = new Date(b.submittedAt || "").getTime();
          return timeB - timeA;
        }),
      }),
    );
  }, [submissions]);

  const [selectedSubmissionByStudent, setSelectedSubmissionByStudent] =
    useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedSubmissionByStudent((prev) => {
      const next: Record<string, string> = {};

      submissionsByStudent.forEach((studentGroup) => {
        const existing = prev[studentGroup.studentId];
        const hasExisting = studentGroup.submissions.some(
          (item) => item.id === existing,
        );

        next[studentGroup.studentId] =
          hasExisting && existing
            ? existing
            : studentGroup.submissions[0]?.id || "";
      });

      return next;
    });
  }, [submissionsByStudent]);

  if (isAssignmentLoading || isSubmissionsLoading) {
    return <Loader />;
  }

  if (!assignment) {
    return (
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Không tìm thấy assignment.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      <Button
        label="Quay lại danh sách assignment"
        icon={ArrowLeft}
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {assignment.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CalendarClock className="h-4 w-4" />
              Hạn nộp: {formatDateTimeVN(assignment.deadline)}
            </div>
          </div>

          <Badge
            label={
              assignment.status === "OPEN" ? "Đang nhận bài" : "Đã kết thúc"
            }
            variant={assignment.status === "OPEN" ? "success" : "danger"}
            size="sm"
            dot
          />
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {assignment.description ||
            "Giảng viên chưa thêm mô tả cho assignment này."}
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            Bài nộp của sinh viên
          </h2>
          <Badge
            label={`${submissionsByStudent.length} sinh viên đã nộp`}
            variant="info"
            size="sm"
          />
        </div>

        {submissionsByStudent.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
            Chưa có sinh viên nộp bài
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {submissionsByStudent.map((studentGroup) => {
              const selectedId =
                selectedSubmissionByStudent[studentGroup.studentId] || "";
              const selectedSubmission =
                studentGroup.submissions.find(
                  (item) => item.id === selectedId,
                ) || studentGroup.submissions[0];

              return (
                <div
                  key={studentGroup.studentId}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                      <User className="h-4 w-4" />
                      {studentGroup.studentName}
                    </div>
                    <Badge
                      label={`${studentGroup.submissions.length} lần nộp`}
                      variant="secondary"
                      size="sm"
                    />
                  </div>

                  <div className="mt-3 max-w-xl">
                    <Select
                      label="Chọn mốc thời gian nộp"
                      iconLeft={CalendarClock}
                      variant="outline"
                      size="sm"
                      value={selectedSubmission?.id || ""}
                      options={studentGroup.submissions.map((item) => ({
                        label: formatDateTimeVN(item.submittedAt),
                        value: item.id,
                      }))}
                      onChange={(e) =>
                        setSelectedSubmissionByStudent((prev) => ({
                          ...prev,
                          [studentGroup.studentId]: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {selectedSubmission?.submittedAt && (
                    <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      Đang xem bài nộp lúc:{" "}
                      {formatDateTimeVN(selectedSubmission.submittedAt)}
                    </p>
                  )}

                  <div className="mt-3 space-y-2">
                    {selectedSubmission?.files?.length ? (
                      selectedSubmission.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            {getFileIcon(file.name)}
                            <span className="truncate text-sm text-gray-700 dark:text-gray-200">
                              {file.name}
                            </span>
                          </div>
                          {file.url ? (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                            >
                              <Download size={12} />
                              Xem file
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              Không có link file
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Bài nộp không có file đính kèm.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorAssignmentDetailsPage;
