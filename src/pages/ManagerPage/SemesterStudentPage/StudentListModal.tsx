import { useEffect, useState } from "react";
import { useSearchStudentsQuery } from "../../../services/userApi";
import Modal from "../../../components/UI/Modal";
import StudentRow from "./StudentRow";
import {
  useAddStudentToCurrentSemesterMutation,
  useGetThesisStudentQuery,
} from "../../../services/semApi";

const PAGE_SIZE = 10;

const StudentListModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [addStudent] = useAddStudentToCurrentSemesterMutation();

  const [page, setPage] = useState(0);

  const [search, setSearch] = useState({
    name: "",
    code: "",
    email: "",
  });

  const { data: semesterStudentsResponse } = useGetThesisStudentQuery({});
  const thesisStudentIds = (semesterStudentsResponse?.data || []).map(
    (student) => student.id,
  );

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading } = useSearchStudentsQuery({
    page,
    size: PAGE_SIZE,
    ...debouncedSearch,
  });

  const students = data?.data.content ?? [];
  const totalPages = data?.data.totalPages ?? 0;

  const handleNext = () => {
    if (page + 1 < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const onAdd = async (id: string) => {
    await addStudent(id).unwrap();
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-6xl">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Danh sách sinh viên</h1>
      </div>

      {/* SEARCH */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search.name}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Tìm theo mã SV..."
          value={search.code}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, code: e.target.value }))
          }
          className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Tìm theo email..."
          value={search.email}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* HEADER */}
        <div className="grid grid-cols-9 gap-4 px-4 py-3 text-xs font-semibold uppercase bg-gray-50 border-b">
          <div className="col-span-2">Sinh viên</div>
          <div>Mã SV</div>
          <div>Ngày sinh</div>
          <div>Giới tính</div>
          <div>SĐT</div>
          <div>Ngành</div>
          <div>Khóa</div>
          <div className="text-center">Hành động</div>
        </div>

        {/* BODY */}
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không có sinh viên
          </div>
        ) : (
          students.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              onAdd={() => onAdd(student.id)}
              added={thesisStudentIds.includes(student.id)}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-5 text-sm">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-100"
        >
          ← Previous
        </button>

        <span className="text-gray-600">
          Trang <b>{page + 1}</b> / {totalPages || 1} • Tổng:{" "}
          <b>{data?.data.totalElements ?? 0}</b>
        </span>

        <button
          onClick={handleNext}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-100"
        >
          Next →
        </button>
      </div>
    </Modal>
  );
};

export default StudentListModal;
