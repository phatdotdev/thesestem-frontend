import { useGetStudentProfileQuery } from "../../services/userApi";

const StdDashboardPage = () => {
  const { data: studentProfileResponse } = useGetStudentProfileQuery();
  const student = studentProfileResponse?.data;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
        Xin chào {student?.fullName} !
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Chào mừng bạn quay lại hệ thống quản lý luận văn
      </p>
    </div>
  );
};

export default StdDashboardPage;
