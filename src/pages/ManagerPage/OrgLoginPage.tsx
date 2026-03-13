import { Lock, MapPin, User2 } from "lucide-react";
import Input from "../../components/UI/Input";
import { useNavigate, useParams } from "react-router-dom";
import { useSearchOrgInfoByCodeQuery } from "../../services/orgApi";
import { useLoginOrgMutation } from "../../services/authApi";
import { useState } from "react";
import { useAppDispatch } from "../../app/hook";
import { loginSuccess } from "../../features/auth/authSlice";

const OrgLoginPage = () => {
  const { "org-code": orgCode } = useParams();
  const { data } = useSearchOrgInfoByCodeQuery(orgCode as string);
  const [loginOrg] = useLoginOrgMutation();
  const orgInfo = data?.data;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogin = async () => {
    const data = (
      await loginOrg({
        code: orgCode,
        credentials: { username, password },
      }).unwrap()
    ).data;
    dispatch(loginSuccess({ token: data?.accessToken }));
    if (data.role === "LECTURER") navigation(`/${orgCode}/l`);
    if (data.role === "STUDENT") navigation(`/${orgCode}/s`);
  };
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT – HERO */}
      <div
        className="relative hidden lg:flex items-center justify-center"
        style={{
          backgroundImage: `url(${orgInfo?.coverUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl text-center text-white px-8">
          <img
            src={orgInfo?.logoUrl}
            alt="Logo"
            className="mx-auto mb-6 h-24 w-24 rounded-full bg-white/90 p-2"
          />

          <h1 className="text-3xl font-bold">Thesis Management System</h1>
          <p className="mt-2 text-lg font-medium">{orgInfo?.name}</p>

          <p className="mt-4 text-sm opacity-90 leading-relaxed">
            {orgInfo?.description}
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-md font-bold opacity-80">
            <MapPin size={16} />
            <span>{orgInfo?.address}</span>
          </div>
        </div>
      </div>

      {/* RIGHT – FORM */}
      <div className="flex items-center justify-center px-4">
        <form className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Header */}
          <div className="mb-8 text-center">
            <img
              src={orgInfo?.logoUrl}
              alt="organization logo"
              className="mx-auto mb-3 h-14 w-14"
            />

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Đăng nhập tổ chức
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {orgInfo?.name}
            </p>
          </div>

          {/* Username */}
          <div className="mb-4">
            <Input
              label="Mã sinh viên / Mã cán bộ"
              placeholder="Nhập mã đăng nhập"
              iconLeft={User2}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              iconLeft={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="button"
            className="
              w-full rounded-lg bg-blue-600 px-4 py-2.5
              text-white font-medium
              hover:bg-blue-700 transition
            "
            onClick={handleLogin}
          >
            Đăng nhập
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">hoặc</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* OAuth hint */}
          <button
            type="button"
            disabled
            className="
              w-full rounded-lg border border-gray-300 px-4 py-2.5
              text-sm font-medium text-gray-500
              cursor-not-allowed
            "
          >
            Đăng nhập bằng Google (sắp ra mắt)
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            Chỉ dành cho thành viên thuộc tổ chức đã được cấp quyền
          </p>
        </form>
      </div>
    </div>
  );
};

export default OrgLoginPage;
