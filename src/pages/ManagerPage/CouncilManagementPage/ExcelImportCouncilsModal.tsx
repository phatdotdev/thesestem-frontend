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

import {
  useGetCollegesQuery,
  useGetDeparmentsQuery,
  useGetFacultiesQuery,
} from "../../../services/orgApi";

import { useGetRolesQuery } from "../../../services/catApi";
import { useGetLecturersQuery } from "../../../services/userApi";
import { useCreateCouncilMutation } from "../../../services/semApi";

import type { CouncilRequest } from "../../../types/council";
import { useGetCurrentCouncilListQuery } from "../../../services/councilApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ExcelRow = Record<string, unknown>;

interface PreviewRow {
  rowNo: number;
  councilName: string;
  councilCode: string;

  collegeCode: string;
  facultyCode: string;
  departmentCode: string;

  collegeName: string;
  facultyName: string;
  departmentName: string;

  membersCount: number;
  membersPreview: string;

  collegeId: string | null;
  facultyId: string | null;
  departmentId: string | null;
  members: { lecturerId: string; roleId: string }[];

  error?: string;
}

type ImportCouncilRequest = CouncilRequest & {
  collegeId: string | null;
  facultyId: string | null;
  departmentId: string | null;
};

const COLUMNS = [
  "Dòng",
  "Tên hội đồng",
  "Mã hội đồng",
  "Đơn vị quản lý",
  "Số thành viên",
  "Thành viên theo vai trò",
  "Lỗi",
];

const normalize = (v: unknown): string => (v ?? "").toString().trim();

const ExcelImportCouncilsModal = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { data: collegesData } = useGetCollegesQuery();
  const { data: facultiesData } = useGetFacultiesQuery();
  const { data: departmentsData } = useGetDeparmentsQuery();
  const { data: rolesData } = useGetRolesQuery();
  const { data: lecturersData } = useGetLecturersQuery({});
  const { data: currentCouncilsData } = useGetCurrentCouncilListQuery({});

  const colleges = collegesData?.data || [];
  const faculties = facultiesData?.data || [];
  const departments = departmentsData?.data || [];
  const roles = rolesData?.data || [];
  const lecturers = lecturersData?.data || [];
  const currentCouncils = currentCouncilsData?.data || [];

  const [createCouncil] = useCreateCouncilMutation();

  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // ==================== MAP TRA CỨU ====================
  const collegeMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    colleges.forEach((c: any) => {
      const code = normalize(c.code).toLowerCase();
      map.set(code, { id: String(c.id), name: normalize(c.name) });
    });
    return map;
  }, [colleges]);

  const facultyMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    faculties.forEach((f: any) => {
      const code = normalize(f.code).toLowerCase();
      map.set(code, { id: String(f.id), name: normalize(f.name) });
    });
    return map;
  }, [faculties]);

  const departmentMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    departments.forEach((d: any) => {
      const code = normalize(d.code).toLowerCase();
      map.set(code, { id: String(d.id), name: normalize(d.name) });
    });
    return map;
  }, [departments]);

  const lecturerMap = useMemo(() => {
    const map = new Map<string, { id: string; code: string; name?: string }>();
    lecturers.forEach((l: any) => {
      const code = normalize(l.lecturerCode).toLowerCase();
      map.set(code, { id: String(l.id), code: normalize(l.lecturerCode) });
    });
    return map;
  }, [lecturers]);

  const roleMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string; code?: string }>();
    roles.forEach((r: any) => {
      const nameNorm = normalize(r.name).toLowerCase();
      const codeNorm = r.code ? normalize(r.code).toLowerCase() : "";
      map.set(nameNorm, { id: String(r.id), name: normalize(r.name) });
      if (codeNorm)
        map.set(codeNorm, { id: String(r.id), name: normalize(r.name) });
    });
    return map;
  }, [roles]);

  const reset = () => {
    setRows([]);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getUnitDisplay = (
    code: string,
    type: "college" | "faculty" | "department",
  ): string => {
    if (!code) return "";

    const normCode = normalize(code).toLowerCase();
    let name = "";

    if (type === "college") name = collegeMap.get(normCode)?.name || "";
    if (type === "faculty") name = facultyMap.get(normCode)?.name || "";
    if (type === "department") name = departmentMap.get(normCode)?.name || "";

    return name || code; // fallback về code nếu không tìm thấy tên
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file
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
        raw: false,
      });

      // Bỏ qua dòng trống
      json = json.filter((row) =>
        Object.values(row).some((v) => normalize(v) !== ""),
      );

      const preview: PreviewRow[] = json.map((row, index) => {
        const councilName = normalize(
          row["Tên hội đồng"] || row["Tên"] || row["Name"],
        );
        const councilCode = normalize(
          row["Mã hội đồng"] || row["Mã HD"] || row["Mã"] || row["Code"],
        );

        const collegeCode = normalize(row["Mã trường"] || row["Mã college"]);
        const facultyCode = normalize(row["Mã khoa"] || row["Mã faculty"]);
        const departmentCode = normalize(
          row["Mã bộ môn"] || row["Mã department"],
        );

        // Lấy ID và tên đơn vị
        const collegeInfo = collegeCode
          ? collegeMap.get(collegeCode.toLowerCase())
          : null;
        const facultyInfo = facultyCode
          ? facultyMap.get(facultyCode.toLowerCase())
          : null;
        const departmentInfo = departmentCode
          ? departmentMap.get(departmentCode.toLowerCase())
          : null;

        const collegeId = collegeInfo?.id || null;
        const facultyId = facultyInfo?.id || null;
        const departmentId = departmentInfo?.id || null;

        const errors: string[] = [];

        if (
          currentCouncils.some(
            (c) =>
              normalize(c.code).toLowerCase() === councilCode.toLowerCase(),
          )
        ) {
          errors.push("Mã hội đồng đã tồn tại");
        }
        if (!councilName) errors.push("Thiếu tên hội đồng");
        if (!councilCode) errors.push("Thiếu mã hội đồng");

        const unitCodes = [collegeCode, facultyCode, departmentCode].filter(
          Boolean,
        );
        if (unitCodes.length === 0) {
          errors.push("Thiếu mã đơn vị quản lý (trường/khoa/bộ môn)");
        }
        if (unitCodes.length > 1) {
          errors.push("Chỉ được nhập một loại đơn vị quản lý");
        }

        if (collegeCode && !collegeId)
          errors.push(`Không tìm thấy trường (${collegeCode})`);
        if (facultyCode && !facultyId)
          errors.push(`Không tìm thấy khoa (${facultyCode})`);
        if (departmentCode && !departmentId)
          errors.push(`Không tìm thấy bộ môn (${departmentCode})`);

        // ==================== XỬ LÝ THÀNH VIÊN ====================
        const members: { lecturerId: string; roleId: string }[] = [];
        const usedRoleIds = new Set<string>();
        const usedLecturerIds = new Set<string>();

        roles.forEach((role: any) => {
          const roleNameHeader = normalize(role.name);
          const roleCodeHeader = normalize(role.code || "");

          let lecturerCode = normalize(
            row[roleNameHeader] || row[roleCodeHeader] || "",
          );

          if (!lecturerCode) return;

          const lecturerInfo = lecturerMap.get(lecturerCode.toLowerCase());
          const roleInfo =
            roleMap.get(roleNameHeader.toLowerCase()) ||
            (roleCodeHeader ? roleMap.get(roleCodeHeader.toLowerCase()) : null);

          if (!lecturerInfo) {
            errors.push(
              `Không tìm thấy giảng viên (${lecturerCode}) cho vai trò ${roleNameHeader}`,
            );
            return;
          }
          if (!roleInfo) {
            errors.push(`Không tìm thấy vai trò ${roleNameHeader}`);
            return;
          }

          if (usedRoleIds.has(roleInfo.id)) {
            errors.push(`Vai trò ${roleNameHeader} bị lặp`);
            return;
          }
          if (usedLecturerIds.has(lecturerInfo.id)) {
            errors.push(`Giảng viên (${lecturerCode}) bị trùng vai trò`);
            return;
          }

          usedRoleIds.add(roleInfo.id);
          usedLecturerIds.add(lecturerInfo.id);

          members.push({
            lecturerId: lecturerInfo.id,
            roleId: roleInfo.id,
          });
        });

        if (!members.length) {
          errors.push("Không có thành viên nào được nhập");
        }

        const membersPreview = members
          .map((m) => {
            const roleName =
              roles.find((r: any) => String(r.id) === m.roleId)?.name ||
              "Không rõ vai trò";

            const lecturer = lecturers.find(
              (l: any) => String(l.id) === m.lecturerId,
            );

            const lecturerName = lecturer
              ? normalize(lecturer.fullName || "")
              : "";

            const lecturerCode = lecturer
              ? normalize(lecturer.lecturerCode)
              : m.lecturerId;

            return lecturerName
              ? `${roleName}: ${lecturerName} (${lecturerCode})`
              : `${roleName}: ${lecturerCode}`;
          })
          .join("\n");

        // Đơn vị hiển thị
        let unitDisplay = "";
        if (collegeCode) unitDisplay = getUnitDisplay(collegeCode, "college");
        else if (facultyCode)
          unitDisplay = getUnitDisplay(facultyCode, "faculty");
        else if (departmentCode)
          unitDisplay = getUnitDisplay(departmentCode, "department");

        return {
          rowNo: index + 2,
          councilName,
          councilCode,
          collegeCode,
          facultyCode,
          departmentCode,
          collegeName: collegeInfo?.name || "",
          facultyName: facultyInfo?.name || "",
          departmentName: departmentInfo?.name || "",
          membersCount: members.length,
          membersPreview,
          collegeId,
          facultyId,
          departmentId,
          members,
          error: errors.length ? errors.join(" | ") : undefined,
          unitDisplay,
        };
      });

      const councilCodeCount = new Map<string, number>();
      preview.forEach((item) => {
        if (item.councilCode) {
          const key = item.councilCode.toLowerCase();
          councilCodeCount.set(key, (councilCodeCount.get(key) || 0) + 1);
        }
      });

      preview.forEach((item) => {
        if (
          item.councilCode &&
          (councilCodeCount.get(item.councilCode.toLowerCase()) || 0) > 1
        ) {
          const errors = item.error ? item.error.split(" | ") : [];
          errors.push("Mã hội đồng bị trùng trong file import");
          item.error = [...new Set(errors)].join(" | ");
        }
      });

      setRows(preview);
    } catch (err) {
      dispatch(
        addToast({
          type: "error",
          message:
            "Đọc file Excel thất bại. Vui lòng kiểm tra lại định dạng file.",
        }),
      );
    }
  };

  const handleDownloadTemplate = () => {
    const roleHeaders = roles.map((role: any) =>
      normalize(role.code || role.name),
    );

    const data = [
      [
        "Tên hội đồng",
        "Mã hội đồng",
        "Mã trường",
        "Mã khoa",
        "Mã bộ môn",
        ...roleHeaders,
      ],
      [
        "Hội đồng Khoa CNTT",
        "CNTT01",
        "",
        "CNTT",
        "",
        ...Array.from({ length: roleHeaders.length }, (_, i) =>
          i < 3 ? `GV000${i + 1}` : "",
        ),
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Councils");
    XLSX.writeFile(wb, "mau-import-hoi-dong.xlsx");
  };

  const handleImport = async () => {
    const validRows = rows.filter((r) => !r.error);
    if (!validRows.length) {
      dispatch(
        addToast({
          type: "warning",
          message: "Không có dữ liệu hợp lệ để nhập",
        }),
      );
      return;
    }

    setSubmitting(true);

    // Group theo councilCode (mỗi council chỉ tạo 1 lần)
    const grouped = Object.values(
      validRows.reduce(
        (acc, row) => {
          const key = row.councilCode.toLowerCase();
          if (!acc[key]) {
            acc[key] = {
              name: row.councilName,
              code: row.councilCode,
              collegeId: row.collegeId,
              facultyId: row.facultyId,
              departmentId: row.departmentId,
              members: [...row.members],
            };
          } else {
            acc[key].members.push(...row.members);
          }
          return acc;
        },
        {} as Record<string, ImportCouncilRequest>,
      ),
    );

    try {
      // api chỉ cho phép tạo từng council một, không có batch, nên đành phải dùng Promise.allSettled để chạy song song và tổng hợp kết quả
      const results = await Promise.allSettled(
        grouped.map((council) => createCouncil(council).unwrap()),
      );

      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const failCount = grouped.length - successCount;

      if (successCount > 0) {
        dispatch(
          addToast({
            type: failCount > 0 ? "warning" : "success",
            message:
              failCount > 0
                ? `Nhập thành công ${successCount}/${grouped.length} hội đồng`
                : `Nhập thành công ${successCount} hội đồng`,
          }),
        );

        if (failCount === 0) handleClose();
      } else {
        dispatch(
          addToast({
            type: "error",
            message: "Không thể nhập hội đồng. Vui lòng kiểm tra lại dữ liệu.",
          }),
        );
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
                Nhập hội đồng từ Excel
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Một dòng tương ứng một hội đồng, các cột vai trò chứa mã giảng
                viên
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
            className={`flex h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-150
              ${
                dragging
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-600"
                  : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-700"
              }`}
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
          >
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              ref={fileRef}
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
              maxHeight: "420px",
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
                {rows.map((r) => {
                  const unitDisplay =
                    r.collegeName ||
                    r.facultyName ||
                    r.departmentName ||
                    r.collegeCode ||
                    r.facultyCode ||
                    r.departmentCode ||
                    "—";

                  return (
                    <tr
                      key={r.rowNo}
                      className={`transition-colors ${
                        r.error
                          ? "bg-red-50 dark:bg-red-950/20"
                          : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                        {r.rowNo}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        {r.councilName}
                      </td>
                      <td className="px-3 py-2 font-mono text-gray-700 dark:text-gray-300">
                        {r.councilCode}
                      </td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {unitDisplay}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-700 dark:text-gray-200">
                        {r.membersCount}
                      </td>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400 whitespace-pre-line max-w-md">
                        {r.membersPreview || "—"}
                      </td>
                      <td className="px-3 py-2">
                        {r.error && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            <AlertCircle size={10} />
                            {r.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
            label={`Nhập ${validCount} hội đồng`}
            size="sm"
            variant="success"
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

export default ExcelImportCouncilsModal;
