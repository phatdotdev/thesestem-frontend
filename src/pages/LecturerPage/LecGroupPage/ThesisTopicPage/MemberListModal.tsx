import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  UserPlus,
  Loader2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import Modal from "../../../../components/UI/Modal";
import Button from "../../../../components/UI/Button";
import {
  useGetStudentsInGroupQuery,
  useAssignStudentToTopicMutation,
  useGetGroupThesesQuery,
} from "../../../../services/groupApi";
import { useAppDispatch } from "../../../../app/hook";
import { addToast } from "../../../../features/notification/toastSlice";
import type { TopicResponse } from "../../../../types/group";

const MemberListModal = ({
  open,
  onClose,
  topic,
}: {
  open: boolean;
  onClose: () => void;
  topic: TopicResponse | null;
}) => {
  const { ["group-id"]: groupId } = useParams();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");

  const { data: membersResponse, isLoading } = useGetStudentsInGroupQuery(
    groupId!,
    {
      skip: !groupId || !open,
    },
  );

  const { data: thesesResponse } = useGetGroupThesesQuery(groupId!, {
    skip: !groupId || !open,
  });

  const [assignTopic, { isLoading: assigning }] =
    useAssignStudentToTopicMutation();

  const members = membersResponse?.data || [];

  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.studentCode?.toLowerCase().includes(search.toLowerCase()),
  );

  const studentThesisMap = useMemo(() => {
    const map: Record<string, { thesisId: string; title: string }> = {};

    if (thesesResponse?.data) {
      thesesResponse.data.forEach((t: any) => {
        map[t.student.id] = { thesisId: t.id, title: t.title };
      });
    }
    return map;
  }, [thesesResponse]);

  const handleAssign = async (studentId: string) => {
    if (!topic || !groupId) return;
    try {
      await assignTopic({
        groupId,
        studentId,
        topicId: topic.id,
      }).unwrap();
      dispatch(
        addToast({ type: "success", message: "Đã gán sinh viên vào đề tài" }),
      );
      // Có thể không đóng modal để giảng viên gán tiếp người thứ 2 nếu đề tài cho phép
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Phân công thất bại" }));
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <UserPlus size={20} className="text-blue-500" />
          Thêm thành viên
        </h2>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          Đề tài:{" "}
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {topic?.title}
          </span>
        </p>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sinh viên..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-[380px] overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
        {isLoading ? (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        ) : (
          filteredMembers.map((student) => {
            const hasThesis = !!studentThesisMap[student.id];
            const isSelf = false;

            return (
              <div
                key={student.id}
                className={`
                    flex items-center justify-between p-3 rounded-2xl border transition-all
                    ${
                      isSelf
                        ? "border-blue-100 bg-blue-50/50 dark:border-blue-900/30 dark:bg-blue-900/10"
                        : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }
                  `}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                      {student.fullName.split(" ").pop()?.charAt(0)}
                    </div>
                    {isSelf && (
                      <div className="absolute -right-1 -top-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white dark:border-gray-900">
                        <CheckCircle2 size={10} />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {student.fullName}
                    </p>
                    {hasThesis ? (
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        <BookOpen size={10} />
                        <span>
                          Đã có đề tài: {studentThesisMap[student.id]?.title}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-500">
                        {student.studentCode}
                      </p>
                    )}
                  </div>
                </div>

                {!isSelf && (
                  <Button
                    size="sm"
                    variant={hasThesis ? "outline" : "primary"}
                    label={hasThesis ? "Đổi" : "Thêm"}
                    loading={assigning}
                    onClick={() => handleAssign(student.id)}
                    className="rounded-xl h-8 text-[11px]"
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex justify-end">
        <button
          onClick={onClose}
          className="text-sm font-bold text-gray-400 hover:text-gray-700"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default MemberListModal;
