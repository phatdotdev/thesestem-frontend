import {
  Calendar,
  CircleX,
  Edit,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  Users,
} from "lucide-react";
import ImageUploader from "../../../components/UI/ImageUploader";
import Input from "../../../components/UI/Input";
import Textarea from "../../../components/UI/TextArea";
import {
  useGetStudentProfileQuery,
  useUpdateStudentAvatarMutation,
  useUpdateStudentProfileMutation,
} from "../../../services/userApi";
import Loader from "../../../components/UI/Loader";
import { useEffect, useState } from "react";
import type { StudentResponse } from "../../../types/student";
import SectionCard from "../../../components/UI/SectionCard";
import Button from "../../../components/UI/Button";
import { formatGender } from "../../../utils/formatters";

const StdProfilePage = () => {
  const { data: data, isLoading, refetch } = useGetStudentProfileQuery();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<null | File>(null);
  const [profile, setProfile] = useState<null | StudentResponse>(null);
  useEffect(() => {
    console.log(data?.data);
    if (data?.data) {
      setProfile(data.data);
      setEmail(data.data.email || "");
      setPhone(data.data.phone || "");
      setAddress(data.data.address || "");
    }
  }, [data]);
  const [editing, setEditing] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [updateStudentProfile] = useUpdateStudentProfileMutation();
  const [updateStudentAvatar] = useUpdateStudentAvatarMutation();

  const resetForm = () => {
    if (!profile) return;

    setEmail(profile.email || "");
    setPhone(profile.phone || "");
    setAddress(profile.address || "");
  };

  const handleUpdateProfile = async () => {
    console.log({
      email,
      phone,
      address,
    });
    try {
      await updateStudentProfile({
        email,
        phone,
        address,
      }).unwrap();

      setEditing(false);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAvatar = async () => {
    const formData = new FormData();
    if (avatar) {
      formData.append("file", avatar);
      await updateStudentAvatar(formData);
    }
    setEditingAvatar(false);
  };

  if (isLoading) return <Loader />;
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* ===== Student Info ===== */}
      <SectionCard title="Thông tin sinh viên" icon={User}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 flex-1 md:flex-none">
            <ImageUploader
              onChange={(file: File) => setAvatar(file)}
              onRemove={() => setAvatar(null)}
              value={profile?.avatarUrl}
              label="Ảnh đại diện"
              ratio="1:1"
              width="w-40"
              disabled={!editingAvatar}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              JPG, PNG tối đa 5MB
            </p>
            <div className="flex justify-end gap-4">
              {!editingAvatar && (
                <Button
                  icon={Edit}
                  label="Thay đổi"
                  size="sm"
                  onClick={() => setEditingAvatar(true)}
                />
              )}
              {editingAvatar && (
                <>
                  <Button
                    icon={Save}
                    label="Lưu"
                    size="sm"
                    onClick={handleSaveAvatar}
                  />
                  <Button
                    icon={CircleX}
                    label="Hủy"
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      {
                        setEditingAvatar(false);
                        resetForm();
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex flex-col flex-1 gap-4 justify-end">
            <div className="flex flex-1 gap-6 items-end flex-wrap md:flex-nowrap">
              <Input
                label="Mã số sinh viên"
                placeholder="2112345"
                iconLeft={IdCard}
                value={profile?.studentCode || ""}
                disabled
                onChange={() => {}}
              />
              <Input
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                iconLeft={User}
                value={profile?.fullName || ""}
                onChange={() => {}}
              />
            </div>

            <div className="flex flex-1 gap-6 flex-wrap md:flex-nowrap">
              <Input
                label="Giới tính"
                placeholder="Nam / Nữ"
                iconLeft={Users}
                value={formatGender(profile?.gender) || "Chưa cập nhật"}
                onChange={() => {}}
              />
              <Input
                label="Ngày sinh"
                type="date"
                iconLeft={Calendar}
                value={profile?.dob || ""}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ===== Contact Info ===== */}
      <SectionCard title="Thông tin liên hệ" icon={Mail}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email"
            placeholder="sv@university.edu.vn"
            iconLeft={Mail}
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing}
          />

          <Input
            label="Số điện thoại"
            placeholder="0123456789"
            iconLeft={Phone}
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Địa chỉ thường trú"
              iconLeft={MapPin}
              rows={3}
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!editing}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          {!editing && (
            <Button
              icon={Edit}
              label="Chỉnh sửa"
              size="sm"
              onClick={() => setEditing(true)}
            />
          )}
          {editing && (
            <>
              <Button
                icon={Save}
                label="Lưu"
                size="sm"
                onClick={handleUpdateProfile}
              />
              <Button
                icon={CircleX}
                label="Hủy"
                size="sm"
                variant="outline"
                onClick={async () => {
                  {
                    setEditing(false);
                    resetForm();
                  }
                }}
              />
            </>
          )}
        </div>
      </SectionCard>

      {/* ===== Academic Info ===== */}
      <SectionCard title="Thông tin học tập" icon={GraduationCap}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Khoa / Bộ môn"
            placeholder="Công nghệ thông tin"
            iconLeft={GraduationCap}
            value={
              profile?.program
                ? `${profile.program.code} - ${profile.program.name}`
                : ""
            }
            onChange={() => {}}
          />

          <Input
            label="Khóa học"
            placeholder="2021 – 2025"
            iconLeft={Calendar}
            disabled
            value={profile?.course.name}
            onChange={() => {}}
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default StdProfilePage;
