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

export const formatAccessLevel = (accessLevel?: string) => {
  switch (accessLevel) {
    case "PUBLIC":
      return "Công khai";
    case "PRIVATE":
      return "Riêng tư";
    default:
      return "Không xác định";
  }
};

export const formatThesisStatus = (status?: string) => {
  switch (status) {
    case "PROPOSAL":
      return "Đề xuất";
    case "IN_PROGRESS":
      return "Đang tiến hành";
    case "APPROVED":
      return "Đã duyệt";
    case "SUBMITTED":
      return "Đã nộp";
    case "REJECTED":
      return "Đã từ chối";
    case "GRADED":
      return "Đã chấm điểm";
    default:
      return "Không xác định";
  }
};

export function formatDateTimeVN(
  isoString?: string | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...options,
  }).format(date);
}

export function formatDateRangeVN(
  start?: string | null,
  end?: string | null,
): string {
  if (!start || !end) return "";

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "";

  const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
  });

  const sameDay =
    dateFormatter.format(startDate) === dateFormatter.format(endDate);

  if (sameDay) {
    return `${dateFormatter.format(startDate)} ${timeFormatter.format(
      startDate,
    )} - ${timeFormatter.format(endDate)}`;
  }

  return `${dateFormatter.format(startDate)} ${timeFormatter.format(
    startDate,
  )} - ${dateFormatter.format(endDate)} ${timeFormatter.format(endDate)}`;
}

export function formatDateVN(isoString: string | null | undefined): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const pad = (n: number): string => n.toString().padStart(2, "0");

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} `;
}
