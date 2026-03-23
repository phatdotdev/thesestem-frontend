import { useNavigate, useParams } from "react-router-dom";
import { useGetCouncilByIdQuery } from "../../../services/councilApi";
import { Landmark, Users, CalendarX } from "lucide-react";
import { getColor } from "../../../utils/getColor";
import { getInitials } from "../../../utils/getInitials";
import { useGetDefensesByCouncilQuery } from "../../../services/defenseApi";
import DefenseCard from "./DefenseCard";

const CouncilDetailsPage = () => {
  const { ["council-id"]: id } = useParams();
  const { data: councilResponse } = useGetCouncilByIdQuery(id as string);
  const { data: defensesResponse } = useGetDefensesByCouncilQuery(id as string);
  const council = councilResponse?.data;
  const navigate = useNavigate();
  if (!council) return null;

  const myMember = council.members?.find((m: any) => m.currentUser);
  const defenses = defensesResponse?.data ?? [];

  return (
    <div className="space-y-5">
      {/* ═══════════════════════ COUNCIL HEADER CARD ═══════════════════════ */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 flex items-start justify-between gap-6">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shrink-0">
              <Landmark size={28} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-tight">
                {council.name}
              </h1>

              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500 tracking-wide">
                  {council.code}
                </span>

                {myMember && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600">
                    Vai trò của bạn: {myMember.role?.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: member count */}
          <div className="flex items-center gap-1.5 text-sm text-gray-400 shrink-0 mt-1">
            <Users size={14} />
            <span>{council.members?.length || 0} thành viên</span>
          </div>
        </div>

        {/* ── MEMBERS ── */}
        <div className="border-t border-dashed border-gray-100 px-6 py-5">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-3">
            Thành viên hội đồng
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {council.members?.map((m: any) => {
              const isMe = m.currentUser;
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isMe
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-gray-50 border-gray-100 hover:border-gray-200 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${getColor(m.lecturer?.fullName)}`}
                  >
                    {getInitials(m.lecturer?.fullName)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium truncate ${isMe ? "text-indigo-700" : "text-gray-800"}`}
                    >
                      {m.lecturer?.fullName}
                    </p>
                    <p
                      className={`text-[11px] ${isMe ? "text-indigo-400" : "text-gray-400"}`}
                    >
                      {m.role?.name}
                    </p>
                  </div>

                  {isMe && (
                    <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500 text-white leading-none">
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
        <div className="flex items-center justify-between">
          <h2 className="px-2 text-base font-semibold text-gray-800">
            Danh sách lịch bảo vệ
          </h2>
          <span className="text-xs text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
            {defenses.length} đề tài
          </span>
        </div>

        {defenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-gray-200 bg-white text-gray-400">
            <CalendarX size={32} className="mb-2 text-gray-300" />
            <p className="text-sm">Chưa có lịch bảo vệ</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {defenses.map((d: any) => (
              <DefenseCard d={d} onClick={() => navigate(`defenses/${d.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouncilDetailsPage;
