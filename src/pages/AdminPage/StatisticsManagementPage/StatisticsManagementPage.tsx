import { useGetSystemStatisticsQuery } from "../../../services/statisticsApi";
import Loader from "../../../components/UI/Loader";
import type { SystemStatistics } from "../../../types/statistics";
import {
  BookMarked,
  Building2,
  GraduationCap,
  ShieldCheck,
  User,
  Users,
  Globe,
  Lock,
  BarChart3,
  RefreshCw,
} from "lucide-react";

type StatCard = {
  key: keyof SystemStatistics;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const SUMMARY_CARDS: StatCard[] = [
  { key: "totalUsers", label: "Tổng người dùng", icon: Users },
  {
    key: "totalManagers",
    label: "Quản lý",
    icon: ShieldCheck,
  },
  {
    key: "totalStudents",
    label: "Sinh viên",
    icon: GraduationCap,
  },
  { key: "totalLecturers", label: "Giảng viên", icon: User },
];

const THESIS_CARDS: StatCard[] = [
  {
    key: "totalTheses",
    label: "Tổng đề tài",
    icon: BookMarked,
  },
  {
    key: "totalPublishedTheses",
    label: "Công khai",
    icon: Globe,
  },
  {
    key: "totalInternalTheses",
    label: "Nội bộ",
    icon: Building2,
  },
  {
    key: "totalPrivateTheses",
    label: "Riêng tư",
    icon: Lock,
  },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value);

/* ── Stat card ── */
const StatCardItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
          <Icon size={18} />
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {formatNumber(value)}
      </p>
    </div>
  );
};

/* ═══ PAGE ═══ */
const StatisticsManagementPage = () => {
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useGetSystemStatisticsQuery();
  const statistics = response?.data;

  if (isLoading)
    return (
      <div className="min-h-[320px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
        <Loader size={36} />
      </div>
    );

  if (isError || !statistics)
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-600 dark:text-red-400">
        Không tải được thống kê hệ thống. Vui lòng thử lại.
      </div>
    );

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Thống kê hệ thống
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Tổng quan số liệu toàn hệ thống
            </p>
          </div>
        </div>

        {isFetching && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <RefreshCw size={12} className="animate-spin" />
            Đang cập nhật...
          </div>
        )}
      </div>

      {/* ── Users ── */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Người dùng
        </p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {SUMMARY_CARDS.map((item) => (
            <StatCardItem
              key={item.key}
              label={item.label}
              value={statistics[item.key] ?? 0}
              icon={item.icon}
            />
          ))}
        </div>
      </div>

      {/* ── Theses ── */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Đề tài luận văn
        </p>
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {THESIS_CARDS.map((item) => (
            <StatCardItem
              key={item.key}
              label={item.label}
              value={statistics[item.key] ?? 0}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsManagementPage;
