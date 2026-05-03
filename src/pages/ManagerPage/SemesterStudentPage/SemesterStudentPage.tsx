import { useEffect, useState } from "react";
import {
  useGetCurrentSemesterQuery,
  useLazySearchStudentThesisBySemesterQuery,
  useRemoveStudentFromCurrentSemesterMutation,
  useSearchThesisStudentsQuery,
} from "../../../services/semApi";
import type { StudentResponse } from "../../../types/student";
import StudentRow from "./StudentRow";
import Button from "../../../components/UI/Button";
import { GraduationCap, Plus, Search, Upload } from "lucide-react";
import StudentListModal from "./StudentListModal";
import SemesterSelecter from "../../../components/common/SemesterSelecter";
import StudentExcelImportModal from "./StudentExcelImportModal";

const PAGE_SIZE = 10;

const SemesterStudentPage = () => {
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState({
    name: "",
    code: "",
    email: "",
  });
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [
    getStudentsBySemester,
    { data: semesterData, isLoading: semesterLoading },
  ] = useLazySearchStudentThesisBySemesterQuery();

  const {
    data: currentData,
    isLoading: currentLoading,
    refetch: refetchCurrentStudents,
  } = useSearchThesisStudentsQuery({
    page,
    size: PAGE_SIZE,
    ...debouncedSearch,
  });

  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();

  const [removeStudent] = useRemoveStudentFromCurrentSemesterMutation();
  const [openList, setOpenList] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (selectedSemesterId) {
      getStudentsBySemester({
        semesterId: selectedSemesterId,
        form: {
          page,
          size: PAGE_SIZE,
          ...debouncedSearch,
        },
      });
    }
  }, [selectedSemesterId, page, debouncedSearch, getStudentsBySemester]);

  const data = selectedSemesterId ? semesterData : currentData;
  const isLoading = selectedSemesterId ? semesterLoading : currentLoading;
  const students: StudentResponse[] = data?.data.content || [];
  const totalPages = data?.data.totalPages ?? 0;
  const currentSemesterId = currentSemesterResponse?.data?.id;
  const canManageStudents =
    !selectedSemesterId || selectedSemesterId === currentSemesterId;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages - 1) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  const handleSemesterChange = (semesterId: string | null) => {
    setPage(0);
    setSelectedSemesterId(semesterId);
  };

  const refreshStudents = () => {
    if (selectedSemesterId) {
      getStudentsBySemester({
        semesterId: selectedSemesterId,
        form: {
          page,
          size: PAGE_SIZE,
          ...debouncedSearch,
        },
      });
      return;
    }

    refetchCurrentStudents();
  };

  const onDelete = async (id: string) => {
    if (!canManageStudents) return;

    await removeStudent(id).unwrap();
    refreshStudents();
  };

  return (
    <div
      className="space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow p-6"
      style={{ fontFamily: "Inter" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-950/40 text-blue-500 dark:text-blue-300 rounded-lg">
            <GraduationCap />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý sinh viên
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý sinh viên tham gia thực hiện luận văn
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SemesterSelecter size="sm" onChange={handleSemesterChange} />

          <Button
            icon={Upload}
            label="Thêm Excel"
            size="sm"
            variant="outline"
            disabled={!canManageStudents}
            title={
              canManageStudents
                ? ""
                : "Chỉ được thêm sinh viên trong học kỳ hiện tại"
            }
            onClick={() => setOpenExcel(true)}
          />

          <Button
            icon={Plus}
            label="Thêm sinh viên"
            size="sm"
            disabled={!canManageStudents}
            title={
              canManageStudents
                ? ""
                : "Chỉ được thêm sinh viên trong học kỳ hiện tại"
            }
            onClick={() => setOpenList(true)}
          />
        </div>
      </div>

      {!canManageStudents && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          Bạn đang xem học kỳ không phải hiện tại. Chế độ này chỉ cho phép xem,
          không cho thêm hoặc xóa sinh viên.
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300">
          <Search size={16} />
          <p className="text-xs font-semibold uppercase tracking-wider">
            Tìm kiếm sinh viên
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={search.name}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />

          <input
            type="text"
            placeholder="Tìm theo mã SV..."
            value={search.code}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, code: e.target.value }))
            }
            className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />

          <input
            type="text"
            placeholder="Tìm theo email..."
            value={search.email}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, email: e.target.value }))
            }
            className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* TABLE HEADER */}
        <div
          className="
          grid grid-cols-9 gap-4
          border-b border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800
          px-4 py-3
          text-xs font-semibold uppercase tracking-wide
          text-gray-600 dark:text-gray-300
        "
        >
          <div className="col-span-2">Sinh viên</div>
          <div>Mã SV</div>
          <div>Ngày sinh</div>
          <div>Giới tính</div>
          <div>Số điện thoại</div>
          <div>Ngành</div>
          <div>Khóa</div>
          <div className="text-center">Hành động</div>
        </div>

        {/* TABLE BODY */}
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Chưa có sinh viên nào
          </div>
        ) : (
          students.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              onDelete={
                canManageStudents ? () => onDelete(student.id) : undefined
              }
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <Button
            label="Trước"
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          />

          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              label={(index + 1).toString()}
              size="sm"
              variant={page === index ? "info" : "outline"}
              onClick={() => setPage(index)}
            />
          ))}

          <Button
            label="Sau"
            size="sm"
            variant="outline"
            disabled={page === totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          />
        </div>
      )}

      {/* MODAL */}
      <StudentListModal
        open={openList && canManageStudents}
        onClose={() => {
          setOpenList(false);
          refreshStudents();
        }}
      />

      <StudentExcelImportModal
        open={openExcel && canManageStudents}
        onClose={() => {
          setOpenExcel(false);
          refreshStudents();
        }}
      />
    </div>
  );
};

export default SemesterStudentPage;
