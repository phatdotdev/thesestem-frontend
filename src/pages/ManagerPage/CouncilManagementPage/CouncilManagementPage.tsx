import { Landmark, Plus } from "lucide-react";
import Button from "../../../components/UI/Button";
import CouncilCard from "./CouncilCard";
import type { CouncilResponse } from "../../../types/council";
import { useSearchCurrentCouncilsQuery } from "../../../services/semApi";
import CouncilFormModal from "./CouncilFormModal";
import { useState } from "react";

const CouncilManagementPage = () => {
  const { data: councilsResponse } = useSearchCurrentCouncilsQuery({
    page: 0,
    size: 6,
  });
  const councils = councilsResponse?.data.content || [];
  const [openForm, setOpenForm] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState<CouncilResponse | null>(
    null,
  );
  return (
    <div className="bg-white shadow rounded-lg border border-gray-300 p-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-6">
        {/* left */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600">
            <Landmark size={26} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Quản lý hội đồng luận văn
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý vai trò giảng viên trong hội đồng chấm luận văn như chủ
              tịch, thư ký và phản biện.
            </p>
          </div>
        </div>
        {/* right */}
        {/* Semester */}
        <div className="px-4 py-2 rounded-lg bg-gray-100 text-xs text-gray-700 font-semibold">
          Học kỳ hiện tại: <span className="text-blue-500">HK1 2026</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-semibold text-lg text-gray-800">
          Danh sách hội đồng
        </div>
        <div>
          <Button
            label="Thêm hội đồng"
            icon={Plus}
            size="sm"
            onClick={() => {
              {
                setEditingCouncil(null);
                setOpenForm(true);
              }
            }}
          />
        </div>
      </div>
      {/* LIST */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {councils.map((council) => (
          <CouncilCard
            key={council.id}
            council={council}
            onEditing={() => {
              {
                setEditingCouncil(council);
                setOpenForm(true);
              }
            }}
          />
        ))}
      </div>
      <CouncilFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        council={editingCouncil}
      />
    </div>
  );
};

export default CouncilManagementPage;
