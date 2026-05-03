import { Plus, Edit, Trash2, CalendarRange, Flag } from "lucide-react";
import { useGetCurrentSmilestonesQuery } from "../../../services/semApi";
import Button from "../../../components/UI/Button";
import dayjs from "dayjs";
import type { MilestoneResponse } from "../../../types/milestone";
import { useState } from "react";
import TimeLineForm from "./TimeLineForm";

const TimelineManager = () => {
  const { data: timelinesResponse } = useGetCurrentSmilestonesQuery();
  const timelines: MilestoneResponse[] = timelinesResponse?.data || [];

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] =
    useState<MilestoneResponse | null>(null);

  const now = new Date();

  const getStatus = (item: MilestoneResponse) => {
    const start = new Date(item.startAt);
    const end = new Date(item.endAt);
    if (now < start) return "upcoming";
    if (now > end) return "done";
    return "active";
  };

  const statusConfig = {
    active: {
      label: "Đang diễn ra",
      bar: "bg-blue-500",
      badge:
        "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    },
    upcoming: {
      label: "Sắp diễn ra",
      bar: "bg-amber-400",
      badge:
        "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400",
    },
    done: {
      label: "Đã kết thúc",
      bar: "bg-gray-300 dark:bg-gray-600",
      badge:
        "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400",
    },
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Flag size={26} className="text-gray-400 dark:text-gray-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Mốc thời gian luận văn
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
              {timelines.length} mốc thời gian
            </p>
          </div>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            {
              setIsFormOpen(true);
              setEditingMilestone(null);
            }
          }}
          label="Thêm mốc"
          size="sm"
          variant="primary"
        />
      </div>

      {/* ── Empty state ── */}
      {timelines.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 gap-2">
          <Flag size={28} className="text-gray-200 dark:text-gray-700" />
          <p className="text-sm">Chưa có mốc thời gian nào</p>
        </div>
      )}

      {/* ── Timeline list ── */}
      <div className="space-y-2">
        {timelines.map((item, index) => {
          const status = getStatus(item);
          const s = statusConfig[status];

          return (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-150"
            >
              {/* status bar */}
              <div className={`h-1 w-full ${s.bar}`} />

              <div className="flex items-start justify-between gap-4 px-5 py-4">
                {/* LEFT */}
                <div className="flex items-start gap-3 min-w-0">
                  {/* index badge */}
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {item.title}
                      </h3>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${s.badge}`}
                      >
                        {s.label}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                      <CalendarRange size={12} className="shrink-0" />
                      <span>
                        {dayjs(item.startAt).format("DD/MM/YYYY")}
                        {" → "}
                        {dayjs(item.endAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: actions */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <Button
                    icon={Edit}
                    onClick={() => {
                      {
                        setEditingMilestone(item);
                        setIsFormOpen(true);
                      }
                    }}
                    size="xs"
                    variant="ghost"
                  />
                  <Button icon={Trash2} size="xs" variant="soft-danger" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Modals */}
      <TimeLineForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingMilestone}
      />
    </div>
  );
};

export default TimelineManager;
