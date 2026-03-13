export const formatGender = (gender?: string) => {
  switch (gender) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    default:
      return "Chưa cập nhật";
  }
};

export const formatStatus = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Ngừng hoạt động";
    default:
      return "Không xác định";
  }
};

export function formatDateTimeVN(isoString: string | null | undefined): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const pad = (n: number): string => n.toString().padStart(2, "0");

  return (
    `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}

export function formatDateVN(isoString: string | null | undefined): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const pad = (n: number): string => n.toString().padStart(2, "0");

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} `;
}
