import {
  Landmark,
  Plus,
  RotateCcw,
  Search,
  SearchX,
  ShieldAlert,
  UploadIcon,
} from "lucide-react";
import Button from "../../../components/UI/Button";
import CouncilCard from "./CouncilCard";
import type { CouncilResponse } from "../../../types/council";
import {
  useDeleteCouncilMutation,
  useGetCurrentSemesterQuery,
  useLazySearchCouncilsBySemesterQuery,
  useSearchCurrentCouncilsQuery,
} from "../../../services/semApi";
import CouncilFormModal from "./CouncilFormModal";
import { useEffect, useMemo, useState } from "react";
import SemesterSelecter from "../../../components/common/SemesterSelecter";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import Input from "../../../components/UI/Input";
import Select from "../../../components/UI/Select";
import {
  useGetCollegesQuery,
  useGetDeparmentsQuery,
  useGetFacultiesQuery,
} from "../../../services/orgApi";
import ExcelImportCouncilsModal from "./ExcelImportCouncilsModal";

type CouncilType = "FACULTY" | "COLLEGE" | "DEPARTMENT";

const CouncilManagementPage = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [unitId, setUnitId] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedCode, setDebouncedCode] = useState("");
  const [openExcelImport, setOpenExcelImport] = useState(false);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );

  const [type, setType] = useState<CouncilType>("FACULTY");

  const codeLabel = useMemo(() => {
    if (type === "FACULTY") return "Mã khoa";
    if (type === "COLLEGE") return "Mã trường";
    return "Mã bộ môn";
  }, [type]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedName(name);
    }, 500);

    return () => clearTimeout(timeout);
  }, [name]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedCode(code);
    }, 500);

    return () => clearTimeout(timeout);
  }, [code]);

  const searchForm = useMemo(() => {
    const form: Record<string, string | number> = {
      page: 0,
      size: 6,
      type,
    };

    const trimmedName = debouncedName.trim();

    if (trimmedName) form.name = trimmedName;

    if (unitId) {
      if (type === "FACULTY") form.facultyId = unitId;
      else if (type === "COLLEGE") form.collegeId = unitId;
      else form.departmentId = unitId;
    }
    return form;
  }, [debouncedName, debouncedCode, unitId, type]);

  const handleResetFilter = () => {
    setName("");
    setCode("");
    setDebouncedName("");
    setDebouncedCode("");
    setUnitId("");
    setType("FACULTY");
  };

  const {
    data: currentCouncilsResponse,
    isLoading: currentCouncilsLoading,
    refetch: refetchCurrentCouncils,
  } = useSearchCurrentCouncilsQuery(searchForm);

  const [
    getCouncilsBySemester,
    { data: semesterCouncilsResponse, isLoading: semesterCouncilsLoading },
  ] = useLazySearchCouncilsBySemesterQuery();

  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();

  const { data: collegesData } = useGetCollegesQuery();
  const { data: facultiesData } = useGetFacultiesQuery();
  const { data: departmentsData } = useGetDeparmentsQuery();

  const [deleteCouncil] = useDeleteCouncilMutation();

  const [openForm, setOpenForm] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState<CouncilResponse | null>(
    null,
  );

  const units = useMemo(() => {
    if (type === "COLLEGE") return collegesData?.data || [];
    if (type === "FACULTY") return facultiesData?.data || [];
    if (type === "DEPARTMENT") return departmentsData?.data || [];
    return [];
  }, [type, collegesData, facultiesData, departmentsData]);

  useEffect(() => {
    if (selectedSemesterId) {
      getCouncilsBySemester({
        semesterId: selectedSemesterId,
        form: searchForm,
      });
    }
  }, [selectedSemesterId, searchForm, getCouncilsBySemester]);

  useEffect(() => {
    setUnitId("");
    setCode("");
    setDebouncedCode("");
  }, [type]);
  const councilsResponse = selectedSemesterId
    ? semesterCouncilsResponse
    : currentCouncilsResponse;
  const isLoading = selectedSemesterId
    ? semesterCouncilsLoading
    : currentCouncilsLoading;
  const councils = councilsResponse?.data.content || [];

  const currentSemesterId = currentSemesterResponse?.data?.id;
  const canManageCouncils =
    !selectedSemesterId || selectedSemesterId === currentSemesterId;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [councilToDelete, setCouncilToDelete] =
    useState<CouncilResponse | null>(null);
  const refreshCouncils = () => {
    if (selectedSemesterId) {
      getCouncilsBySemester({
        semesterId: selectedSemesterId,
        form: searchForm,
      });
      return;
    }

    refetchCurrentCouncils();
  };

  const handleDeleteCouncil = async () => {
    if (!canManageCouncils) return;
    await deleteCouncil(councilToDelete?.id as string).unwrap();
    refreshCouncils();
    setOpenConfirm(false);
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-300 dark:border-gray-700 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        {/* left */}
        <div className="flex gap-3 sm:gap-4 items-start sm:items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300">
            <Landmark size={26} />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
              Quản lý hội đồng luận văn
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Quản lý vai trò giảng viên trong hội đồng chấm luận văn như chủ
              tịch, thư ký và phản biện.
            </p>
          </div>
        </div>
        {/* right */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <SemesterSelecter size="sm" onChange={setSelectedSemesterId} />

          <Button
            label="Nhập từ excel"
            icon={UploadIcon}
            size="sm"
            variant="outline"
            onClick={() => setOpenExcelImport(true)}
          />
          <Button
            label="Thêm hội đồng"
            icon={Plus}
            size="sm"
            disabled={!canManageCouncils}
            title={
              canManageCouncils
                ? ""
                : "Chỉ được thêm hội đồng trong học kỳ hiện tại"
            }
            onClick={() => {
              setEditingCouncil(null);
              setOpenForm(true);
            }}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50 mb-4 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300">
          <Search size={16} />
          <p className="text-xs font-semibold uppercase tracking-wider">
            Tìm kiếm hội đồng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 p-4">
          <Input
            label="Tên hội đồng"
            size="sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label={codeLabel}
            size="sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Select
            label="Loại hội đồng"
            size="sm"
            value={type}
            onChange={(e: any) => setType(e.target.value as CouncilType)}
            options={[
              { label: "Hội đồng khoa", value: "FACULTY" },
              { label: "Hội đồng trường", value: "COLLEGE" },
              { label: "Hội đồng bộ môn", value: "DEPARTMENT" },
            ]}
          />
          <Select
            label="Đơn vị quản lý"
            value={unitId}
            options={[
              { value: "", label: "Chọn đơn vị" },
              ...units.map((unit: any) => ({
                value: unit.id,
                label: unit.name,
              })),
            ]}
            onChange={(e: any) => setUnitId(e.target.value)}
          />
          <div className="flex items-end">
            <Button
              icon={RotateCcw}
              size="sm"
              className="h-9 w-full"
              variant="outline"
              onClick={handleResetFilter}
            />
          </div>
        </div>
      </div>
      {!canManageCouncils && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300 flex items-start gap-2">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          Bạn đang xem học kỳ không phải hiện tại. Chế độ này chỉ cho phép xem,
          không cho thêm, sửa hoặc xóa hội đồng.
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          Danh sách hội đồng
        </div>
        <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          {councils.length} hội đồng
        </span>
      </div>

      {/* LIST */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6"
          aria-live="polite"
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
            >
              <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-gray-700 animate-pulse mt-2" />
              <div className="h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-700 animate-pulse mt-5" />
              <div className="flex gap-2 mt-4">
                <div className="h-7 w-24 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse" />
                <div className="h-7 w-20 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : councils.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center bg-gray-50/70 dark:bg-gray-900/40">
          <div className="mx-auto w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
            <SearchX size={20} />
          </div>
          <p className="mt-3 font-medium text-gray-700 dark:text-gray-200">
            Chưa có hội đồng nào trong học kỳ này
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Bạn có thể tạo hội đồng mới để bắt đầu phân công vai trò giảng viên.
          </p>
          {canManageCouncils && (
            <div className="mt-4">
              <Button
                label="Thêm hội đồng"
                icon={Plus}
                size="sm"
                onClick={() => {
                  setEditingCouncil(null);
                  setOpenForm(true);
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {councils.map((council) => (
            <CouncilCard
              key={council.id}
              council={council}
              onEditing={
                canManageCouncils
                  ? () => {
                      setEditingCouncil(council);
                      setOpenForm(true);
                    }
                  : undefined
              }
              onDelete={
                canManageCouncils
                  ? () => {
                      {
                        setCouncilToDelete(council);
                        setOpenConfirm(true);
                      }
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <CouncilFormModal
        open={openForm && canManageCouncils}
        onClose={() => {
          setOpenForm(false);
          setEditingCouncil(null);
          refreshCouncils();
        }}
        council={editingCouncil}
      />

      <ConfirmModal
        title={`Bạn có chắc chắn muốn xóa hội đồng ${councilToDelete?.name}?`}
        description="Hành động này không thể hoàn tác!"
        onConfirm={handleDeleteCouncil}
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        type="danger"
      />
      <ExcelImportCouncilsModal
        open={openExcelImport}
        onClose={() => setOpenExcelImport(false)}
      />
    </div>
  );
};

export default CouncilManagementPage;
