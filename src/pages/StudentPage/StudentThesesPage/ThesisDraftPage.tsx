import {
  FiFolder,
  FiFileText,
  FiUpload,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
} from "react-icons/fi";

import { SquarePen } from "lucide-react";
import Button from "../../../components/UI/Button";

import {
  useDeleteFileFromThesisMutation,
  useDeleteThesisFolderMutation,
  useGetStudentThesisDraftQuery,
  useUploadFileToThesisMutation,
} from "../../../services/thesisApi";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FolderFormModal from "./FolderFormModal";

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

// tìm folder theo id
const findFolderById = (root: any, id: string): any => {
  if (!root) return null;
  if (root.id === id) return root;

  for (const f of root.folders || []) {
    const found = findFolderById(f, id);
    if (found) return found;
  }

  return null;
};

// tìm breadcrumb path
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

const ThesisDraftPage = () => {
  const { ["thesis-id"]: id } = useParams();

  const { data: draftResponse, isLoading } = useGetStudentThesisDraftQuery(
    id as string,
  );

  const [uploadFile] = useUploadFileToThesisMutation();
  const [deleteFile] = useDeleteFileFromThesisMutation();
  const [deleteFolder] = useDeleteThesisFolderMutation();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const root = draftResponse?.data;

  // folder hiện tại
  const currentFolder = currentFolderId
    ? findFolderById(root, currentFolderId)
    : root;

  // breadcrumb path
  const path = currentFolderId
    ? findPath(root, currentFolderId)
    : root
      ? [root]
      : [];

  // init root
  useEffect(() => {
    if (root?.id && !currentFolderId) {
      setCurrentFolderId(root.id);
    }
  }, [root]);

  /* ================= HANDLERS ================= */

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !currentFolderId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadFile({
        id,
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
        id,
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
        id,
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
    <div className="mt-6 space-y-6 p-6 bg-white dark:bg-gray-900 min-h-[500px] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <SquarePen size={24} />
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Bản thảo luận văn
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lưu trữ file và thư mục
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
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

      {/* BREADCRUMB + BACK */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
          {path.map((p, index) => (
            <div key={p.id} className="flex items-center gap-2">
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
            className="group relative border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md bg-white dark:bg-gray-900"
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

            <p className="text-sm text-gray-700 dark:text-gray-200 text-center line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {file.name}
            </p>
          </div>
        ))}
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

export default ThesisDraftPage;
