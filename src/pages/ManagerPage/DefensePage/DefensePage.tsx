import { useMemo, useState } from "react";
import DefenseViewPage from "./DefenseViewPage";
import DefenseAssignPage from "./DefenseAssignPage";
import PageHeader from "../../../components/UI/PageHeader";
import { Download, Presentation, Upload } from "lucide-react";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import ExcelImportModal from "./ExcelImportModal";
import {
  useGetDefensesQuery,
  useSearchDefensesQuery,
} from "../../../services/defenseApi";
import { exportDefenseResultsToExcel } from "../../../utils/exportUtils";
import SemesterSelecter from "../../../components/common/SemesterSelecter";
import UnitSelecter from "../../../components/common/UnitSelecter";
import ProgramSelecter from "../../../components/common/ProgramSelecter";

type UnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

const DefensePage = () => {
  const [activeTab, setActiveTab] = useState<"view" | "assign">("view");
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null,
  );
  const [studentCode, setStudentCode] = useState("");
  const [councilCode, setCouncilCode] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<{
    type: UnitType;
    id: string | null;
    name?: string;
  } | null>(null);
  const [page, setPage] = useState(0);
  const size = 5;

  const searchForm = useMemo(() => {
    return {
      collegeId:
        selectedUnit?.type === "COLLEGE"
          ? (selectedUnit.id ?? undefined)
          : undefined,
      facultyId:
        selectedUnit?.type === "FACULTY"
          ? (selectedUnit.id ?? undefined)
          : undefined,
      departmentId:
        selectedUnit?.type === "DEPARTMENT"
          ? (selectedUnit.id ?? undefined)
          : undefined,
      programId: selectedProgramId ?? undefined,
      studentCode: studentCode.trim() || undefined,
      councilCode: councilCode.trim() || undefined,
    };
  }, [councilCode, selectedProgramId, selectedUnit, studentCode]);

  const pagedQueryArgs = useMemo(
    () => ({
      ...searchForm,
      page,
      size,
      semesterId: selectedSemesterId ?? undefined,
    }),
    [page, searchForm, selectedSemesterId],
  );

  const fullQueryArgs = useMemo(
    () => ({ ...searchForm, semesterId: selectedSemesterId ?? undefined }),
    [searchForm, selectedSemesterId],
  );

  const { data: pagedResponse, isLoading: pagedLoading } =
    useSearchDefensesQuery(pagedQueryArgs);
  const { data: fullResponse, isLoading: fullLoading } =
    useGetDefensesQuery(fullQueryArgs);

  const pagedData = pagedResponse?.data;
  const defensesForView = pagedData?.content ?? [];
  const totalPages = pagedData?.totalPages ?? 0;
  const viewLoading = pagedLoading;
  const defensesForExport = fullResponse?.data ?? [];
  const exportLoading = fullLoading;

  const handleChangeSemester = (semesterId: string | null) => {
    setSelectedSemesterId(semesterId);
    setPage(0);
  };

  const handleChangeUnit = (type: UnitType, unitId: string | null) => {
    setSelectedUnit({ type, id: unitId });
    setSelectedProgramId(null);
    setPage(0);
  };

  const handleChangeProgram = (programId: string | null) => {
    setSelectedProgramId(programId);
    setPage(0);
  };

  const handleDownload = () => {
    exportDefenseResultsToExcel(defensesForExport);
  };

  const programFilterForm = useMemo(() => {
    return {
      collegeId:
        selectedUnit?.type === "COLLEGE"
          ? (selectedUnit.id ?? undefined)
          : undefined,
      facultyId:
        selectedUnit?.type === "FACULTY"
          ? (selectedUnit.id ?? undefined)
          : undefined,
      departmentId:
        selectedUnit?.type === "DEPARTMENT"
          ? (selectedUnit.id ?? undefined)
          : undefined,
    };
  }, [selectedUnit]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center gap-4">
        <PageHeader
          icon={Presentation}
          title="Bảo vệ luận văn"
          description="Quản lý lịch báo cáo luận văn"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={Upload}
            label="Thêm từ Excel"
            size="sm"
            onClick={() => setOpenImportModal(true)}
          />
          <Button
            icon={Download}
            label="Tải kết quả"
            size="sm"
            variant="outline"
            loading={exportLoading}
            onClick={handleDownload}
          />
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50 overflow">
        {/* Filter header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Bộ lọc
          </p>
          {activeTab !== "view" && (
            <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300">
              Trang phân công dùng học kỳ hiện tại
            </span>
          )}
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 items-center">
          {activeTab === "view" ? (
            <SemesterSelecter
              size="sm"
              showAllOption
              value={selectedSemesterId}
              onChange={handleChangeSemester}
              width="100%"
            />
          ) : (
            <div className="flex items-center rounded-lg border border-dashed border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-400 dark:text-gray-500 select-none">
              Học kỳ hiện tại
            </div>
          )}

          <UnitSelecter
            size="sm"
            showAllOption
            value={selectedUnit}
            onChange={handleChangeUnit}
            width="100%"
          />

          <ProgramSelecter
            size="sm"
            showAllOption
            form={programFilterForm}
            value={selectedProgramId}
            onChange={handleChangeProgram}
            width="100%"
          />

          <Input
            size="sm"
            placeholder="Mã sinh viên"
            value={studentCode}
            onChange={(e) => {
              setStudentCode(e.target.value);
              setPage(0);
            }}
          />

          <Input
            size="sm"
            placeholder="Mã hội đồng"
            value={councilCode}
            onChange={(e) => {
              setCouncilCode(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {(["view", "assign"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
              activeTab === tab
                ? "bg-white dark:bg-gray-900 shadow-sm text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab === "view" ? "Xem phân công" : "Phân công"}
          </button>
        ))}
      </div>

      {activeTab === "view" && (
        <DefenseViewPage
          defenses={defensesForView}
          loading={viewLoading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      {activeTab === "assign" && (
        <DefenseAssignPage
          unitFilter={selectedUnit}
          thesisProgramId={selectedProgramId}
          studentCode={studentCode}
          councilCode={councilCode}
        />
      )}

      <ExcelImportModal
        open={openImportModal}
        onClose={() => setOpenImportModal(false)}
      />
    </div>
  );
};

export default DefensePage;
