import { Edit, Trash, Users, Landmark } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { CouncilResponse } from "../../../types/council";

const roleColor = (role: string) => {
  switch (role) {
    case "Chủ tịch":
      return "bg-blue-100 text-blue-600";
    case "Thư ký":
      return "bg-purple-100 text-purple-600";
    case "Phản biện":
      return "bg-orange-100 text-orange-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const CouncilCard = ({
  onEditing,
  council,
}: {
  onEditing: () => void;
  council: CouncilResponse;
}) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Landmark size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">{council.name}</h3>
            <p className="text-sm text-gray-500">Mã: {council.code}</p>
          </div>
        </div>
      </div>

      {/* MEMBER LIST */}
      <div className="mt-4 border-t pt-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Users size={16} />
          <span>Thành viên hội đồng</span>
        </div>

        <div className="space-y-2">
          {council.members.map((m) => (
            <div
              key={m.lecturer.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{m.lecturer.fullName}</span>

              <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${roleColor(
                  m.role.name,
                )}`}
              >
                {m.role.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end mt-4 gap-2">
        <Button icon={Edit} size="sm" variant="outline" onClick={onEditing} />
        <Button icon={Trash} size="sm" variant="danger" />
      </div>
    </div>
  );
};

export default CouncilCard;
