import { useState, useMemo, useEffect } from "react";
import { Copy, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../../../components/UI/Button";
import { useGetGroupTopicsQuery } from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import TopicFormModal from "./TopicFormModal";
import type { TopicResponse } from "../../../../types/group";
import TopicCard from "./TopicCard";
import ConfirmModal from "./ConfirmModal";
import Input from "../../../../components/UI/Input";
import EmptyState from "../../../../components/UI/EmptyState";
import MemberListModal from "./MemberListModal";

const ITEMS_PER_PAGE = 9;

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

  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [assigningTopic, setAssigningTopic] = useState<TopicResponse | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- LOGIC LỌC & PHÂN TRANG ---

  // Chỉ lọc theo Search
  const allFilteredTopics = useMemo(() => {
    return topics.filter((topic) =>
      topic.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [topics, search]);

  const paginatedTopics = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allFilteredTopics.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allFilteredTopics, currentPage]);

  const totalPages = Math.ceil(allFilteredTopics.length / ITEMS_PER_PAGE);

  // Reset trang khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="mt-6 rounded-3xl border border-gray-200/80 bg-white/95 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/95">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <Copy size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý đề tài luận văn
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số {allFilteredTopics.length} đề tài được tìm thấy
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingTopic(null);
            setOpenTopicModal(true);
          }}
          size="sm"
          icon={Plus}
          label="Thêm chủ đề"
          variant="outline-primary"
        />
      </div>

      {/* SEARCH BAR (Đã bỏ thanh Status Badge) */}
      <div className="mb-6">
        <div className="max-w-md">
          <Input
            placeholder="Tìm kiếm theo tiêu đề đề tài..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TOPIC LIST */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {paginatedTopics.length === 0 ? (
          <div className="col-span-3">
            <EmptyState
              icon={Copy}
              title="Chưa có đề tài"
              description="Thêm đề tài mới để bắt đầu."
              action={
                <Button
                  onClick={() => {
                    setEditingTopic(null);
                    setOpenTopicModal(true);
                  }}
                  size="sm"
                  icon={Plus}
                  label="Thêm đề tài"
                />
              }
            />
          </div>
        ) : (
          paginatedTopics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              onEdit={() => {
                setEditingTopic(topic);
                setOpenTopicModal(true);
              }}
              onDelete={() => {
                setDeletingTopic(topic);
                setOpenConfirmModal(true);
              }}
              onAssignMembers={() => {
                setAssigningTopic(topic);
                setOpenAssignModal(true);
              }}
            />
          ))
        )}
      </div>

      {/* PAGINATION UI */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                  currentPage === i + 1
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:bg-gray-800"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Modals */}
      <TopicFormModal
        open={openTopicModal}
        onClose={() => setOpenTopicModal(false)}
        initialData={editingTopic}
      />
      <ConfirmModal
        initialData={deletingTopic}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      />
      <MemberListModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        topic={assigningTopic}
      />
    </div>
  );
};

export default MentorThesisTopicPage;
