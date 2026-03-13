import { useEffect, useState } from "react";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import { Building2, Mail, Phone, Save } from "lucide-react";
import ImageUploader from "../../components/UI/ImageUploader";
import {
  useGetOrgInfoQuery,
  useUpdateOrgInfoMutation,
  useUpdateOrgMediaMutation,
} from "../../services/orgApi";
import Loader from "../../components/UI/Loader";

const OrgInfoPage = () => {
  const { data: data, isLoading } = useGetOrgInfoQuery();
  const [org, setOrg] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    logoUrl: "",
    coverUrl: "",
    bannerUrl: "",
    managerEmail: "",
  });

  const [media, setMedia] = useState<{
    logo?: File | null;
    cover?: File | null;
    banner?: File | null;
  }>({});

  const [updateOrgInfo] = useUpdateOrgInfoMutation();
  const [updateOrgMedia] = useUpdateOrgMediaMutation();

  useEffect(() => {
    if (data?.data) {
      setOrg(data.data);
    }
  }, [data]);

  const handleChange = (key: string, value: string) => {
    setOrg((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSaveChange = async () => {
    await updateOrgInfo({
      name: org.name,
      code: org.code,
      email: org.email,
      phone: org.phone,
      website: org.website,
      address: org.address,
      description: org.description,
    });

    if (media.logo || media.cover || media.banner) {
      const formData = new FormData();

      if (media.logo) formData.append("logo", media.logo);
      if (media.cover) formData.append("cover", media.cover);
      if (media.banner) formData.append("banner", media.banner);

      await updateOrgMedia(formData);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Thông tin tổ chức
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Quản lý thông tin trường, hình ảnh và tài khoản quản trị
        </p>
      </div>

      {/* ===== Images ===== */}
      <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <h2 className="mb-4 font-medium text-gray-800 dark:text-gray-200">
          Hình ảnh
        </h2>

        <div className="grid grid-cols-12 gap-4">
          {/* Avatar / Logo */}
          <div className="col-span-12 md:col-span-3">
            <ImageUploader
              value={org?.logoUrl}
              label="Avatar / Logo"
              ratio="1:1"
              onChange={(file: File) =>
                setMedia((prev) => ({ ...prev, logo: file }))
              }
              onRemove={() => setMedia((prev) => ({ ...prev, logo: null }))}
            />
          </div>

          {/* Banner dọc */}
          <div className="col-span-12 md:col-span-9">
            <ImageUploader
              value={org?.coverUrl}
              label="Ảnh bìa (dọc)"
              ratio="16:9"
              cover
              onChange={(file: File) =>
                setMedia((prev) => ({ ...prev, cover: file }))
              }
              onRemove={() => setMedia((prev) => ({ ...prev, cover: null }))}
            />
          </div>

          {/* Banner ngang – full width */}
          <div className="col-span-12">
            <ImageUploader
              value={org?.bannerUrl}
              label="Ảnh bìa (ngang)"
              height="h-40 md:h-56"
              onChange={(file: File) =>
                setMedia((prev) => ({ ...prev, banner: file }))
              }
              onRemove={() => setMedia((prev) => ({ ...prev, banner: null }))}
            />
          </div>
        </div>
      </section>

      {/* ===== Org Info ===== */}
      <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <h2 className="mb-4 font-medium text-gray-800 dark:text-gray-200">
          Thông tin tổ chức
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Tên tổ chức"
            iconLeft={Building2}
            value={org.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            label="Tên viết tắt"
            value={org.code || ""}
            onChange={(e) => handleChange("code", e.target.value)}
          />
          <Input
            label="Email"
            iconLeft={Mail}
            value={org.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            label="Số điện thoại"
            iconLeft={Phone}
            value={org.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Input
            label="Website"
            value={org.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
          />
          <Input
            label="Địa chỉ"
            value={org.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Mô tả
          </label>
          <textarea
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm
                       dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            rows={3}
            value={org.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>
      </section>

      {/* ===== Admin Info ===== */}
      <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
        <h2 className="mb-4 font-medium text-gray-800 dark:text-gray-200">
          Tài khoản quản trị
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email đăng nhập"
            iconLeft={Mail}
            value={org?.managerEmail || ""}
            onChange={() => {}}
            disabled
          />
        </div>
      </section>

      {/* ===== Actions ===== */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveChange}
          label="Lưu thay đổi"
          icon={Save}
          size="md"
        />
      </div>
    </div>
  );
};

export default OrgInfoPage;
