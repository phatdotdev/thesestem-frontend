import { FiBookOpen } from "react-icons/fi";
import Loader from "../../../components/UI/Loader";
import {
  useGetCurrentStudentThesisQuery,
  useLazyGetStudentThesisBySemesterQuery,
} from "../../../services/thesisApi";
import ThesisCard from "./ThesisCard";
import SemesterSelecter from "../../../components/common/SemesterSelecter";
import { useEffect, useState } from "react";

const StudentThesesPage = () => {
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );

  const { data: currentData, isLoading: isCurrentLoading } =
    useGetCurrentStudentThesisQuery(undefined, {
      skip: Boolean(selectedSemesterId),
    });

  const [getThesesBySemester, { data: semesterData, isLoading: isSemLoading }] =
    useLazyGetStudentThesisBySemesterQuery();

  useEffect(() => {
    if (selectedSemesterId) {
      getThesesBySemester(selectedSemesterId);
    }
  }, [selectedSemesterId, getThesesBySemester]);

  const theses = selectedSemesterId
    ? (semesterData?.data ?? [])
    : (currentData?.data ?? []);
  const isLoading = selectedSemesterId ? isSemLoading : isCurrentLoading;

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:space-y-8 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
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
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 sm:text-2xl">
              Luận văn của tôi
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Danh sách luận văn bạn đang thực hiện
            </p>
          </div>
        </div>

        <div className="self-start lg:self-auto">
          <SemesterSelecter
            size="sm"
            onChange={(semesterId) => setSelectedSemesterId(semesterId)}
          />
        </div>
      </div>

      {/* LIST */}
      {isLoading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader />
        </div>
      ) : theses.length === 0 ? (
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
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {theses.map((thesis: any) => (
            <ThesisCard key={thesis.id} thesis={thesis} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentThesesPage;
