export const thesisStateToVN = (state: string) => {
  switch (state.toLowerCase()) {
    case "proposal":
      return "Đề xuất";
    case "on_going":
      return "Đang thực hiện";
    case "approved":
      return "Đã duyệt";
    case "submitted":
      return "Đã nộp";
    case "graded":
      return "Đã chấm điểm";
    default:
      return state;
  }
};
