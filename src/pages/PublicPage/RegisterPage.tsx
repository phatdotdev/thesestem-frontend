import { Building2, KeyRound, Lock, Mail, MapPin, Phone } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

import { useAppDispatch } from "../../app/hook";
import { addToast } from "../../features/notification/toastSlice";

import {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useCreateOrganizationMutation,
} from "../../services/authApi";
import Select from "../../components/UI/Select";

type RegisterStep = 1 | 2 | 3;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState<RegisterStep>(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [orgEmail, setOrgEmail] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [orgType, setOrgType] = useState("COLLEGE");
  const [orgAddress, setOrgAddress] = useState("");

  const [error, setError] = useState("");

  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const [verifyEmail, { isLoading: verifyLoading }] = useVerifyEmailMutation();

  const [resendVerificationEmail, { isLoading: resendLoading }] =
    useResendVerificationEmailMutation();

  const [createOrganization, { isLoading: orgLoading }] =
    useCreateOrganizationMutation();

  // STEP 1
  const handleStepOne = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin tài khoản.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu cần tối thiểu 6 ký tự.");
      return;
    }

    try {
      setError("");

      await register({
        username: email,
        password,
      }).unwrap();

      setStep(2);

      dispatch(
        addToast({
          type: "success",
          message: "Mã xác thực đã được gửi tới email của bạn.",
        }),
      );
    } catch (err: any) {
      setError(err?.data?.message || "Đăng ký thất bại");
    }
  };

  // STEP 2
  const handleStepTwo = async () => {
    if (!verificationCode.trim()) {
      setError("Vui lòng nhập mã xác thực.");
      return;
    }

    try {
      setError("");

      await verifyEmail({
        email,
        code: verificationCode,
      }).unwrap();

      setStep(3);

      dispatch(
        addToast({
          type: "success",
          message: "Xác thực email thành công.",
        }),
      );
    } catch (err: any) {
      setError(err?.data?.message || "Mã xác thực không đúng");
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    try {
      await resendVerificationEmail(email).unwrap();

      dispatch(
        addToast({
          type: "info",
          message: "Đã gửi lại mã xác thực",
        }),
      );
    } catch (err: any) {
      setError(err?.data?.message || "Không thể gửi lại mã");
    }
  };

  // STEP 3
  const handleCreateOrganization = async () => {
    if (!orgName || !orgCode || !orgEmail || !orgPhone || !orgAddress) {
      setError("Vui lòng nhập đầy đủ thông tin tổ chức.");
      return;
    }

    try {
      setError("");

      await createOrganization({
        email,
        orgName,
        orgCode,
        orgEmail,
        orgPhone,
        orgAddress,
        orgType,
      }).unwrap();

      dispatch(
        addToast({
          type: "success",
          message: "Tạo tổ chức thành công. Bạn có thể đăng nhập.",
        }),
      );

      navigate("/login");
    } catch (err: any) {
      setError(err?.data?.message || "Tạo tổ chức thất bại");
    }
  };

  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(1, prev - 1) as RegisterStep);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Đăng ký
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Tạo tài khoản mới để sử dụng hệ thống
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6 grid grid-cols-3 gap-2 text-center text-xs font-medium">
            <div
              className={`rounded-md px-2 py-2 ${
                step >= 1
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              1. Tài khoản
            </div>

            <div
              className={`rounded-md px-2 py-2 ${
                step >= 2
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              2. Xác thực email
            </div>

            <div
              className={`rounded-md px-2 py-2 ${
                step >= 3
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              3. Tạo tổ chức
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <Input
                value={email}
                label="Email"
                type="email"
                iconLeft={Mail}
                placeholder="you@email.com"
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="mt-4">
                <Input
                  value={password}
                  label="Mật khẩu"
                  type="password"
                  iconLeft={Lock}
                  placeholder="••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  value={confirmPassword}
                  label="Xác nhận mật khẩu"
                  type="password"
                  iconLeft={Lock}
                  placeholder="••••••"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button
                type="button"
                className="mt-4 w-full"
                label={registerLoading ? "Đang xử lý..." : "Tiếp tục"}
                variant="success"
                onClick={handleStepOne}
              />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="mb-4 text-sm text-blue-600">
                Mã xác thực đã được gửi tới {email}
              </div>

              <Input
                value={verificationCode}
                label="Mã xác thực"
                type="text"
                iconLeft={KeyRound}
                placeholder="Nhập OTP"
                onChange={(e) => setVerificationCode(e.target.value)}
              />

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  label="Quay lại"
                  className="w-1/2"
                  onClick={goBack}
                />

                <Button
                  type="button"
                  variant="success"
                  label={verifyLoading ? "Đang xác thực..." : "Xác thực"}
                  className="w-1/2"
                  onClick={handleStepTwo}
                />
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <Input
                value={orgName}
                label="Tên tổ chức"
                iconLeft={Building2}
                onChange={(e) => setOrgName(e.target.value)}
              />

              <div className="mt-4">
                <Input
                  value={orgCode}
                  label="Mã tổ chức"
                  iconLeft={KeyRound}
                  onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                />
              </div>

              <div className="mt-4">
                <Select
                  value={orgType}
                  options={[{ value: "COLLEGE", label: "Trường đại học" }]}
                  onChange={(e) => setOrgType(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  value={orgEmail}
                  label="Email tổ chức"
                  iconLeft={Mail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  value={orgPhone}
                  label="Số điện thoại"
                  iconLeft={Phone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Input
                  value={orgAddress}
                  label="Địa chỉ"
                  iconLeft={MapPin}
                  onChange={(e) => setOrgAddress(e.target.value)}
                />
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  label="Quay lại"
                  className="w-1/2"
                  onClick={goBack}
                />

                <Button
                  type="button"
                  variant="success"
                  label={orgLoading ? "Đang tạo..." : "Tạo tổ chức"}
                  className="w-1/2"
                  onClick={handleCreateOrganization}
                />
              </div>
            </>
          )}

          {/* Divider */}
          <div className="my-5 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">HOẶC</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            icon={FaGoogle}
            label="Đăng ký với Google"
            size="md"
            type="button"
          />

          <p className="mt-6 text-center text-sm">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
