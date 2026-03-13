import { useMemo, useState } from "react";
import {
  LuFolder,
  LuFileText,
  LuFileCode,
  LuFileSpreadsheet,
  LuUpload,
  LuChevronRight,
} from "react-icons/lu";
import Badge from "../../../../components/UI/Badge";

type ItemType = "ALL" | "FOLDER" | "FILE";

interface DocumentItem {
  id: string;
  name: string;
  type: "FOLDER" | "FILE";
  fileType?: "pdf" | "docx" | "xlsx" | "code";
  updatedAt: string;
  size?: string;
}

const mockData: DocumentItem[] = [
  {
    id: "1",
    name: "Tài liệu nghiên cứu",
    type: "FOLDER",
    updatedAt: "2026-03-01",
  },
  {
    id: "2",
    name: "Báo cáo tiến độ.docx",
    type: "FILE",
    fileType: "docx",
    size: "1.2 MB",
    updatedAt: "2026-02-25",
  },
  {
    id: "3",
    name: "Dataset.xlsx",
    type: "FILE",
    fileType: "xlsx",
    size: "2.8 MB",
    updatedAt: "2026-02-20",
  },
  {
    id: "4",
    name: "Source Code",
    type: "FOLDER",
    updatedAt: "2026-02-28",
  },
  {
    id: "5",
    name: "Thesis_Final.pdf",
    type: "FILE",
    fileType: "pdf",
    size: "3.5 MB",
    updatedAt: "2026-03-02",
  },
];

const getFileIcon = (fileType?: string) => {
  switch (fileType) {
    case "pdf":
    case "docx":
      return <LuFileText size={28} className="text-blue-600" />;
    case "xlsx":
      return <LuFileSpreadsheet size={28} className="text-green-600" />;
    case "code":
      return <LuFileCode size={28} className="text-purple-600" />;
    default:
      return <LuFileText size={28} className="text-gray-600" />;
  }
};

const MentorDocumentPage = () => {
  const [filter, setFilter] = useState<ItemType>("ALL");

  const filteredItems = useMemo(() => {
    if (filter === "ALL") return mockData;
    return mockData.filter((item) => item.type === filter);
  }, [filter]);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Tài liệu nhóm
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý và chia sẻ tài liệu giữa giảng viên và sinh viên.
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
            <span>Trang chủ</span>
            <LuChevronRight size={14} />
            <span className="font-medium text-gray-700">Tài liệu</span>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
          <LuUpload size={16} />
          Tải lên
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 flex-wrap">
        <Badge
          label="Tất cả"
          onClick={() => setFilter("ALL")}
          variant={filter === "ALL" ? "primary" : "outline"}
        />
        <Badge
          label="Thư mục"
          onClick={() => setFilter("FOLDER")}
          variant={filter === "FOLDER" ? "warning" : "outline"}
        />
        <Badge
          label="Tập tin"
          onClick={() => setFilter("FILE")}
          variant={filter === "FILE" ? "success" : "outline"}
        />
      </div>

      {/* LIST */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-3xl bg-gray-50">
          <p className="font-semibold text-gray-600 text-lg">
            Không có tài liệu
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group cursor-pointer bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                {item.type === "FOLDER" ? (
                  <LuFolder size={28} className="text-yellow-500" />
                ) : (
                  getFileIcon(item.fileType)
                )}

                {item.type === "FILE" && (
                  <span className="text-xs text-gray-400">{item.size}</span>
                )}
              </div>

              <h3 className="mt-4 font-semibold text-gray-800 group-hover:text-blue-600 transition line-clamp-1">
                {item.name}
              </h3>

              <p className="text-xs text-gray-500 mt-2">
                Cập nhật: {new Date(item.updatedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorDocumentPage;
