export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  SYSTEM_ANNOUNCEMENT: "Thông báo hệ thống",

  STUDENT_REGISTER_MENTOR: "Sinh viên đăng ký giảng viên hướng dẫn",
  STUDENT_CANCEL_REGISTER: "Sinh viên hủy đăng ký",
  STUDENT_SUBMIT_THESIS: "Sinh viên nộp luận văn",
  STUDENT_UPDATE_THESIS: "Sinh viên cập nhật luận văn",
  STUDENT_UPLOAD_FILE: "Sinh viên tải lên tài liệu",

  MENTOR_APPROVE_REGISTER: "Giảng viên duyệt đăng ký",
  MENTOR_REJECT_REGISTER: "Giảng viên từ chối đăng ký",
  MENTOR_ADD_MEMBER: "Giảng viên thêm thành viên vào nhóm",
  MENTOR_REMOVE_MEMBER: "Giảng viên xóa thành viên khỏi nhóm",
  MENTOR_ASSIGN_TASK: "Giảng viên giao nhiệm vụ",
  MENTOR_COMMENT: "Giảng viên nhận xét",

  GROUP_MEMBER_ADDED: "Thành viên được thêm vào nhóm",
  GROUP_MEMBER_REMOVED: "Thành viên bị xóa khỏi nhóm",
  GROUP_UPDATED: "Thông tin nhóm được cập nhật",

  THESIS_ASSIGNED_COUNCIL: "Luận văn được phân công hội đồng",
  THESIS_UPDATED: "Luận văn được cập nhật",
  THESIS_APPROVED: "Luận văn được duyệt",
  THESIS_REJECTED: "Luận văn bị từ chối",

  COUNCIL_ASSIGNED: "Được phân công vào hội đồng",
  COUNCIL_GRADE_UPDATED: "Điểm số hội đồng được cập nhật",
  COUNCIL_SCHEDULE_UPDATED: "Lịch hội đồng được cập nhật",
  COUNCIL_FINAL_RESULT: "Kết quả bảo vệ chính thức",

  DEADLINE_REMINDER: "Nhắc nhở thời hạn nộp",
  DEFENSE_SCHEDULE: "Lịch bảo vệ luận văn",

  CHAT_MESSAGE: "Tin nhắn mới",
};

export const getTypeLabel = (type?: string) =>
  NOTIFICATION_TYPE_LABELS[type ?? ""] ?? type ?? "Thông báo";
