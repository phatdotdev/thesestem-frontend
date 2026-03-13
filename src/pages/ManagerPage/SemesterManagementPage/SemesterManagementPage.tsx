import { CalendarDays, Edit, Play, PlusCircle, Trash2 } from "lucide-react";
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

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "";

const SemesterManagementPage = () => {
  /* ================= YEARS ================= */
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [openYear, setOpenYear] = useState(false);

  const { data, refetch: refetchYears } = useGetYearsQuery();
  const years = data?.data ?? [];

  const selectedYear = useMemo(
    () => years.find((y: any) => y.id === selectedYearId) ?? null,
    [years, selectedYearId],
  );
  const [deleteYear] = useDeleteYearMutation();

  /* ================= SEMESTERS ================= */
  const [semesters, setSemesters] = useState<any[]>([]);
  const [openSemester, setOpenSemester] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<any>(null);

  const [getSemesters, { isFetching: isLoadingSemester }] =
    useLazyGetSemesterByYearQuery();
  const [deleteSemester] = useDeleteSemesterMutation();
  const [updateSemesterStatus] = useUpdateSemesterStatusMutation();

  const loadSemesters = async (yearId: string) => {
    try {
      const res = await getSemesters(yearId).unwrap();
      const data = res?.data ?? [];
      setSemesters(data);
    } catch (err) {
      console.error("Load semesters failed:", err);
      setSemesters([]);
    }
  };

  const deleteYearById = async (id: string) => {
    if (confirm("Xác nhận xóa?")) {
      await deleteYear(id).unwrap();
      setSelectedYearId(null);
      setSemesters([]);
      refetchYears();
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

  /* ================= RENDER ================= */
  return (
    <main className="p-6 max-w-7xl font-inter space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          {/* ICON */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <CalendarDays size={24} />
          </div>

          {/* TEXT */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Quản lý học kỳ
            </h1>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              Quản lý danh sách học kỳ theo từng năm học, cho phép tạo mới, cập
              nhật, kích hoạt hoặc xóa học kỳ trong hệ thống.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT - YEARS */}
        <div className="col-span-4 bg-white border border-gray-300 rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <h2 className="font-semibold">Năm học</h2>
            <Button
              size="sm"
              icon={PlusCircle}
              label="Thêm năm học"
              variant="ghost"
              className="border"
              onClick={() => {
                setSelectedYearId(null);
                setOpenYear(true);
              }}
            />
          </div>

          <ul className="h-135 overflow-y-auto">
            {years.map((year: any) => (
              <li
                key={year.id}
                onClick={() => {
                  setSelectedYearId(year.id);
                  loadSemesters(year.id);
                }}
                className={`flex justify-between items-center px-4 py-3 cursor-pointer text-sm border-b border-gray-300
                ${
                  selectedYearId === year.id
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="text-md">{year.name}</span>

                <span
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    icon={Edit}
                    size="sm"
                    onClick={() => {
                      setSelectedYearId(year.id);
                      setOpenYear(true);
                    }}
                  />
                  <Button
                    icon={Trash2}
                    variant="danger"
                    size="sm"
                    onClick={() => deleteYearById(year.id)}
                  />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT - SEMESTERS */}
        <div className="col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <h2 className="font-semibold">
              Học kỳ{" "}
              {selectedYear && (
                <>
                  {selectedYear.name}{" "}
                  <span className="text-blue-500 text-sm">
                    (từ ngày {formatDate(selectedYear.startDate)} đến ngày{" "}
                    {formatDate(selectedYear.endDate)})
                  </span>
                </>
              )}
            </h2>

            <Button
              size="sm"
              icon={PlusCircle}
              label="Thêm học kỳ"
              variant="ghost"
              className="border"
              disabled={!selectedYearId}
              onClick={() => {
                setSelectedSemester(null);
                setOpenSemester(true);
              }}
            />
          </div>

          <div className="h-135 overflow-y-auto px-4 py-2">
            {isLoadingSemester ? (
              <div className="text-sm text-gray-500 text-center py-10">
                Đang tải học kỳ...
              </div>
            ) : semesters.length ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="py-2">Tên học kỳ</th>
                    <th>Ngày bắt đầu</th>
                    <th>Ngày kết thúc</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {semesters.map((s: any) => (
                    <tr
                      key={s.id}
                      className="border-b h-12 border-gray-300 hover:bg-gray-50"
                    >
                      <td className="py-2 font-medium">
                        {s.name}- {s.status}
                      </td>
                      <td>{formatDate(s.startDate)}</td>
                      <td>{formatDate(s.endDate)}</td>
                      <td className="text-center">
                        <div className="flex justify-center gap-2 items-center">
                          <Button
                            icon={Play}
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateSemesterStatusById(s.id, "ACTIVE")
                            }
                          />
                          <Button
                            icon={Edit}
                            size="sm"
                            onClick={() => {
                              setSelectedSemester(s);
                              setOpenSemester(true);
                            }}
                          />
                          <Button
                            icon={Trash2}
                            variant="danger"
                            size="sm"
                            onClick={() => deleteSemesterById(s.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-sm text-gray-500 text-center py-10">
                {selectedYearId
                  ? "Chưa có học kỳ nào cho năm học này"
                  : "Chọn một năm học để xem học kỳ"}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* MODALS */}
      <YearForm
        initialData={selectedYear}
        open={openYear}
        onClose={() => setOpenYear(false)}
        onSuccess={async () => {
          await refetchYears();
          setOpenYear(false);
        }}
      />
      <SemesterForm
        initialData={selectedSemester}
        yearId={selectedYearId ?? ""}
        semesterId={selectedSemester?.id ?? ""}
        open={openSemester}
        onClose={() => setOpenSemester(false)}
        onSuccess={() => {
          if (selectedYearId) loadSemesters(selectedYearId);
          setOpenSemester(false);
        }}
      />
    </main>
  );
};

export default SemesterManagementPage;
