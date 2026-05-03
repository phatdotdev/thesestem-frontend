import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  RotateCcw,
  Search,
  SearchX,
  ShieldAlert,
} from "lucide-react";

import { useSearchThesesForManagerQuery } from "../../../services/thesisApi";
import { useGetCurrentSemesterQuery } from "../../../services/semApi";

import type { ThesisResponse } from "../../../types/thesis";

import Button from "../../../components/UI/Button";
import SemesterSelecter from "../../../components/common/SemesterSelecter";
import OrganizationUnitSelecter from "../../../components/common/UnitSelecter";
import ThesisRow from "./ThesisRow";
import ProgramSelecter from "../../../components/common/ProgramSelecter";
import Select from "../../../components/UI/Select";
import Input from "../../../components/UI/Input";

const SemesterThesesManagementPage = () => {
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(
    null,
  );
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    null,
  );
  const [type, setType] = useState<"FACULTY" | "COLLEGE" | "DEPARTMENT">(
    "FACULTY",
  );
  const [unitId, setUnitId] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const size = 10; // Nên để 10 thay vì 5 cho UX tốt hơn

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [accessFilter, setAccessFilter] = useState("ALL");

  const filterForm = useMemo(() => {
    const form: any = {
      page,
      size,
    };

    if (selectedSemesterId) {
      form.semesterId = selectedSemesterId;
    }

    if (unitId) {
      if (type === "FACULTY") form.facultyId = unitId;
      else if (type === "COLLEGE") form.collegeId = unitId;
      else if (type === "DEPARTMENT") form.departmentId = unitId;
    }

    if (selectedProgramId) {
      form.programId = selectedProgramId;
    }

    if (search.trim()) {
      form.name = search.trim();
    }

    if (statusFilter !== "ALL") {
      form.status = statusFilter;
    }

    if (accessFilter !== "ALL") {
      form.accessLevel = accessFilter;
    }

    return form;
  }, [
    selectedSemesterId,
    selectedProgramId,
    unitId,
    type,
    search,
    statusFilter,
    accessFilter,
    page,
    size,
  ]);

  const programForm = useMemo(() => {
    const form: any = {};

    if (unitId) {
      if (type === "FACULTY") form.facultyId = unitId;
      else if (type === "COLLEGE") form.collegeId = unitId;
      else if (type === "DEPARTMENT") form.departmentId = unitId;
    }

    return form;
  }, [unitId, type]);

  const {
    data: thesesResponse,
    isLoading,
    isFetching,
  } = useSearchThesesForManagerQuery(filterForm);

  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();

  const allTheses: ThesisResponse[] = thesesResponse?.data?.content || [];
  const totalPages = thesesResponse?.data?.totalPages || 0;
  const totalElements = thesesResponse?.data?.totalElements || 0;

  const currentSemesterId = currentSemesterResponse?.data?.id;
  const canManageTheses =
    !selectedSemesterId || selectedSemesterId === currentSemesterId;

  useEffect(() => {
    setPage(0);
  }, [selectedSemesterId, unitId, type, search, statusFilter, accessFilter]);

  const handleSemesterChange = (semesterId: string | null) => {
    setSelectedSemesterId(semesterId);
  };

  const handleUnitChange = (
    selectedType: "FACULTY" | "COLLEGE" | "DEPARTMENT",
    selectedUnitId: string | null,
  ) => {
    setType(selectedType);
    setUnitId(selectedUnitId);
    setSelectedProgramId(null);
    setPage(0);
  };

  const handleReset = () => {
    setSelectedSemesterId(null);
    setSelectedProgramId(null);
    setType("FACULTY");
    setUnitId(null);
    setSearch("");
    setStatusFilter("ALL");
    setAccessFilter("ALL");
    setPage(0);
  };

  return (
    <div className="space-y-5 rounded-xl border border-gray-300 bg-white p-4 shadow dark:border-gray-700 dark:bg-gray-900 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 sm:text-xl">
              Quản lý luận văn
            </h1>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
              Danh sách luận văn sinh viên theo học kỳ và đơn vị
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300">
          <Search size={16} />
          <p className="text-xs font-semibold uppercase tracking-wider">
            Bộ lọc luận văn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 p-4">
          <div className="min-w-0">
            <OrganizationUnitSelecter
              size="sm"
              onChange={handleUnitChange}
              width="100%"
            />
          </div>
          <div className="min-w-0">
            <ProgramSelecter
              form={programForm}
              onChange={setSelectedProgramId}
              size="sm"
              value={selectedProgramId}
              showAllOption={true}
              width="100%"
            />
          </div>
          <div className="min-w-0">
            <SemesterSelecter
              size="sm"
              onChange={handleSemesterChange}
              showAllOption={true}
              width="100%"
            />
          </div>
          <div className="min-w-0">
            <Button
              size="sm"
              icon={RotateCcw}
              variant="outline"
              onClick={handleReset}
              className="h-9"
            />
          </div>
        </div>
      </div>

      {/* Warning */}
      {!canManageTheses && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" />
          Bạn đang xem học kỳ không phải hiện tại. Chế độ này chỉ cho phép xem
          thông tin.
        </div>
      )}

      {/* Filters & Stats */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/60 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300">
          <Search size={16} />
          <p className="text-xs font-semibold uppercase tracking-wider">
            Tìm kiếm, trạng thái và quyền truy cập
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr] gap-3 px-4 py-3 items-start lg:items-center">
          <div>
            <span className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {totalElements}
              </span>{" "}
              luận văn
            </span>
          </div>

          {/* Search & Status Filter */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 min-w-0">
            <div className="min-w-0">
              <Input
                size="sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập tên đề tài cần tìm"
              />
            </div>

            <div className="min-w-0">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: "ALL", label: "Tất cả trạng thái" },
                  { value: "PROPOSAL", label: "Đề xuất" },
                  { value: "ON_GOING", label: "Đang thực hiện" },
                  { value: "APPROVED", label: "Đã duyệt" },
                  { value: "SUBMITTED", label: "Đã nộp" },
                  { value: "GRADED", label: "Đã chấm điểm" },
                ]}
                size="sm"
              />
            </div>

            <div className="min-w-0">
              <Select
                value={accessFilter}
                onChange={(e) => setAccessFilter(e.target.value)}
                options={[
                  { value: "ALL", label: "Tất cả quyền truy cập" },
                  { value: "PUBLIC", label: "Công khai" },
                  { value: "INTERNAL", label: "Nội bộ" },
                  { value: "PRIVATE", label: "Riêng tư" },
                ]}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-9 gap-2 border-b border-gray-200 bg-gray-50 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <div className="col-span-2">Sinh viên</div>
          <div className="col-span-3">Đề tài</div>
          <div className="col-span-1">Hướng dẫn viên</div>
          <div className="col-span-1 text-center">Tiến độ</div>
          <div className="col-span-1 text-center">Trạng thái</div>
          <div className="col-span-1 text-center">Hành động</div>
        </div>

        {isLoading || isFetching ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: size }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : allTheses.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <SearchX size={40} className="mx-auto text-gray-400" />
            <p className="mt-4 font-medium text-gray-700 dark:text-gray-200">
              Không tìm thấy luận văn nào
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          allTheses.map((thesis) => (
            <ThesisRow key={thesis.id} thesis={thesis} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="xs"
            label="Trước"
            variant="outline"
            disabled={page === 0 || isLoading || isFetching}
            onClick={() => setPage((p) => p - 1)}
          />

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              size="xs"
              label={(i + 1).toString()}
              variant={i === page ? "primary" : "outline"}
              onClick={() => setPage(i)}
              disabled={isLoading || isFetching}
            />
          ))}

          <Button
            size="xs"
            label="Sau"
            variant="outline"
            disabled={page >= totalPages - 1 || isLoading || isFetching}
            onClick={() => setPage((p) => p + 1)}
          />
        </div>
      )}
    </div>
  );
};

export default SemesterThesesManagementPage;
