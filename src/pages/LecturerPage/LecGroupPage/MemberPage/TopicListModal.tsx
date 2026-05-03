import { useEffect, useMemo, useState } from "react";
import Modal from "../../../../components/UI/Modal";
import Button from "../../../../components/UI/Button";
import {
  useAssignStudentToTopicMutation,
  useExchangeStudentBetweenTopicsMutation,
  useGetGroupTopicsQuery,
} from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import type { StudentResponse } from "../../../../types/student";
import { BookOpen, Users, Loader2, Search } from "lucide-react";
import type { ThesesResponse, TopicResponse } from "../../../../types/group";

type Props = {
  open: boolean;
  onClose: () => void;
  student: StudentResponse | null;
  topic: ThesesResponse | null;
};

const TopicListModal = ({ open, onClose, student, topic }: Props) => {
  const { ["group-id"]: groupId } = useParams();

  const { data: topicsResponse, isLoading } = useGetGroupTopicsQuery(groupId!, {
    skip: !groupId || !open,
  });

  const [assignTopic, { isLoading: assigning }] =
    useAssignStudentToTopicMutation();

  const [exchangeTopic, { isLoading: exchanging }] =
    useExchangeStudentBetweenTopicsMutation();

  const topics: TopicResponse[] = topicsResponse?.data || [];

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const isSubmitting = assigning || exchanging;

  // reset khi đóng modal
  useEffect(() => {
    if (!open) {
      setSelectedTopicId(null);
      setSearch("");
    }
  }, [open]);

  // reset khi đổi student
  useEffect(() => {
    setSelectedTopicId(null);
  }, [student]);

  // filter topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [topics, search]);

  const selectedTopic = topics.find((t) => t.id === selectedTopicId);

  const handleAssign = async () => {
    if (!selectedTopicId || !student || !groupId) return;

    try {
      if (!topic) {
        await assignTopic({
          groupId,
          studentId: student.id,
          topicId: selectedTopicId,
        }).unwrap();
      } else {
        await exchangeTopic({
          groupId,
          studentId: student.id,
          newTopicId: selectedTopicId,
          oldTopicId: topic.id,
        }).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Assign topic error:", error);
    }
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="p-2 space-y-4">
        {/* Header */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-2 text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
              <BookOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {topic
                  ? "Đổi đề tài cho sinh viên"
                  : "Phân công đề tài cho sinh viên"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Chọn đề tài phù hợp trong danh sách của nhóm
              </p>

              {student && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-2.5 py-1.5 dark:border-blue-900/60 dark:bg-gray-900">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {getInitials(student.fullName)}
                  </div>

                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {student.fullName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search + Topic List */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm đề tài..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-800 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            )}

            {!isLoading && filteredTopics.length === 0 && (
              <div className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                Không tìm thấy đề tài nào
              </div>
            )}

            {!isLoading &&
              filteredTopics.map((t) => {
                const selected = selectedTopicId === t.id;
                const isCurrentTopic = topic?.id === t.id;
                const currentStudents = t.currentStudents || 0;
                const isFull = currentStudents >= t.maxStudents;
                const percent = Math.min(
                  (currentStudents / Math.max(t.maxStudents, 1)) * 100,
                  100,
                );

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      !isFull && !isCurrentTopic && setSelectedTopicId(t.id)
                    }
                    disabled={isFull || isCurrentTopic}
                    className={`mb-1 w-full rounded-lg border px-3 py-2.5 text-left transition last:mb-0
                      ${
                        isFull || isCurrentTopic
                          ? "cursor-not-allowed border-gray-200 bg-gray-50/70 opacity-70 dark:border-gray-800 dark:bg-gray-800/40"
                          : "cursor-pointer border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700 dark:hover:bg-gray-800"
                      }
                      ${
                        selected
                          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border
                          ${
                            selected
                              ? "border-blue-200 bg-white text-blue-500 dark:border-blue-800 dark:bg-gray-900"
                              : "border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800"
                          }`}
                      >
                        <BookOpen size={14} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                            {t.title}
                          </p>

                          <div className="flex items-center gap-1.5">
                            {isCurrentTopic && (
                              <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800">
                                Hiện tại
                              </span>
                            )}

                            {isFull && (
                              <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[11px] text-red-500 dark:bg-red-950/40">
                                Đầy
                              </span>
                            )}

                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-full border-2
                                ${
                                  selected
                                    ? "border-blue-500"
                                    : "border-gray-300 dark:border-gray-600"
                                }`}
                            >
                              {selected && (
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>

                        {t.description && (
                          <p className="mb-1.5 line-clamp-1 text-xs text-gray-400 dark:text-gray-500">
                            {t.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                            <div
                              className={`h-full rounded-full
                                ${
                                  isFull
                                    ? "bg-red-400"
                                    : selected
                                      ? "bg-blue-400"
                                      : "bg-gray-300 dark:bg-gray-500"
                                }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                            <Users size={11} />
                            {currentStudents}/{t.maxStudents}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2 dark:border-gray-800">
          <p className="truncate text-xs text-gray-400 dark:text-gray-500">
            {selectedTopic
              ? `Đã chọn: ${selectedTopic.title}`
              : "Chưa chọn đề tài"}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              label="Hủy"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            />

            <Button
              label={topic ? "Đổi đề tài" : "Phân công"}
              size="sm"
              loading={isSubmitting}
              disabled={!selectedTopicId || isSubmitting}
              onClick={handleAssign}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TopicListModal;
