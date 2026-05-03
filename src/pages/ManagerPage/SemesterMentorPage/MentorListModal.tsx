import { useEffect, useState } from "react";
import Modal from "../../../components/UI/Modal";
import { useSearchLecturersQuery } from "../../../services/userApi";
import MentorRow from "./MentorRow";
import {
  useAddMentorToCurrentSemesterMutation,
  useGetThesisMentorsQuery,
} from "../../../services/semApi";

const PAGE_SIZE = 5;

const MentorListModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [page, setPage] = useState(0);
  const [addMentor] = useAddMentorToCurrentSemesterMutation();
  const { data: mentorsResponse } = useGetThesisMentorsQuery({});
  const [search, setSearch] = useState({
    name: "",
    code: "",
    email: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const mentorIds = (mentorsResponse?.data || []).map((mentor) => mentor.id);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading } = useSearchLecturersQuery({
    page,
    size: PAGE_SIZE,
    ...debouncedSearch,
  });

  const mentors = data?.data.content ?? [];
  const totalPages = data?.data.totalPages ?? 0;
  const totalElements = data?.data.totalElements ?? 0;

  const handleAdd = async (id: string) => {
    await addMentor(id).unwrap();
  };

  const handleNext = () => {
    if (page + 1 < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-6xl">
      {/* HEADER */}
      <h1 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Danh sách giảng viên
      </h1>

      {/* SEARCH */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm theo tên..."
          value={search.name}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <input
          type="text"
          placeholder="Tìm theo mã CB..."
          value={search.code}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, code: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />

        <input
          type="text"
          placeholder="Tìm theo email..."
          value={search.email}
          onChange={(e) =>
            setSearch((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* HEADER */}
        <div className="grid grid-cols-6 gap-4 border-b border-gray-200 dark:border-gray-700 px-4 py-3 text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <div className="col-span-2">Giảng viên</div>
          <div>Mã CB</div>
          <div>Ngày sinh</div>
          <div>Giới tính</div>
          <div>SĐT</div>
          <div className="text-center">Hành động</div>
        </div>

        {/* BODY */}
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        ) : mentors.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Không có giảng viên
          </div>
        ) : (
          mentors.map((mentor) => (
            <MentorRow
              added={mentorIds.includes(mentor.id)}
              key={mentor.id}
              lecturer={mentor}
              onAdd={() => handleAdd(mentor.id)}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4 text-gray-700 dark:text-gray-200">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Previous
        </button>

        <span className="text-sm">
          Trang {page + 1} / {totalPages || 1} | Tổng: {totalElements}
        </span>

        <button
          onClick={handleNext}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Next
        </button>
      </div>
    </Modal>
  );
};

export default MentorListModal;
