import Input from "../../../components/UI/Input";
import { MdCoPresent } from "react-icons/md";
import { PiBookBookmarkFill } from "react-icons/pi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { TbArrowsExchange } from "react-icons/tb";
import { useSearchCurrentCouncilsQuery } from "../../../services/semApi";
import CouncilRow from "./components/CouncilRow";
import { useSearchCurrentThesesQuery } from "../../../services/thesisApi";
import { useState } from "react";
import ThesisRow from "./components/ThesisRow";
import SectionHeader from "../../../components/UI/SectionHeader";
import { useGetCurrentDefensesQuery } from "../../../services/defenseApi";
import type { CouncilResponse } from "../../../types/council";
import type { ThesisResponse } from "../../../types/thesis";
import AssignFormModal from "./components/AssignFormModal";
import type { DefenseResponse } from "../../../types/defense";
import Button from "../../../components/UI/Button";
import { ArrowLeftRight, Check, Info, X } from "lucide-react";
import AssginedThesis from "./components/AssginedThesis";
import Badge from "../../../components/UI/Badge";
import ScrollBox from "../../../components/UI/ScrollBox";

const FilterCard = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3 shadow-sm">
    {children}
  </div>
);

const DefenseAssignPage = () => {
  const { data: councilsResponse } = useSearchCurrentCouncilsQuery({});
  const { data: thesesResponse } = useSearchCurrentThesesQuery({});
  const { data: defensesResponse } = useGetCurrentDefensesQuery({});

  const councils = councilsResponse?.data.content || [];
  const theses = thesesResponse?.data.content || [];
  const defenses = defensesResponse?.data || [];

  const addedThesisIds = defenses.map((defense) => defense.thesis.id);

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
    (defense) => defense.council.id === (currentThesis?.id || ""),
  );

  return (
    <>
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {onAdd ? (
            <>
              {!selectedCouncil && (
                <Badge label="Chọn hội đồng" icon={Info} variant="warning" />
              )}
              {!selectedThesis && (
                <Badge label="Chọn luận văn" icon={Info} variant="warning" />
              )}
              {selectedThesis && selectedCouncil && (
                <Badge
                  label="Hội đồng và luận văn đã được chọn"
                  icon={Check}
                  variant="success"
                />
              )}
            </>
          ) : (
            <Badge
              label="Chọn phân công để thêm phân công"
              variant="warning"
              icon={Info}
            />
          )}
        </div>
        <div className="flex gap-3 justify-end items-center">
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
                  {
                    setOnAdd(false);
                    setSelectedCouncil(null);
                    setSelectedThesis(null);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* LEFT */}
        <div className="space-y-4 col-span-3">
          {/* Filter */}
          <FilterCard>
            <SectionHeader
              icon={<MdCoPresent />}
              title="Tìm kiếm hội đồng"
              color="indigo"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Mã hội đồng" />
              <Input placeholder="Tên hội đồng" />
            </div>
          </FilterCard>

          {/* Council list */}
          <div className="space-y-2.5">
            <SectionHeader
              icon={<HiMiniMagnifyingGlass />}
              title="Danh sách hội đồng"
              count={councils.length || 3}
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
                count={0}
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
          {/* Filter */}
          <FilterCard>
            <SectionHeader
              icon={<PiBookBookmarkFill />}
              title="Tìm kiếm luận văn"
              color="teal"
            />
            <Input placeholder="Nhập tên luận văn..." />
          </FilterCard>

          {/* Thesis list */}
          <div className="space-y-2.5">
            <SectionHeader
              icon={<HiMiniMagnifyingGlass />}
              title="Danh sách luận văn"
              count={theses.length}
              color="teal"
            />
            <ScrollBox height="300px">
              {theses.map((thesis: any) => (
                <ThesisRow
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
                count={0}
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
                  <div></div>
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
            {
              setSelectedCouncil(null);
              setSelectedDefense(null);
              setSelectedDefense(null);
              setOnAdd(false);
            }
          }}
        />
      </div>
    </>
  );
};

export default DefenseAssignPage;
