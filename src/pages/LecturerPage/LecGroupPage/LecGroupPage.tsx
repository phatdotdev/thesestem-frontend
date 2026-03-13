import { Plus, Users, UserCheck } from "lucide-react";
import Button from "../../../components/UI/Button";
import Loader from "../../../components/UI/Loader";
import { useState } from "react";
import GroupForm from "./GroupForm";
import ConfirmModal from "./ConfirmModal";
import {
  useCheckMentorInCurrentSemesterQuery,
  useGetMentorRegistersQuery,
} from "../../../services/semApi";
import { useGetCurrentMentorGroupsQuery } from "../../../services/groupApi";
import type { GroupResponse } from "../../../types/group";
import Badge from "../../../components/UI/Badge";
import type { RegisterResposne } from "../../../types/register";
import { useNavigate } from "react-router-dom";
import RegisterCard from "./RegisterCard";
import GroupCard from "./GroupCard";
import ConfirmStatusChangeModal from "./ConfirmStatusChangeModal";
import SelectGroupModal from "./SelectGroupModal";
import type { StudentResponse } from "../../../types/student";

const LecGroupPage = () => {
  const { data: checkResponse, isLoading } =
    useCheckMentorInCurrentSemesterQuery();

  const { data: registerResposne } = useGetMentorRegistersQuery();

  const { data: groupsResponse, isLoading: groupsLoading } =
    useGetCurrentMentorGroupsQuery();

  const groups: GroupResponse[] = groupsResponse?.data ?? [];
  const registers: RegisterResposne[] = registerResposne?.data || [];

  const [activeTab, setActiveTab] = useState<"groups" | "registers">("groups");

  const [openForm, setOpenForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponse | null>(null);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState<GroupResponse | null>(
    null,
  );

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
  if (isLoading) return <Loader />;

  if (!checkResponse?.data) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6 text-red-500 font-medium">
        Bạn không tham gia hướng dẫn học kỳ này!
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 border-gray-300 shadow">
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between">
        <div className="flex gap-5">
          <div className="p-4 rounded-2xl bg-blue-100 text-blue-600 items-center justify-center">
            <Users size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Quản lý hướng dẫn
            </h1>

            <p className="text-gray-500 mt-1 max-w-xl">
              Quản lý các nhóm sinh viên và theo dõi đăng ký hướng dẫn trong học
              kỳ hiện tại.
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <Badge
            label="Học kỳ đang hoạt động"
            variant="success"
            size="sm"
            dot
          />
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex gap-3 bg-gray-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("groups")}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition ${
              activeTab === "groups"
                ? "bg-white shadow text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Quản lý nhóm
          </button>

          <button
            onClick={() => setActiveTab("registers")}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition flex items-center gap-2 ${
              activeTab === "registers"
                ? "bg-white shadow text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <p>Sinh viên đăng ký</p>
            <p className="p-2 rounded-full bg-blue-100 w-5 h-5 flex justify-center items-center">
              {registers.length}
            </p>
          </button>
        </div>

        {/* ================= TAB 1: GROUPS ================= */}
        {activeTab === "groups" && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-gray-600 text-lg">
                    Danh sách nhóm
                  </h2>

                  <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-600">
                    {groups.length}
                  </span>
                </div>
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
              <div className="text-center py-16 border border-dashed rounded-3xl bg-gray-50">
                <Users className="mx-auto mb-4 text-gray-400" size={36} />
                <p className="font-semibold text-gray-600 text-lg">
                  Chưa có nhóm nào
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Nhấn "Thêm nhóm" để tạo nhóm mới
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="text-center py-16 border border-dashed rounded-3xl bg-gray-50">
                <UserCheck className="mx-auto mb-4 text-gray-400" size={36} />
                <p className="font-semibold text-gray-600 text-lg">
                  Chưa có sinh viên đăng ký
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Khi sinh viên đăng ký hướng dẫn, danh sách sẽ hiển thị tại đây
                </p>
              </div>
            ) : (
              // REGISTER CARD
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {registers.map((register) => (
                  <RegisterCard
                    key={register.id}
                    register={register}
                    onAccept={(r) => {
                      {
                        console.log("accept", r);
                        setOpenStatusChange(true);
                        setCurrentRegister(r);
                        setCurrentStatus("ACCEPTED");
                      }
                    }}
                    onReject={(r) => {
                      console.log("reject", r);
                      setOpenStatusChange(true);
                      setCurrentRegister(r);
                      setCurrentStatus("REJECTED");
                    }}
                    onAdd={(r) => {
                      setOpenGroupForm(true);
                      setCurrentStudent(r.student);
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      <GroupForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        initialData={editingGroup}
      />

      <ConfirmModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        initialData={deletingGroup}
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
  );
};

export default LecGroupPage;
