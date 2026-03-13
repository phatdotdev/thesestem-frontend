import { X } from "lucide-react";
import { type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: string;
};

const Modal = ({ open, onClose, children, width = "max-w-lg" }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* MODAL */}
      <div
        className={`relative w-full ${width} bg-white rounded-xl shadow-lg p-6 z-10 animate-fade-in`}
      >
        {/* CLOSE */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Modal;
