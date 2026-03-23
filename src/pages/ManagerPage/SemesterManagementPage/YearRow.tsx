import { ChevronRight, Edit, Trash2 } from "lucide-react";
import Button from "../../../components/UI/Button";

interface YearRowProps {
  year: { id: string; name: string };
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  loadSemesters: (id: string) => void;
}

const YearRow = ({
  year,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  loadSemesters,
}: YearRowProps) => {
  const handleClick = () => {
    onSelect(year.id);
    loadSemesters(year.id);
  };

  return (
    <li
      key={year.id}
      onClick={handleClick}
      className={`group flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150
        ${
          isSelected
            ? "bg-blue-50 dark:bg-blue-900 border-l-2 border-l-blue-500"
            : "hover:bg-gray-50 dark:hover:bg-gray-700 border-l-2 border-l-transparent"
        }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <ChevronRight
          size={14}
          className={`shrink-0 transition-all ${
            isSelected
              ? "text-blue-400 dark:text-blue-300"
              : "text-gray-300 dark:text-gray-500 group-hover:text-gray-400 dark:group-hover:text-gray-300"
          }`}
        />
        <span
          className={`text-sm font-medium truncate ${
            isSelected
              ? "text-blue-700 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          {year.name}
        </span>
      </div>

      <div
        className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          icon={Edit}
          size="xs"
          variant="ghost"
          onClick={() => onEdit(year.id)}
        />
        <Button
          icon={Trash2}
          size="xs"
          variant="soft-danger"
          onClick={() => onDelete(year.id)}
        />
      </div>
    </li>
  );
};

export default YearRow;
