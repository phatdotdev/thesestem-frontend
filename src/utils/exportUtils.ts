import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export const exportDefenseResultsToExcel = (defenses: any[]) => {
  if (!defenses || defenses.length === 0) {
    alert("Không có dữ liệu để xuất!");
    return;
  }

  // 1. Header & Data
  const header = [
    "STT",
    "Họ tên sinh viên",
    "Mã SV",
    "Tên đề tài",
    "GVHD",
    "Ngày giờ bảo vệ",
    "Địa điểm",
    "Hội đồng",
    "Thành viên hội đồng",
    "Chi tiết điểm",
    "Điểm TB",
  ];
  const excelData: any[] = [header];

  // 2. Xử lý Logic dữ liệu (Sắp xếp & Tính toán)
  const sortedDefenses = [...defenses].sort(
    (a, b) =>
      new Date(a.defenseTime).getTime() - new Date(b.defenseTime).getTime(),
  );

  sortedDefenses.forEach((defense, index) => {
    let totalScore = 0;
    let validScoresCount = 0;
    let membersText = "";
    let scoresText = "";

    defense.council.members.forEach((member: any) => {
      const lecturerName = member.lecturer.fullName;
      const scoreObj = defense.scores.find(
        (s: any) => s.member.lecturer.fullName === lecturerName,
      );
      const score = scoreObj ? parseFloat(scoreObj.score) : null;

      membersText += `${member.role.name}: ${lecturerName}\n`;
      scoresText += `${score !== null ? score : "-"}\n`;

      if (score !== null && !isNaN(score)) {
        totalScore += score;
        validScoresCount++;
      }
    });

    const averageScore =
      validScoresCount > 0 ? (totalScore / validScoresCount).toFixed(2) : "-";

    excelData.push([
      index + 1,
      defense.thesis.student.fullName,
      defense.thesis.student.studentCode,
      defense.thesis.title,
      defense.thesis.mentor?.fullName || "N/A",
      new Date(defense.defenseTime).toLocaleString("vi-VN"),
      defense.location,
      `${defense.council.name}`,
      membersText.trim(),
      scoresText.trim(),
      averageScore,
    ]);
  });

  // 3. Khởi tạo Sheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // 4. Định dạng Column Width
  ws["!cols"] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 12 },
    { wch: 35 },
    { wch: 22 },
    { wch: 18 },
    { wch: 15 },
    { wch: 20 },
    { wch: 35 },
    { wch: 10 },
    { wch: 10 },
  ];

  // 5. Apply Styles (Sửa lỗi màu sắc)
  const range = XLSX.utils.decode_range(ws["!ref"]!);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      const isHeader = R === 0;

      ws[cellAddress].s = {
        // Font chữ
        font: {
          name: "Arial",
          sz: 10,
          bold: isHeader,
          color: { rgb: isHeader ? "FFFFFF" : "000000" }, // Chữ trắng cho header, đen cho nội dung
        },
        // Màu nền
        fill: {
          fgColor: { rgb: isHeader ? "2F75B5" : "FFFFFF" }, // Nền xanh dương cho header, trắng cho nội dung
        },
        // Căn lề
        alignment: {
          vertical: "center",
          horizontal: isHeader || C === 0 || C === 10 ? "center" : "left",
          wrapText: true,
        },
        // Đường viền
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }
  }

  // 6. Xuất file
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "KetQua");
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([excelBuffer]),
    `Ket_qua_bao_ve_${new Date().getTime()}.xlsx`,
  );
};
