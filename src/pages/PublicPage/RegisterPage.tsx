import { Lock, Mail } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <form className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Đăng ký
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tạo tài khoản mới để sử dụng hệ thống
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
          <div className="mb-4">
            <Input
              value={password}
              label="Mật khẩu"
              type="password"
              iconLeft={Lock}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-2">
            <Input
              value={confirmPassword}
              label="Xác nhận mật khẩu"
              type="password"
              iconLeft={Lock}
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={error}
            />
          </div>

          {/* Submit */}
          <Button
            type="button"
            className="mt-4 w-full"
            label="Đăng ký"
            size="md"
            variant="success"
            onClick={handleRegister}
          />

          {/* Divider */}
          <div className="my-5 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
            <span className="text-xs text-gray-400">HOẶC</span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Google */}
          <Button
            className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            icon={FaGoogle}
            label="Đăng ký với Google"
            size="md"
          />

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
