import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import type { DefenseScore } from "../../../types/defense";
import type { DefenseResponse } from "../../../types/defense";
import Button from "../../../components/UI/Button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileDown,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { useFileDownloader } from "../../../hooks/useFileDownloader";
import Modal from "../../../components/UI/Modal";
import FilePreview from "../../../components/UI/FilePreview";

type Props = {
  defenses: DefenseResponse[];
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
};

const DefenseScheduleTable = ({
  defenses,
  loading = false,
  page,
  totalPages,
  onPageChange,
}: Props) => {
  const { downloadFile } = useFileDownloader();
  const [openMinutesPreview, setOpenMinutesPreview] = useState(false);
  const [previewMinutes, setPreviewMinutes] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const getMinutesFile = (row: DefenseResponse) => {
    const source =
      (row as any)?.minutesFile ??
      (row as any)?.minutes ??
      (row as any)?.minuteFile ??
      null;

    if (!source) return null;

    if (typeof source === "string") {
      return {
        id: source,
        name: "Bien-ban-bao-ve",
      };
    }

    return {
      id: source.id ?? source.fileId ?? source.uuid ?? "",
      name: source.name ?? source.fileName ?? "Bien-ban-bao-ve",
      url: source.url ?? source.fileUrl ?? "",
    };
  };

  const handleViewMinutes = async (row: DefenseResponse) => {
    const minutesFile = getMinutesFile(row);
    if (!minutesFile) return;

    if (minutesFile.id) {
      setPreviewMinutes({
        id: minutesFile.id,
        name: minutesFile.name,
      });
      setOpenMinutesPreview(true);
      return;
    }

    if (minutesFile.url) {
      window.open(minutesFile.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadMinutes = async (row: DefenseResponse) => {
    const minutesFile = getMinutesFile(row);
    if (!minutesFile?.id) return;

    await downloadFile(minutesFile.id);
  };

  const maxScoreColumns = defenses.reduce(
    (max, row) => Math.max(max, row?.council?.members?.length || 0),
    0,
  );

  return (
    <div className="space-y-5">
      {/* TITLE */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Danh sách phân công
        </p>
        <span className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
          {defenses.length} mục
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400 dark:text-gray-500 gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Đang tải dữ liệu...
        </div>
      )}

      {/* EMPTY */}
      {!loading && defenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <FaMagnifyingGlass className="text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Không có dữ liệu
          </p>
        </div>
      ) : !loading ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 overflow-hidden shadow-sm">
          <div className="overflow-auto">
            <table className="min-w-[1200px] w-full text-sm">
              {/* HEADER */}
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {[
                    "Sinh viên",
                    "Tên đề tài",
                    "GVHD",
                    "Thời gian",
                    "Hội đồng",
                    "Biên bản",
                  ].map((label, i) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0 ${
                        i === 3 || i === 5 ? "text-center" : "text-left"
                      }`}
                    >
                      {label}
                    </th>
                  ))}
                  {Array.from({ length: maxScoreColumns }).map((_, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                    >
                      Điểm {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* BODY */}
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-700/60">
                {defenses.map((row, index) => {
                  const scores: DefenseScore[] = row.scores || [];
                  const minutesFile = getMinutesFile(row);

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors duration-100"
                    >
                      {/* STUDENT */}
                      <td className="px-4 py-3 border-r border-gray-100 dark:border-gray-700/40">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                            <GraduationCap
                              size={13}
                              className="text-blue-500 shrink-0"
                            />
                            {row?.thesis?.student?.fullName || "-"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 pl-5">
                            {row?.thesis?.student?.studentCode || "-"}
                          </p>
                        </div>
                      </td>

                      {/* THESIS */}
                      <td className="px-4 py-3 max-w-[280px] border-r border-gray-100 dark:border-gray-700/40">
                        <p className="text-gray-700 dark:text-gray-200 leading-5 line-clamp-2 text-[13px]">
                          {row?.thesis?.title || "-"}
                        </p>
                      </td>

                      {/* MENTOR */}
                      <td className="px-4 py-3 border-r border-gray-100 dark:border-gray-700/40">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                            <UserRound
                              size={13}
                              className="text-emerald-500 shrink-0"
                            />
                            {row?.thesis?.mentor?.fullName || "-"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 pl-5">
                            {row?.thesis?.mentor?.lecturerCode || "-"}
                          </p>
                        </div>
                      </td>

                      {/* TIME */}
                      <td className="px-4 py-3 text-center whitespace-nowrap text-xs text-gray-500 dark:text-gray-400 border-r border-gray-100 dark:border-gray-700/40">
                        {row?.defenseTime
                          ? new Date(row.defenseTime).toLocaleString("vi-VN")
                          : "-"}
                      </td>

                      {/* COUNCIL */}
                      <td className="px-4 py-3 border-r border-gray-100 dark:border-gray-700/40 min-w-[200px]">
                        <div className="mb-2">
                          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                            {row?.council?.name || "-"}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {row?.council?.code || "-"}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          {row?.council?.members?.map((c, i) => (
                            <p
                              key={i}
                              className="text-xs text-gray-500 dark:text-gray-400 truncate"
                            >
                              {c?.lecturer?.fullName}{" "}
                              <span className="text-gray-400 dark:text-gray-500">
                                ({c?.lecturer?.lecturerCode || "-"})
                              </span>
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* MINUTES */}
                      <td className="px-4 py-3 border-r border-gray-100 dark:border-gray-700/40">
                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                          <Button
                            icon={Eye}
                            label="Xem"
                            variant="outline"
                            size="xs"
                            disabled={!minutesFile?.id}
                            onClick={() => handleViewMinutes(row)}
                          />
                          <Button
                            icon={FileDown}
                            label="Tải"
                            variant="outline"
                            size="xs"
                            disabled={!minutesFile?.id}
                            onClick={() => handleDownloadMinutes(row)}
                          />
                        </div>
                      </td>

                      {/* SCORES */}
                      {Array.from({ length: maxScoreColumns }).map((_, i) => {
                        const member = row?.council?.members?.[i];
                        const score = member
                          ? scores.find((s) => s.member.id === member.id)
                          : null;

                        return (
                          <td
                            key={i}
                            className={`px-4 py-3 text-center text-sm font-medium border-r border-gray-100 dark:border-gray-700/40 last:border-r-0 ${
                              !member
                                ? "text-gray-300 dark:text-gray-600"
                                : member && !score
                                  ? "text-red-400 dark:text-red-500 bg-red-50/60 dark:bg-red-900/10"
                                  : "text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {!member
                              ? "—"
                              : (score?.score ?? (
                                  <span className="text-xs font-normal">
                                    Chưa chấm
                                  </span>
                                ))}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-1">
          <Button
            label="Trước"
            icon={ChevronLeft}
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => onPageChange(Math.max(0, page - 1))}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
            {page + 1} / {totalPages}
          </span>
          <Button
            label="Sau"
            icon={ChevronRight}
            size="sm"
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          />
        </div>
      )}

      <Modal
        open={openMinutesPreview}
        onClose={() => {
          setOpenMinutesPreview(false);
          setPreviewMinutes(null);
        }}
        width="max-w-4xl"
      >
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            {previewMinutes?.name || "Biên bản bảo vệ"}
          </h2>

          {previewMinutes?.id ? (
            <FilePreview fileId={previewMinutes.id} />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-sm text-gray-500 dark:text-gray-400">
              Không có mã file để xem trực tiếp. Vui lòng dùng nút tải xuống.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DefenseScheduleTable;
