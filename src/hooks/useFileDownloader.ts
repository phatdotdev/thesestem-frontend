import { useCallback } from "react";
import {
  useDownloadFileMutation,
  useGetFileViewMutation,
} from "../services/resourceApi";

export const useFileDownloader = () => {
  const [download] = useDownloadFileMutation();
  const [getBlob] = useGetFileViewMutation();

  const getFileInfo = useCallback(
    async (fileId: string) => {
      try {
        const response = await download({ fileId }).unwrap();
        return {
          url: response.data.url,
          fileName: response.data.name,
        };
      } catch (err) {
        console.error("Error fetching file info:", err);
        return null;
      }
    },
    [download],
  );

  const getFileBlob = useCallback(
    async (fileId: string) => {
      try {
        const response = await getBlob({ fileId }).unwrap();
        return response;
      } catch (err) {
        console.error("Error fetching file blob:", err);
        return null;
      }
    },
    [getBlob],
  );

  const downloadFile = useCallback(
    async (fileId: string) => {
      try {
        const response = await download({ fileId }).unwrap();

        console.log(response);
        const url = response.data.url;
        const fileName = response.data.name;

        const res = await fetch(url);

        const blob = await res.blob();

        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = blobUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error(err);
      }
    },
    [download],
  );

  return { downloadFile, getFileInfo, getFileBlob };
};
