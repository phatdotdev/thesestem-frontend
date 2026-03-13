import { useState } from "react";
import { Search, Plus } from "lucide-react";
import Button from "../../../../components/UI/Button";
import Badge from "../../../../components/UI/Badge";
import { useGetGroupTopicsQuery } from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import TopicFormModal from "./TopicFormModal";
import type { TopicResponse } from "../../../../types/group";
import TopicCard from "./TopicCard";
import ConfirmModal from "./ConfirmModal";

type TopicStatus = "DRAFT" | "OPEN" | "IN_PROGRESS" | "COMPLETED";

interface ThesisTopic {
  id: string;
  title: string;
  description: string;
  maxStudents: number;
  currentStudents: number;
  deadline: string;
  status: TopicStatus;
}

const mockTopics: ThesisTopic[] = [
  {
    id: "1",
    title: "Xây dựng hệ thống quản lý luận văn tích hợp AI",
    description:
      "Phát triển nền tảng quản lý luận văn sử dụng Spring Boot, React và tích hợp Chatbot AI.",
    maxStudents: 3,
    currentStudents: 2,
    deadline: "30/06/2026",
    status: "IN_PROGRESS",
  },
  {
    id: "2",
    title: "Hệ thống phát hiện Code Clone bằng Deep Learning",
    description:
      "Nghiên cứu và xây dựng mô hình phát hiện trùng lặp mã nguồn sử dụng PyTorch.",
    maxStudents: 2,
    currentStudents: 2,
    deadline: "15/07/2026",
    status: "OPEN",
  },
  {
    id: "3",
    title: "Xây dựng nền tảng BPMN Workflow Engine",
    description:
      "Thiết kế hệ thống quản lý quy trình nghiệp vụ dựa trên BPMN và Camunda.",
    maxStudents: 3,
    currentStudents: 1,
    deadline: "01/08/2026",
    status: "DRAFT",
  },
  {
    id: "4",
    title: "Phân tích dữ liệu giáo dục bằng Machine Learning",
    description: "Ứng dụng ML để phân tích hiệu suất học tập của sinh viên.",
    maxStudents: 2,
    currentStudents: 2,
    deadline: "01/05/2026",
    status: "COMPLETED",
  },
];

const MentorThesisTopicPage = () => {
  const { ["group-id"]: id } = useParams();
  const { data: topicsResponse } = useGetGroupTopicsQuery(id as string);

  const topics = topicsResponse?.data || [];
  const [openTopicModal, setOpenTopicModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [editingTopic, setEditingTopic] = useState<TopicResponse | null>(null);
  const [deletingTopic, setDeletingTopic] = useState<TopicResponse | null>(
    null,
  );

  const [filter, setFilter] = useState<TopicStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filteredTopics = topics.filter((topic) => {
    const matchStatus = filter === "ALL" || topic.status === filter;
    const matchSearch = topic.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-white border border-gray-200 shadow rounded-2xl p-6">
      {/* HEADER */}
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý đề tài luận văn
          </h1>
          <p className="text-gray-500">
            Danh sách các đề tài bạn đang hướng dẫn
          </p>
        </div>
        <div>
          <Button
            onClick={() => {
              {
                setEditingTopic(null);
                setOpenTopicModal(true);
              }
            }}
            size="sm"
            icon={Plus}
            label="Thêm chủ đề"
            variant="outline"
          />
        </div>
      </div>

      {/* FILTER + SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Badge
            label="Tất cả"
            onClick={() => setFilter("ALL")}
            className={filter === "ALL" ? "bg-blue-600 text-white" : ""}
          />
          <Badge
            label="Bản nháp"
            onClick={() => setFilter("DRAFT")}
            className={filter === "DRAFT" ? "bg-gray-600 text-white" : ""}
          />
          <Badge
            label="Đang mở"
            onClick={() => setFilter("OPEN")}
            className={filter === "OPEN" ? "bg-blue-600 text-white" : ""}
          />
          <Badge
            label="Đang thực hiện"
            onClick={() => setFilter("IN_PROGRESS")}
            className={
              filter === "IN_PROGRESS" ? "bg-yellow-500 text-white" : ""
            }
          />
          <Badge
            label="Hoàn thành"
            onClick={() => setFilter("COMPLETED")}
            className={filter === "COMPLETED" ? "bg-green-600 text-white" : ""}
          />
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm đề tài..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* TOPIC LIST */}
      <div className="grid gap-4">
        {filteredTopics.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            Không có đề tài phù hợp
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onEdit={() => {
                {
                  setEditingTopic(topic);
                  setOpenTopicModal(true);
                }
              }}
              onDelete={() => {
                {
                  setDeletingTopic(topic);
                  setOpenConfirmModal(true);
                }
              }}
            />
          ))
        )}
      </div>
      {/* Modals */}
      <TopicFormModal
        open={openTopicModal}
        onClose={() => {
          {
            setOpenTopicModal(false);
          }
        }}
        initialData={editingTopic}
      />
      <ConfirmModal
        initialData={deletingTopic}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      />
    </div>
  );
};

export default MentorThesisTopicPage;
