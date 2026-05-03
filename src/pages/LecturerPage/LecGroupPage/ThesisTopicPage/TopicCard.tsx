import { BookOpen, Eye, Pencil, Trash2, UserPlus, Users } from "lucide-react";
import Button from "../../../../components/UI/Button";
import type { TopicResponse, TopicStatus } from "../../../../types/group";

const TopicCard = ({
  topic,
  onEdit,
  onDelete,
  onAssignMembers,
}: {
  topic: TopicResponse;
  onEdit: () => void;
  onDelete: () => void;
  onAssignMembers: () => void;
}) => {
  const percent = Math.min(
    (topic.currentStudents / Math.max(topic.maxStudents, 1)) * 100,
    100,
  );

  return (
    <div className="flex flex-col h-full rounded-2xl border border-gray-200 bg-white p-5 gap-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300`}
          >
            <BookOpen size={16} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-[15px] font-medium leading-snug text-gray-900 dark:text-gray-100 line-clamp-2 mb-1.5">
            {topic.title}
          </h3>
          <p className="text-[13px] text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
            {topic.description || "Chưa có mô tả cho đề tài này."}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* Footer */}
      <div className="space-y-2 mt-auto">
        {/* Students & percent */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full`}
            >
              <Users size={11} />
            </div>
            <span>
              {topic.currentStudents} / {topic.maxStudents} sinh viên
            </span>
          </div>
          <span className="text-[12px] font-medium text-gray-600 dark:text-gray-400">
            {Math.round(percent)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-500 bg-black`}
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1.5 pt-1">
          <Button size="sm" variant="ghost" icon={Eye} />
          <Button size="sm" variant="ghost" icon={Pencil} onClick={onEdit} />
          <Button
            size="sm"
            variant="ghost"
            icon={Trash2}
            onClick={onDelete}
            className="text-red-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
          />
          <Button
            size="sm"
            icon={UserPlus}
            variant="ghost"
            onClick={onAssignMembers}
          />
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
