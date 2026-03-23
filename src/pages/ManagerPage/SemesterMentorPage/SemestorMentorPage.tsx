import { useState } from "react";
import {
  useRemoveMentorFromCurrentSemesterMutation,
  useSearchThesisMentorsQuery,
} from "../../../services/semApi";
import type { LecturerResponse } from "../../../types/lecturer";
import MentorRow from "./MentorRow";
import Button from "../../../components/UI/Button";
import { GraduationCap, Plus } from "lucide-react";
import MentorListModal from "./MentorListModal";

const SemestorMentorPage = () => {
  const { data, isLoading, refetch } = useSearchThesisMentorsQuery({
    page: 0,
    size: 10,
  });

  const [removeMentor] = useRemoveMentorFromCurrentSemesterMutation();
  const [openMentorsList, setOpenMentorsList] = useState(false);

  const mentors: LecturerResponse[] = data?.data.content || [];

  const handleRemove = async (id: string) => {
    await removeMentor(id).unwrap();
    refetch();
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-950/40 text-blue-500 dark:text-blue-300 rounded-lg">
            <GraduationCap />
          </div>

          <div>
            <h1 className="text-2xl font-semibold dark:text-gray-100">
              Quản lý giảng viên hướng dẫn
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý giảng viên tham gia hướng dẫn luận văn
            </p>
          </div>
        </div>

        <Button
          icon={Plus}
          label="Thêm GVHD"
          size="sm"
          onClick={() => setOpenMentorsList(true)}
        />
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* HEADER */}
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
          <div className="col-span-2">Giảng viên</div>
          <div>Mã CB</div>
          <div className="col-span-2">Đơn vị</div>
          <div>Ngày sinh</div>
          <div>Giới tính</div>
          <div>SĐT</div>
          <div className="text-center">Hành động</div>
        </div>

        {/* BODY */}
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : mentors.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Chưa có giảng viên nào
          </div>
        ) : (
          mentors.map((mentor) => (
            <MentorRow
              key={mentor.id}
              lecturer={mentor}
              onDelete={() => handleRemove(mentor.id)}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      <MentorListModal
        open={openMentorsList}
        onClose={() => {
          setOpenMentorsList(false);
          refetch();
        }}
      />
    </div>
  );
};

export default SemestorMentorPage;
