import { useState } from "react";
import { MdCoPresent } from "react-icons/md";
import DefenseViewPage from "./DefenseViewPage";
import DefenseAssignPage from "./DefenseAssignPage";

const DefensePage = () => {
  const [activeTab, setActiveTab] = useState<"view" | "assign">("view");
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
      {/* HEADER */}
      <div className="flex justify-between px-6">
        <div className="flex items-center gap-5">
          {/* Avatar group */}
          <div className="h-16 w-16 rounded-3xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xl">
            <MdCoPresent size={40} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
              Quản lý lịch báo cáo luận văn
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
              Phân công hội đồng luận văn
            </p>
          </div>
        </div>
      </div>

      {/* tab */}
      <div className="flex gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("view")}
          className={`px-5 py-2 text-sm font-medium rounded-xl transition ${
            activeTab === "view"
              ? "bg-white dark:bg-gray-900 shadow text-blue-600 dark:text-blue-300"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          }`}
        >
          Xem phân công
        </button>

        <button
          onClick={() => setActiveTab("assign")}
          className={`px-5 py-2 text-sm font-medium rounded-xl transition ${
            activeTab === "assign"
              ? "bg-white dark:bg-gray-900 shadow text-blue-600 dark:text-blue-300"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
          }`}
        >
          Phân công
        </button>
      </div>

      {activeTab === "view" && <DefenseViewPage />}
      {activeTab === "assign" && <DefenseAssignPage />}
    </div>
  );
};

export default DefensePage;
