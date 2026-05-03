import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  UserCheck,
  XCircle,
  Ban,
  Building2,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import Loader from "../../../components/UI/Loader";
import SemesterSelecter from "../../../components/common/SemesterSelecter";
import { useGetSemestersQuery } from "../../../services/semApi";
import {
  useGetMentorStatisticsQuery,
  useLazyGetMentorStatisticsBySemesterQuery,
} from "../../../services/statisticsApi";
import StatCard from "./StatCard";
import { FaChartBar } from "react-icons/fa";

const LecturerStatisticsPage = () => {
  const { data: allStatisticsResponse, isLoading: allLoading } =
    useGetMentorStatisticsQuery();

  const [
    getStatisticsBySemester,
    { data: semesterStatisticsResponse, isLoading: semesterLoading },
  ] = useLazyGetMentorStatisticsBySemesterQuery();

  const { data: semestersResponse } = useGetSemestersQuery();

  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (selectedSemesterId) {
      getStatisticsBySemester(selectedSemesterId);
    }
  }, [selectedSemesterId, getStatisticsBySemester]);

  const statistics =
    selectedSemesterId === null
      ? allStatisticsResponse?.data
      : semesterStatisticsResponse?.data;

  const loading = selectedSemesterId === null ? allLoading : semesterLoading;

  const handleResetFilter = () => {
    setSelectedSemesterId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className="
            h-16 w-16 rounded-3xl
            bg-white dark:bg-gray-800
            shadow-md
            flex items-center justify-center
            text-blue-600 dark:text-blue-300
            border border-gray-200 dark:border-gray-700
          "
            >
              <FaChartBar size={36} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                Thống kê hướng dẫn
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                Xem thống kê về các sinh viên mà bạn hướng dẫn.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Segmented toggle */}
            <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={handleResetFilter}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedSemesterId === null
                    ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Tất cả học kỳ
              </button>
              <button
                onClick={() => {
                  if (!selectedSemesterId && semestersResponse?.data?.[0]) {
                    setSelectedSemesterId(semestersResponse.data[0].id);
                  }
                }}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedSemesterId !== null
                    ? "bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                Theo học kỳ
              </button>
            </div>

            {/* Semester selector — chỉ hiện khi ở tab "Theo học kỳ" */}
            {selectedSemesterId !== null && (
              <SemesterSelecter size="sm" onChange={setSelectedSemesterId} />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      ) : !statistics ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">
            Không có dữ liệu thống kê
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Row 1 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Sinh viên đăng ký"
              value={statistics.totalRegisteredStudents}
              icon={Users}
            />

            <StatCard
              title="Đã chấp nhận"
              value={statistics.totalAcceptedRegistrations}
              icon={UserCheck}
            />

            <StatCard
              title="Từ chối"
              value={statistics.totalRejectedRegistrations}
              icon={XCircle}
            />

            <StatCard
              title="Hủy đăng ký"
              value={statistics.totalCancelledRegistrations}
              icon={Ban}
            />
          </div>

          {/* Row 2 */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Số luận văn"
              value={statistics.totalTheses}
              icon={BookOpen}
            />

            <StatCard
              title="Số nhóm"
              value={statistics.totalGroups}
              icon={Users}
            />

            <StatCard
              title="Hội đồng tham gia"
              value={statistics.totalCouncils}
              icon={Building2}
            />
          </div>

          {/* Row 3 */}
          <div className="grid gap-6 md:grid-cols-2">
            <StatCard
              title="Điểm luận văn trung bình"
              value={statistics.averageThesisScore?.toFixed(2)}
              icon={GraduationCap}
            />

            <StatCard
              title="Điểm giảng viên chấm TB"
              value={statistics.averageGivenScore?.toFixed(2)}
              icon={BarChart3}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerStatisticsPage;
