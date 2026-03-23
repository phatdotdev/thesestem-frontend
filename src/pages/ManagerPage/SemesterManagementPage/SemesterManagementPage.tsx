import { CalendarDays, Edit, PlusCircle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../components/UI/Button";
import {
  useDeleteSemesterMutation,
  useDeleteYearMutation,
  useGetYearsQuery,
  useLazyGetSemesterByYearQuery,
  useUpdateSemesterStatusMutation,
} from "../../../services/orgApi";
import YearForm from "./YearForm";
import SemesterForm from "./SemesterForm";
import SemesterRow from "./SemesterRow";

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "";

const SemesterManagementPage = () => {
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [openYear, setOpenYear] = useState(false);
  const [openSemester, setOpenSemester] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<any>(null);
  const [semesters, setSemesters] = useState<any[]>([]);

  const { data } = useGetYearsQuery();
  const years = data?.data ?? [];

  const selectedYear = useMemo(
    () => years.find((y: any) => y.id === selectedYearId) ?? null,
    [years, selectedYearId],
  );

  const [deleteYear] = useDeleteYearMutation();
  const [getSemesters, { isFetching: isLoadingSemester }] =
    useLazyGetSemesterByYearQuery();
  const [deleteSemester] = useDeleteSemesterMutation();
  const [updateSemesterStatus] = useUpdateSemesterStatusMutation();

  const loadSemesters = async (yearId: string) => {
    try {
      const res = await getSemesters(yearId).unwrap();
      setSemesters(res?.data ?? []);
    } catch {
      setSemesters([]);
    }
  };

  const deleteYearById = async (id: string) => {
    if (confirm("Xác nhận xóa?")) {
      await deleteYear(id).unwrap();
      setSelectedYearId(null);
      setSemesters([]);
    }
  };

  const updateSemesterStatusById = async (id: string, status: string) => {
    if (!selectedYearId) return;
    if (confirm("Xác nhận cập nhật?")) {
      await updateSemesterStatus({ id, status }).unwrap();
      loadSemesters(selectedYearId);
    }
  };

  const deleteSemesterById = async (id: string) => {
    if (!selectedYearId) return;
    if (confirm("Xác nhận xóa?")) {
      await deleteSemester(id).unwrap();
      loadSemesters(selectedYearId);
    }
  };

  return (
    <main className="p-6 mx-auto font-inter space-y-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
      {/* ═══ HEADER ═══ */}
      <div className="flex items-center gap-4 pb-5 border-b border-gray-100 dark:border-gray-700">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-700 text-blue-500 shrink-0">
          <CalendarDays size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            Quản lý học kỳ
          </h1>
          <p className="mt-0.5 text-sm text-gray-400 dark:text-gray-300">
            Tạo mới, cập nhật, kích hoạt hoặc xóa học kỳ theo từng năm học
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* ═══ LEFT — YEARS ═══ */}
        <div className="col-span-4 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col">
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-100">
                Năm học
              </h2>
              <p className="text-[11px] text-gray-400 dark:text-gray-300 mt-0.5">
                {years.length} năm học
              </p>
            </div>
            <Button
              size="sm"
              icon={PlusCircle}
              label="Thêm"
              variant="outline"
              onClick={() => {
                setSelectedYearId(null);
                setOpenYear(true);
              }}
            />
          </div>

          {/* Year list */}
          <ul className="h-135 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
            {years.length === 0 && (
              <li className="text-sm text-gray-400 dark:text-gray-300 text-center py-10">
                Chưa có năm học nào
              </li>
            )}
            {years.map((year: any) => {
              const isSelected = selectedYearId === year.id;
              return (
                <li
                  key={year.id}
                  onClick={() => {
                    setSelectedYearId(year.id);
                    loadSemesters(year.id);
                  }}
                  className={`group relative flex justify-between items-center px-4 py-3 cursor-pointer transition-all duration-150
                    ${isSelected ? "bg-blue-50 dark:bg-blue-900" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-0.5 transition-all ${isSelected ? "bg-blue-500 dark:bg-blue-500" : "bg-transparent"}`}
                  />
                  <span
                    className={`text-sm font-medium truncate ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-100"}`}
                  >
                    {year.name}
                  </span>
                  <span
                    className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      icon={Edit}
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setSelectedYearId(year.id);
                        setOpenYear(true);
                      }}
                    />
                    <Button
                      icon={Trash2}
                      size="xs"
                      variant="soft-danger"
                      onClick={() => deleteYearById(year.id)}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ═══ RIGHT — SEMESTERS ═══ */}
        <div className="col-span-8 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden flex flex-col">
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-100">
                  Học kỳ
                </h2>
                {selectedYear && (
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    — {selectedYear.name}
                  </span>
                )}
              </div>
              {selectedYear ? (
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mt-0.5">
                  {formatDate(selectedYear.startDate)} →{" "}
                  {formatDate(selectedYear.endDate)}
                  <span className="mx-1.5 text-gray-300 dark:text-gray-500">
                    ·
                  </span>
                  {semesters.length} học kỳ
                </p>
              ) : (
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mt-0.5">
                  Chọn năm học để xem
                </p>
              )}
            </div>
            <Button
              size="sm"
              icon={PlusCircle}
              label="Thêm"
              variant="outline"
              disabled={!selectedYearId}
              onClick={() => {
                setSelectedSemester(null);
                setOpenSemester(true);
              }}
            />
          </div>

          {/* Semester content */}
          <div className="h-135 overflow-y-auto p-3">
            {isLoadingSemester ? (
              <div className="text-sm text-gray-400 dark:text-gray-300 text-center py-10">
                Đang tải học kỳ...
              </div>
            ) : !selectedYearId ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-300 gap-2 py-10">
                <CalendarDays
                  size={28}
                  className="text-gray-200 dark:text-gray-600"
                />
                <p className="text-sm">Chọn một năm học để xem học kỳ</p>
              </div>
            ) : semesters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-300 gap-2 py-10">
                <CalendarDays
                  size={28}
                  className="text-gray-200 dark:text-gray-600"
                />
                <p className="text-sm">Chưa có học kỳ nào cho năm học này</p>
              </div>
            ) : (
              <div className="space-y-2">
                {semesters.map((s: any) => (
                  <SemesterRow
                    key={s.id}
                    semester={s}
                    onActivate={updateSemesterStatusById}
                    onEdit={() => {
                      setSelectedSemester(s);
                      setOpenSemester(true);
                    }}
                    onDelete={() => deleteSemesterById(s.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <YearForm
        open={openYear}
        onClose={() => setOpenYear(false)}
        initialData={selectedYear}
      />
      <SemesterForm
        open={openSemester}
        onClose={() => setOpenSemester(false)}
        initialData={selectedSemester}
        semesterId={selectedSemester?.id}
        yearId={selectedYear?.id}
      />
    </main>
  );
};

export default SemesterManagementPage;
