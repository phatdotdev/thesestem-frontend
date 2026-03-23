import {
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useGetDefenseByThesisQuery } from "../../../../services/defenseApi";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import AvatarInitial from "../../../../components/UI/AvatarInitial";
import ScoreCard from "./ScoreCard";

const ThesisResultPage = () => {
  const { "thesis-id": id } = useParams();
  const { data: defenseResponse, isLoading } = useGetDefenseByThesisQuery(
    id as string,
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">
        Đang tải kết quả...
      </div>
    );

  const defense = defenseResponse?.data;

  if (!defense)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">
        Không có thông tin bảo vệ
      </div>
    );

  const scores = defense?.scores || [];
  const averageScore = scores.length
    ? (
        scores.reduce((sum: number, s: any) => sum + s.score, 0) / scores.length
      ).toFixed(2)
    : null;

  const isPass = averageScore && Number(averageScore) >= 5;

  return (
    <div className="space-y-5 mt-4 p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
      {/* HEADER */}
      <div className="overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-500 dark:text-indigo-300 shrink-0">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Bảo vệ luận văn
            </h1>

            <p className="text-sm text-gray-400 dark:text-gray-500">
              Thông tin hội đồng và kết quả bảo vệ
            </p>
          </div>
        </div>
      </div>

      {/* TIME & LOCATION */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Thời gian & địa điểm
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              icon: <Clock size={14} />,
              label: "Thời gian",
              value: dayjs(defense.defenseTime).format("HH:mm — DD/MM/YYYY"),
            },
            {
              icon: <MapPin size={14} />,
              label: "Địa điểm",
              value: defense.location || "Chưa có",
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3"
            >
              <span className="text-gray-400 dark:text-gray-500 shrink-0">
                {icon}
              </span>

              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">
                  {label}
                </p>

                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COUNCIL */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Thành viên hội đồng
        </h2>

        <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {defense.council.members.map((m: any) => (
            <div
              key={m.id}
              className="flex items-center justify-between px-5 py-3 bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-3">
                <AvatarInitial fullName={m.lecturer.fullName} />

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {m.lecturer.fullName}
                  </p>

                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    {m.lecturer.email}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 shrink-0">
                {m.role.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RESULT */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Kết quả bảo vệ
        </h2>

        <div className="space-y-4">
          {/* Average score */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">
                Điểm trung bình
              </p>

              <p
                className={`text-3xl font-bold mt-1 ${
                  !averageScore
                    ? "text-gray-400 dark:text-gray-500"
                    : isPass
                      ? "text-emerald-600 dark:text-emerald-300"
                      : "text-red-500 dark:text-red-300"
                }`}
              >
                {averageScore ?? "—"}

                {averageScore && (
                  <span className="text-base font-normal text-gray-400 dark:text-gray-500 ml-1">
                    / 10
                  </span>
                )}
              </p>
            </div>

            {averageScore && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${
                  isPass
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300"
                    : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300"
                }`}
              >
                {isPass ? <CheckCircle size={15} /> : <XCircle size={15} />}
                {isPass ? "Đạt" : "Không đạt"}
              </div>
            )}
          </div>

          {/* Score cards */}
          {scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 gap-1.5">
              <Star size={24} className="text-gray-200 dark:text-gray-700" />
              <p className="text-sm">Chưa có giảng viên chấm điểm</p>
            </div>
          ) : (
            <div className="space-y-2">
              {scores.map((s: any) => (
                <ScoreCard key={s.id} score={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThesisResultPage;
