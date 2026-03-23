import { GraduationCap, Search, User, UserSearch } from "lucide-react";
import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";
import Select from "../../../components/UI/Select";
import {
  useGetStudentRegistersQuery,
  useSearchThesisMentorsQuery,
} from "../../../services/semApi";
import Loader from "../../../components/UI/Loader";
import MessageModal from "./MessageModal";
import { useMemo, useState } from "react";
import type { LecturerResponse } from "../../../types/lecturer";
import Badge from "../../../components/UI/Badge";
import MentorRow from "./MentorRow";
import RegisterCard from "./RegisterCard";
import ConfirmModal from "./ConfirmModal";
import type { RegisterResposne } from "../../../types/register";

const StdRegisterPage = () => {
  const { data, isLoading } = useSearchThesisMentorsQuery({});
  const { data: registerResponse } = useGetStudentRegistersQuery();

  const registers = registerResponse?.data ?? [];
  const mentors = data?.data.content ?? [];

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
    <div className="space-y-6 py-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow rounded-lg">
      {/* ================= HEADER ================= */}

      <div className="bg-white dark:bg-gray-900 px-6 rounded-xl flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-lg">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Đăng ký giảng viên hướng dẫn
            </h1>

            <p className="text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed">
              Tìm kiếm giảng viên phù hợp với đề tài của bạn và yêu cầu hướng
              dẫn.
            </p>
          </div>
        </div>

        <Badge label="Học kỳ đang mở đăng ký" variant="success" size="sm" dot />
      </div>

      {/* ================= CONTENT ================= */}

      <div className="px-6 rounded-xl space-y-8">
        {/* ===== Tabs ===== */}

        <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition ${
              activeTab === "search"
                ? "bg-white dark:bg-gray-900 shadow text-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            Đăng ký giảng viên
          </button>

          <button
            onClick={() => setActiveTab("registered")}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition flex items-center gap-2 ${
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

              <div className="flex gap-4">
                <Input
                  placeholder="Nhập tên giảng viên..."
                  iconLeft={Search}
                  value=""
                />

                <Select options={[{ label: "Chọn khoa", value: "" }]} />
                <Select options={[{ label: "Chọn ngành", value: "" }]} />

                <div className="w-80">
                  <Button label="Tìm kiếm" size="sm" />
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
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
