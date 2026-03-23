import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import clsx from "clsx";

interface Props {
  label: string;
  ratio?: "1:1" | "16:9" | "3:4";
  value?: string | null; // URL từ server
  width?: string;
  height?: string;
  className?: string;
  disabled?: boolean;
  cover?: boolean;
  onChange?: (file: File) => void;
  onRemove?: () => void;
}

const ratioMap = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "3:4": "aspect-[3/4]",
};

const ImageUploader = ({
  label,
  ratio = "1:1",
  value,
  width = "w-full",
  height,
  cover,
  disabled,
  className,
  onChange,
  onRemove,
}: Props) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(value ?? null);
  }, [value]);

  const handleFileChange = (file?: File) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange?.(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setPreview(null);
    onRemove?.();
  };

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {/* Label */}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>

      {/* Upload box */}
      <label
        className={clsx(
          "group relative overflow-hidden rounded-xl border-2 border-dashed transition",
          "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900",
          width,
          height ?? ratioMap[ratio],

          disabled
            ? "cursor-not-allowed pointer-events-none"
            : "cursor-pointer hover:border-blue-500",
        )}
      >
        {preview ? (
          <>
            {/* Preview image */}
            <img
              src={preview}
              alt={label}
              className={`w-full h-full ${cover ? "object-cover" : "object-contain"}`}
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1
                         text-white hover:bg-red-500 dark:hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>

            {/* Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/40
                         opacity-0 transition group-hover:opacity-100"
            >
              <span className="rounded-md bg-white/90 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-900/90 dark:text-gray-100">
                Đổi ảnh
              </span>
            </div>
          </>
        ) : (
          <div
            className={clsx(
              "flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400",
              disabled ? "bg-gray-100 dark:bg-gray-800" : "",
            )}
          >
            <ImagePlus size={24} />
            <span className="text-sm">
              Chọn ảnh{" "}
              <span className="opacity-70">({height ? "custom" : ratio})</span>
            </span>
          </div>
        )}

        {/* Input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0])}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
