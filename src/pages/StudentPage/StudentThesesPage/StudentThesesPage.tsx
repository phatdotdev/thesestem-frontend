import { FiBookOpen } from "react-icons/fi";
import Loader from "../../../components/UI/Loader";
import { useGetCurrentStudentThesisQuery } from "../../../services/thesisApi";
import Badge from "../../../components/UI/Badge";
import ThesisCard from "./ThesisCard";
import SemesterSelecter from "../../../components/common/SemesterSelecter";

const StudentThesesPage = () => {
  const { data, isLoading } = useGetCurrentStudentThesisQuery();
  const theses = data?.data || [];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (theses.length === 0) {
    return (
      <div
        className="
        text-center py-20 
        border border-dashed 
        rounded-2xl 
        bg-gray-50 dark:bg-gray-900
        border-gray-200 dark:border-gray-700
        "
      >
        <FiBookOpen
          className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
          size={36}
        />

        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Bạn chưa có luận văn
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Khi được phân đề tài, luận văn sẽ xuất hiện tại đây
        </p>
      </div>
    );
  }

  return (
    <div
      className="
      space-y-8 
      bg-white dark:bg-gray-900
      p-6 rounded-xl shadow-sm
      border border-gray-200 dark:border-gray-700
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="
            p-4 
            bg-blue-100 text-blue-600
            dark:bg-blue-950/40 dark:text-blue-300
            rounded-xl
            "
          >
            <FiBookOpen size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Luận văn của tôi
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Danh sách luận văn bạn đang thực hiện
            </p>
          </div>
        </div>

        <SemesterSelecter />
      </div>

      {/* LIST */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {theses.map((thesis: any) => (
          <ThesisCard key={thesis.id} thesis={thesis} />
        ))}
      </div>
    </div>
  );
};

export default StudentThesesPage;
