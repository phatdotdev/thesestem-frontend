import {
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType,
  FileVideo,
} from "lucide-react";
import type { JSX } from "react";

export const fileTypes: Record<string, { icon: JSX.Element; color: string }> = {
  // PDF
  pdf: {
    icon: <FileText />,
    color: "text-red-500",
  },

  // Word
  doc: {
    icon: <FileText />,
    color: "text-blue-600",
  },
  docx: {
    icon: <FileText />,
    color: "text-blue-600",
  },

  // Excel
  xls: {
    icon: <FileSpreadsheet />,
    color: "text-green-600",
  },
  xlsx: {
    icon: <FileSpreadsheet />,
    color: "text-green-600",
  },
  csv: {
    icon: <FileSpreadsheet />,
    color: "text-green-600",
  },

  // PowerPoint
  ppt: {
    icon: <FileType />,
    color: "text-orange-500",
  },
  pptx: {
    icon: <FileType />,
    color: "text-orange-500",
  },

  // Text
  txt: {
    icon: <FileText />,
    color: "text-gray-600",
  },
  md: {
    icon: <FileText />,
    color: "text-gray-600",
  },

  // Image
  jpg: {
    icon: <FileImage />,
    color: "text-pink-500",
  },
  jpeg: {
    icon: <FileImage />,
    color: "text-pink-500",
  },
  png: {
    icon: <FileImage />,
    color: "text-pink-500",
  },
  gif: {
    icon: <FileImage />,
    color: "text-pink-500",
  },
  webp: {
    icon: <FileImage />,
    color: "text-pink-500",
  },
  svg: {
    icon: <FileImage />,
    color: "text-pink-500",
  },

  // Video
  mp4: {
    icon: <FileVideo />,
    color: "text-purple-500",
  },
  avi: {
    icon: <FileVideo />,
    color: "text-purple-500",
  },
  mov: {
    icon: <FileVideo />,
    color: "text-purple-500",
  },
  mkv: {
    icon: <FileVideo />,
    color: "text-purple-500",
  },

  // Audio
  mp3: {
    icon: <FileAudio />,
    color: "text-yellow-500",
  },
  wav: {
    icon: <FileAudio />,
    color: "text-yellow-500",
  },
  ogg: {
    icon: <FileAudio />,
    color: "text-yellow-500",
  },

  // Code
  js: {
    icon: <FileCode />,
    color: "text-yellow-600",
  },
  ts: {
    icon: <FileCode />,
    color: "text-blue-500",
  },
  java: {
    icon: <FileCode />,
    color: "text-red-600",
  },
  py: {
    icon: <FileCode />,
    color: "text-green-600",
  },
  cpp: {
    icon: <FileCode />,
    color: "text-blue-700",
  },
  c: {
    icon: <FileCode />,
    color: "text-blue-700",
  },
  html: {
    icon: <FileCode />,
    color: "text-orange-600",
  },
  css: {
    icon: <FileCode />,
    color: "text-blue-600",
  },
  json: {
    icon: <FileCode />,
    color: "text-gray-600",
  },
  xml: {
    icon: <FileCode />,
    color: "text-gray-600",
  },

  // Archive
  zip: {
    icon: <FileArchive />,
    color: "text-gray-500",
  },
  rar: {
    icon: <FileArchive />,
    color: "text-gray-500",
  },
  tar: {
    icon: <FileArchive />,
    color: "text-gray-500",
  },
  gz: {
    icon: <FileArchive />,
    color: "text-gray-500",
  },
  "7z": {
    icon: <FileArchive />,
    color: "text-gray-500",
  },
};
