import { useState } from "react";
import { Search, Mail, User, Trash2, Eye } from "lucide-react";
import Badge from "../../../../components/UI/Badge";
import Button from "../../../../components/UI/Button";

type MemberStatus = "ACTIVE" | "INACTIVE" | "PENDING";

interface Member {
  id: string;
  name: string;
  email: string;
  studentCode: string;
  role: string;
  joinedAt: string;
  status: MemberStatus;
}

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "vana@university.edu",
    studentCode: "SE150001",
    role: "Leader",
    joinedAt: "01/03/2026",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "thib@university.edu",
    studentCode: "SE150002",
    role: "Member",
    joinedAt: "03/03/2026",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Lê Văn C",
    email: "vanc@university.edu",
    studentCode: "SE150003",
    role: "Member",
    joinedAt: "05/03/2026",
    status: "PENDING",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    email: "thid@university.edu",
    studentCode: "SE150004",
    role: "Member",
    joinedAt: "07/03/2026",
    status: "INACTIVE",
  },
];

const MentorMembersPage = () => {
  const [filter, setFilter] = useState<MemberStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const filteredMembers = mockMembers.filter((member) => {
    const matchStatus = filter === "ALL" || member.status === filter;
    const matchSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.studentCode.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const getStatusColor = (status: MemberStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-red-100 text-red-600";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow rounded-2xl p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thành viên</h1>
        <p className="text-gray-500">
          Danh sách sinh viên thuộc nhóm hướng dẫn
        </p>
      </div>

      {/* FILTER + SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          <Badge
            label="Tất cả"
            onClick={() => setFilter("ALL")}
            className={filter === "ALL" ? "bg-blue-600 text-white" : ""}
          />
          <Badge
            label="Đang hoạt động"
            onClick={() => setFilter("ACTIVE")}
            className={filter === "ACTIVE" ? "bg-green-600 text-white" : ""}
          />
          <Badge
            label="Chờ duyệt"
            onClick={() => setFilter("PENDING")}
            className={filter === "PENDING" ? "bg-yellow-500 text-white" : ""}
          />
          <Badge
            label="Ngưng hoạt động"
            onClick={() => setFilter("INACTIVE")}
            className={filter === "INACTIVE" ? "bg-red-600 text-white" : ""}
          />
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc MSSV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* MEMBER LIST */}
      <div className="grid gap-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            Không có sinh viên nào phù hợp
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-sm transition"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <User className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-800">{member.name}</h2>
                  <p className="text-sm text-gray-500">
                    MSSV: {member.studentCode}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Tham gia: {member.joinedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    member.status,
                  )}`}
                >
                  {member.status}
                </span>

                <span className="text-sm text-gray-600 font-medium">
                  {member.role}
                </span>

                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>

                <Button size="sm" variant="danger">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MentorMembersPage;
