const MOCK_COLLEGES = [
  {
    id: "C1",
    code: "UST-01",
    name: "Đại học Công nghệ",
    description: "Đào tạo kỹ thuật mũi nhọn",
    faculties: [
      {
        id: "F1",
        code: "F-IT",
        name: "Khoa Công nghệ thông tin",
        description: "Tập trung AI và Phần mềm",
        departments: [
          {
            id: "D1",
            code: "S-CS",
            name: "Bộ môn Khoa học máy tính",
            description: "Lý thuyết nền tảng",
          },
          {
            id: "D2",
            code: "S-SE",
            name: "Bộ môn Kỹ thuật phần mềm",
            description: "Quy trình phát triển",
          },
        ],
      },
    ],
  },
  {
    id: "C2",
    code: "UEB-02",
    name: "Đại học Kinh tế",
    description: "Đào tạo quản lý và tài chính",
    faculties: [],
  },
];
import React, { useState } from "react";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { FaUniversity, FaBuilding, FaBook } from "react-icons/fa";

const CollegeManagement = () => {
  const [data, setData] = useState(MOCK_COLLEGES);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "",
    action: "add",
    target: null,
    parentId: null,
  });

  // Toggle đóng mở hàng
  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) newExpandedRows.delete(id);
    else newExpandedRows.add(id);
    setExpandedRows(newExpandedRows);
  };

  // Mở modal (Dùng chung cho cả thêm/sửa các cấp)
  const openModal = (type, action, target = null, parentId = null) => {
    setModalConfig({ type, action, target, parentId });
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Danh sách Trường / Cơ sở
          </h1>
          <p className="text-sm text-gray-500">
            Quản lý cấu trúc phân cấp các đơn vị đào tạo
          </p>
        </div>
        <button
          onClick={() => openModal("Trường", "add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <MdAdd size={20} /> Thêm Trường mới
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Tên đơn vị / Mã</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {data.map((college) => (
              <React.Fragment key={college.id}>
                {/* Trường Row */}
                <RowItem
                  item={college}
                  level={0}
                  icon={<FaUniversity className="text-blue-500" />}
                  onToggle={() => toggleRow(college.id)}
                  isExpanded={expandedRows.has(college.id)}
                  onAdd={() => openModal("Khoa", "add", null, college.id)}
                  onEdit={() => openModal("Trường", "edit", college)}
                />

                {/* Khoa Rows */}
                {expandedRows.has(college.id) &&
                  college.faculties.map((faculty) => (
                    <React.Fragment key={faculty.id}>
                      <RowItem
                        item={faculty}
                        level={1}
                        icon={<FaBuilding className="text-emerald-500" />}
                        onToggle={() => toggleRow(faculty.id)}
                        isExpanded={expandedRows.has(faculty.id)}
                        onAdd={() =>
                          openModal("Bộ môn", "add", null, faculty.id)
                        }
                        onEdit={() => openModal("Khoa", "edit", faculty)}
                      />

                      {/* Bộ môn Rows */}
                      {expandedRows.has(faculty.id) &&
                        faculty.departments.map((dept) => (
                          <RowItem
                            key={dept.id}
                            item={dept}
                            level={2}
                            icon={<FaBook className="text-amber-500" />}
                            onEdit={() => openModal("Bộ môn", "edit", dept)}
                          />
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination Dummy */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center text-sm text-gray-500">
          <span>Hiển thị 1-10 trên 25 trường</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-white transition">
              Trước
            </button>
            <button className="px-3 py-1 border rounded bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded hover:bg-white transition">
              Sau
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CrudModal config={modalConfig} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

// Component con cho từng hàng để tái sử dụng
const RowItem = ({
  item,
  level,
  icon,
  onToggle,
  isExpanded,
  onAdd,
  onEdit,
}) => {
  const indentClass = level === 1 ? "pl-12" : level === 2 ? "pl-20" : "pl-6";

  return (
    <tr
      className={`${level === 0 ? "bg-white font-semibold" : "bg-gray-50/50"} hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition`}
    >
      <td className={`px-6 py-4 flex items-center gap-3 ${indentClass}`}>
        {level < 2 && (
          <button onClick={onToggle} className="text-gray-400">
            {isExpanded ? (
              <MdKeyboardArrowDown size={20} />
            ) : (
              <MdKeyboardArrowRight size={20} />
            )}
          </button>
        )}
        {icon}
        <div>
          <div className="text-gray-800 dark:text-gray-200">{item.name}</div>
          <div className="text-xs text-gray-400 font-mono">{item.code}</div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
        {item.description}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-2">
          {onAdd && (
            <button
              onClick={onAdd}
              className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"
              title="Thêm cấp con"
            >
              <MdAdd size={18} />
            </button>
          )}
          <button
            onClick={onEdit}
            className="p-1.5 text-amber-600 hover:bg-amber-100 rounded"
          >
            <MdEdit size={18} />
          </button>
          <button className="p-1.5 text-red-600 hover:bg-red-100 rounded">
            <MdDelete size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Form Modal dùng chung
const CrudModal = ({ config, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {config.action === "add"
              ? `Thêm mới ${config.type}`
              : `Chỉnh sửa ${config.type}`}
          </h3>
        </div>
        <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mã {config.type}
            </label>
            <input
              type="text"
              defaultValue={config.target?.code}
              placeholder="Ví dụ: UST-01"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên {config.type}
            </label>
            <input
              type="text"
              defaultValue={config.target?.name}
              placeholder={`Tên ${config.type.toLowerCase()}...`}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mô tả
            </label>
            <textarea
              rows="3"
              defaultValue={config.target?.description}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeManagement;
