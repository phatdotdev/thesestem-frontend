import { Landmark, Trash, UserPlus } from "lucide-react";
import Modal from "../../../components/UI/Modal";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import type { CouncilRequest, CouncilResponse } from "../../../types/council";
import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";
import { useEffect, useMemo, useState } from "react";
import Select from "../../../components/UI/Select";
import SearchableLecturerSelect from "./SearchableLecturersSelect";
import { useGetRolesQuery } from "../../../services/catApi";
import {
  useCreateCouncilMutation,
  useUpdateCouncilMutation,
} from "../../../services/semApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";
import {
  useGetCollegesQuery,
  useGetDeparmentsQuery,
  useGetFacultiesQuery,
} from "../../../services/orgApi";

const CouncilFormModal = ({
  open,
  onClose,
  council,
}: {
  open: boolean;
  onClose: () => void;
  council: CouncilResponse | null;
}) => {
  const emptyCouncil: CouncilRequest = {
    name: "",
    code: "",
    members: [],
    collegeId: null,
    facultyId: null,
    departmentId: null,
  };

  const [type, setType] = useState("FACULTY");

  const { data: collegesData } = useGetCollegesQuery();
  const { data: facultiesData } = useGetFacultiesQuery();
  const { data: departmentsData } = useGetDeparmentsQuery();
  const units = useMemo(() => {
    if (type === "COLLEGE") return collegesData?.data || [];
    if (type === "FACULTY") return facultiesData?.data || [];
    if (type === "DEPARTMENT") return departmentsData?.data || [];
    return [];
  }, [type, collegesData, facultiesData, departmentsData]);

  useEffect(() => {
    setCurrentCouncil((prev) => ({
      ...prev,
      collegeId: null,
      facultyId: null,
      departmentId: null,
    }));
  }, [type]);

  const [createCouncil] = useCreateCouncilMutation();
  const [updateCouncil] = useUpdateCouncilMutation();

  const [currentCouncil, setCurrentCouncil] =
    useState<CouncilRequest>(emptyCouncil);
  const [memberToRemoveIndex, setMemberToRemoveIndex] = useState<number | null>(
    null,
  );

  const { data: rolesResponse } = useGetRolesQuery();
  const roles = rolesResponse?.data || [];

  useEffect(() => {
    if (!open) return;

    if (council) {
      let councilType = "FACULTY";

      if (council.department) councilType = "DEPARTMENT";
      else if (council.faculty) councilType = "FACULTY";
      else if (council.college) councilType = "COLLEGE";

      setType(councilType);

      setCurrentCouncil({
        name: council.name,
        code: council.code,
        members:
          council.members.map((member) => ({
            id: member.id,
            lecturerId: member.lecturer.id,
            roleId: member.role.id,
          })) || [],
        collegeId: council?.college?.id || null,
        facultyId: council?.faculty?.id || null,
        departmentId: council?.department?.id || null,
      });
    } else {
      setType("FACULTY");
      setCurrentCouncil(emptyCouncil);
    }
  }, [council, open]);

  const handleChange = (field: "name" | "code", value: string) => {
    setCurrentCouncil((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const dispatch = useAppDispatch();

  const addMember = () => {
    setCurrentCouncil((prev) => ({
      ...prev,
      members: [...prev.members, { lecturerId: "", roleId: "" }],
    }));
  };

  const removeMember = (index: number) => {
    setCurrentCouncil((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
  };

  const handleConfirmRemoveMember = () => {
    if (memberToRemoveIndex === null) return;
    removeMember(memberToRemoveIndex);
    setMemberToRemoveIndex(null);
  };

  const updateMember = (
    index: number,
    field: "lecturerId" | "roleId",
    value: string,
  ) => {
    const newMembers = [...currentCouncil.members];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value,
    };

    setCurrentCouncil((prev) => ({
      ...prev,
      members: newMembers,
    }));
  };

  const handleSubmit = async () => {
    const lecturerIds = currentCouncil.members
      .map((m) => m.lecturerId)
      .filter((id) => id);
    const duplicateLecturer = lecturerIds.find(
      (id, idx) => lecturerIds.indexOf(id) !== idx,
    );

    if (duplicateLecturer) {
      dispatch(
        addToast({
          type: "error",
          message: "Có giảng viên bị chọn trùng lặp!",
        }),
      );
      return;
    }

    const roleIds = currentCouncil.members
      .map((m) => m.roleId)
      .filter((id) => id);
    const duplicateRole = roleIds.find(
      (id, idx) => roleIds.indexOf(id) !== idx,
    );

    if (duplicateRole) {
      dispatch(
        addToast({
          type: "error",
          message: "Có vai trò bị chọn trùng lặp!",
        }),
      );
      return;
    }

    try {
      if (council) {
        await updateCouncil({ id: council.id, data: currentCouncil }).unwrap();
      } else {
        await createCouncil(currentCouncil).unwrap();
      }
      onClose();
    } catch (e) {
      dispatch(
        addToast({
          type: "error",
          message: "Đã có lỗi xảy ra khi lưu hội đồng. Vui lòng thử lại.",
        }),
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 rounded-lg">
          <Landmark />
        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {council ? "Cập nhật hội đồng luận văn" : "Thêm hội đồng luận văn"}
        </h2>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tên hội đồng"
          placeholder="Nhập tên hội đồng"
          value={currentCouncil.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="dark:bg-gray-800 dark:text-gray-100"
        />

        <Input
          label="Mã hội đồng"
          placeholder="Nhập mã hội đồng"
          value={currentCouncil.code}
          onChange={(e) => handleChange("code", e.target.value)}
          className="dark:bg-gray-800 dark:text-gray-100"
        />

        <Select
          label="Loại đơn vị quản lý"
          value={type}
          onChange={(e: any) => setType(e.target.value)}
          options={[
            { value: "COLLEGE", label: "Trường" },
            { value: "FACULTY", label: "Khoa" },
            { value: "DEPARTMENT", label: "Bộ môn" },
          ]}
        />

        <Select
          label="Đơn vị quản lý"
          value={
            type === "COLLEGE"
              ? currentCouncil.collegeId || ""
              : type === "FACULTY"
                ? currentCouncil.facultyId || ""
                : currentCouncil.departmentId || ""
          }
          options={[
            { value: "", label: "Chọn đơn vị" },
            ...units.map((unit: any) => ({
              value: unit.id,
              label: unit.name,
            })),
          ]}
          onChange={(e: any) => {
            const value = e.target.value;

            setCurrentCouncil((prev) => ({
              ...prev,
              collegeId: type === "COLLEGE" ? value : null,
              facultyId: type === "FACULTY" ? value : null,
              departmentId: type === "DEPARTMENT" ? value : null,
            }));
          }}
        />

        {/* ADD MEMBER */}
        <div className="col-span-2 flex justify-end">
          <Button
            size="sm"
            label="Thêm thành viên"
            icon={UserPlus}
            onClick={addMember}
          />
        </div>

        {/* MEMBER LIST */}
        {currentCouncil.members.map((member, index) => (
          <div
            key={index}
            className="flex items-center gap-3 col-span-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md"
          >
            <div className="flex-1">
              <SearchableLecturerSelect
                label="Giảng viên"
                value={member.lecturerId}
                onChange={(id) => updateMember(index, "lecturerId", id)}
              />
            </div>

            <div className="flex-1">
              <Select
                label="Vai trò"
                options={[
                  { value: "", label: "Chọn vai trò" },
                  ...roles.map((role) => ({
                    value: role.id,
                    label: role.name,
                  })),
                ]}
                value={member.roleId}
                onChange={(e: any) =>
                  updateMember(index, "roleId", e.target.value)
                }
                className="dark:bg-gray-800 dark:text-gray-100"
              />
            </div>

            <div className="flex relative top-3">
              <Button
                icon={Trash}
                size="sm"
                variant="danger"
                onClick={() => setMemberToRemoveIndex(index)}
                className="py-2.5"
                title="Xóa giảng viên khỏi hội đồng"
                aria-label="Xóa giảng viên khỏi hội đồng"
              />
            </div>
          </div>
        ))}

        {/* ACTION */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <Button
            label="Hủy"
            variant="outline"
            onClick={onClose}
            className="dark:border-gray-700 dark:text-gray-200"
          />
          <Button label="Lưu hội đồng" onClick={handleSubmit} />
        </div>
      </div>

      <ConfirmModal
        open={memberToRemoveIndex !== null}
        onClose={() => setMemberToRemoveIndex(null)}
        onConfirm={handleConfirmRemoveMember}
        type="danger"
        title="Xác nhận xóa giảng viên"
        description="Bạn có chắc muốn xóa giảng viên này khỏi danh sách thành viên hội đồng không?"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </Modal>
  );
};

export default CouncilFormModal;
