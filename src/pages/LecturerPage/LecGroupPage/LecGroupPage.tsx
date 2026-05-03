import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { Plus, UserCheck, Users } from "lucide-react";
import Button from "../../../components/UI/Button";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import Loader from "../../../components/UI/Loader";
import SemesterSelecter from "../../../components/common/SemesterSelecter";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";
import {
  useCheckMentorInCurrentSemesterQuery,
  useGetMentorRegistersQuery,
} from "../../../services/semApi";
import {
  useDeleteGroupMutation,
  useGetCurrentMentorGroupsQuery,
  useLazyGetMentorGroupsBySemesterQuery,
} from "../../../services/groupApi";
import type { GroupResponse } from "../../../types/group";
import type { RegisterResposne } from "../../../types/register";
import type { StudentResponse } from "../../../types/student";
import GroupCard from "./GroupCard";
import GroupForm from "./GroupForm";
import RegisterCard from "./RegisterCard";
import SelectGroupModal from "./SelectGroupModal";
import ConfirmStatusChangeModal from "./ConfirmStatusChangeModal";

const LecGroupPage = () => {
  const { data: checkResponse, isLoading } =
    useCheckMentorInCurrentSemesterQuery();

  const { data: registerResposne } = useGetMentorRegistersQuery();

  const { data: currentGroupsResponse, isLoading: currentGroupsLoading } =
    useGetCurrentMentorGroupsQuery();

  const [
    getGroups,
    { data: semesterGroupsResponse, isLoading: semesterGroupsLoading },
  ] = useLazyGetMentorGroupsBySemesterQuery();

  const [selectedSemesterId, setSelectedSemseterId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (selectedSemesterId) {
      getGroups(selectedSemesterId);
    }
  }, [selectedSemesterId, getGroups]);

  const groups: GroupResponse[] =
    selectedSemesterId === null
      ? (currentGroupsResponse?.data ?? [])
      : (semesterGroupsResponse?.data ?? []);

  const registers: RegisterResposne[] = registerResposne?.data || [];

  const [activeTab, setActiveTab] = useState<"groups" | "registers">("groups");

  const [openForm, setOpenForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponse | null>(null);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<GroupResponse | null>(
    null,
  );

  const dispatch = useAppDispatch();

  const [deleteGroup] = useDeleteGroupMutation();

  const handleDelete = async () => {
    if (!deleteGroup) return;
    try {
      await deleteGroup(deletingGroup?.id as string).unwrap();
      setOpenConfirmModal(false);
      setDeletingGroup(null);
      dispatch(addToast({ type: "success", message: "Xóa nhóm thành công" }));
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Xóa nhóm thất bại" }));
    }
  };

  const groupsLoading =
    selectedSemesterId === null ? currentGroupsLoading : semesterGroupsLoading;

  /* REGISTERS */
  const [openStatusChange, setOpenStatusChange] = useState(false);
  const [currentRegister, setCurrentRegister] =
    useState<RegisterResposne | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string>("");

  /* GROUPS */
  const [openGroupForm, setOpenGroupForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<StudentResponse | null>(
    null,
  );

  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-4 md:p-6 shadow-xl backdrop-blur">
      <div className="relative space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className="
                      h-16 w-16 rounded-3xl
                      bg-white dark:bg-gray-800
                      shadow-md
                      flex items-center justify-center
                      text-blue-600 dark:text-blue-300
                      border border-gray-200 dark:border-gray-700
                    "
            >
              <FaUsers size={36} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                Nhóm luận văn
              </h1>

              <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
                Quản lý các nhóm luận văn hướng dẫn khóa luận mà bạn tham gia.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="md:hidden">
              <SemesterSelecter onChange={setSelectedSemseterId} width="100%" />
            </div>

            <div className="hidden md:block">
              <SemesterSelecter onChange={setSelectedSemseterId} />
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="mt-6">
          {isLoading ? (
            <Loader />
          ) : !checkResponse?.data ? (
            <div className="grid place-items-center rounded-3xl border border-dashed border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/20 px-6 py-20 text-center">
              <div className="mb-4 rounded-2xl bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/50 p-4 text-red-500 dark:text-red-300 shadow-sm">
                <UserCheck size={34} />
              </div>
              <p className="text-lg font-semibold text-red-600 dark:text-red-300">
                Bạn không tham gia hướng dẫn học kỳ này
              </p>
              <p className="mt-2 max-w-md text-sm text-red-500/80 dark:text-red-300/80 leading-6">
                Nếu đây là sai lệch dữ liệu, hãy kiểm tra lại phân công hướng
                dẫn hoặc bộ lọc học kỳ.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Tabs */}
              <div className="inline-flex w-full flex-col gap-2 rounded-3xl bg-gray-100/90 dark:bg-gray-800/80 p-2 sm:w-auto sm:flex-row">
                <button
                  onClick={() => setActiveTab("groups")}
                  className={`inline-flex items-center justify-between gap-3 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    activeTab === "groups"
                      ? "bg-white dark:bg-gray-900 shadow text-blue-600 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <span>Quản lý nhóm</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                    {groups.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("registers")}
                  className={`inline-flex items-center justify-between gap-3 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                    activeTab === "registers"
                      ? "bg-white dark:bg-gray-900 shadow text-blue-600 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  }`}
                >
                  <span>Sinh viên đăng ký</span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    {registers.length}
                  </span>
                </button>
              </div>

              {/* ================= TAB 1: GROUPS ================= */}
              {activeTab === "groups" && (
                <>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Danh sách nhóm
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Xem và quản lý các nhóm đang thuộc học kỳ được chọn.
                      </p>
                    </div>

                    <Button
                      icon={Plus}
                      label="Thêm nhóm"
                      size="sm"
                      onClick={() => {
                        setEditingGroup(null);
                        setOpenForm(true);
                      }}
                    />
                  </div>

                  {groupsLoading ? (
                    <Loader />
                  ) : groups.length === 0 ? (
                    <div className="grid place-items-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60 px-6 py-20 text-center">
                      <div className="mb-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 text-gray-400 dark:text-gray-500 shadow-sm">
                        <Users size={34} />
                      </div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Chưa có nhóm nào
                      </p>
                      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400 leading-6">
                        Nhấn nút thêm nhóm để tạo nhóm mới cho học kỳ đang chọn.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {groups.map((group) => (
                        <GroupCard
                          key={group.id}
                          group={group}
                          onView={(g) => navigate(g.id)}
                          onEdit={(g) => {
                            setEditingGroup(g);
                            setOpenForm(true);
                          }}
                          onDelete={(g) => {
                            setDeletingGroup(g);
                            setOpenConfirmModal(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ================= TAB 2: STUDENT REGISTERS ================= */}
              {activeTab === "registers" && (
                <>
                  {registers.length === 0 ? (
                    <div className="grid place-items-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/60 px-6 py-20 text-center">
                      <div className="mb-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 text-gray-400 dark:text-gray-500 shadow-sm">
                        <UserCheck size={34} />
                      </div>
                      <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        Chưa có sinh viên đăng ký
                      </p>
                      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400 leading-6">
                        Khi sinh viên đăng ký hướng dẫn, danh sách sẽ hiển thị ở
                        đây để bạn duyệt nhanh.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {registers.map((register) => (
                        <RegisterCard
                          key={register.id}
                          register={register}
                          onAccept={(r) => {
                            setOpenStatusChange(true);
                            setCurrentRegister(r);
                            setCurrentStatus("ACCEPTED");
                          }}
                          onReject={(r) => {
                            setOpenStatusChange(true);
                            setCurrentRegister(r);
                            setCurrentStatus("REJECTED");
                          }}
                          onAdd={(r) => {
                            setOpenGroupForm(true);
                            setCurrentStudent(r.student);
                          }}
                          added={groups.some((group) =>
                            group.students.some(
                              (student) => student.id === register.student.id,
                            ),
                          )}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <GroupForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          initialData={editingGroup}
        />

        <ConfirmModal
          title="Xác nhận xóa nhóm"
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          onConfirm={handleDelete}
          type="danger"
        />

        <ConfirmStatusChangeModal
          open={openStatusChange}
          onClose={() => setOpenStatusChange(false)}
          register={currentRegister}
          status={currentStatus}
        />

        <SelectGroupModal
          open={openGroupForm}
          onClose={() => setOpenGroupForm(false)}
          groups={groups}
          student={currentStudent}
        />
      </div>
    </div>
  );
};

export default LecGroupPage;
