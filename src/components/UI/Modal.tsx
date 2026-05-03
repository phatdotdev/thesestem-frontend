import { X } from "lucide-react";
import { type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
};

const Modal = ({ open, onClose, children, width = "max-w-lg" }: ModalProps) => {
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* MODAL */}
      <div
        className={`relative z-10 w-full ${width} animate-fade-in rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900`}
      >
        {/* CLOSE */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
