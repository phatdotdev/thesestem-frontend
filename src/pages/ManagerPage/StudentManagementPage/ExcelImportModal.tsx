import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { v4 as uuid } from "uuid";
import type { Student } from "../../../types/Student";
import { excelDateToISO } from "../../../utils/excelDateToISO";

interface Props {
  onClose: () => void;
  onImport: (students: Student[]) => void;
}

interface StudentExcelRow {
  MSSV: string;
  "Họ tên": string;
  "Ngày sinh": string;
  "Giới tính": string;
  Email: string;
  SĐT: string;
  Ngành: string;
  Khóa: string;
  "Mật khẩu": string;
}

const ExcelImportModal = ({ onClose, onImport }: Props) => {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<StudentExcelRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetFile = () => {
    setFileName("");
    setRows([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file: File) => {
    resetFile();
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json<StudentExcelRow>(worksheet, {
        defval: "",
        raw: false,
      });

      setRows(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    const students: Student[] = rows.map((r) => ({
      id: uuid(),
      studentCode: r.MSSV,
      fullName: r["Họ tên"],
      dob: excelDateToISO(r["Ngày sinh"]),
      gender: r["Giới tính"] as any,
      email: r.Email,
      phone: r["SĐT"],
      major: r.Ngành,
      course: r.Khóa,
      password: r["Mật khẩu"],
    }));

    onImport(students);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* ===== MODAL HEADER ===== */}
        <div className="border-b bg-gray-50 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            📊 Nhập sinh viên từ Excel
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tải file Excel và xem trước dữ liệu trước khi nhập
          </p>
        </div>

        {/* ===== CONTENT ===== */}
        <div className="p-6">
          {rows.length === 0 && (
            <label
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="flex h-72 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-green-500 hover:bg-green-50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={(e) =>
                  e.target.files && handleFile(e.target.files[0])
                }
              />
              <div className="text-5xl">📥</div>
              <p className="mt-3 text-sm">
                Kéo & thả file Excel hoặc <b>click để chọn</b>
              </p>
            </label>
          )}

          {fileName && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span>
                📄 <b>{fileName}</b>
              </span>
              <button
                onClick={resetFile}
                className="text-red-600 hover:underline"
              >
                Chọn file khác
              </button>
            </div>
          )}

          {rows.length > 0 && (
            <div className="mt-4 max-h-[420px] overflow-auto rounded border-2 border-gray-300">
              <table className="border-none w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gray-200 shadow-sm">
                  <tr>
                    {[
                      "MSSV",
                      "Họ tên",
                      "Ngày sinh",
                      "Giới tính",
                      "Email",
                      "SĐT",
                      "Ngành",
                      "Khóa",
                      "Mật khẩu",
                    ].map((h) => (
                      <th
                        key={h}
                        className="border px-3 py-2 text-left font-semibold text-gray-700 uppercase text-xs whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="border-none">
                  {rows.map((r, i) => (
                    <tr
                      key={i}
                      className="odd:bg-white even:bg-gray-50 hover:bg-green-50"
                    >
                      <td className="px-2 py-1">{r.MSSV}</td>
                      <td className="px-2 py-1">{r["Họ tên"]}</td>
                      <td className="px-2 py-1">
                        {excelDateToISO(r["Ngày sinh"])}
                      </td>
                      <td className="px-2 py-1">{r.Email}</td>
                      <td className="px-2 py-2">{r["Giới tính"]}</td>
                      <td className="px-2 py-1">{r["SĐT"]}</td>
                      <td className="px-2 py-1">{r.Ngành}</td>
                      <td className="px-2 py-1">{r.Khóa}</td>
                      <td className="px-2 py-1">
                        {"•".repeat(r["Mật khẩu"]?.length || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button onClick={onClose} className="px-4 py-2">
            Hủy
          </button>
          <button
            disabled={rows.length === 0}
            onClick={handleImport}
            className="rounded-lg bg-green-600 px-4 py-2 text-white disabled:bg-gray-300"
          >
            Nhập {rows.length} sinh viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportModal;
