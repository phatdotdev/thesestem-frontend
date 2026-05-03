import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  RotateCcw,
  FileText,
  Clock,
  CheckCircle,
  CheckCircle2,
  Send,
  Award,
  Lock,
  Eye,
  Presentation,
} from "lucide-react";

import { useGetOrganizationStatisticsQuery } from "../../services/statisticsApi";
import SemesterSelecter from "../../components/common/SemesterSelecter";

import { useMemo, useState } from "react";

import OrganizationUnitSelecter from "../../components/common/UnitSelecter";
import { RxDashboard } from "react-icons/rx";
import PageHeader from "../../components/UI/PageHeader";

const StatCard = ({
  icon,
  title,
  value,
  trend,
  color = "blue",
  loading = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: string;
  color?: "blue" | "indigo" | "emerald" | "violet";
  loading?: boolean;
}) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-100 dark:border-blue-800",
      icon: "text-blue-500 dark:text-blue-400",
      bar: "bg-blue-500",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-100 dark:border-indigo-800",
      icon: "text-indigo-500 dark:text-indigo-400",
      bar: "bg-indigo-500",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-800",
      icon: "text-emerald-500 dark:text-emerald-400",
      bar: "bg-emerald-500",
    },
    violet: {
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-100 dark:border-violet-800",
      icon: "text-violet-500 dark:text-violet-400",
      bar: "bg-violet-500",
    },
  };

  const c = colorMap[color];

  return (
    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 overflow-hidden group hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.bg} ${c.border} ${c.icon}`}
        >
          {icon}
        </div>

        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp size={10} />
            {trend}
          </div>
        )}
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {value}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-1">{title}</p>
      </div>
    </div>
  );
};

/* ───────────────── DASHBOARD ───────────────── */

const DashBoardPage = () => {
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );

  const [type, setType] = useState<"FACULTY" | "COLLEGE" | "DEPARTMENT">(
    "FACULTY",
  );

  const [unitId, setUnitId] = useState<string | null>(null);

  const filterForm = useMemo(() => {
    const form: any = {};

    if (selectedSemesterId) form.semesterId = selectedSemesterId;

    if (unitId) {
      if (type === "FACULTY") form.facultyId = unitId;
      else if (type === "COLLEGE") form.collegeId = unitId;
      else form.departmentId = unitId;
    }

    return form;
  }, [selectedSemesterId, unitId, type]);

  /* ───── API ───── */

  const { data: orgStats, isLoading } =
    useGetOrganizationStatisticsQuery(filterForm);

  const stats = orgStats?.data;

  /* ───── RESET ───── */

  const handleReset = () => {
    setSelectedSemesterId(null);
    setUnitId("");
    setType("FACULTY");
  };

  return (
    <div className="px-6 py-2 space-y-5">
      {/* HEADER */}
      <div className="gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-xl">
        <PageHeader
          icon={RxDashboard}
          title="Tổng quan hệ thống"
          description="Thống kê chi tiết hoạt động của toàn hệ thống"
        />

        {/* FILTER */}
        <div className="flex items-end gap-5 mt-6">
          <div>
            <SemesterSelecter
              size="sm"
              onChange={setSelectedSemesterId}
              showAllOption={true}
            />
          </div>

          <div>
            <OrganizationUnitSelecter
              size="sm"
              onChange={(type, unitId) => {
                setType(type);
                setUnitId(unitId);
              }}
            />
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Reset bộ lọc"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Tổng quan
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<Users size={18} />}
            title="Sinh viên"
            value={stats?.totalStudents ?? 0}
            color="blue"
            loading={isLoading}
          />
          <StatCard
            icon={<GraduationCap size={18} />}
            title="Giảng viên"
            value={stats?.totalLecturers ?? 0}
            color="emerald"
            loading={isLoading}
          />
          <StatCard
            icon={<Award size={18} />}
            title="Hướng dẫn viên"
            value={stats?.totalMentors ?? 0}
            color="violet"
            loading={isLoading}
          />
          <StatCard
            icon={<BookOpen size={18} />}
            title="Tổng luận văn"
            value={stats?.totalTheses ?? 0}
            color="indigo"
            loading={isLoading}
          />
        </div>
      </div>

      {/* THESIS STATUS STATS */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Trạng thái luận văn
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard
            icon={<FileText size={18} />}
            title="Đề xuất"
            value={stats?.proposalTheses ?? 0}
            color="blue"
            loading={isLoading}
          />
          <StatCard
            icon={<Clock size={18} />}
            title="Đang thực hiện"
            value={stats?.inProgressTheses ?? 0}
            color="indigo"
            loading={isLoading}
          />
          <StatCard
            icon={<CheckCircle size={18} />}
            title="Đã phê duyệt"
            value={stats?.approvedTheses ?? 0}
            color="emerald"
            loading={isLoading}
          />
          <StatCard
            icon={<Send size={18} />}
            title="Đã nộp"
            value={stats?.submittedTheses ?? 0}
            color="violet"
            loading={isLoading}
          />
          <StatCard
            icon={<CheckCircle2 size={18} />}
            title="Đã chấm"
            value={stats?.gradedTheses ?? 0}
            color="blue"
            loading={isLoading}
          />
        </div>
      </div>

      {/* THESIS TYPE STATS */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Loại luận văn
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <StatCard
            icon={<Lock size={18} />}
            title="Luận văn riêng"
            value={stats?.privateTheses ?? 0}
            color="indigo"
            loading={isLoading}
          />
          <StatCard
            icon={<Eye size={18} />}
            title="Luận văn nội bộ"
            value={stats?.internalTheses ?? 0}
            color="emerald"
            loading={isLoading}
          />
          <StatCard
            icon={<Users size={18} />}
            title="Luận văn công khai"
            value={stats?.publicTheses ?? 0}
            color="violet"
            loading={isLoading}
          />
        </div>
      </div>

      {/* ACTIVITIES STATS */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
          Hoạt động
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<Building2 size={18} />}
            title="Hội đồng"
            value={stats?.totalCouncils ?? 0}
            color="blue"
            loading={isLoading}
          />
          <StatCard
            icon={<BookOpen size={18} />}
            title="Nhóm"
            value={stats?.totalGroups ?? 0}
            color="indigo"
            loading={isLoading}
          />
          <StatCard
            icon={<Presentation size={18} />}
            title="Phòng vấn"
            value={stats?.totalDefenses ?? 0}
            color="emerald"
            loading={isLoading}
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            title="Điểm TB luận văn"
            value={stats?.averageThesisScore?.toFixed(2) ?? 0}
            color="violet"
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
