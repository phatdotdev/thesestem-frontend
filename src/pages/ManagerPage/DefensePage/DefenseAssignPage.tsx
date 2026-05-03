import { MdCoPresent } from "react-icons/md";
import { PiBookBookmarkFill } from "react-icons/pi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { TbArrowsExchange } from "react-icons/tb";
import { useSearchCurrentCouncilsQuery } from "../../../services/semApi";
import CouncilRow from "./components/CouncilRow";
import { useSearchCurrentThesesQuery } from "../../../services/thesisApi";
import { useMemo, useState } from "react";
import ThesisRow from "./components/ThesisRow";
import SectionHeader from "../../../components/UI/SectionHeader";
import { useGetCurrentDefensesQuery } from "../../../services/defenseApi";
import type { CouncilResponse } from "../../../types/council";
import type { ThesisResponse } from "../../../types/thesis";
import AssignFormModal from "./components/AssignFormModal";
import type { DefenseResponse } from "../../../types/defense";
import Button from "../../../components/UI/Button";
import { ArrowLeftRight, X } from "lucide-react";
import AssginedThesis from "./components/AssginedThesis";
import ScrollBox from "../../../components/UI/ScrollBox";

const FilterCard = ({ children }: { children: React.ReactNode }) => (
  <div
    className="
    rounded-xl 
    border border-gray-200 dark:border-gray-700
    bg-gray-50/60 dark:bg-gray-800
    p-4 space-y-3 shadow-sm
  "
  >
    {children}
  </div>
);

type UnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

type Props = {
  unitFilter: {
    type: UnitType;
    id: string | null;
    name?: string;
  } | null;
  thesisProgramId: string | null;
  studentCode: string;
  councilCode: string;
};

const DefenseAssignPage = ({
  unitFilter,
  thesisProgramId,
  studentCode,
  councilCode,
}: Props) => {
  const councilSearchForm = useMemo(
    () => ({
      page: 0,
      size: 100,
      code: councilCode.trim() || undefined,
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
    [councilCode, unitFilter],
  );

  const thesisSearchForm = useMemo(
    () => ({
      page: 0,
      size: 100,
      studentCode: studentCode.trim() || undefined,
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
      programId: thesisProgramId || undefined,
    }),
    [studentCode, thesisProgramId, unitFilter],
  );

  const { data: councilsResponse } =
    useSearchCurrentCouncilsQuery(councilSearchForm);
  const { data: thesesResponse } =
    useSearchCurrentThesesQuery(thesisSearchForm);
  const { data: defensesResponse } = useGetCurrentDefensesQuery({
    ...councilSearchForm,
    studentCode: studentCode.trim() || undefined,
    programId: thesisProgramId || undefined,
  });

  const councils = councilsResponse?.data.content || [];
  const theses = thesesResponse?.data.content || [];
  const defenses = defensesResponse?.data || [];

  const addedThesisIds = defenses.map((defense) => defense.thesis.id);
  const assignedThesisCount = new Set(addedThesisIds).size;

  const [selectedCouncil, setSelectedCouncil] =
    useState<CouncilResponse | null>(null);
  const [selectedThesis, setSelectedThesis] = useState<ThesisResponse | null>(
    null,
  );
  const [selectedDefense, setSelectedDefense] =
    useState<DefenseResponse | null>(null);

  const [onAdd, setOnAdd] = useState(false);

  const [currentCouncil, setCurrentCouncil] = useState<CouncilResponse | null>(
    null,
  );
  const [currentThesis, setCurrentThesis] = useState<ThesisResponse | null>(
    null,
  );

  const selectedCouncilDefenses = defenses.filter(
    (defense) => defense.council.id === (currentCouncil?.id || ""),
  );
  const selectedThesisDefenses = defenses.filter(
    (defense) => defense.thesis.id === (currentThesis?.id || ""),
  );

  return (
    <>
      {/* Action Bar */}
      <div className="space-y-3">
        {/* Step indicator */}
        <div className="mb-4 flex items-center justify-center gap-1">
          {[
            { label: "Phân công", done: onAdd },
            { label: "Chọn hội đồng", done: !!selectedCouncil },
            { label: "Chọn luận văn", done: !!selectedThesis },
            { label: "Xác nhận", done: false },
          ].map((step, i, arr) => {
            const isActive = !step.done && arr.slice(0, i).every((s) => s.done);
            return (
              <div key={i} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all
          ${
            step.done
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
              : isActive
                ? "bg-amber-100 text-amber-700 font-semibold dark:bg-amber-900/40 dark:text-amber-300"
                : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
            ${
              step.done
                ? "bg-green-600 text-white"
                : isActive
                  ? "bg-amber-500 text-white"
                  : "bg-gray-300 text-white dark:bg-gray-600"
            }`}
                  >
                    {step.done ? "✓" : i + 1}
                  </span>
                  {step.label}
                </div>

                {i < arr.length - 1 && (
                  <div
                    className={`w-10 h-[2px] mx-1 ${
                      step.done
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
            Trang phân công đang lọc theo học kỳ hiện tại
          </div>
          <div className="flex items-center gap-2">
            {!onAdd && (
              <Button
                label="Phân công"
                icon={ArrowLeftRight}
                size="sm"
                variant="primary"
                onClick={() => setOnAdd(true)}
              />
            )}

            {onAdd && (
              <Button
                label="Hủy"
                size="sm"
                variant="outline"
                icon={X}
                onClick={() => {
                  setOnAdd(false);
                  setSelectedCouncil(null);
                  setSelectedThesis(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-6">
        {/* LEFT */}
        <div className="space-y-4 col-span-3">
          <FilterCard>
            <SectionHeader
              icon={<MdCoPresent />}
              title="Tìm kiếm hội đồng"
              color="indigo"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Đang lọc theo mã hội đồng và đơn vị từ bộ lọc ở đầu trang.
            </p>
          </FilterCard>

          {/* Council list */}
          <div className="space-y-2.5">
            <SectionHeader
              icon={<HiMiniMagnifyingGlass />}
              title="Danh sách hội đồng"
              count={councils.length}
              color="indigo"
            />
            <ScrollBox height="300px">
              {(councils.length ? councils : []).map((council: any) => (
                <CouncilRow
                  key={council.id}
                  council={council}
                  selected={
                    onAdd
                      ? selectedCouncil?.id === council.id
                      : currentCouncil?.id === council.id
                  }
                  onClick={() => {
                    // luôn set để xem
                    setCurrentCouncil(council);

                    // chỉ set khi đang assign
                    if (onAdd) {
                      setSelectedCouncil((prev) =>
                        prev?.id === council.id ? null : council,
                      );
                    }
                  }}
                />
              ))}
            </ScrollBox>
          </div>

          {/* Assignments */}
          {currentCouncil && (
            <div className="space-y-2.5">
              <SectionHeader
                icon={<TbArrowsExchange />}
                title="Đề tài phân công"
                count={selectedCouncilDefenses.length}
                color="indigo"
              />
              <ScrollBox height="300px">
                {selectedCouncilDefenses.length < 1 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-xs font-semibold text-gray-500">
                      Chưa phân công đề tài nào
                    </p>
                  </div>
                ) : (
                  <div>
                    {selectedCouncilDefenses.map((defense) => (
                      <AssginedThesis
                        key={defense.id}
                        onEdit={() => setSelectedDefense(defense)}
                        onDelete={() => {}}
                        defense={defense}
                      />
                    ))}
                  </div>
                )}
              </ScrollBox>
            </div>
          )}
        </div>

        {/* ═══════════════ RIGHT: THESIS ═══════════════ */}
        <div className="space-y-4 col-span-2">
          <FilterCard>
            <SectionHeader
              icon={<PiBookBookmarkFill />}
              title="Tìm kiếm luận văn"
              color="teal"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Đang lọc theo mã sinh viên, đơn vị và ngành từ bộ lọc ở đầu trang.
            </p>
          </FilterCard>

          {/* Thesis list */}
          <div className="space-y-2.5">
            <SectionHeader
              icon={<HiMiniMagnifyingGlass />}
              title="Danh sách luận văn"
              count={theses.length}
              color="teal"
            />
            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                Tổng: {theses.length}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                Đã phân công: {assignedThesisCount}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                Chưa phân công:{" "}
                {Math.max(theses.length - assignedThesisCount, 0)}
              </span>
            </div>
            <ScrollBox height="300px">
              {theses.map((thesis: any) => (
                <ThesisRow
                  isAssigned={addedThesisIds.includes(thesis.id)}
                  added={addedThesisIds.includes(thesis.id) && onAdd}
                  key={thesis.id}
                  thesis={thesis}
                  selected={
                    onAdd
                      ? selectedThesis?.id === thesis.id
                      : currentThesis?.id === thesis.id
                  }
                  onClick={() => {
                    setCurrentThesis(thesis);

                    if (onAdd) {
                      setSelectedThesis((prev) =>
                        prev?.id === thesis.id ? null : thesis,
                      );
                    }
                  }}
                />
              ))}
            </ScrollBox>
          </div>

          {/* Assignments */}
          {currentThesis && (
            <div className="space-y-2.5">
              <SectionHeader
                icon={<TbArrowsExchange />}
                title="Hội đồng phân công"
                count={selectedThesisDefenses.length}
                color="indigo"
              />
              <ScrollBox height="220px">
                {selectedThesisDefenses.length < 1 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-xs font-semibold text-gray-500">
                      Chưa phân công đề tài nào
                    </p>
                  </div>
                ) : (
                  <div>
                    {selectedThesisDefenses.map((defense) => (
                      <AssginedThesis
                        key={defense.id}
                        onEdit={() => setSelectedDefense(defense)}
                        onDelete={() => {}}
                        defense={defense}
                      />
                    ))}
                  </div>
                )}
              </ScrollBox>
            </div>
          )}
        </div>
        {/* Modals */}
        <AssignFormModal
          thesis={selectedThesis}
          council={selectedCouncil}
          defense={selectedDefense}
          onClose={() => {
            setSelectedCouncil(null);
            setSelectedDefense(null);
            setSelectedThesis(null);
            setOnAdd(false);
          }}
        />
      </div>
    </>
  );
};

export default DefenseAssignPage;
