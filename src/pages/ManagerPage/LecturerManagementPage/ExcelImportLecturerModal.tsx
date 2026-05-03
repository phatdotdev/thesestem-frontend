import { useRef, useState } from "react";
import * as XLSX from "xlsx";

import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { excelDateToISO } from "../../../utils/excelDateToISO";

import {
  useAddLecturersMutation,
  useGetLecturersQuery,
} from "../../../services/userApi";
import {
  useGetCollegesQuery,
  useGetDeparmentsQuery,
  useGetFacultiesQuery,
} from "../../../services/orgApi";

import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import type { AddLecturerRequest } from "../../../types/lecturer";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ExcelRawRow = Record<string, any>;

interface PreviewRow {
  lecturerCode: string;
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  collegeCode: string;
  facultyCode: string;
  departmentCode: string;
  collegeId: string | null;
  facultyId: string | null;
  departmentId: string | null;
  error?: string;
}

const COLUMNS = [
  "Mã GV",
  "Họ tên",
  "Ngày sinh",
  "Giới tính",
  "Email",
  "SĐT",
  "Mã trường",
  "Mã khoa",
  "Mã bộ môn",
  "Lỗi",
];

const normalize = (value: any) => (value ?? "").toString().trim();

const getValue = (row: ExcelRawRow, keys: string[]) => {
  for (const key of keys) {
    if (
      row[key] !== undefined &&
      row[key] !== null &&
      `${row[key]}`.trim() !== ""
    ) {
      return normalize(row[key]);
    }
  }
  return "";
};

const ExcelImportLecturerModal = ({ open, onClose }: Props) => {
  const dispatch = useAppDispatch();

  const { data: lecturersData } = useGetLecturersQuery({});
  const { data: collegesData } = useGetCollegesQuery();
  const { data: facultiesData } = useGetFacultiesQuery();
  const { data: departmentsData } = useGetDeparmentsQuery();

  const [addLecturers] = useAddLecturersMutation();

  const lecturers = lecturersData?.data || [];
  const colleges = collegesData?.data || [];
  const faculties = facultiesData?.data || [];
  const departments = departmentsData?.data || [];

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        "Mã GV": "GV0001",
        "Họ tên": "Nguyen Van A",
        "Ngày sinh": "1988-01-20",
        "Giới tính": "Nam",
        Email: "gv0001@school.edu.vn",
        SĐT: "0912345678",
        "Địa chỉ": "Ha Noi",
        "Mật khẩu": "123456",
        "Mã trường": "DHCN",
        "Mã khoa": "CNTT",
        "Mã bộ môn": "KTPM",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Lecturers");
    XLSX.writeFile(wb, "lecturer-import-template.xlsx");
  };

  const resetFile = () => {
    setFileName("");
    setRows([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetFile();
    onClose();
  };

  const handleFile = async (file: File) => {
    resetFile();
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<ExcelRawRow>(ws, {
        defval: "",
        raw: false,
      });

      const resolveUnitId = (items: any[], code: string) => {
        if (!code) return null;

        const found = items.find(
          (item: any) =>
            normalize(item.code).toLowerCase() === code.toLowerCase(),
        );

        return found ? String(found.id) : null;
      };

      const lecturerCodes = new Set(
        lecturers.map((item: any) =>
          normalize(item.lecturerCode).toLowerCase(),
        ),
      );

      const preview = json.map((raw): PreviewRow => {
        const lecturerCode = getValue(raw, [
          "Mã giảng viên",
          "Mã GV",
          "Mã cán bộ",
        ]);
        const fullName = getValue(raw, ["Họ tên", "Tên", "Full name"]);
        const dob = excelDateToISO(
          getValue(raw, ["Ngày sinh", "DOB", "Birthdate"]),
        );
        const gender = getValue(raw, ["Giới tính", "Gender"]);
        const email = getValue(raw, ["Email"]);
        const phone = getValue(raw, ["SĐT", "Điện thoại", "Phone"]);
        const address = getValue(raw, ["Địa chỉ", "Address"]);
        const password = getValue(raw, ["Mật khẩu", "Password"]);

        const collegeCode = getValue(raw, ["Mã trường", "Mã college"]);
        const facultyCode = getValue(raw, ["Mã khoa", "Mã faculty"]);
        const departmentCode = getValue(raw, ["Mã bộ môn", "Mã department"]);

        let collegeId: string | null = null;
        let facultyId: string | null = null;
        let departmentId: string | null = null;

        const errors: string[] = [];

        if (!lecturerCode) errors.push("Thiếu mã giảng viên");
        if (!fullName) errors.push("Thiếu họ tên");
        if (!email) errors.push("Thiếu email");
        if (!password) errors.push("Thiếu mật khẩu");

        if (lecturerCode && lecturerCodes.has(lecturerCode.toLowerCase())) {
          errors.push("Mã giảng viên đã tồn tại");
        }

        if (departmentCode) {
          departmentId = resolveUnitId(departments, departmentCode);
          if (!departmentId) {
            errors.push(`Không tìm thấy bộ môn (${departmentCode})`);
          }
        } else if (facultyCode) {
          facultyId = resolveUnitId(faculties, facultyCode);
          if (!facultyId) {
            errors.push(`Không tìm thấy khoa (${facultyCode})`);
          }
        } else if (collegeCode) {
          collegeId = resolveUnitId(colleges, collegeCode);
          if (!collegeId) {
            errors.push(`Không tìm thấy trường (${collegeCode})`);
          }
        } else {
          errors.push("Thiếu mã đơn vị (mã bộ môn/mã khoa/mã trường)");
        }

        return {
          lecturerCode,
          fullName,
          dob,
          gender:
            String(gender).toLowerCase() === "nam" ||
            String(gender).toLowerCase() === "male"
              ? "MALE"
              : "FEMALE",
          email,
          phone,
          address,
          password,
          collegeCode,
          facultyCode,
          departmentCode,
          collegeId,
          facultyId,
          departmentId,
          error: errors.join(" | "),
        };
      });

      setRows(preview);
    } catch {
      setRows([]);
      dispatch(
        addToast({
          id: "",
          type: "error",
          message: "Khong doc duoc file Excel",
        }),
      );
    }
  };

  const handleImport = async () => {
    const validRows = rows.filter((item) => !item.error);

    if (!validRows.length) {
      dispatch(
        addToast({
          id: "",
          type: "warning",
          message: "Không có dữ liệu hợp lệ để nhập",
        }),
      );
      return;
    }

    setSubmitting(true);

    const requests: AddLecturerRequest[] = validRows.map((item) => ({
      lecturerCode: item.lecturerCode,
      fullName: item.fullName,
      gender: normalize(item.gender || "MALE").toUpperCase(),
      email: item.email,
      password: item.password,
      phone: item.phone,
      address: item.address,
      dob: item.dob,
      collegeId: item.collegeId,
      facultyId: item.facultyId,
      departmentId: item.departmentId,
    }));

    try {
      await addLecturers(requests).unwrap();

      dispatch(
        addToast({
          id: "",
          type: "success",
          message: `Nhập thành công ${requests.length} giảng viên${errorCount > 0 ? `, bỏ qua ${errorCount} dòng lỗi` : ""}`,
        }),
      );

      handleClose();
    } catch (error) {
      dispatch(
        addToast({
          id: "",
          type: "error",
          message: "Không thể nhập dữ liệu giảng viên",
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const validCount = rows.filter((item) => !item.error).length;
  const errorCount = rows.filter((item) => item.error).length;

  return (
    <Modal open={open} onClose={handleClose} width="max-w-7xl">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-500 shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                Nhập giảng viên từ Excel
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Dùng mã bộ môn hoặc mã khoa hoặc mã trường để xác định đơn vị
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            icon={Download}
            label="Tải template"
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
              ref={fileInputRef}
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
              onClick={resetFile}
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
              maxHeight: "380px",
              overflowY: "auto",
              scrollbarWidth: "thin",
            }}
          >
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
                <tr>
                  {COLUMNS.map((item) => (
                    <th
                      key={item}
                      className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap"
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`transition-colors ${
                      row.error
                        ? "bg-red-50 dark:bg-red-950/20"
                        : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <td className="px-3 py-2 font-mono text-gray-700 dark:text-gray-300">
                      {row.lecturerCode}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {row.fullName}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {row.dob}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {row.gender}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {row.email}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {row.phone}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {row.collegeCode}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {row.facultyCode}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {row.departmentCode}
                    </td>
                    <td className="px-3 py-2">
                      {row.error && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                          <AlertCircle size={10} />
                          {row.error}
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
            label={`Nhập ${validCount} giảng viên`}
            variant="success"
            size="sm"
            icon={Download}
            disabled={validCount === 0 || submitting}
            loading={submitting}
            onClick={handleImport}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExcelImportLecturerModal;
