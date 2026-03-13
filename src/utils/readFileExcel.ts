import * as XLSX from "xlsx";

export const getExcelSheets = (file: File): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        resolve(workbook.SheetNames);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject("Cannot read excel file");
    reader.readAsArrayBuffer(file);
  });
};

export const readExcelBySheet = <T = any>(
  file: File,
  sheetName: string,
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          throw new Error("Sheet not found");
        }

        const jsonData = XLSX.utils.sheet_to_json<T>(worksheet, {
          defval: "",
          raw: false,
        });

        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject("Cannot read excel file");
    reader.readAsArrayBuffer(file);
  });
};
