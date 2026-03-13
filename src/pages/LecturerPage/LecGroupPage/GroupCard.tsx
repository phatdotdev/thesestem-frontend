import { Users, FileText, Pencil, Trash } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { GroupResponse } from "../../../types/group";

interface GroupCardProps {
  group: GroupResponse;
  onView: (group: GroupResponse) => void;
  onEdit: (group: GroupResponse) => void;
  onDelete: (group: GroupResponse) => void;
}

const GroupCard = ({ group, onView, onEdit, onDelete }: GroupCardProps) => {
  return (
    <div
      className="
      group bg-white border border-gray-200
      rounded-3xl p-6
      shadow-sm hover:shadow-xl
      hover:-translate-y-1
      transition-all duration-300
    "
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          {/* ICON */}
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Users size={18} />
          </div>

          {/* TITLE */}
          <div>
            <h2
              className="
              font-semibold text-lg text-gray-800
              group-hover:text-blue-600
              transition cursor-pointer
              "
              onClick={() => onView(group)}
            >
              {group.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {group.description || "Không có mô tả"}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button
            icon={Pencil}
            variant="outline"
            size="xs"
            onClick={() => onEdit(group)}
          />

          <Button
            icon={Trash}
            variant="outline"
            size="xs"
            onClick={() => onDelete(group)}
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FileText size={14} />
          <span className="truncate">{group.id}</span>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
