import { useState } from "react";
import Modal from "../../../../components/UI/Modal";
import Button from "../../../../components/UI/Button";
import {
  useAssignStudentToGroupMutation,
  useAssignStudentToTopicMutation,
  useGetGroupTopicsQuery,
} from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import type { StudentResponse } from "../../../../types/student";
import { BookOpen } from "lucide-react";

const TopicListModal = ({
  open,
  onClose,
  student,
}: {
  open: boolean;
  onClose: () => void;
  student: StudentResponse | null;
}) => {
  const { ["group-id"]: groupId } = useParams();

  const { data: topicsResponse } = useGetGroupTopicsQuery(groupId!);
  const [assignTopic] = useAssignStudentToTopicMutation();
  const topics = topicsResponse?.data || [];

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const handleAssign = async () => {
    if (!selectedTopicId) return;

    console.log("Assign topic", selectedTopicId, "to student", student?.id);

    await assignTopic({
      groupId: groupId as string,
      studentId: student?.id as string,
      topicId: selectedTopicId as string,
    }).unwrap();

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="p-2 max-w-full">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Phân công đề tài
          </h2>

          <p className="text-sm text-gray-500">
            Sinh viên: <span className="font-medium">{student?.fullName}</span>
          </p>
        </div>

        {/* Topic List */}
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto">
            {topics.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                Không có đề tài nào
              </div>
            ) : (
              topics.map((topic: any) => {
                const selected = selectedTopicId === topic.id;

                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`flex items-start gap-3 p-3 cursor-pointer border-b last:border-b-0 transition
                      ${selected ? "bg-gray-100" : "hover:bg-gray-50"}
                    `}
                  >
                    <BookOpen className="h-4 w-4 mt-1 text-gray-500" />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {topic.title}
                      </p>

                      {topic.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {topic.description}
                        </p>
                      )}
                    </div>

                    <input type="radio" checked={selected} readOnly />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" label="Hủy" onClick={onClose} />

          <Button
            label="Phân công"
            disabled={!selectedTopicId}
            onClick={handleAssign}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TopicListModal;
