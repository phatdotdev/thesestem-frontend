import { Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGetCurrentCouncilsQuery,
  useLazyGetCouncilsBySemesterQuery,
} from "../../../services/councilApi";
import { useGetCurrentSemesterQuery } from "../../../services/semApi";
import CouncilRow from "./CouncilRow";
import { useNavigate } from "react-router-dom";

const LecCouncilPage = () => {
  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();
  const currentSemesterId = currentSemesterResponse?.data?.id;

  const { data: councilsResponse } = useGetCurrentCouncilsQuery({});
  const currentCouncils = councilsResponse?.data || [];

  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );
  const [getCouncilsBySemester, { data: councilsBySemesterResponse }] =
    useLazyGetCouncilsBySemesterQuery();

  const navigate = useNavigate();

  const councils =
    selectedSemesterId && selectedSemesterId !== currentSemesterId
      ? councilsBySemesterResponse?.data || []
      : currentCouncils;

  useEffect(() => {
    if (selectedSemesterId && selectedSemesterId !== currentSemesterId) {
      getCouncilsBySemester(selectedSemesterId);
    }
  }, [selectedSemesterId, currentSemesterId, getCouncilsBySemester]);

  return (
    <div className="h-full space-y-5 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:space-y-6 sm:p-6">
      {/* HEADER */}
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        {/* Icon */}
        <div
          className="
                           h-12 w-12 rounded-2xl sm:h-16 sm:w-16 sm:rounded-3xl
                           bg-gray-50 dark:bg-gray-800
                           flex items-center justify-center
                           text-gray-600 dark:text-gray-300
                           border border-gray-200 dark:border-gray-700
                         "
        >
          <Landmark size={30} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-2xl">
            Hội đồng luận văn
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Quản lý các hội đồng luận văn mà bạn tham gia.
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-200 dark:border-gray-800" />

      {/* LIST HEADER */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <h2 className="font-medium text-gray-700 dark:text-gray-300">
          Danh sách hội đồng
        </h2>

        <span
          className="
    ml-2 inline-flex items-center justify-center 
    px-2 py-0.5 min-w-[24px] h-6 
    text-[11px] font-bold tracking-tighter
    bg-gray-100 text-gray-600 
    dark:bg-gray-800 dark:text-gray-300
    border border-gray-200 dark:border-gray-700
    rounded-lg
"
        >
          {councils.length}
        </span>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {councils.length === 0 ? (
          <div
            className="
        col-span-full
        flex flex-col items-center justify-center
        text-center
        py-12
        border border-dashed
        border-gray-200 dark:border-gray-700
        rounded-xl
        bg-gray-50/70 dark:bg-gray-800/50
      "
          >
            <Landmark
              size={32}
              className="text-gray-400 dark:text-gray-500 mb-3"
            />

            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Không có hội đồng trong học kỳ này
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Hãy chọn học kỳ khác hoặc chờ phân công hội đồng
            </p>
          </div>
        ) : (
          councils.map((council: any) => (
            <CouncilRow
              key={council.id}
              council={council}
              onClick={() => navigate(council.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LecCouncilPage;
