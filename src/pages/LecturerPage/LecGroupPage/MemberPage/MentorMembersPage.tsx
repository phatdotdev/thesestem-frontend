import { useMemo, useState } from "react";

import {
  useGetGroupThesesQuery,
  useGetStudentsInGroupQuery,
} from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import Input from "../../../../components/UI/Input";
import { FaSearch } from "react-icons/fa";
import MemberCard from "./MemberCard";
import TopicListModal from "./TopicListModal";
import type { StudentResponse } from "../../../../types/student";
import { Plus, Users } from "lucide-react";
import EmptyState from "../../../../components/UI/EmptyState";
import Button from "../../../../components/UI/Button";
import RegisterModal from "./RegisterModal";
import type { ThesisResponse } from "../../../../types/thesis";
import type { ThesesResponse } from "../../../../types/group";

const MentorMembersPage = () => {
  const { ["group-id"]: groupId } = useParams();
  const [search, setSearch] = useState("");
  const { data: thesesResposne } = useGetGroupThesesQuery(groupId!);
  const { data: membersResponse } = useGetStudentsInGroupQuery(groupId!);

  const members = membersResponse?.data || [];
  const theses = thesesResposne?.data || [];

  const topicByStudentId = new Map(
    theses.map((thesis) => [thesis.student.id, thesis.title]),
  );

  const [openTopicModal, setOpenTopicModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<null | StudentResponse>(null);

  const [thesisByStudent, setThesisByStudent] = useState<null | ThesesResponse>(
    null,
  );

  // filter theo tên hoặc MSSV
  const filteredMembers = members.filter((student) => {
    const keyword = search.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(keyword) ||
      student.studentCode.toLowerCase().includes(keyword)
    );
  });
  const thesisMap = useMemo(() => {
    return new Map<string, ThesesResponse>(
      theses.map((t) => [t.student.id, t]),
    );
  }, [theses]);

  return (
    <div className="mt-6 rounded-3xl border border-gray-200/80 bg-white/95 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/95">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3 items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <Users size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý thành viên
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Danh sách sinh viên trong nhóm hướng dẫn
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-4 relative mb-6">
          <Input
            iconLeft={FaSearch}
            type="text"
            placeholder="Tìm theo tên hoặc MSSV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="w-60">
            <Button
              onClick={() => setOpenRegisterModal(true)}
              icon={Plus}
              label="Thêm sinh viên"
              size="sm"
            />
          </div>
        </div>
      </div>

      <p className="mt-4 mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
        Danh sách sinh viên
      </p>

      {/* MEMBER LIST */}
      <div className="grid gap-4">
        {filteredMembers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Chưa có sinh viên"
            description="Thêm sinh viên mới để bắt đầu hướng dẫn."
          />
        ) : (
          filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              topic={
                topicByStudentId.get(member.id)
                  ? { title: topicByStudentId.get(member.id)! }
                  : undefined
              }
              onSelect={() => {
                {
                  setSelectedStudent(member);
                  const studentThesis = theses.find(
                    (t) => t.student.id === member.id,
                  );
                  setThesisByStudent(studentThesis || null);
                  setOpenTopicModal(true);
                }
              }}
            />
          ))
        )}
      </div>

      {/* ACTIONS */}
      <TopicListModal
        open={openTopicModal}
        onClose={() => setOpenTopicModal(false)}
        student={selectedStudent}
        topic={thesisByStudent}
      />
      <RegisterModal
        open={openRegisterModal}
        onClose={() => setOpenRegisterModal(false)}
        groupId={groupId as string}
      />
    </div>
  );
};

export default MentorMembersPage;
