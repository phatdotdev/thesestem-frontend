import { useParams } from "react-router-dom";
import {
  useGetDefenseByIdForMentorQuery,
  useScoreThesisMutation,
} from "../../../../services/defenseApi";
import Avatar from "../../../../components/UI/Avatar";
import { BookOpen, Star, FileText, ClipboardList } from "lucide-react";
import { useState } from "react";
import Input from "../../../../components/UI/Input";
import Textarea from "../../../../components/UI/TextArea";
import ScoreCard from "./ScoreCard";

/* ── Section wrapper ── */
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Tab = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150
      ${
        active
          ? "bg-white text-indigo-600 shadow-sm border border-gray-200"
          : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
      }`}
  >
    <span className={active ? "text-indigo-500" : "text-gray-400"}>{icon}</span>
    {label}
  </button>
);

const CouncilDefensePage = () => {
  const { "defense-id": id } = useParams();
  const { data: defenseResponse, isLoading } = useGetDefenseByIdForMentorQuery(
    id as string,
  );
  const [activeTab, setActiveTab] = useState<"score" | "content">("score");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ score: "", comment: "" });
  const d = defenseResponse?.data;
  console.log(d);

  const [scoreThesis] = useScoreThesisMutation();

  const submit = async () => {
    await scoreThesis({ id, memberId: d?.member?.id as string, data: form });
    setEditing(false);
  };

  const scored =
    d?.scores?.some((score) => score.member?.id === d?.member?.id) ?? false;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        Đang tải...
      </div>
    );
  if (!d)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        Không có dữ liệu
      </div>
    );

  return (
    <div className="space-y-4">
      {/* ═══ THESIS INFO ═══ */}
      <Section icon={<BookOpen size={15} />} title="Thông tin luận văn">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-800 leading-snug">
            {d.thesis?.title}
          </h1>
          {d.thesis?.titleEn && (
            <p className="text-sm text-gray-400 italic mt-1">
              {d.thesis.titleEn}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Sinh viên thực hiện",
              name: d.thesis?.student?.fullName,
              sub: d.thesis?.student?.studentCode,
            },
            {
              label: "Giảng viên hướng dẫn",
              name: d.thesis?.mentor?.fullName,
              sub: d.thesis?.mentor?.lecturerCode,
            },
          ].map(({ label, name, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
            >
              <Avatar name={name} size="md" />
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {name}
                </p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══ TABS ═══ */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex items-center gap-1 p-1.5 border-b border-gray-200">
          <Tab
            icon={<Star size={14} />}
            label="Chấm điểm"
            active={activeTab === "score"}
            onClick={() => setActiveTab("score")}
          />
          <Tab
            icon={<FileText size={14} />}
            label="Nội dung luận văn"
            active={activeTab === "content"}
            onClick={() => setActiveTab("content")}
          />
        </div>

        {/* ── Tab 1: Chấm điểm ── */}
        {activeTab === "score" && (
          <div className="p-5 space-y-6 bg-white">
            {/* ===== LIST SCORES ===== */}
            <div className="space-y-3">
              {d.scores?.length ? (
                d.scores.map((score) => (
                  <ScoreCard
                    isMe={score.member.id === d?.member?.id}
                    score={score}
                    onEdit={() => {
                      setForm({
                        score: String(score.score),
                        comment: score.comment,
                      });
                      setEditing(true);
                    }}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-gray-200 text-gray-400 gap-1.5">
                  <span className="text-2xl">🗳️</span>
                  <p className="text-sm">Chưa có điểm nào</p>
                </div>
              )}
            </div>

            {/* ===== FORM ===== */}
            {(!scored || editing) && (
              <div className="pt-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Điểm"
                    type="number"
                    min={0}
                    max={10}
                    step={0.1}
                    placeholder="0.0"
                    value={form.score}
                    onChange={(e) =>
                      setForm({ ...form, score: e.target.value })
                    }
                  />
                </div>

                <Textarea
                  rows={4}
                  label="Nhận xét"
                  placeholder="Nhập nhận xét cho luận văn..."
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                />

                <div className="flex justify-end">
                  <button
                    onClick={submit}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium
          hover:bg-indigo-700 active:scale-[0.98] transition-all duration-150"
                  >
                    <Star size={14} />
                    Lưu điểm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Nội dung luận văn ── */}
        {activeTab === "content" && (
          <div className="p-5 bg-white space-y-4">
            {d.thesis?.description ? (
              <div className="space-y-1.5">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  Tóm tắt
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {d.thesis.description}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                <ClipboardList size={32} className="text-gray-200" />
                <p className="text-sm">Chưa có nội dung luận văn</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouncilDefensePage;
