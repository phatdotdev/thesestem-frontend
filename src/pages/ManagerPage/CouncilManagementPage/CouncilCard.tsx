import { Edit, Trash, Landmark } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { CouncilResponse } from "../../../types/council";

const CouncilCard = ({
  council,
  onEditing,
  onDelete,
}: {
  council: CouncilResponse;
  onEditing?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <div
      className="
        group
        border border-gray-200 dark:border-gray-700
        rounded-xl
        p-4
        space-y-3
        bg-white dark:bg-gray-800
        hover:border-indigo-300 dark:hover:border-indigo-500
        hover:shadow-md dark:hover:shadow-lg
        hover:shadow-indigo-50 dark:hover:shadow-indigo-900/20
        transition-all duration-150
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              w-9 h-9
              rounded-xl
              flex items-center justify-center
              bg-indigo-50 dark:bg-indigo-900/30
              border border-indigo-100 dark:border-indigo-700
              text-indigo-600 dark:text-indigo-400
              shrink-0
            "
          >
            <Landmark size={16} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                text-sm font-semibold
                text-gray-800 dark:text-gray-100
                truncate
                group-hover:text-indigo-700
                dark:group-hover:text-indigo-400
                transition-colors
              "
            >
              {council.name}
            </h3>

            <p
              className="
                text-[11px] font-mono
                text-gray-400 dark:text-gray-500
                mt-0.5
              "
            >
              {council.code}
            </p>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex gap-1 shrink-0">
          {onEditing && (
            <Button
              icon={Edit}
              size="xs"
              variant="ghost"
              onClick={onEditing}
              title="Chỉnh sửa hội đồng"
              aria-label="Chỉnh sửa hội đồng"
            />
          )}

          {onDelete && (
            <Button
              icon={Trash}
              size="xs"
              variant="danger"
              onClick={onDelete}
              title="Xóa hội đồng"
              aria-label="Xóa hội đồng"
            />
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div
        className="
          border-t border-dashed
          border-gray-100 dark:border-gray-700
          group-hover:border-indigo-100
          dark:group-hover:border-indigo-700
          transition-colors
        "
      />

      {/* MEMBER COUNT */}
      <div className="flex items-center justify-between">
        <span
          className="
            text-[11px]
            px-2 py-0.5
            rounded-full
            bg-gray-50 dark:bg-gray-700
            border border-gray-200 dark:border-gray-600
            text-gray-500 dark:text-gray-300
          "
        >
          {council?.department
            ? council.department.name
            : council?.faculty
              ? council.faculty.name
              : council?.college
                ? council.college.name
                : "Không xác định"}{" "}
        </span>
        <span
          className="
            text-[11px]
            px-2 py-0.5
            rounded-full
            bg-gray-50 dark:bg-gray-700
            border border-gray-200 dark:border-gray-600
            text-gray-500 dark:text-gray-300
          "
        >
          {council.members.length} thành viên
        </span>
      </div>

      {/* MEMBERS */}
      <div className="flex items-center gap-2 flex-wrap">
        {council.members.map((m) => (
          <div
            key={m.lecturer.id}
            title={`${m.lecturer.fullName} — ${m.role.name}`}
            className="
              flex items-center gap-2
              px-2.5 py-1.5
              rounded-full
              border
              text-xs font-medium
              bg-gray-50 dark:bg-gray-700
              border-gray-200 dark:border-gray-600
              text-gray-600 dark:text-gray-300
            "
          >
            {/* Name */}
            <span className="truncate max-w-[95px] sm:max-w-[110px]">
              {m.lecturer.fullName}
            </span>

            {/* Role */}
            <span className="text-gray-400 dark:text-gray-300">
              · {m.role.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouncilCard;
