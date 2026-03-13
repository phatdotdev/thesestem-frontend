// pages/org/students/StudentFormModal.tsx
import { useEffect, useState } from "react";
import type { StudentRequest, StudentResponse } from "../../../types/student";
import { useGetCoursesQuery } from "../../../services/catApi";
import Input from "../../../components/UI/Input";
import Select from "../../../components/UI/Select";
import Textarea from "../../../components/UI/TextArea";
import { useGetProgramsQuery } from "../../../services/orgApi";
import {
  useAddStudentMutation,
  useUpdateStudentMutation,
} from "../../../services/userApi";
import Modal from "../../../components/UI/Modal";

interface Props {
  open: boolean;
  student: StudentResponse | null;
  onClose: () => void;
}

const StudentFormModal = ({ open, student, onClose }: Props) => {
  const [createStudent] = useAddStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();

  const { data: programData } = useGetProgramsQuery();
  const { data: coursesData } = useGetCoursesQuery();
  const courses = coursesData?.data || [];
  const programs = programData?.data || [];

  const [form, setForm] = useState<StudentRequest>({
    studentCode: "",
    fullName: "",
    dob: "",
    gender: "MALE",
    email: "",
    password: "",
    phone: "",
    address: "",
    programId: "",
    courseId: "",
  });

  useEffect(() => {
    setForm({
      studentCode: student?.studentCode || "",
      fullName: student?.fullName || "",
      dob: student?.dob || "",
      gender: student?.gender || "MALE",
      email: student?.email || "",
      password: "",
      phone: student?.phone || "",
      address: student?.address || "",
      programId: student?.program?.id || "",
      courseId: student?.course?.id || "",
    });
  }, [student]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (student) {
        await updateStudent({
          id: student?.id,
          data: {
            studentCode: form.studentCode,
            fullName: form.fullName,
            dob: form.dob,
            gender: form.gender,
            email: form.email,
            phone: form.phone,
            address: form.address,
            password: form.password,
            programId: form.programId,
            courseId: form.courseId,
          },
        }).unwrap();
      } else {
        await createStudent({
          studentCode: form.studentCode,
          fullName: form.fullName,
          dob: form.dob,
          gender: form.gender,
          email: form.email,
          phone: form.phone,
          address: form.address,
          password: form.password,
          programId: form.programId,
          courseId: form.courseId,
        }).unwrap();
      }
      onClose();
    } catch (e) {}
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="w-full max-w-2xl rounded-xl bg-white p-2">
        <h2 className="mb-4 text-lg font-semibold">
          {student ? "Cập nhật sinh viên" : "Thêm sinh viên"}
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <Input
            name="studentCode"
            value={form.studentCode}
            onChange={handleChange}
            label="Mã sinh viên"
            placeholder="Nhập mã sinh viên"
          />
          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            label="Họ và tên"
            placeholder="Nhập họ tên"
          />
          <Input
            name="dob"
            value={form.dob}
            onChange={handleChange}
            label="Ngày sinh"
            type="date"
          />
          <Select
            label="Giới tính"
            options={[
              {
                label: "Chọn giới tính",
                value: "",
              },
              {
                label: "Nam",
                value: "MALE",
              },
              {
                label: "Nữ",
                value: "FEMALE",
              },
            ]}
            value={form.gender}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />
          <Input
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />
          <Input
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
          />
          <div className="col-span-2">
            <Textarea
              label="Địa chỉ"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <Select
            label="Chương trình"
            options={[
              {
                label: "Chọn chương trình",
                value: "",
              },
              ...programs.map((program: any) => ({
                label: program.name,
                value: program.id,
              })),
            ]}
            onChange={handleChange}
            name="programId"
            value={form.programId}
          />
          <Select
            label="Khóa"
            name="courseId"
            options={[
              { label: "Chọn khóa", value: "" },
              ...courses.map((course: any) => ({
                label: course.name,
                value: course.id,
              })),
            ]}
            onChange={handleChange}
            value={form.courseId}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Lưu
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentFormModal;
