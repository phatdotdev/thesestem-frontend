import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { useUpdateRegisterRequestStatusMutation } from "../../../services/semApi";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { RegisterResposne } from "../../../types/register";
import Badge from "../../../components/UI/Badge";
import Textarea from "../../../components/UI/TextArea";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  register: RegisterResposne | null;
  status: string;
}

const ConfirmStatusChangeModal = ({
  open,
  onClose,
  register,
  status,
}: ConfirmModalProps) => {
  const [updateRegisterStatus, { isLoading }] =
    useUpdateRegisterRequestStatusMutation();

  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (open) {
      setError(null);
      setResponse("");
    }
  }, [open, register?.id, status]);

  if (!register) return null;

  const handleConfirm = async () => {
    try {
      setError(null);

      await updateRegisterStatus({
        id: register.id,
        data: { status, response },
      }).unwrap();

      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Có lỗi xảy ra");
    }
  };

  const statusMeta =
    status === "ACCEPTED"
      ? {
          title: "Chấp nhận đăng ký",
          badgeVariant: "success" as const,
          badgeLabel: "Chấp nhận",
          icon: CheckCircle2,
          iconTone:
            "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
          confirmVariant: "success" as const,
          confirmLabel: isLoading ? "Đang chấp nhận..." : "Xác nhận chấp nhận",
        }
      : {
          title: "Từ chối đăng ký",
          badgeVariant: "danger" as const,
          badgeLabel: "Từ chối",
          icon: XCircle,
          iconTone:
            "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300",
          confirmVariant: "danger" as const,
          confirmLabel: isLoading ? "Đang từ chối..." : "Xác nhận từ chối",
        };

  const StatusIcon = statusMeta.icon;

  return (
    <Modal open={open} onClose={onClose} width="max-w-lg">
      <div className="space-y-5 p-1">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-3 ${statusMeta.iconTone}`}>
            <StatusIcon size={22} />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {statusMeta.title}
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              Bạn có chắc muốn
              <span className="mx-2 inline-flex align-middle">
                <Badge
                  label={statusMeta.badgeLabel}
                  variant={statusMeta.badgeVariant}
                  size="sm"
                />
              </span>
              đăng ký của sinh viên
              <span className="ml-1 font-semibold text-blue-600 dark:text-blue-300">
                {register.student.fullName}
              </span>
              ?
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>Hành động này không thể hoàn tác.</p>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded-md border border-red-200 dark:border-red-700">
            {error}
          </div>
        )}

        <Textarea
          label="Phản hồi cho sinh viên"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={3}
          placeholder="Nhập lý do hoặc ghi chú để sinh viên nắm rõ"
          disabled={isLoading}
          className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            label="Hủy"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="dark:border-gray-700 dark:text-gray-200"
          />

          <Button
            label={statusMeta.confirmLabel}
            variant={statusMeta.confirmVariant}
            loading={isLoading}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmStatusChangeModal;
