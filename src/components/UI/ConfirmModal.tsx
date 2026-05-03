import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { AlertTriangle, CheckCircle2, Info, Trash2 } from "lucide-react";

type ConfirmType = "danger" | "success" | "warning" | "info";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;

  title?: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;

  type?: ConfirmType;
  loading?: boolean;
}

const typeConfig = {
  danger: {
    icon: Trash2,
    color:
      "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
    button: "danger",
  },

  success: {
    icon: CheckCircle2,
    color:
      "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400",
    button: "success",
  },

  warning: {
    icon: AlertTriangle,
    color:
      "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400",
    button: "warning",
  },

  info: {
    icon: Info,
    color:
      "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    button: "primary",
  },
};

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Xác nhận",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  type = "info",
  loading = false,
}: ConfirmModalProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Modal open={open} onClose={onClose} width="max-w-lg">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${config.color}`}
          >
            <Icon size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Footer */}
        <div className="flex justify-end gap-2">
          <Button
            label={cancelText}
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={loading}
          />

          <Button
            label={confirmText}
            variant={config.button as any}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
