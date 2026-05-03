const pad2 = (value: number) => String(value).padStart(2, "0");

const toIsoDate = (year: number, month: number, day: number) =>
  `${year}-${pad2(month)}-${pad2(day)}`;

const isValidDate = (year: number, month: number, day: number) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export function excelDateToISO(value: any): string {
  if (value === null || value === undefined || `${value}`.trim() === "") {
    return "";
  }

  if (typeof value === "string") {
    const raw = value.trim();

    // yyyy-MM-dd or yyyy/MM/dd
    const ymd = raw.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);
    if (ymd) {
      const year = Number(ymd[1]);
      const month = Number(ymd[2]);
      const day = Number(ymd[3]);
      return isValidDate(year, month, day) ? toIsoDate(year, month, day) : "";
    }

    // dd/MM/yyyy or dd-MM-yyyy
    const dmy = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (dmy) {
      const day = Number(dmy[1]);
      const month = Number(dmy[2]);
      const year = Number(dmy[3]);
      return isValidDate(year, month, day) ? toIsoDate(year, month, day) : "";
    }

    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      return toIsoDate(
        parsed.getUTCFullYear(),
        parsed.getUTCMonth() + 1,
        parsed.getUTCDate(),
      );
    }

    return "";
  }

  if (typeof value === "number") {
    // Excel serial date: day 1 = 1900-01-01 (base date 1899-12-30)
    const excelEpoch = Date.UTC(1899, 11, 30);
    const date = new Date(excelEpoch + Math.round(value) * 86400000);

    return toIsoDate(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
    );
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toIsoDate(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate(),
    );
  }

  return "";
}
