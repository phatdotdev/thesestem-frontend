import { Landmark, Trash, UserPlus } from "lucide-react";
import Modal from "../../../components/UI/Modal";
import type { CouncilRequest, CouncilResponse } from "../../../types/council";
import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";
import { useEffect, useState } from "react";
import Select from "../../../components/UI/Select";
import SearchableLecturerSelect from "./SearchableLecturersSelect";
import { useGetRolesQuery } from "../../../services/catApi";
import {
  useCreateCouncilMutation,
  useUpdateCouncilMutation,
} from "../../../services/semApi";

const CouncilFormModal = ({
  open,
  onClose,
  council,
}: {
  open: boolean;
  onClose: () => void;
  council: CouncilResponse | null;
}) => {
  const [createCouncil] = useCreateCouncilMutation();
  const [updateCouncil] = useUpdateCouncilMutation();

  const [currentCouncil, setCurrentCouncil] = useState<CouncilRequest>({
    name: "",
    code: "",
    members: [],
  });

  const { data: rolesResponse } = useGetRolesQuery();
  const roles = rolesResponse?.data || [];

  useEffect(() => {
    if (council) {
      setCurrentCouncil({
        name: council.name,
        code: council.code,
        members:
          council.members.map((member) => ({
            id: member.id,
            lecturerId: member.lecturer.id,
            roleId: member.role.id,
          })) || [],
      });
    } else {
      setCurrentCouncil({
        name: "",
        code: "",
        members: [],
      });
    }
  }, [council]);

  const handleChange = (field: "name" | "code", value: string) => {
    setCurrentCouncil((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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
    if (council) {
      await updateCouncil({ id: council.id, data: currentCouncil }).unwrap();
    } else {
      console.log(currentCouncil);
      await createCouncil(currentCouncil).unwrap();
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <div className="p-2 flex items-center justify-center bg-blue-100 text-blue-500 rounded-lg">
          <Landmark />
        </div>

        <h2 className="text-lg font-semibold">
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
        />

        <Input
          label="Mã hội đồng"
          placeholder="Nhập mã hội đồng"
          value={currentCouncil.code}
          onChange={(e) => handleChange("code", e.target.value)}
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
          <div key={index} className="flex items-center gap-3 col-span-2">
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
              />
            </div>

            <div className="flex relative top-3">
              <Button
                icon={Trash}
                size="sm"
                variant="danger"
                onClick={() => removeMember(index)}
                className="py-2.5"
              />
            </div>
          </div>
        ))}

        {/* ACTION */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <Button label="Hủy" variant="outline" onClick={onClose} />
          <Button label="Lưu hội đồng" onClick={handleSubmit} />
        </div>
      </div>
    </Modal>
  );
};

export default CouncilFormModal;
