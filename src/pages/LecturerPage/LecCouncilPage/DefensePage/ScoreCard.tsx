import { Edit, Pencil } from "lucide-react";
import { getColor } from "../../../../utils/getColor";
import { getInitials } from "../../../../utils/getInitials";
import Button from "../../../../components/UI/Button";

type Props = {
  score: any;
  isMe?: boolean;
  onEdit?: (score: any) => void;
};

const ScoreCard = ({ score, isMe, onEdit }: Props) => {
  const lecturer = score?.member?.lecturer;
  const role = score?.member?.role;

  const value = Number(score?.score || 0);

  const getScoreColor = () => {
    if (value >= 8)
      return {
        bar: "bg-emerald-400",
        box: "bg-emerald-50 border-emerald-200 text-emerald-600",
      };
    if (value >= 5)
      return {
        bar: "bg-amber-400",
        box: "bg-amber-50 border-amber-200 text-amber-600",
      };
    return {
      bar: "bg-red-400",
      box: "bg-red-50 border-red-200 text-red-600",
    };
  };

  const color = getScoreColor();

  return (
    <div
      className={`
        relative rounded-xl border bg-white overflow-hidden transition
        ${isMe ? "border-blue-300 ring-1 ring-blue-100" : "border-gray-200"}
      `}
    >
      <div className="px-4 pt-4 flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-start gap-3 min-w-0">
          {/* AVATAR */}
          <div
            className={`
              w-9 h-9 rounded-full flex items-center justify-center
              text-white text-xs font-bold shrink-0
              ${getColor(lecturer?.fullName)}
            `}
          >
            {getInitials(lecturer?.fullName)}
          </div>

          {/* INFO */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {lecturer?.fullName || "Ẩn danh"}{" "}
              {isMe && <span className="text-blue-500">(bạn)</span>}
            </p>

            <p className="text-[11px] text-gray-400">
              {role?.name || "Thành viên"}
            </p>

            {score?.createdAt && (
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date(score.createdAt).toLocaleString("vi-VN")}
              </p>
            )}

            {score?.comment && (
              <p className="text-xs text-gray-600 mt-2 leading-relaxed border-l-2 border-gray-200 pl-2 italic">
                {score.comment}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT - SCORE */}
        <div
          className={`
            shrink-0 flex flex-col items-center justify-center
            w-14 h-14 rounded-xl border font-bold text-lg leading-none
            ${color.box}
          `}
        >
          {value}
          <span className="text-[10px] font-normal opacity-60 mt-0.5">
            / 10
          </span>
        </div>
      </div>
      {isMe && (
        <div className="flex justify-end gap-2 px-4 py-2">
          <Button
            variant="outline-primary"
            label="Chỉnh sửa"
            icon={Edit}
            size="xs"
            onClick={onEdit}
          />
          <Button variant="outline" label="Xóa" icon={Edit} size="xs" />
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
