import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { excelDateToISO } from "../../../utils/excelDateToISO";
import type { StudentRequest } from "../../../types/student";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { useGetProgramsQuery } from "../../../services/orgApi";
import { useGetCoursesQuery } from "../../../services/catApi";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import {
  useAddStudentsMutation,
  useGetStudentsQuery,
} from "../../../services/userApi";
import { formatGender } from "../../../utils/formatters";

interface Props {
  open: boolean;
  onClose: () => void;
}

type ExcelRawRow = Record<string, any>;

interface PreviewRow {
  studentCode: string;
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  programCode: string;
  courseCode: string;
  password: string;
  programId?: string;
  courseId?: string;
  error?: string;
}

const COLUMNS = [
  "MSSV",
  "Họ tên",
  "Ngày sinh",
  "Giới tính",
  "Email",
  "SĐT",
  "Địa chỉ",
  "Ngành",
  "Khóa",
  "Lỗi",
];

const normalize = (value: any) => (value ?? "").toString().trim();

const normalizeHeader = (value: string) =>
  normalize(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const getValue = (row: ExcelRawRow, aliases: string[]) => {
  const aliasSet = new Set(aliases.map(normalizeHeader));

  for (const [key, value] of Object.entries(row)) {
    if (aliasSet.has(normalizeHeader(key))) {
      return normalize(value);
    }
  }

  return "";
};

const ExcelImportModal = ({ open, onClose }: Props) => {
  const { data: studentsData } = useGetStudentsQuery();
  const { data: programData } = useGetProgramsQuery({});
  const { data: coursesData } = useGetCoursesQuery();

  const [addStudents] = useAddStudentsMutation();

  const students = studentsData?.data || [];
  const programs = programData?.data || [];
  const courses = coursesData?.data || [];

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDownloadTemplate = () => {
    const templateRows = [
      {
        MSSV: "SV0001",
        "Họ tên": "Nguyen Van A",
        "Ngày sinh": "2002-09-01",
        "Giới tính": "Nam",
        Email: "sv0001@school.edu.vn",
        SĐT: "0912345678",
        "Địa chỉ": "Ha Noi",
        Ngành: "CNTT",
        Khóa: "K18",
        "Mật khẩu": "123456",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateRows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "student-import-template.xlsx");
  };

  const resetFile = () => {
    setFileName("");
    setRows([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      const programMap = new Map(
        programs.map((p) => [normalize(p.code).toLowerCase(), p.id]),
      );
      const courseMap = new Map(
        courses.map((c) => [normalize(c.code).toLowerCase(), c.id]),
      );

      const studentMap = new Set(
        students.map((s) => normalize(s.studentCode).toLowerCase()),
      );

      const preview: PreviewRow[] = json.map((raw) => {
        const studentCode = getValue(raw, [
          "MSSV",
          "Mã SV",
          "Mã sinh viên",
          "Mã số sinh viên",
          "Student code",
          "studentCode",
        ]);
        const fullName = getValue(raw, [
          "Họ tên",
          "Họ và tên",
          "Tên",
          "Full name",
          "fullName",
        ]);
        const dob = excelDateToISO(
          getValue(raw, [
            "Ngày sinh",
            "DOB",
            "Birthdate",
            "Date of birth",
            "dob",
          ]),
        );
        const genderRaw = getValue(raw, ["Giới tính", "Gender", "Phái", "Sex"]);
        const email = getValue(raw, ["Email", "E-mail", "Mail"]);
        const phone = getValue(raw, [
          "SĐT",
          "Số điện thoại",
          "Điện thoại",
          "Phone",
          "Phone number",
        ]);
        const address = getValue(raw, ["Địa chỉ", "Address"]);
        const programCode = getValue(raw, [
          "Ngành",
          "Mã ngành",
          "Ngành học",
          "Program",
          "Program code",
          "programCode",
        ]);
        const courseCode = getValue(raw, [
          "Khóa",
          "Khoá",
          "Mã khóa",
          "Mã khoá",
          "Course",
          "Course code",
          "courseCode",
        ]);
        const password = getValue(raw, ["Mật khẩu", "Password", "Pass"]);

        const programId = programMap.get(programCode.toLowerCase());
        const courseId = courseMap.get(courseCode.toLowerCase());
        const genderNormalized =
          normalize(genderRaw).toLowerCase() === "nam" ||
          normalize(genderRaw).toLowerCase() === "male"
            ? "MALE"
            : "FEMALE";

        const errors: string[] = [];

        if (!studentCode) errors.push("Thiếu MSSV");
        if (!fullName) errors.push("Thiếu họ tên");
        if (!email) errors.push("Thiếu email");
        if (!password) errors.push("Thiếu mật khẩu");
        if (!dob) errors.push("Ngày sinh không hợp lệ");

        if (!programCode) {
          errors.push("Thiếu mã ngành");
        } else if (!programId) {
          errors.push(`Không tìm thấy ngành (${programCode})`);
        }

        if (!courseCode) {
          errors.push("Thiếu mã khóa");
        } else if (!courseId) {
          errors.push(`Không tìm thấy khóa (${courseCode})`);
        }

        if (studentCode && studentMap.has(studentCode.toLowerCase())) {
          errors.push("MSSV đã tồn tại");
        }

        return {
          studentCode,
          fullName,
          dob,
          gender: genderNormalized,
          email,
          phone,
          address,
          programCode,
          courseCode,
          password,
          programId,
          courseId,
          error: errors.join(" | "),
        };
      });

      setRows(preview);
    } catch {
      setRows([]);
    }
  };

  const handleImport = async () => {
    const students: StudentRequest[] = rows
      .filter((r) => !r.error)
      .map((r) => ({
        studentCode: r.studentCode,
        password: r.password,
        fullName: r.fullName,
        email: r.email,
        gender: r.gender,
        phone: r.phone,
        address: r.address,
        programId: r.programId!,
        courseId: r.courseId!,
        dob: r.dob,
      }));
    await addStudents(students);
    onClose();
  };

  const validCount = rows.filter((r) => !r.error).length;
  const errorCount = rows.filter((r) => r.error).length;

  return (
    <Modal open={open} onClose={onClose} width="max-w-7xl">
      <div className="space-y-5">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center text-emerald-500 shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
                Nhập sinh viên từ Excel
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Ví dụ: MSSV = SV0001, Ngành = CNTT, Khóa = K18
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

        {/* ── Drop zone ── */}
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
              Kéo & thả file vào đây
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              hoặc{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                click để chọn file
              </span>{" "}
              — .xlsx, .xls
            </p>
          </label>
        )}

        {/* ── File info + summary ── */}
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

        {/* ── Stats ── */}
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

        {/* ── Preview table ── */}
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
                  {COLUMNS.map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    className={`transition-colors ${
                      r.error
                        ? "bg-red-50 dark:bg-red-950/20"
                        : "bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <td className="px-3 py-2 font-mono text-gray-700 dark:text-gray-300">
                      {r.studentCode}
                    </td>
                    <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                      {r.fullName}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {r.dob}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {r.gender ? formatGender(r.gender) : "Chưa nhập"}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {r.email}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {r.phone}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400 max-w-[140px] truncate">
                      {r.address}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {r.programCode}
                    </td>
                    <td className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      {r.courseCode}
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2 pt-1">
          <Button label="Hủy" variant="outline" size="sm" onClick={onClose} />
          <Button
            label={`Nhập ${validCount} sinh viên`}
            variant="success"
            size="sm"
            icon={Download}
            disabled={validCount === 0}
            onClick={handleImport}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExcelImportModal;
