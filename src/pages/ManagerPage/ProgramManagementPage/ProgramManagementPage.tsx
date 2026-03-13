// TrainingProgramManagementPage.tsx
import { Book, Plus } from "lucide-react";
import Button from "../../../components/UI/Button";
import TrainingProgramForm from "./ProgramManagementForm";
import { useGetProgramsQuery } from "../../../services/orgApi";
import Loader from "../../../components/UI/Loader";
import ProgramTable from "./ProgramTable";
import Badge from "../../../components/UI/Badge";
import { useState } from "react";
import type { ProgramResponse } from "../../../types/organization";
import ConfirmModal from "./ConfirmModal";

const TrainingProgramManagementPage = () => {
  const { data: data, isLoading } = useGetProgramsQuery();

  const programs = data?.data;
  const [openProgramForm, setOpenProgramForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramResponse | null>(
    null,
  );
  const [deletingProgram, setDeletingProgram] =
    useState<ProgramResponse | null>(null);
  if (isLoading) return <Loader />;
  return (
    <main className="max-w-7xl mx-auto p-6 font-inter bg-white p-6 rounded-lg border border-gray-300 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          <div className="flex justify-center items-center p-4 bg-blue-100 rounded-lg text-blue-500">
            <Book size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chương trình đào tạo
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý thông tin các chương trình đào tạo dành cho sinh viên
            </p>
          </div>
        </div>

        <Button
          size="sm"
          icon={Plus}
          label="Thêm chương trình"
          onClick={() => {
            {
              setEditingProgram(null);
              setOpenProgramForm(true);
            }
          }}
        />
      </div>

      {/* Content */}
      <div className="mt-6 space-y-2">
        <div className="px-2 py-3 text-lg font-semibold text-gray-800">
          Danh sách chương trình đào tạo
        </div>

        {programs && programs?.length > 0 ? (
          <ProgramTable
            programs={programs}
            onSelectEditing={(program: ProgramResponse | null) => {
              {
                setEditingProgram(program);
                setOpenProgramForm(true);
              }
            }}
            onSelectDeleting={(program: ProgramResponse | null) => {
              {
                setDeletingProgram(program);
                setOpenConfirm(true);
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-50 p-4 text-sm text-gray-500 text-center border border-gray-300 bg-gray-50 rounded-lg">
            <Badge label="(Chưa có dữ liệu)" variant="ghost" />
          </div>
        )}
      </div>

      <TrainingProgramForm
        open={openProgramForm}
        onClose={() => setOpenProgramForm(false)}
        program={editingProgram}
      />
      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        program={deletingProgram}
      />
    </main>
  );
};

export default TrainingProgramManagementPage;
