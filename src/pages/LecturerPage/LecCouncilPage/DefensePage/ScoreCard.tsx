import { Edit, Trash2 } from "lucide-react";
import Button from "../../../../components/UI/Button";
import AvatarInitial from "../../../../components/UI/AvatarInitial";

type Props = {
  score: any;
  isMe?: boolean;
  onEdit?: (score: any) => void;
  onDelete?: (score: any) => void;
};

const ScoreCard = ({ score, isMe, onEdit, onDelete }: Props) => {
  const lecturer = score?.member?.lecturer;
  const role = score?.member?.role;

  const value = Number(score?.score || 0);

  const getScoreColor = () => {
    if (value >= 8)
      return {
        bar: "bg-emerald-400",
        box: `
          bg-emerald-50 border-emerald-200 text-emerald-600
          dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300
        `,
      };

    if (value >= 5)
      return {
        bar: "bg-amber-400",
        box: `
          bg-amber-50 border-amber-200 text-amber-600
          dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300
        `,
      };

    return {
      bar: "bg-red-400",
      box: `
        bg-red-50 border-red-200 text-red-600
        dark:bg-red-900/20 dark:border-red-800 dark:text-red-300
      `,
    };
  };

  const color = getScoreColor();

  return (
    <div
      className={`
        relative rounded-xl border overflow-hidden transition
        bg-white dark:bg-gray-900
        border-gray-200 dark:border-gray-800
        hover:shadow-md

        ${isMe ? "ring-1 ring-blue-200 dark:ring-blue-800 border-blue-300 dark:border-blue-700" : ""}
      `}
    >
      <div className="px-4 py-4 flex items-start justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-start gap-3 min-w-0">
          {/* AVATAR */}
          <AvatarInitial fullName={lecturer?.fullName} size={32} />

          {/* INFO */}
          <div className="min-w-0">
            {/* NAME */}
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
              {lecturer?.fullName || "Ẩn danh"}{" "}
              {lecturer?.lecturerCode && `- ${lecturer.lecturerCode}`}
              {isMe && (
                <span className="text-blue-500 dark:text-blue-400 text-xs">
                  {" "}
                  (bạn)
                </span>
              )}
            </p>

            {/* ROLE */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {role?.name || "Thành viên"}
            </p>

            {/* TIME */}
            {score?.createdAt && (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                {new Date(score.createdAt).toLocaleString("vi-VN")}
              </p>
            )}

            {/* COMMENT */}
            {score?.comment && (
              <div
                className="
                  mt-2
                  text-xs
                  text-gray-700 dark:text-gray-300
                  border-gray-200 dark:border-gray-700
                  pl-3
                  italic
                  leading-relaxed
                  bg-gray-50 dark:bg-gray-800
                  rounded-md
                  py-1.5 px-2
                "
              >
                {score.comment}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - SCORE */}
        <div
          className={`
            shrink-0 flex flex-col items-center justify-center
            w-16 h-16 rounded-xl border font-bold text-xl leading-none
            ${color.box}
          `}
        >
          {value}
          <span className="text-[10px] font-normal opacity-60 mt-0.5">
            / 10
          </span>
        </div>
      </div>

      {/* ACTION */}
      {isMe && (
        <div
          className="
            flex justify-end gap-2
            px-4 py-2
            border-t
            border-gray-100 dark:border-gray-800
            bg-gray-50 dark:bg-gray-800/40
          "
        >
          <Button
            variant="outline-primary"
            label="Chỉnh sửa"
            icon={Edit}
            size="xs"
            onClick={() => onEdit?.(score)}
          />

          <Button
            variant="outline"
            label="Xóa"
            icon={Trash2}
            size="xs"
            onClick={() => onDelete?.(score)}
          />
        </div>
      )}
    </div>
  );
};

export default ScoreCard;
