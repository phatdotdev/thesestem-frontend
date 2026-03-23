import { Edit, Trash } from "lucide-react";
import Button from "../../../../components/UI/Button";
import type { DefenseResponse } from "../../../../types/defense";
import { truncateWords } from "../../../../utils/truncateWord";

const AssginedThesis = ({
  defense,
  onEdit,
  onDelete,
}: {
  defense: DefenseResponse;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const thesis = defense.thesis;
  const student = thesis.student;
  const mentor = thesis.mentor;
  return (
    <div className="border rounded-2xl p-4 bg-white border-gray-300 shadow-sm space-y-3">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug">
            {truncateWords(thesis?.title ?? "Không có tiêu đề", 20)}
          </h3>

          {thesis?.titleEn && (
            <p className="text-xs text-gray-400 mt-0.5">
              {truncateWords(thesis.titleEn, 15)}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button icon={Edit} size="xs" variant="outline" onClick={onEdit} />
          <Button icon={Trash} size="xs" variant="danger" onClick={onDelete} />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-300"></div>

      {/* INFO */}
      <div className="grid grid-cols-6 gap-4 text-sm">
        {/* STUDENT */}
        <div className="space-y-1 col-span-2">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Sinh viên
          </p>

          <div className="flex items-center gap-2">
            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm text-gray-800 truncate">
                {student?.fullName ?? "—"} -{student?.studentCode ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* MENTOR */}
        <div className="space-y-1 col-span-2">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            GV hướng dẫn
          </p>

          <div className="flex items-center gap-2">
            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm text-gray-800 truncate">
                {mentor?.fullName ?? "—"} - {mentor?.lecturerCode ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Địa điểm
          </p>

          <div className="flex items-center gap-2">
            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm text-gray-800 truncate">
                {defense.location ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* TIME*/}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Thời gian
          </p>

          <div className="flex items-center gap-2">
            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm text-gray-800 truncate">
                {defense.defenseTime ?? "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssginedThesis;
