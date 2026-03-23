import { useState } from "react";

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

const MentorMembersPage = () => {
  const { ["group-id"]: groupId } = useParams();
  const [search, setSearch] = useState("");
  const { data: thesesResposne } = useGetGroupThesesQuery(groupId!);
  const { data: membersResponse } = useGetStudentsInGroupQuery(groupId!);

  const members = membersResponse?.data || [];
  const theses = thesesResposne?.data || [];

  console.log(theses);

  const [openTopicModal, setOpenTopicModal] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<null | StudentResponse>(null);

  // filter theo tên hoặc MSSV
  const filteredMembers = members.filter((student) => {
    const keyword = search.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(keyword) ||
      student.studentCode.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="bg-white border border-gray-200 shadow rounded-2xl p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thành viên</h1>
        <p className="text-gray-500">
          Danh sách sinh viên thuộc nhóm hướng dẫn
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative w-full md:w-72 mb-6">
        <Input
          iconLeft={FaSearch}
          type="text"
          placeholder="Tìm theo tên hoặc MSSV..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <p className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        Danh sách sinh viên
      </p>

      {/* MEMBER LIST */}
      <div className="grid gap-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            Không có sinh viên nào phù hợp
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              topic={
                theses.find((thesis) => thesis.student.id === member.id)
                  ? {
                      title: theses.find(
                        (thesis) => thesis.student.id === member.id,
                      )!.title,
                    }
                  : undefined
              }
              onSelect={() => {
                {
                  setSelectedStudent(member);
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
      />
    </div>
  );
};

export default MentorMembersPage;
