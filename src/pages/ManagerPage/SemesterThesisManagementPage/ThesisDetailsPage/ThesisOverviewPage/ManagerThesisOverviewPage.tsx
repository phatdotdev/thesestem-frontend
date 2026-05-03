import { useParams } from "react-router-dom";
import {
  useGetStudentThesisByIdQuery,
  useUpdateTheisAccessLevelMutation,
} from "../../../../../services/thesisApi";
import {
  Check,
  ChevronDown,
  Compass,
  Globe,
  Lock,
  Building2,
  GraduationCap,
  User,
  Star,
  X,
} from "lucide-react";
import Badge from "../../../../../components/UI/Badge";
import { useEffect, useState } from "react";
import Button from "../../../../../components/UI/Button";
import ConfirmModal from "../../../../../components/UI/ConfirmModal";
import {
  formatAccessLevel,
  formatThesisStatus,
} from "../../../../../utils/formatters";

import { useRef } from "react";

const ACCESS_OPTIONS = [
  {
    value: "PUBLIC",
    label: "Công khai",
    sub: "Mọi người có thể xem",
    icon: <Globe size={14} />,
    iconClass:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  {
    value: "INTERNAL",
    label: "Nội bộ",
    sub: "Chỉ người trong tổ chức",
    icon: <Building2 size={14} />,
    iconClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  {
    value: "PRIVATE",
    label: "Riêng tư",
    sub: "Chỉ bạn và người được cấp quyền",
    icon: <Lock size={14} />,
    iconClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
];

const STATUS_OPTIONS = [
  {
    value: "PROPOSAL",
    label: "Đề xuất",
    icon: <Compass size={14} />,
    iconClass:
      "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
    sub: "Luận văn mới được đề xuất, chưa bắt đầu thực hiện",
  },
  {
    value: "IN_PROGRESS",
    label: "Đang tiến hành",
    icon: <Globe size={14} />,
    iconClass:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    sub: "Luận văn đang được thực hiện, sinh viên và giảng viên hướng dẫn đang làm việc",
  },
  {
    value: "APPROVED",
    label: "Đã duyệt",
    icon: <Check size={14} />,
    iconClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    sub: "Luận văn đã được giảng viên duyệt, chuẩn bị nộp báo cáo",
  },
  {
    value: "SUBMITTED",
    label: "Đã nộp",
    icon: <Building2 size={14} />,
    iconClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    sub: "Luận văn đã được nộp, đang chờ xử lý",
  },
  {
    value: "REJECTED",
    label: "Đã từ chối",
    icon: <X size={14} />,
    iconClass: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    sub: "Luận văn đã bị từ chối, cần chỉnh sửa và nộp lại",
  },
  {
    value: "GRADED",
    label: "Đã chấm điểm",
    icon: <Star size={14} />,
    iconClass:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    sub: "Luận văn đã được chấm điểm",
  },
];

const ManagerThesisOverviewPage = () => {
  const { ["thesis-id"]: id } = useParams();

  const { data, isLoading } = useGetStudentThesisByIdQuery(id as string);

  const thesis = data?.data;

  const [accessLevel, setAccessLevel] = useState<string>(
    thesis?.accessLevel || "PRIVATE",
  );

  const [selectOpen, setSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (thesis) {
      setAccessLevel(thesis.accessLevel);
    }
  }, [thesis]);

  const [updateTheisAccessLevel] = useUpdateTheisAccessLevelMutation();

  if (isLoading) return null;

  return (
    <div
      className="
        mt-6 
        bg-white 
        dark:bg-gray-900
        rounded-lg 
        border 
        border-gray-300 
        dark:border-gray-700
        p-6 
        space-y-6
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 shrink-0">
            <Compass size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Tổng quan luận văn
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Thông tin chi tiết về luận văn
            </p>
          </div>
        </div>
        <Badge label={thesis?.status || "PROPOSAL"} variant="secondary" />
      </div>

      {/* CONTENT */}
      <div className="space-y-6">
        {/* Title Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề (Tiếng Việt)
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm">
              {thesis?.title || "—"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề (Tiếng Anh)
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm">
              {thesis?.titleEn || "—"}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Mô tả (Tiếng Việt)
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm min-h-[100px]">
            {thesis?.description || "—"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Mô tả (Tiếng Anh)
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm min-h-[100px]">
            {thesis?.descriptionEn || "—"}
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Tiến độ thực hiện
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {thesis?.progressPercent || 0}% completed
              </span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                style={{ width: `${thesis?.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>
        {/* Status and Access Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              Trạng thái
            </label>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${STATUS_OPTIONS.find((o) => o.value === thesis?.status)?.iconClass}`}
              >
                {STATUS_OPTIONS.find((o) => o.value === thesis?.status)?.icon}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                  {
                    STATUS_OPTIONS.find((o) => o.value === thesis?.status)
                      ?.label
                  }
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                  {STATUS_OPTIONS.find((o) => o.value === thesis?.status)?.sub}
                </span>
              </span>
            </div>
          </div>

          {/* Access Level */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
              Quyền truy cập
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1" ref={selectRef}>
                {/* Trigger */}
                <button
                  onClick={() => setSelectOpen((v) => !v)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 bg-white dark:bg-gray-900 border rounded-lg text-left transition-colors
          ${
            selectOpen
              ? "border-blue-400 dark:border-blue-500"
              : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
          }`}
                >
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${ACCESS_OPTIONS.find((o) => o.value === accessLevel)?.iconClass}`}
                  >
                    {ACCESS_OPTIONS.find((o) => o.value === accessLevel)?.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                      {
                        ACCESS_OPTIONS.find((o) => o.value === accessLevel)
                          ?.label
                      }
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                      {ACCESS_OPTIONS.find((o) => o.value === accessLevel)?.sub}
                    </span>
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 shrink-0 transition-transform ${selectOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {selectOpen && (
                  <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
                    {ACCESS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setAccessLevel(opt.value);
                          setSelectOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors
                ${
                  accessLevel === opt.value
                    ? "bg-blue-50 dark:bg-blue-950/40"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${opt.iconClass}`}
                        >
                          {opt.icon}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                            {opt.label}
                          </span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">
                            {opt.sub}
                          </span>
                        </span>
                        {accessLevel === opt.value && (
                          <Check size={14} className="text-blue-500 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button label="Cập nhật" onClick={() => setOpenConfirm(true)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Student Info Section */}
          <div className="bg-gray-50 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-900 rounded-lg p-4">
            <h3 className="uppercase font-semibold text-gray-500 dark:text-gray-100 mb-3 text-sm">
              Thông tin sinh viên
            </h3>
            <div className="flex items-center gap-4 text-sm bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500`}
              >
                <GraduationCap size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                  {thesis?.student?.fullName || "—"}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                  {thesis?.student?.studentCode || "—"}
                </span>
              </span>
            </div>
          </div>

          {/* Mentor Info Section */}
          <div className="bg-gray-50 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-900 rounded-lg p-4">
            <h3 className="uppercase font-semibold text-gray-500 dark:text-gray-100 mb-3 text-sm">
              Thông tin giảng viên hướng dẫn
            </h3>
            <div className="flex items-center gap-4 text-sm bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500`}
              >
                <User size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-800 dark:text-gray-100">
                  {thesis?.mentor?.fullName || "—"}
                </span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                  {thesis?.mentor?.lecturerCode || "—"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Xác nhận cập nhật quyền truy cập"
        description={`Bạn có chắc chắn muốn cập nhật quyền truy cập của luận văn này thành "${formatAccessLevel(accessLevel)}"?"`}
        onConfirm={async () => {
          {
            await updateTheisAccessLevel({
              id: thesis?.id,
              accessLevel,
            }).unwrap();
            setOpenConfirm(false);
          }
        }}
      />
    </div>
  );
};

export default ManagerThesisOverviewPage;
