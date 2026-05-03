import {
  FiFolder,
  FiFileText,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";

import { FolderOpen } from "lucide-react";
import Button from "../../../../components/UI/Button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  useDeleteFileFromGroupMutation,
  useDeleteGroupFolderMutation,
  useGetGroupDocumentsQuery,
  useUploadFileToGroupMutation,
} from "../../../../services/groupApi";

import FolderFormModal from "./FolderFormModal";
import { useFileDownloader } from "../../../../hooks/useFileDownloader";

/* ================= FILE ICON ================= */

const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF":
      return <FiFileText size={40} className="text-red-500" />;
    case "WORD":
      return <FiFileText size={40} className="text-blue-500" />;
    case "EXCEL":
      return <FiFileText size={40} className="text-green-600" />;
    case "POWERPOINT":
      return <FiFileText size={40} className="text-orange-500" />;
    case "CODE":
      return <FiFileText size={40} className="text-purple-600" />;
    default:
      return <FiFileText size={40} className="text-gray-500" />;
  }
};

/* ================= HELPER ================= */

const findFolderById = (root: any, id: string): any => {
  if (!root) return null;
  if (root.id === id) return root;

  for (const f of root.folders || []) {
    const found = findFolderById(f, id);
    if (found) return found;
  }

  return null;
};

const findPath = (root: any, id: string, path: any[] = []): any[] => {
  if (!root) return [];

  if (root.id === id) return [...path, root];

  for (const f of root.folders || []) {
    const result = findPath(f, id, [...path, root]);
    if (result.length) return result;
  }

  return [];
};

/* ================= COMPONENT ================= */

const GroupDocumentsPage = () => {
  const { ["group-id"]: id } = useParams();
  const { downloadFile } = useFileDownloader();
  const { data: groupDocsResponse, isLoading } = useGetGroupDocumentsQuery(
    id as string,
  );

  const [uploadFile] = useUploadFileToGroupMutation();
  const [deleteFile] = useDeleteFileFromGroupMutation();
  const [deleteFolder] = useDeleteGroupFolderMutation();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const root = groupDocsResponse?.data;

  const currentFolder = currentFolderId
    ? findFolderById(root, currentFolderId)
    : root;

  const path = currentFolderId
    ? findPath(root, currentFolderId)
    : root
      ? [root]
      : [];

  useEffect(() => {
    if (root?.id && !currentFolderId) {
      setCurrentFolderId(root.id);
    }
  }, [root]);

  /* ================= HANDLER ================= */

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentFolderId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadFile({
        groupId: id as string,
        folderId: currentFolderId,
        formData,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      await deleteFile({
        groupId: id as string,
        folderId: currentFolderId,
        fileId,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder({
        groupId: id as string,
        folderId,
      }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoBack = () => {
    if (path.length <= 1) return;
    setCurrentFolderId(path[path.length - 2].id);
  };

  if (isLoading) return null;

  return (
    <div className="mt-6 min-h-[500px] space-y-6 rounded-3xl border border-gray-200/80 bg-white/95 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/95">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <FolderOpen size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Tài liệu nhóm
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lưu trữ file và thư mục của nhóm
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 cursor-pointer transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
            <FiUpload />
            Upload
            <input type="file" className="hidden" onChange={handleUploadFile} />
          </label>

          <Button
            icon={FiPlus}
            label="Folder"
            variant="secondary"
            size="sm"
            onClick={() => setOpenForm(true)}
          />
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
          {path.map((p, index) => (
            <div key={p.id} className="flex gap-2 items-center">
              <span
                className={`cursor-pointer ${
                  index === path.length - 1
                    ? "text-gray-800 dark:text-gray-100 font-medium"
                    : "hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                onClick={() => setCurrentFolderId(p.id)}
              >
                {p.name}
              </span>

              {index < path.length - 1 && <span>/</span>}
            </div>
          ))}
        </div>

        {path.length > 1 && (
          <button
            onClick={handleGoBack}
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FiArrowLeft />
            Quay lại
          </button>
        )}
      </div>

      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {/* FOLDERS */}
        {currentFolder?.folders?.map((f: any) => (
          <div
            key={f.id}
            onClick={() => setCurrentFolderId(f.id)}
            className="group relative border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md cursor-pointer transition bg-white dark:bg-gray-900"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(f.id);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500"
            >
              <FiTrash2 />
            </button>

            <div className="flex justify-center mb-3">
              <FiFolder
                size={40}
                className="text-yellow-500 group-hover:scale-110 transition"
              />
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-200 text-center line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {f.name}
            </p>
          </div>
        ))}

        {/* FILES */}
        {currentFolder?.files?.map((file: any) => (
          <div
            key={file.id}
            onClick={() => downloadFile(file.id)}
            className="group relative border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition bg-white dark:bg-gray-900"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile(file.id);
              }}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 dark:text-gray-500 hover:text-red-500"
            >
              <FiTrash2 />
            </button>

            <div className="flex justify-center mb-3">
              {getFileIcon(file.type)}
            </div>

            <p className="cursor-pointer text-sm text-gray-700 dark:text-gray-200 text-center line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {file.name}
            </p>
          </div>
        ))}

        {/* EMPTY */}
        {!currentFolder?.folders?.length && !currentFolder?.files?.length && (
          <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
            Không có file hoặc thư mục
          </div>
        )}
      </div>

      {/* MODAL */}
      <FolderFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        currentFolderId={currentFolderId as string}
      />
    </div>
  );
};

export default GroupDocumentsPage;
