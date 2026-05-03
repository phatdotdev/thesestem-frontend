import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FileSpreadsheet, Upload, X, Download } from "lucide-react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import {
  useAddMentorToCurrentSemesterMutation,
  useGetThesisMentorsQuery,
} from "../../../services/semApi";
import { useGetLecturersQuery } from "../../../services/userApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ExcelRow = Record<string, unknown>;

type PreviewRow = {
  rowNo: number;
  code: string;
  fullName: string;
  status: string;
  lecturerId: string | null;
  error?: string;
};

const normalize = (value: unknown) => (value ?? "").toString().trim();

const normalizeHeader = (value: string) =>
  normalize(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getValue = (row: ExcelRow, aliases: string[]) => {
  const aliasSet = new Set(aliases.map(normalizeHeader));

  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(normalizeHeader(key))) {
      return normalize(value);
    }
  }

  return "";
};

const MentorExcelImportModal = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { data: lecturersResponse } = useGetLecturersQuery({});
  const { data: semesterMentorsResponse } = useGetThesisMentorsQuery({});
  const [addMentorToSemester] = useAddMentorToCurrentSemesterMutation();

  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const lecturers = lecturersResponse?.data || [];
  const semesterMentors = semesterMentorsResponse?.data || [];

  const reset = () => {
    setRows([]);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDownloadTemplate = () => {
    const data = [["Mã GV"], ["GV001"], ["GV002"]];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mentors");
    XLSX.writeFile(wb, "mau-them-giang-vien-hoc-ky.xlsx");
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      dispatch(
        addToast({
          type: "error",
          message: "Chỉ chấp nhận file Excel (.xlsx, .xls)",
        }),
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      dispatch(
        addToast({
          type: "error",
          message: "File quá lớn (tối đa 5MB)",
        }),
      );
      return;
    }

    reset();
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];

      let json = XLSX.utils.sheet_to_json<ExcelRow>(ws, {
        defval: "",
        raw: false,
      });

      json = json.filter((row) =>
        Object.values(row).some((value) => normalize(value) !== ""),
      );

      const lecturerMap = new Map(
        lecturers.map((lecturer) => [
          normalize(lecturer.lecturerCode).toLowerCase(),
          lecturer,
        ]),
      );

      const inSemester = new Set(
        semesterMentors.map((mentor) =>
          normalize(mentor.lecturerCode).toLowerCase(),
        ),
      );

      const codeCount = new Map<string, number>();
      json.forEach((row) => {
        const code = getValue(row, [
          "Mã GV",
          "Ma GV",
          "Mã giảng viên",
          "Mã cán bộ",
          "lecturerCode",
          "Lecturer code",
        ]).toLowerCase();

        if (!code) return;
        codeCount.set(code, (codeCount.get(code) || 0) + 1);
      });

      const preview: PreviewRow[] = json.map((row, index) => {
        const code = getValue(row, [
          "Mã GV",
          "Ma GV",
          "Mã giảng viên",
          "Mã cán bộ",
          "lecturerCode",
          "Lecturer code",
        ]);

        const errors: string[] = [];
        if (!code) {
          errors.push("Thiếu mã giảng viên");
        }

        const lecturer = lecturerMap.get(code.toLowerCase());

        if (code && !lecturer) {
          errors.push(`Không tìm thấy giảng viên (${code})`);
        }

        if (code && inSemester.has(code.toLowerCase())) {
          errors.push("Giảng viên đã có trong học kỳ hiện tại");
        }

        if (code && (codeCount.get(code.toLowerCase()) || 0) > 1) {
          errors.push("Mã giảng viên bị trùng trong file import");
        }

        return {
          rowNo: index + 2,
          code,
          fullName: lecturer?.fullName || "",
          status: errors.length ? "Không hợp lệ" : "Sẵn sàng thêm",
          lecturerId: lecturer?.id || null,
          error: errors.length ? errors.join(" | ") : undefined,
        };
      });

      setRows(preview);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Đọc file Excel thất bại",
        }),
      );
      setRows([]);
    }
  };

  const handleImport = async () => {
    const validRows = rows.filter((row) => !row.error && row.lecturerId);

    if (!validRows.length) {
      dispatch(
        addToast({
          type: "warning",
          message: "Không có dữ liệu hợp lệ để thêm",
        }),
      );
      return;
    }

    const ids = Array.from(new Set(validRows.map((row) => row.lecturerId!)));

    setSubmitting(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => addMentorToSemester(id).unwrap()),
      );

      const successCount = results.filter(
        (result) => result.status === "fulfilled",
      ).length;
      const failCount = ids.length - successCount;

      if (successCount > 0) {
        dispatch(
          addToast({
            type: failCount > 0 ? "warning" : "success",
            message:
              failCount > 0
                ? `Thêm thành công ${successCount}/${ids.length} giảng viên`
                : `Thêm thành công ${successCount} giảng viên vào học kỳ`,
          }),
        );

        if (failCount === 0) {
          handleClose();
        }
      } else {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể thêm giảng viên vào học kỳ",
          }),
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validCount = rows.filter((row) => !row.error).length;
  const errorCount = rows.length - validCount;

  return (
    <Modal open={open} onClose={handleClose} width="max-w-5xl">
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-500 shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                Thêm giảng viên vào học kỳ bằng Excel
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                File chỉ cần cột mã giảng viên
              </p>
            </div>
          </div>

          <Button
            label="Tải file mẫu"
            icon={Download}
            size="sm"
            variant="outline"
            onClick={handleDownloadTemplate}
          />
        </div>

        {rows.length === 0 && (
          <label
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFile(e.dataTransfer.files[0]);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            className={`flex h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-150 ${
              dragging
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-600"
                : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-700"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
                dragging
                  ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400"
              }`}
            >
              <Upload size={22} />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Kéo và thả file vào đây
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              hoặc click để chọn file - .xlsx, .xls
            </p>
          </label>
        )}

        {fileName && (
          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileSpreadsheet
                size={16}
                className="text-emerald-500 shrink-0"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {fileName}
              </span>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors shrink-0"
            >
              <X size={13} />
              Chọn file khác
            </button>
          </div>
        )}

        {rows.length > 0 && (
          <>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Hợp lệ: <b>{validCount}</b> | Lỗi: <b>{errorCount}</b>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[320px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left">Dòng</th>
                    <th className="px-3 py-2 text-left">Mã GV</th>
                    <th className="px-3 py-2 text-left">Họ tên</th>
                    <th className="px-3 py-2 text-left">Trạng thái</th>
                    <th className="px-3 py-2 text-left">Lỗi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {rows.map((row) => (
                    <tr
                      key={`${row.rowNo}-${row.code}`}
                      className={
                        row.error
                          ? "bg-red-50 dark:bg-red-950/20"
                          : "bg-white dark:bg-gray-900"
                      }
                    >
                      <td className="px-3 py-2">{row.rowNo}</td>
                      <td className="px-3 py-2 font-medium">
                        {row.code || "-"}
                      </td>
                      <td className="px-3 py-2">{row.fullName || "-"}</td>
                      <td className="px-3 py-2">{row.status}</td>
                      <td className="px-3 py-2 text-red-600 dark:text-red-400">
                        {row.error || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button label="Đóng" variant="outline" onClick={handleClose} />
          <Button
            label={submitting ? "Đang thêm..." : "Thêm vào học kỳ"}
            onClick={handleImport}
            disabled={submitting || validCount === 0}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MentorExcelImportModal;
