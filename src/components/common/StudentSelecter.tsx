import { useEffect, useRef, useState, useMemo } from "react";
import { ChevronDown, Users, Search } from "lucide-react";
import { useGetStudentsQuery } from "../../services/userApi";

interface Props {
  value?: string | null; // studentId
  size?: "sm" | "md";
  onChange?: (studentId: string | null) => void;
  showAllOption?: boolean;
  placeholder?: string;
  width?: number | string;
  height?: number | string;
}

const StudentSelector = ({
  value,
  size = "md",
  onChange,
  showAllOption = false,
  placeholder = "Chọn sinh viên",
  width,
  height,
}: Props) => {
  const { data: studentsResponse, isLoading } = useGetStudentsQuery();
  const students = studentsResponse?.data || [];

  const [selected, setSelected] = useState<string | null>(value ?? null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const triggerHeightClass = size === "sm" ? "h-9" : "h-11";

  const ref = useRef<HTMLDivElement>(null);

  // Cập nhật selected khi prop value thay đổi
  useEffect(() => {
    setSelected(value ?? null);
  }, [value]);

  // Click outside đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchTerm(""); // reset search khi đóng
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lọc sinh viên theo từ khóa tìm kiếm
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;

    const term = searchTerm.toLowerCase().trim();
    return students.filter((student: any) => {
      const fullName = (student.fullName || "").toLowerCase();
      const studentCode = (student.studentCode || "").toLowerCase();
      return fullName.includes(term) || studentCode.includes(term);
    });
  }, [students, searchTerm]);

  const handleChange = (studentId: string | null) => {
    setSelected(studentId);
    onChange?.(studentId);
    setOpen(false);
    setSearchTerm("");
  };

  const selectedStudent = students.find((s: any) => s.id === selected);

  // Loading skeleton
  if (isLoading) {
    return (
      <div
        className={`rounded-xl border border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 animate-pulse ${height ? "" : triggerHeightClass}`}
        style={{ width: width ?? "20rem", height }}
      />
    );
  }

  return (
    <div ref={ref} className="relative" style={{ width: width ?? "20rem" }}>
      {/* Trigger Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{ height }}
        className={`
          flex items-center justify-between gap-2
          ${size === "sm" ? "px-3" : "px-4"}
          ${height ? "py-0" : size === "sm" ? "py-1.5" : "py-2.5"}
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          shadow-sm
          cursor-pointer
          hover:border-blue-400
          transition-all
        `}
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <Users size={size === "sm" ? 16 : 20} className="text-blue-500" />

          <span className="text-sm font-medium truncate max-w-[220px]">
            {selectedStudent
              ? `${selectedStudent.fullName} (${selectedStudent.studentCode})`
              : showAllOption && selected === null
                ? "Tất cả sinh viên"
                : placeholder}
          </span>
        </div>

        <ChevronDown
          size={size === "sm" ? 16 : 20}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên hoặc mã sinh viên..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-400"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-72 overflow-y-auto">
            {showAllOption && (
              <div
                onClick={() => handleChange(null)}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                  selected === null
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 font-medium"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                Tất cả sinh viên
              </div>
            )}

            {filteredStudents.length > 0 ? (
              filteredStudents.map((student: any) => (
                <div
                  key={student.id}
                  onClick={() => handleChange(student.id)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    selected === student.id
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <div>
                    <div className="font-medium">{student.fullName}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {student.studentCode}
                    </div>
                  </div>

                  {student.program?.name && (
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                      {student.program.name}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Không tìm thấy sinh viên nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSelector;
