import { Landmark } from "lucide-react";
import { useGetCurrentCouncilsQuery } from "../../../services/councilApi";

import CouncilRow from "./CouncilRow";
import { useNavigate } from "react-router-dom";

const LecCouncilPage = () => {
  const { data: councilsResponse } = useGetCurrentCouncilsQuery({});

  const councils = councilsResponse?.data || [];
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 shadow rounded-xl p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Landmark />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Danh sách hội đồng
          </h1>
          <p className="text-sm text-gray-500">Hội đồng mà bạn tham gia</p>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4 grid md:grid-cols-3 ">
        {councils.length === 0 ? (
          <div className="text-center text-gray-400 py-10 border rounded-xl">
            Bạn chưa tham gia hội đồng nào
          </div>
        ) : (
          councils.map((council: any) => (
            <CouncilRow
              onClick={() => navigate(council.id)}
              council={council}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LecCouncilPage;
