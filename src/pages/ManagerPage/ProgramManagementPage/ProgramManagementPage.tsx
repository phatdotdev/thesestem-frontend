import { Book, Plus } from "lucide-react";
import Button from "../../../components/UI/Button";
import TrainingProgramForm from "./ProgramManagementForm";
import {
  useDeleteProgramMutation,
  useGetProgramsQuery,
} from "../../../services/orgApi";
import Loader from "../../../components/UI/Loader";
import ProgramTable from "./ProgramTable";
import Badge from "../../../components/UI/Badge";
import { useEffect, useState } from "react";
import type { ProgramResponse } from "../../../types/organization";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

const TrainingProgramManagementPage = () => {
  const { data, isLoading } = useGetProgramsQuery();
  const [deleteProgram, { isLoading: isDeletingProgram }] =
    useDeleteProgramMutation();
  const dispatch = useAppDispatch();

  const programs: ProgramResponse[] = data?.data ?? [];

  /* ================= PAGINATION ================= */

  const pageSize = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(programs.length / pageSize);

  const paginatedPrograms = programs.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  /* nếu xóa hết trang thì quay về trang trước */
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [programs]);

  /* ================= MODAL ================= */

  const [openProgramForm, setOpenProgramForm] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [editingProgram, setEditingProgram] = useState<ProgramResponse | null>(
    null,
  );

  const [deletingProgram, setDeletingProgram] =
    useState<ProgramResponse | null>(null);

  const handleDeleteProgram = async () => {
    if (!deletingProgram) return;

    try {
      await deleteProgram(deletingProgram.id).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: "Xóa chương trình đào tạo thành công",
        }),
      );
      setOpenConfirm(false);
      setDeletingProgram(null);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Không thể xóa chương trình đào tạo",
        }),
      );
    }
  };

  if (isLoading) return <Loader />;

  return (
    <main
      className="
      max-w-7xl mx-auto p-6 font-inter
      bg-white dark:bg-gray-900
      rounded-xl
      border border-gray-200 dark:border-gray-700
      shadow-sm
      space-y-6
      "
    >
      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center gap-4">
        <div className="flex gap-3 items-center">
          <div
            className="
            flex justify-center items-center
            p-4
            bg-blue-100 dark:bg-blue-900/40
            rounded-lg
            text-blue-500 dark:text-blue-400
            "
          >
            <Book size={28} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Chương trình đào tạo
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Quản lý thông tin các chương trình đào tạo
            </p>
          </div>
        </div>

        <Button
          size="sm"
          icon={Plus}
          label="Thêm chương trình"
          onClick={() => {
            setEditingProgram(null);
            setOpenProgramForm(true);
          }}
        />
      </div>

      {/* ================= TABLE ================= */}

      <div
        className="
        border border-gray-200 dark:border-gray-700
        rounded-lg
        overflow-hidden
        "
      >
        {/* title */}
        <div
          className="
          px-4 py-3
          text-lg font-semibold
          text-gray-800 dark:text-gray-200
          bg-gray-50 dark:bg-gray-800
          border-b border-gray-200 dark:border-gray-700
          "
        >
          Danh sách chương trình đào tạo
        </div>

        {programs.length > 0 ? (
          <>
            <ProgramTable
              programs={paginatedPrograms}
              onSelectEditing={(program) => {
                setEditingProgram(program);
                setOpenProgramForm(true);
              }}
              onSelectDeleting={(program) => {
                setDeletingProgram(program);
                setOpenConfirm(true);
              }}
            />

            {/* ================= PAGINATION ================= */}

            <div
              className="
              flex justify-center items-center
              gap-2
              py-4
              border-t
              border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-800
              "
            >
              <Button
                label="Trước"
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              />

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`
                    px-3 py-1 rounded-md text-sm transition
                    ${
                      page === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }
                  `}
                >
                  {index + 1}
                </button>
              ))}

              <Button
                label="Sau"
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              />
            </div>
          </>
        ) : (
          <div
            className="
            flex flex-col items-center justify-center
            h-56
            gap-3
            text-gray-500 dark:text-gray-400
            "
          >
            <Book size={40} className="opacity-40" />

            <Badge label="Chưa có chương trình đào tạo" variant="ghost" />

            <p className="text-sm">Nhấn "Thêm chương trình" để tạo mới</p>
          </div>
        )}
      </div>

      {/* ================= FORM ================= */}

      <TrainingProgramForm
        open={openProgramForm}
        onClose={() => setOpenProgramForm(false)}
        program={editingProgram}
      />

      {/* ================= DELETE ================= */}

      <ConfirmModal
        open={openConfirm}
        onClose={() => {
          setOpenConfirm(false);
          setDeletingProgram(null);
        }}
        onConfirm={handleDeleteProgram}
        type="danger"
        title="Xóa chương trình đào tạo"
        description={`Bạn có chắc chắn muốn xóa chương trình ${deletingProgram?.name || "này"}? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        loading={isDeletingProgram}
      />
    </main>
  );
};

export default TrainingProgramManagementPage;
