export function excelDateToISO(value: any): string {
  if (!value) return "";

  // Nếu đã là yyyy-mm-dd
  if (typeof value === "string") return value;

  // Nếu là Excel serial number
  if (typeof value === "number") {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return date.toISOString().slice(0, 10);
  }

  return "";
}
