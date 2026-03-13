import { Lock, Mail } from "lucide-react";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/authApi";
import { useAppDispatch } from "../../app/hook";
import { loginSuccess } from "../../features/auth/authSlice";
import { addToast } from "../../features/notification/notificationSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginApi] = useLoginMutation();
  const handleLogin = async () => {
    if (!email || !password) {
      dispatch(
        addToast({
          type: "error",
          message: "Vui lòng nhập đầy đủ email và mật khẩu!",
        }),
      );
      return;
    }
    try {
      const { data } = await loginApi({
        username: email,
        password,
      }).unwrap();
      dispatch(loginSuccess({ token: data.acessToken }));
      if (data.role === "ADMIN") {
        navigate("/a");
      } else {
        navigate(`/${data.code}/m`);
      }
    } catch (error: any) {
      dispatch(addToast({ type: "error", message: "Đăng nhập thất bại" }));
    }
  };
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Đăng nhập
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Chào mừng bạn quay lại hệ thống
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <Input
              value={email}
              label="Email"
              type="email"
              iconLeft={Mail}
              placeholder="you@email.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <Input
              value={password}
              label="Mật khẩu"
              type="password"
              iconLeft={Lock}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Forgot */}
          <div className="mb-6 text-right">
            <button
              type="button"
              className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit */}
          <Button
            onClick={handleLogin}
            type="button"
            className="w-full"
            label="Đăng nhập"
            size="md"
          />

          {/* Divider */}
          <div className="my-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400">HOẶC</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>
          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            icon={FaGoogle}
            label="Đăng nhập với Google"
            type="button"
            onClick={() => {
              window.location.href = import.meta.env.VITE_OAUTH2_URL;
            }}
            size="md"
          />
          {/* Divider */}
          <div className="my-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400">HOẶC</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
