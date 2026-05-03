import { GraduationCap, Search, User, UserSearch } from "lucide-react";
import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";
import {
  useCheckStudentInCurrentSemesterQuery,
  useGetCurrentSemesterQuery,
  useGetStudentRegistersQuery,
  useSearchThesisMentorsQuery,
} from "../../../services/semApi";
import Loader from "../../../components/UI/Loader";
import MessageModal from "./MessageModal";
import { useEffect, useMemo, useState } from "react";
import type { LecturerResponse } from "../../../types/lecturer";
import Badge from "../../../components/UI/Badge";
import MentorRow from "./MentorRow";
import RegisterCard from "./RegisterCard";
import ConfirmModal from "./ConfirmModal";
import type { RegisterResposne } from "../../../types/register";
import OrganizationUnitSelecter from "../../../components/common/UnitSelecter";
import type { StudentSearchForm } from "../../../types/student";

type UnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";
type MentorSearchWithUnit = StudentSearchForm & {
  collegeId?: string;
  facultyId?: string;
  departmentId?: string;
};

const PAGE_SIZE = 5;

const StdRegisterPage = () => {
  const [searchDraft, setSearchDraft] = useState("");
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(0);
  const [unitFilter, setUnitFilter] = useState<{
    type: UnitType;
    id: string | null;
    name?: string;
  } | null>(null);

  const mentorSearchForm = useMemo<MentorSearchWithUnit>(
    () => ({
      page,
      size: PAGE_SIZE,
      name: searchName.trim() || undefined,
      collegeId:
        unitFilter?.type === "COLLEGE"
          ? (unitFilter.id ?? undefined)
          : undefined,
      facultyId:
        unitFilter?.type === "FACULTY"
          ? (unitFilter.id ?? undefined)
          : undefined,
      departmentId:
        unitFilter?.type === "DEPARTMENT"
          ? (unitFilter.id ?? undefined)
          : undefined,
    }),
    [page, searchName, unitFilter],
  );

  const { data, isLoading } = useSearchThesisMentorsQuery(mentorSearchForm);
  const { data: registerResponse } = useGetStudentRegistersQuery();
  const { data: isStudentInCurrentSemester } =
    useCheckStudentInCurrentSemesterQuery();
  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();
  const registers = registerResponse?.data ?? [];
  const mentors = data?.data.content ?? [];
  const totalPages = data?.data.totalPages ?? 0;

  useEffect(() => {
    if (totalPages > 0 && page > totalPages - 1) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  /* ================= STATUS SETS ================= */

  const { pendingIds, acceptedIds, rejectedIds, cancelledIds, hasAccepted } =
    useMemo(() => {
      const pending = new Set<string>();
      const accepted = new Set<string>();
      const rejected = new Set<string>();
      const cancelled = new Set<string>();

      registers.forEach((r) => {
        const mentorId = r.mentor.id;

        if (r.status === "PENDING") pending.add(mentorId);
        if (r.status === "ACCEPTED") accepted.add(mentorId);
        if (r.status === "REJECTED") rejected.add(mentorId);
        if (r.status === "CANCELLED") cancelled.add(mentorId);
      });

      return {
        pendingIds: pending,
        acceptedIds: accepted,
        rejectedIds: rejected,
        cancelledIds: cancelled,
        hasAccepted: accepted.size > 0,
      };
    }, [registers]);

  /* ================= UI STATES ================= */

  const [openMessageModal, setOpenMessageModal] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<LecturerResponse | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState<"search" | "registered">("search");

  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedRegister, setSelectedRegister] =
    useState<RegisterResposne | null>(null);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "danger";
      case "EXPIRED":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-5 rounded-lg border border-gray-300 bg-white py-4 shadow dark:border-gray-700 dark:bg-gray-900 sm:space-y-6 sm:py-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 rounded-xl bg-white px-3 dark:bg-gray-900 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-3 sm:gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-lg">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-2xl">
              Đăng ký giảng viên hướng dẫn
            </h1>

            <p className="text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              Tìm kiếm giảng viên phù hợp với đề tài của bạn và yêu cầu hướng
              dẫn.
            </p>
          </div>
        </div>

        <div className="self-start lg:self-auto">
          <Badge
            label={`${currentSemesterResponse?.data?.name} | ${currentSemesterResponse?.data?.year.name}`}
            variant="success"
            dot
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      {isStudentInCurrentSemester?.data === false ? (
        <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">
            Bạn không tham gia thực hiện luận văn trong học kỳ hiện tại. Chức
            năng đăng ký giảng viên hướng dẫn không khả dụng.
          </p>
        </div>
      ) : (
        <div className="space-y-6 rounded-xl px-3 sm:px-6 sm:space-y-8">
          {/* ===== Tabs ===== */}

          <div className="inline-flex w-full max-w-full gap-2 overflow-x-auto rounded-2xl bg-gray-100 p-1 dark:bg-gray-800 sm:w-fit">
            <button
              onClick={() => setActiveTab("search")}
              className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition sm:px-5 ${
                activeTab === "search"
                  ? "bg-white dark:bg-gray-900 shadow text-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Đăng ký giảng viên
            </button>

            <button
              onClick={() => setActiveTab("registered")}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition sm:px-5 ${
                activeTab === "registered"
                  ? "bg-white dark:bg-gray-900 shadow text-blue-600"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Giảng viên đã đăng ký
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {registers.length}
              </span>
            </button>
          </div>

          {/* ================= SEARCH TAB ================= */}

          {activeTab === "search" && (
            <>
              {/* Search Filter */}

              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 space-y-3">
                <div className="flex gap-2 items-center">
                  <UserSearch
                    size={20}
                    className="text-gray-700 dark:text-gray-300"
                  />
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    Tìm kiếm giảng viên
                  </h2>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 items-end">
                  <div>
                    <Input
                      placeholder="Nhập tên giảng viên..."
                      iconLeft={Search}
                      value={searchDraft}
                      onChange={(e) => setSearchDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setPage(0);
                          setSearchName(searchDraft);
                        }
                      }}
                    />
                  </div>

                  <OrganizationUnitSelecter
                    size="sm"
                    value={unitFilter}
                    onChange={(type, id) => {
                      setPage(0);
                      setUnitFilter({ type, id });
                    }}
                    width="100%"
                    height={40}
                  />

                  <div className="flex gap-2 w-full">
                    <Button
                      label="Tìm kiếm"
                      size="sm"
                      className="h-10 flex-1"
                      onClick={() => {
                        setPage(0);
                        setSearchName(searchDraft);
                      }}
                    />

                    <Button
                      label="Xóa lọc"
                      size="sm"
                      variant="outline"
                      className="h-10 flex-1"
                      onClick={() => {
                        setPage(0);
                        setSearchDraft("");
                        setSearchName("");
                        setUnitFilter(null);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Mentor list */}

              {isLoading ? (
                <Loader />
              ) : mentors.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-800">
                  <User
                    className="mx-auto text-gray-400 dark:text-gray-500 mb-4"
                    size={36}
                  />
                  <p className="font-semibold text-gray-600 dark:text-gray-300 text-lg">
                    Không tìm thấy giảng viên phù hợp
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mentors.map((mentor: any) => {
                    const isRegistered = pendingIds.has(mentor.id);
                    const isAccepted = acceptedIds.has(mentor.id);
                    const isRejected = rejectedIds.has(mentor.id);
                    const isCancelled = cancelledIds.has(mentor.id);

                    return (
                      <MentorRow
                        key={mentor.id}
                        mentor={mentor}
                        isRegistered={isRegistered}
                        isAccepted={isAccepted}
                        isRejected={isRejected}
                        isCancelled={isCancelled}
                        hasAccepted={hasAccepted}
                        onRegister={(mentor) => {
                          setCurrentMentor(mentor);
                          setOpenMessageModal(true);
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-1">
                  <Button
                    label="Trước"
                    size="sm"
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage((prev) => prev - 1)}
                  />

                  {Array.from({ length: totalPages }).map((_, index) => (
                    <Button
                      key={index}
                      label={(index + 1).toString()}
                      size="sm"
                      variant={page === index ? "info" : "outline"}
                      onClick={() => setPage(index)}
                    />
                  ))}

                  <Button
                    label="Sau"
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages - 1}
                    onClick={() => setPage((prev) => prev + 1)}
                  />
                </div>
              )}
            </>
          )}

          {/* ================= REGISTERED TAB ================= */}

          {activeTab === "registered" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {registers.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl bg-gray-50 dark:bg-gray-800 col-span-full">
                  <p className="text-gray-500 dark:text-gray-400">
                    Bạn chưa đăng ký giảng viên nào
                  </p>
                </div>
              ) : (
                registers.map((register: any) => (
                  <RegisterCard
                    key={register.id}
                    register={register}
                    getStatusVariant={getStatusVariant}
                    onView={(r) => console.log(r)}
                    onCancel={(r) => {
                      setSelectedRegister(r);
                      setOpenConfirm(true);
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= MODALS ================= */}

      {currentMentor && (
        <MessageModal
          open={openMessageModal}
          onClose={() => setOpenMessageModal(false)}
          mentor={currentMentor}
        />
      )}

      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        register={selectedRegister}
        status="CANCELLED"
      />
    </div>
  );
};

export default StdRegisterPage;
