import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import { useEffect } from "react";
import OrgLoginPage from "../pages/ManagerPage/OrgLoginPage";
import HomePage from "../pages/PublicPage/HomePage";
import ThesesPage from "../pages/PublicPage/ThesesPage";
import OrgsPage from "../pages/PublicPage/OrgsPage";
import LoginPage from "../pages/PublicPage/LoginPage";
import RegisterPage from "../pages/PublicPage/RegisterPage";
import DashBoardPage from "../pages/ManagerPage/DashBoardPage";
import OrgInfoPage from "../pages/ManagerPage/OrgInfoPage";
import StdDashboardPage from "../pages/ManagerPage/StdDashboardPage";
import StdRegisterPage from "../pages/StudentPage/StdRegisterPage/StdRegisterPage";
import PublicLayout from "../components/layouts/PublicLayout";
import OrgAdminLayout from "../components/layouts/OrgAdminLayout";
import StudentLayout from "../components/layouts/StudentLayout";
import StdGroupLayout from "../components/layouts/StdGroupLayout";
import LecturerLayout from "../components/layouts/LecturerLayout";
import OrgLayout from "../components/layouts/OrgLayout";
import TimelineManager from "../pages/ManagerPage/TimeLineManagerPage/TimeLineManagerPage";
import CollegeManagement from "../pages/ManagerPage/CollegeManagementPage/CollegeManagementPage";
import StructureManagementPage from "../pages/ManagerPage/StructureManagementPage/StructureManagementPage";
import StudentManagementPage from "../pages/ManagerPage/StudentManagementPage/StudentManagementPage";
import ProgramManagementPage from "../pages/ManagerPage/ProgramManagementPage/ProgramManagementPage";
import AssignmentsPage from "../pages/StudentPage/StudentGroupPage/AssignmentsPage/AssignmentsPage";
import MeetingsPage from "../pages/StudentPage/StudentGroupPage/MeetingsPage/MeetingsPage";
import ChatGroupPage from "../pages/StudentPage/StudentGroupPage/ChatPage/ChatPage";
import LecProfilePage from "../pages/LecturerPage/LecProfilePage/LecProfilePage";
import StdProfilePage from "../pages/StudentPage/StudentProfilePage/StdProfilePage";
import LecGroupPage from "../pages/LecturerPage/LecGroupPage/LecGroupPage";
import ChatPage from "../pages/LecturerPage/LecGroupPage/ChatPage/ChatPage";
import SemesterManagementPage from "../pages/ManagerPage/SemesterManagementPage/SemesterManagementPage";
import CourseManagementPage from "../pages/ManagerPage/CourseManagementPage/CourseManagementPage";
import CouncilRoleManagementPage from "../pages/ManagerPage/CouncilRoleManagementPage/CouncilRoleManagementPage";
import OAuth2RedirectPage from "../pages/PublicPage/Oauth2RedirectPage";
import LecturerManagementPage from "../pages/ManagerPage/LecturerManagementPage/LecturerManagementPage";
import SemesterStudentPage from "../pages/ManagerPage/SemesterStudentPage/SemesterStudentPage";
import SemestorMentorPage from "../pages/ManagerPage/SemesterMentorPage/SemestorMentorPage";
import MentorAssignmentPage from "../pages/LecturerPage/LecGroupPage/AssignmentPage/MentorAssignmentPage";
import MentorGroupLayout from "../components/layouts/MentorGroupLayout";
import MentorMeetingPage from "../pages/LecturerPage/LecGroupPage/MeetingPage/MentorMeetingPage";
import MentorDocumentPage from "../pages/LecturerPage/LecGroupPage/DocumentPage/MentorDocumentPage";
import MentorMembersPage from "../pages/LecturerPage/LecGroupPage/MemberPage/MentorMembersPage";
import MentorThesisTopicPage from "../pages/LecturerPage/LecGroupPage/ThesisTopicPage/MentorThesisTopicPage";
import AdminDashboardPage from "../pages/AdminPage/DashboardPage/AdminDashboardPage";
import AdminLayout from "../components/layouts/AdminLayout";
import UserManagementPage from "../pages/AdminPage/UserManagementPage/UserManagementPage";
import StatisticsManagementPage from "../pages/AdminPage/StatisticsManagementPage/StatisticsManagementPage";
import CouncilManagementPage from "../pages/ManagerPage/CouncilManagementPage/CouncilManagementPage";

const AppRoutes = () => {
  const theme = useAppSelector((state) => state.settings.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <Routes>
      {/* PUB */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/theses" element={<ThesesPage />} />
        <Route path="/orgs" element={<OrgsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="oauth2/redirect" element={<OAuth2RedirectPage />} />
      {/* ORG */}

      <Route path="a" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="statistics" element={<StatisticsManagementPage />} />
      </Route>

      <Route path=":org-code" element={<OrgLayout />}>
        <Route path="login" element={<OrgLoginPage />} />
        {/* MANAGER */}
        <Route path="m" element={<OrgAdminLayout />}>
          <Route index element={<DashBoardPage />} />
          <Route path="info" element={<OrgInfoPage />} />
          <Route path="structure" element={<StructureManagementPage />} />
          <Route path="semesters" element={<SemesterManagementPage />} />
          <Route path="courses" element={<CourseManagementPage />} />
          <Route path="roles" element={<CouncilRoleManagementPage />} />
          <Route path="colleges" element={<CollegeManagement />} />
          <Route path="programs" element={<ProgramManagementPage />} />
          <Route path="students" element={<StudentManagementPage />} />
          <Route path="lecturers" element={<LecturerManagementPage />} />
          <Route path="timeline" element={<TimelineManager />} />
          <Route path="semester-students" element={<SemesterStudentPage />} />
          <Route path="semester-mentors" element={<SemestorMentorPage />} />
          <Route
            path="semester-committees"
            element={<CouncilManagementPage />}
          />
        </Route>
        {/* STUDENT */}
        <Route path="s" element={<StudentLayout />}>
          <Route index element={<StdDashboardPage />} />
          <Route path="profile" element={<StdProfilePage />} />
          <Route path="register" element={<StdRegisterPage />} />
          <Route path="group" element={<StdGroupLayout />}>
            <Route index />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="meetings" element={<MeetingsPage />} />
            <Route path="chat" element={<ChatGroupPage />} />
          </Route>
        </Route>
        {/* LECTURER */}
        <Route path="l" element={<LecturerLayout />}>
          <Route index element={<StdDashboardPage />} />
          <Route path="info" element={<LecProfilePage />} />
          <Route path="group">
            <Route index element={<LecGroupPage />} />
            <Route path=":group-id" element={<MentorGroupLayout />}>
              <Route path="assignments" element={<MentorAssignmentPage />} />
              <Route path="meetings" element={<MentorMeetingPage />} />
              <Route path="documents" element={<MentorDocumentPage />} />
              <Route path="members" element={<MentorMembersPage />} />
              <Route path="topics" element={<MentorThesisTopicPage />} />
              <Route path="chat" element={<ChatPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
