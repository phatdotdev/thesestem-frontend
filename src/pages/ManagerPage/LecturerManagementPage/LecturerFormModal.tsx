import { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";
import Select from "../../../components/UI/Select";
import Textarea from "../../../components/UI/TextArea";

import {
  useAddLecturerMutation,
  useUpdateLecturerMutation,
} from "../../../services/userApi";

import {
  useGetCollegesQuery,
  useGetDeparmentsQuery,
  useGetFacultiesQuery,
} from "../../../services/orgApi";

import type {
  AddLecturerRequest,
  LecturerResponse,
  UpdateLecturerRequest,
} from "../../../types/lecturer";

import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/notificationSlice";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Key,
  GraduationCap,
  Building2,
  Cake,
} from "lucide-react";
import Button from "../../../components/UI/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  lecturer: LecturerResponse | null;
}

const LecturerFormModal = ({ open, onClose, lecturer }: Props) => {
  const dispatch = useAppDispatch();

  const [addLecturer] = useAddLecturerMutation();
  const [updateLecturer] = useUpdateLecturerMutation();

  const { data: collegesData } = useGetCollegesQuery();
  const { data: facultiesData } = useGetFacultiesQuery();
  const { data: departmentsData } = useGetDeparmentsQuery();

  const [type, setType] = useState("FACULTY");

  const [form, setForm] = useState<AddLecturerRequest | UpdateLecturerRequest>({
    lecturerCode: "",
    fullName: "",
    gender: "MALE",
    email: "",
    password: "",
    phone: "",
    dob: "",
    address: "",
    collegeId: null,
    facultyId: null,
    departmentId: null,
  });

  useEffect(() => {
    setForm({
      lecturerCode: lecturer?.lecturerCode || "",
      fullName: lecturer?.fullName || "",
      gender: lecturer?.gender || "MALE",
      email: lecturer?.email || "",
      password: "",
      dob: lecturer?.dob || "",
      phone: lecturer?.phone || "",
      address: lecturer?.address || "",
      collegeId: lecturer?.college?.id || null,
      facultyId: lecturer?.faculty?.id || null,
      departmentId: lecturer?.department?.id || null,
    });
  }, [lecturer]);

  const units = useMemo(() => {
    if (type === "COLLEGE") return collegesData?.data || [];
    if (type === "FACULTY") return facultiesData?.data || [];
    if (type === "DEPARTMENT") return departmentsData?.data || [];
    return [];
  }, [type, collegesData, facultiesData, departmentsData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleUnitChange = (value: string) => {
    if (type === "COLLEGE") {
      setForm({ ...form, collegeId: value });
    }

    if (type === "FACULTY") {
      setForm({ ...form, facultyId: value });
    }

    if (type === "DEPARTMENT") {
      setForm({ ...form, departmentId: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.fullName) {
        dispatch(
          addToast({
            id: "",
            type: "error",
            message: "Vui lòng nhập họ tên",
          }),
        );
        return;
      }

      if (lecturer) {
        await updateLecturer({ id: lecturer.id, data: form }).unwrap();

        dispatch(
          addToast({
            id: "",
            type: "success",
            message: "Cập nhật giảng viên thành công!",
          }),
        );
      } else {
        await addLecturer(form).unwrap();

        dispatch(
          addToast({
            id: "",
            type: "success",
            message: "Thêm giảng viên thành công!",
          }),
        );
      }

      onClose();
    } catch (e) {
      console.error(e);
      dispatch(
        addToast({
          id: "",
          type: "error",
          message: "Có lỗi khi thêm giảng viên!",
        }),
      );
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="w-full rounded-xl bg-white px-3">
        {/* Header */}

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <User size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {lecturer ? "Cập nhật giảng viên" : "Thêm giảng viên"}
            </h2>

            <p className="text-xs text-gray-500">
              Nhập thông tin cán bộ thuộc tổ chức
            </p>
          </div>
        </div>

        {/* Form */}

        <div className="grid grid-cols-2 gap-4">
          <Input
            name="lecturerCode"
            label="Mã cán bộ"
            value={form.lecturerCode}
            onChange={handleChange}
            iconLeft={GraduationCap}
            placeholder="Nhập mã giảng viên"
          />

          <Input
            name="fullName"
            label="Họ và tên"
            value={form.fullName}
            onChange={handleChange}
            iconLeft={User}
            placeholder="Nhập tên giảng viên"
          />

          <Input
            name="dob"
            label="Ngày sinh"
            type="date"
            value={form.dob}
            onChange={handleChange}
            iconLeft={Cake}
          />

          <Select
            name="gender"
            label="Giới tính"
            value={form.gender}
            onChange={handleChange}
            iconLeft={User}
            options={[
              { label: "Nam", value: "MALE" },
              { label: "Nữ", value: "FEMALE" },
            ]}
          />

          <Input
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            iconLeft={Mail}
          />

          <Input
            name="password"
            label="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            iconLeft={Key}
          />

          <Input
            name="phone"
            label="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            iconLeft={Phone}
          />

          <div className="col-span-2">
            <Textarea
              name="address"
              label="Địa chỉ"
              value={form.address}
              onChange={handleChange}
              iconLeft={MapPin}
            />
          </div>

          <Select
            name="type"
            label="Đơn vị quản lý"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setForm({
                ...form,
                collegeId: null,
                facultyId: null,
                departmentId: null,
              });
            }}
            iconLeft={Building2}
            options={[
              { label: "Chọn loại đơn vị", value: "" },
              { label: "Trường", value: "COLLEGE" },
              { label: "Khoa", value: "FACULTY" },
              { label: "Bộ môn", value: "DEPARTMENT" },
            ]}
          />

          <Select
            label="Chọn đơn vị"
            value={
              type === "COLLEGE"
                ? form.collegeId || ""
                : type === "FACULTY"
                  ? form.facultyId || ""
                  : form.departmentId || ""
            }
            onChange={(e) => handleUnitChange(e.target.value)}
            iconLeft={Building2}
            options={[
              { label: "Chọn đơn vị", value: "" },
              ...units.map((u: any) => ({
                label: u.name,
                value: u.id,
              })),
            ]}
          />
        </div>

        {/* Footer */}

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onClose} variant="outline" label="Hủy" size="sm" />

          <Button label="Lưu" onClick={handleSubmit} />
        </div>
      </div>
    </Modal>
  );
};

export default LecturerFormModal;
