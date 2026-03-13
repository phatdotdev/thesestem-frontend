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
  Briefcase,
} from "lucide-react";
import ImageUploader from "../../../components/UI/ImageUploader";
import Input from "../../../components/UI/Input";
import Textarea from "../../../components/UI/TextArea";
import {
  useGetLecturerProfileQuery,
  useUpdateLecturerAvatarMutation,
  useUpdateLecturerProfileMutation,
} from "../../../services/userApi";
import Loader from "../../../components/UI/Loader";
import { useEffect, useState } from "react";
import type { LecturerResponse } from "../../../types/lecturer";
import SectionCard from "../../../components/UI/SectionCard";
import Button from "../../../components/UI/Button";
import { formatGender } from "../../../utils/formatters";

const StaffProfilePage = () => {
  const { data, isLoading, refetch } = useGetLecturerProfileQuery();

  const [profile, setProfile] = useState<LecturerResponse | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [editing, setEditing] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const [updateStaffProfile] = useUpdateLecturerProfileMutation();
  const [updateStaffAvatar] = useUpdateLecturerAvatarMutation();

  useEffect(() => {
    if (data?.data) {
      console.log(data.data);
      setProfile(data.data);
      setEmail(data.data.email || "");
      setPhone(data.data.phone || "");
      setAddress(data.data.address || "");
    }
  }, [data]);

  const resetForm = () => {
    if (!profile) return;
    setEmail(profile.email || "");
    setPhone(profile.phone || "");
    setAddress(profile.address || "");
  };

  const handleUpdateProfile = async () => {
    try {
      await updateStaffProfile({
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
    if (!avatar) return;

    const formData = new FormData();
    formData.append("file", avatar);

    try {
      await updateStaffAvatar(formData).unwrap();
      setEditingAvatar(false);
      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* ===== Staff Info ===== */}
      <SectionCard title="Thông tin cán bộ" icon={User}>
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

            <div className="flex gap-4">
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
                    onClick={() => {
                      setEditingAvatar(false);
                      setAvatar(null);
                    }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex flex-col flex-1 gap-4">
            <div className="flex gap-6 flex-wrap md:flex-nowrap">
              <Input
                label="Mã cán bộ"
                iconLeft={IdCard}
                value={profile?.lecturerCode || ""}
                disabled
                onChange={() => {}}
              />

              <Input
                label="Họ và tên"
                iconLeft={User}
                value={profile?.fullName || ""}
                disabled
                onChange={() => {}}
              />
            </div>

            <div className="flex gap-6 flex-wrap md:flex-nowrap">
              <Input
                label="Giới tính"
                iconLeft={Briefcase}
                value={formatGender(profile?.gender) || ""}
                disabled
                onChange={() => {}}
              />

              <Input
                label="Ngày sinh"
                iconLeft={Calendar}
                type="date"
                value={profile?.dob || ""}
                disabled
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
            iconLeft={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editing}
          />

          <Input
            label="Số điện thoại"
            iconLeft={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editing}
          />

          <div className="md:col-span-2">
            <Textarea
              label="Địa chỉ"
              iconLeft={MapPin}
              rows={3}
              value={address}
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
                onClick={() => {
                  setEditing(false);
                  resetForm();
                }}
              />
            </>
          )}
        </div>
      </SectionCard>

      {/* ===== Department Info ===== */}
      <SectionCard title="Thông tin công tác" icon={GraduationCap}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Khoa / Bộ môn"
            iconLeft={GraduationCap}
            value={
              profile?.department
                ? `${profile.department.code} - ${profile.department.name}`
                : ""
            }
            disabled
            onChange={() => {}}
          />

          <Input
            label="Khoa"
            iconLeft={GraduationCap}
            value={profile?.faculty?.name || ""}
            disabled
            onChange={() => {}}
          />

          <Input
            label="Bộ môn"
            iconLeft={GraduationCap}
            value={profile?.department?.name || ""}
            disabled
            onChange={() => {}}
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default StaffProfilePage;
