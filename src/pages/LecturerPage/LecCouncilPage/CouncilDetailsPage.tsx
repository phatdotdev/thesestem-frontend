import { useNavigate, useParams } from "react-router-dom";
import { useGetCouncilByIdQuery } from "../../../services/councilApi";
import { Landmark, Users, CalendarX, MoveLeft } from "lucide-react";
import { useGetDefensesByCouncilQuery } from "../../../services/defenseApi";
import DefenseCard from "./DefenseCard";
import Button from "../../../components/UI/Button";
import AvatarInitial from "../../../components/UI/AvatarInitial";

const CouncilDetailsPage = () => {
  const { ["org-code"]: code, ["council-id"]: id } = useParams();
  const { data: councilResponse } = useGetCouncilByIdQuery(id as string);
  const { data: defensesResponse } = useGetDefensesByCouncilQuery(id as string);
  const council = councilResponse?.data;
  const navigate = useNavigate();
  if (!council) return null;

  const myMember = council.members?.find((m: any) => m.currentUser);
  const defenses = defensesResponse?.data ?? [];

  return (
    <div className="space-y-6 px-1">
      <div className="flex items-center">
        <Button
          label="Quay lại danh sách hội đồng"
          icon={MoveLeft}
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/${code}/l/councils`)}
        />
      </div>

      {/* ═══════════════════════ COUNCIL HEADER CARD ═══════════════════════ */}
      <div
        className="
        relative overflow-hidden rounded-2xl
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700/60
      "
      >
        {/* Header row */}
        <div className="flex flex-col gap-4 px-4 pb-5 pt-5 sm:px-6 sm:pt-7 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          {/* LEFT */}
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <div
              className="
              h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 sm:h-14 sm:w-14
              bg-gray-50 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              text-gray-600 dark:text-gray-300
            "
            >
              <Landmark size={26} />
            </div>

            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-xl">
                {council.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span
                  className="
                  text-[11px] font-mono font-medium px-2 py-0.5 rounded-md
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  text-gray-500 dark:text-gray-400
                  tracking-widest
                "
                >
                  {council.code}
                </span>

                {myMember && (
                  <span
                    className="
                    text-[11px] font-semibold px-2.5 py-0.5 rounded-full
                    bg-gray-100 dark:bg-gray-800
                    border border-gray-200 dark:border-gray-700
                    text-gray-700 dark:text-gray-300
                  "
                  >
                    Vai trò của bạn: {myMember.role?.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: member count */}
          <div
            className="
            flex items-center gap-1.5 shrink-0
            text-sm text-gray-400 dark:text-gray-500
          "
          >
            <Users size={14} />
            <span>{council.members?.length || 0} thành viên</span>
          </div>
        </div>

        {/* ── MEMBERS SECTION ── */}
        <div
          className="
          border-t border-gray-100 dark:border-gray-800
          px-4 py-5 sm:px-6
        "
        >
          <p
            className="
            text-[10px] uppercase tracking-[0.12em] font-bold mb-4
            text-gray-400 dark:text-gray-500
          "
          >
            Thành viên hội đồng
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {council.members?.map((m: any) => {
              const isMe = m.currentUser;

              return (
                <div
                  key={m.id}
                  className={`
                    group flex items-center gap-3 p-3 rounded-xl border transition-all duration-150
                    ${
                      isMe
                        ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        : "bg-gray-50 dark:bg-gray-800/60 border-gray-100 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-600"
                    }
                  `}
                >
                  {/* Avatar */}
                  <AvatarInitial
                    fullName={m.lecturer?.fullName}
                    size={36}
                    className={
                      isMe
                        ? "border-gray-300 dark:border-gray-600"
                        : "border-gray-200 dark:border-gray-700"
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                      text-sm font-medium truncate
                      ${
                        isMe
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-800 dark:text-gray-100"
                      }
                    `}
                    >
                      {m.lecturer?.fullName} - {m.lecturer?.lecturerCode}
                    </p>
                    <p
                      className={`
                      text-[12px] truncate
                      ${
                        isMe
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-gray-400 dark:text-gray-500"
                      }
                    `}
                    >
                      {m.role?.name}
                    </p>
                  </div>

                  {isMe && (
                    <span
                      className="
                      shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none
                      bg-gray-700 dark:bg-gray-600 text-gray-100
                    "
                    >
                      Bạn
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════ DEFENSE SCHEDULE ═══════════════════════ */}
      <div className="space-y-3">
        {/* Section header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            Danh sách lịch bảo vệ
          </h2>
          <span
            className="
            text-xs font-medium px-2.5 py-1 rounded-full
            bg-gray-100 dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            text-gray-500 dark:text-gray-400
          "
          >
            {defenses.length} đề tài
          </span>
        </div>

        {defenses.length === 0 ? (
          <div
            className="
            flex flex-col items-center justify-center py-16 rounded-2xl
            border border-dashed
            border-gray-200 dark:border-gray-700/60
            bg-white dark:bg-gray-900/50
          "
          >
            <div
              className="
              w-14 h-14 rounded-2xl mb-3 flex items-center justify-center
              bg-gray-50 dark:bg-gray-800
              border border-gray-100 dark:border-gray-700
            "
            >
              <CalendarX
                size={24}
                className="text-gray-300 dark:text-gray-600"
              />
            </div>
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
              Chưa có lịch bảo vệ
            </p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
              Lịch bảo vệ sẽ hiển thị tại đây
            </p>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {defenses.map((d: any) => (
              <DefenseCard
                key={d.id}
                d={d}
                onClick={() => navigate(`defenses/${d.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouncilDetailsPage;
