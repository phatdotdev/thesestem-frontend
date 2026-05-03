import { useNavigate, useParams } from "react-router-dom";
import { User } from "lucide-react";
import Button from "../../../components/UI/Button";
import { thesisStateToVN } from "../../../utils/thesisStateToVN";

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-700";
    case "submitted":
      return "bg-blue-100 text-blue-700";
    case "graded":
      return "bg-purple-100 text-purple-700";
    case "on_going":
      return "bg-amber-100 text-amber-700";
    case "proposal":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getProgressColor = (percent: number) => {
  if (percent >= 75) return "bg-green-500";
  if (percent >= 40) return "bg-blue-500";
  return "bg-amber-400";
};

type Props = {
  thesis: any;
};

const ThesisRow = ({ thesis }: Props) => {
  const navigate = useNavigate();
  const { ["org-code"]: orgCode } = useParams();

  return (
    <div
      className="
      grid lg:grid-cols-9
      items-center gap-4
      px-4 py-3
      text-sm
      border-b border-gray-200
      hover:bg-blue-50
      transition
      dark:border-gray-800 dark:hover:bg-gray-800
      "
    >
      {/* Student */}
      <div className="col-span-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={18} />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {thesis.student?.fullName || "-"}
          </span>

          <span className="text-xs text-gray-500">
            {thesis.student?.studentCode || "-"}
          </span>
        </div>
      </div>

      {/* Thesis Title */}
      <div className="col-span-3 flex items-center gap-2">
        <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
          {thesis.title || "-"}
        </span>
      </div>

      {/* Mentor */}
      <div className="flex justify-start items-center gap-2 text-blue-500 font-semibold">
        <span className="truncate">
          {thesis.mentor?.fullName || "Chưa có GVHD"}
        </span>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {thesis.progressPercent || 0}%
          </span>
        </div>

        <div className="h-1.5 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full rounded-full ${getProgressColor(
              thesis.progressPercent || 0,
            )}`}
            style={{
              width: `${thesis.progressPercent || 0}%`,
            }}
          />
        </div>
      </div>

      {/* Status */}
      <div className="hidden lg:flex justify-center">
        <span
          className={`
          rounded-md
          px-3 py-1
          text-xs font-semibold
          ${getStatusStyle(thesis.status)}
        `}
        >
          {thesisStateToVN(thesis.status)}
        </span>
      </div>

      {/* Action */}
      <div className="flex justify-center">
        <Button
          label="Xem"
          size="xs"
          variant="outline"
          onClick={() => navigate(`/${orgCode}/m/semester-theses/${thesis.id}`)}
          className="hover:border-blue-500 hover:text-blue-600"
        />
      </div>
    </div>
  );
};

export default ThesisRow;
