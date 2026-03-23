import { useState } from "react";
import Input from "../../../components/UI/Input";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSearchCurrentDefensesQuery } from "../../../services/defenseApi";
import type { DefenseScore } from "../../../types/defense";

const DefenseScheduleTable = () => {
  const [filters, setFilters] = useState({
    student: "",
    instructor: "",
    council: "",
    thesis: "",
  });

  const { data: defenseResponse } = useSearchCurrentDefensesQuery({});
  const defenses = defenseResponse?.data.content || [];

  const filteredDefenses = defenses.filter((row) => {
    const student = row?.thesis?.student?.fullName?.toLowerCase() || "";
    const instructor = row?.thesis?.mentor?.fullName?.toLowerCase() || "";
    const council = row?.council?.name?.toLowerCase() || "";
    const thesis = row?.thesis?.title?.toLowerCase() || "";

    return (
      student.includes(filters.student.toLowerCase()) &&
      instructor.includes(filters.instructor.toLowerCase()) &&
      council.includes(filters.council.toLowerCase()) &&
      thesis.includes(filters.thesis.toLowerCase())
    );
  });

  return (
    <div className="overflow-auto space-y-6">
      {/* FILTER */}
      <div className="space-y-4 border border-gray-200 rounded-xl p-4 bg-gray-50 dark:bg-gray-800 shadow-sm">
        <div className="flex gap-3 items-center text-gray-700">
          <FaMagnifyingGlass />
          <p className="font-semibold">Tìm kiếm</p>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Input
            placeholder="Sinh viên..."
            value={filters.student}
            onChange={(e) =>
              setFilters({ ...filters, student: e.target.value })
            }
          />
          <Input
            placeholder="GVHD..."
            value={filters.instructor}
            onChange={(e) =>
              setFilters({ ...filters, instructor: e.target.value })
            }
          />
          <Input
            placeholder="Hội đồng..."
            value={filters.council}
            onChange={(e) =>
              setFilters({ ...filters, council: e.target.value })
            }
          />
          <Input
            placeholder="Tên đề tài..."
            value={filters.thesis}
            onChange={(e) => setFilters({ ...filters, thesis: e.target.value })}
          />
        </div>
      </div>

      {/* TITLE */}
      <p className="font-semibold text-gray-700">
        Danh sách phân công ({filteredDefenses.length})
      </p>

      {/* EMPTY */}
      {filteredDefenses.length === 0 ? (
        <div className="text-center py-10 text-gray-400 border rounded-xl">
          Không có dữ liệu
        </div>
      ) : (
        <table className="min-w-[1200px] w-full text-sm border border-gray-300 overflow-hidden">
          {/* HEADER */}
          <thead className="sticky top-0 bg-gray-100 z-10 text-gray-700">
            <tr>
              <th className="border p-2">Sinh viên</th>
              <th className="border p-2">Tên đề tài</th>
              <th className="border p-2">GVHD</th>
              <th className="border p-2 text-center">Thời gian</th>
              <th className="border p-2">Hội đồng</th>

              {filteredDefenses[0]?.council?.members?.map((_, i) => (
                <th key={i} className="border p-2 text-center">
                  Điểm {i + 1}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {filteredDefenses.map((row, index) => {
              const scores: DefenseScore[] = row.scores || [];

              return (
                <tr key={index} className="hover:bg-gray-50">
                  {/* STUDENT */}
                  <td className="border p-2">
                    {row?.thesis?.student?.fullName || "-"}
                  </td>

                  {/* THESIS */}
                  <td className="border p-2 max-w-[250px] truncate">
                    {row?.thesis?.title || "-"}
                  </td>

                  {/* MENTOR */}
                  <td className="border p-2">
                    {row?.thesis?.mentor?.fullName || "-"}
                  </td>

                  {/* TIME */}
                  <td className="border p-2 text-center whitespace-nowrap">
                    {row?.defenseTime
                      ? new Date(row.defenseTime).toLocaleString()
                      : "-"}
                  </td>

                  {/* COUNCIL */}
                  <td className="border p-2 space-y-1">
                    {row?.council?.members?.map((c, i) => (
                      <p key={i} className="truncate text-xs">
                        {c?.lecturer?.fullName}
                      </p>
                    ))}
                  </td>

                  {/* SCORES */}
                  {row?.council?.members?.map((m, i) => {
                    const score = scores.find((s) => s.member.id === m.id);

                    return (
                      <td
                        key={i}
                        className={`border p-2 text-center ${
                          !score
                            ? "bg-red-50 text-red-500"
                            : "text-green-600 font-medium"
                        }`}
                      >
                        {score?.score ?? "Chưa chấm"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DefenseScheduleTable;
