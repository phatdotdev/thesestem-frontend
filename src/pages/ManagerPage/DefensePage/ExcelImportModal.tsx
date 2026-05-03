import { useRef, useState, useMemo } from "react";
import * as XLSX from "xlsx";

import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";

import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";

import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

import { useGetCurrentCouncilListQuery } from "../../../services/councilApi";
import { useGetCurrentThesesQuery } from "../../../services/thesisApi";
import { useGetCurrentDefensesQuery } from "../../../services/defenseApi";
import { useCreateDefenseMutation } from "../../../services/defenseApi";

import type { ThesisResponse } from "../../../types/thesis";
import type { CouncilResponse } from "../../../types/council";
import type { DefenseRequest, DefenseResponse } from "../../../types/defense";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ExcelRow = Record<string, unknown>;

interface PreviewRow {
  rowNo: number;
  studentCode: string;
  studentName: string;
  councilCode: string;
  defenseTime: string;
  location: string;

  thesisId: string | null;
  councilId: string | null;
  thesisTitle?: string;
  mentorName?: string;
  mentorCode?: string;
  councilName?: string;
  membersPreview: string;

  error?: string;
}

const COLUMNS = [
  "Dòng",
  "Sinh viên",
  "Tên đề tài",
  "Giảng viên hướng dẫn",
  "Hội đồng",
  "Thành viên hội đồng",
  "Thời gian bảo vệ",
  "Địa điểm",
  "Lỗi",
];

const normalize = (v: unknown): string => (v ?? "").toString().trim();

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

const parseDefenseTime = (rawValue: unknown) => {
  if (
    rawValue === null ||
    rawValue === undefined ||
    `${rawValue}`.trim() === ""
  ) {
    return "";
  }

  if (typeof rawValue === "number") {
    const parsed = XLSX.SSF.parse_date_code(rawValue);
    if (!parsed) return "";

    const yyyy = String(parsed.y).padStart(4, "0");
    const mm = String(parsed.m).padStart(2, "0");
    const dd = String(parsed.d).padStart(2, "0");
    const hh = String(parsed.H).padStart(2, "0");
    const min = String(parsed.M).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
  }

  const raw = normalize(rawValue);
  const normalized = raw.replace(" ", "T").replace(/\//g, "-");
  const parsedDate = new Date(normalized);

  if (!Number.isNaN(parsedDate.getTime())) {
    const yyyy = parsedDate.getFullYear();
    const mm = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(parsedDate.getDate()).padStart(2, "0");
    const hh = String(parsedDate.getHours()).padStart(2, "0");
    const min = String(parsedDate.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:00`;
  }

  return "";
};

const formatDisplayDateTime = (isoDateTime: string) => {
  if (!isoDateTime) return "";

  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const ExcelImportDefenseModal = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { data: thesesResponse } = useGetCurrentThesesQuery({});
  const { data: councilsResponse } = useGetCurrentCouncilListQuery({});
  const { data: defensesResponse } = useGetCurrentDefensesQuery({});

  const theses = thesesResponse?.data || [];
  const councils = councilsResponse?.data || [];
  const defenses = defensesResponse?.data || [];

  const [createDefense] = useCreateDefenseMutation();

  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const thesisMap = useMemo(() => {
    const map = new Map<string, ThesisResponse>();
    theses.forEach((t: ThesisResponse) => {
      const code = normalize(t.student?.studentCode || "");
      if (code) map.set(code.toLowerCase(), t);
    });
    return map;
  }, [theses]);

  const councilMap = useMemo(() => {
    const map = new Map<string, CouncilResponse>();
    councils.forEach((c: CouncilResponse) => {
      const code = normalize(c.code);
      if (code) map.set(code.toLowerCase(), c);
    });
    return map;
  }, [councils]);

  const reset = () => {
    setRows([]);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
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
        addToast({ type: "error", message: "File quá lớn (tối đa 5MB)" }),
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
        raw: true,
      });
      json = json.filter((row) =>
        Object.values(row).some((v) => normalize(v) !== ""),
      );

      const preview: PreviewRow[] = json.map((row, index) => {
        const studentCode = getValue(row, [
          "Mã sinh viên",
          "MSSV",
          "Student code",
          "studentCode",
        ]);
        const councilCode = getValue(row, [
          "Mã hội đồng",
          "Council code",
          "councilCode",
        ]);
        const defenseTimeRaw =
          row["Thời gian bảo vệ"] ?? row["Thời gian"] ?? row["Ngày giờ"] ?? "";
        const defenseTime = parseDefenseTime(defenseTimeRaw);
        const location = getValue(row, [
          "Địa điểm",
          "Location",
          "Phòng",
          "location",
        ]);

        const errors: string[] = [];

        if (!studentCode) errors.push("Thiếu mã sinh viên");
        if (!councilCode) errors.push("Thiếu mã hội đồng");
        if (!normalize(defenseTimeRaw)) errors.push("Thiếu thời gian bảo vệ");
        if (!location) errors.push("Thiếu địa điểm");
        if (normalize(defenseTimeRaw) && !defenseTime) {
          errors.push("Thời gian bảo vệ không hợp lệ");
        }

        // Tìm Thesis
        const thesis = thesisMap.get(studentCode.toLowerCase());
        const thesisId = thesis?.id || null;
        const studentName = thesis?.student?.fullName || "Không rõ tên";
        const thesisTitle = thesis?.title || "";
        const mentorName = thesis?.mentor?.fullName || "—";
        const mentorCode = thesis?.mentor?.lecturerCode || "";

        if (!thesisId) {
          errors.push(`Không tìm thấy đề tài của sinh viên ${studentCode}`);
        } else {
          // Kiểm tra luận văn đã được phân công chưa
          const alreadyAssigned = defenses.some(
            (d: DefenseResponse) => d.thesis.id === thesisId,
          );
          if (alreadyAssigned) {
            errors.push("Luận văn này đã được phân công hội đồng");
          }
        }

        // Tìm Council
        const council = councilMap.get(councilCode.toLowerCase());
        const councilId = council?.id || null;
        const councilName = council?.name || "";

        if (!councilId) {
          errors.push(`Không tìm thấy hội đồng ${councilCode}`);
        }

        let membersPreview = "—";
        if (council?.members && council.members.length > 0) {
          membersPreview = council.members
            .map((m: any) => {
              const roleName = m.role?.name || m.roleName || "Thành viên";
              const lecturerName =
                m.lecturer?.fullName || m.lecturer?.name || "Không rõ";
              const lecturerCode = m.lecturer?.lecturerCode || "";
              return `${roleName}: ${lecturerName} (${lecturerCode})`;
            })
            .join("\n");
        }

        return {
          rowNo: index + 2,
          studentCode,
          studentName,
          thesisTitle,
          councilCode,
          councilName,
          defenseTime,
          location,
          thesisId,
          councilId,
          membersPreview,
          mentorName,
          mentorCode,
          error: errors.length ? errors.join(" | ") : undefined,
        };
      });

      setRows(preview);
    } catch (err) {
      dispatch(addToast({ type: "error", message: "Đọc file Excel thất bại" }));
      setRows([]);
    }
  };

  const handleDownloadTemplate = () => {
    const data = [
      ["Mã sinh viên", "Mã hội đồng", "Thời gian bảo vệ", "Địa điểm"],
      ["SV001", "HD001", "2026-04-20 08:00", "Phòng A.301"],
      ["SV002", "HD002", "2026-04-20 10:00", "Phòng B.102"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Defense");
    XLSX.writeFile(wb, "mau-phan-cong-bao-ve.xlsx");
  };

  const handleImport = async () => {
    const validRows = rows.filter((r) => !r.error);
    if (!validRows.length) {
      dispatch(
        addToast({ type: "warning", message: "Không có dữ liệu hợp lệ" }),
      );
      return;
    }

    setSubmitting(true);

    try {
      const results = await Promise.allSettled(
        validRows.map(async (row) => {
          if (!row.thesisId || !row.councilId) throw new Error("Missing ID");

          const payload: DefenseRequest = {
            thesisId: row.thesisId,
            councilId: row.councilId,
            defenseTime: row.defenseTime,
            location: row.location,
          };

          return createDefense(payload).unwrap();
        }),
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const failCount = validRows.length - successCount;

      if (successCount > 0) {
        dispatch(
          addToast({
            type: failCount > 0 ? "warning" : "success",
            message: `Phân công thành công ${successCount}/${validRows.length} bảo vệ`,
          }),
        );
        if (failCount === 0) handleClose();
      } else {
        dispatch(addToast({ type: "error", message: "Không thể phân công" }));
      }
    } catch (_) {
      dispatch(addToast({ type: "error", message: "Import thất bại" }));
    } finally {
      setSubmitting(false);
    }
  };

  const validCount = rows.filter((r) => !r.error).length;
  const errorCount = rows.length - validCount;

  return (
    <Modal open={open} onClose={handleClose} width="max-w-7xl">
      <div className="space-y-5 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-500 shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                Nhập phân công bảo vệ từ Excel
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Cột bắt buộc: studentCode, councilCode, defenseTime, location
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

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

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
            className={`flex h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-150
              ${
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
              hoặc{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                click để chọn file
              </span>{" "}
              - .xlsx, .xls
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
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <FileSpreadsheet size={15} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                  Tổng
                </p>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
                  {rows.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800">
              <CheckCircle size={15} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Hợp lệ
                </p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {validCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800">
              <AlertCircle size={15} className="text-red-500 shrink-0" />
              <div>
                <p className="text-[11px] text-red-500 dark:text-red-400 uppercase tracking-wide">
                  Lỗi
                </p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {errorCount}
                </p>
              </div>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div
            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            style={{
              maxHeight: "450px",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                <tr>
                  {COLUMNS.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rows.map((r) => (
                  <tr
                    key={r.rowNo}
                    className={`transition-colors ${
                      r.error
                        ? "bg-red-50 dark:bg-red-950/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-500">{r.rowNo}</td>

                    {/* Sinh viên */}
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.studentName}</div>
                      <div className="text-gray-500 font-mono text-[10px]">
                        {r.studentCode}
                      </div>
                    </td>

                    {/* Tên đề tài */}
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200 max-w-xs">
                      {r.thesisTitle}
                    </td>

                    {/* GVHD */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {r.mentorName || "—"}
                      </div>
                      <div className="text-gray-500 font-mono text-[10px]">
                        {r.mentorCode || ""}
                      </div>
                    </td>

                    {/* Hội đồng */}
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.councilName || "—"}</div>
                      <div className="text-gray-500 font-mono text-[10px]">
                        {r.councilCode}
                      </div>
                    </td>

                    {/* Thành viên hội đồng */}
                    <td className="px-4 py-3 whitespace-pre-line text-[11px] leading-relaxed max-w-md text-gray-600 dark:text-gray-400">
                      {r.membersPreview}
                    </td>

                    {/* Thời gian */}
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {formatDisplayDateTime(r.defenseTime)}
                    </td>

                    {/* Địa điểm */}
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {r.location || "—"}
                    </td>

                    {/* Lỗi */}
                    <td className="px-4 py-3">
                      {r.error && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-2 py-1 rounded-full">
                          <AlertCircle size={10} />
                          {r.error}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button
            label="Hủy"
            variant="outline"
            size="sm"
            onClick={handleClose}
          />
          <Button
            label={`Nhập ${validCount} phân công`}
            variant="success"
            size="sm"
            icon={Download}
            onClick={handleImport}
            disabled={validCount === 0 || submitting}
            loading={submitting}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExcelImportDefenseModal;
