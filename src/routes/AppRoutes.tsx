import { Route, Routes } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import { useEffect } from "react";
import OrgLoginPage from "../pages/OrganizationPage/OrgLoginPage";
import HomePage from "../pages/PublicPage/HomePage";
import ThesesPage from "../pages/PublicPage/ThesesPage";
import OrgsPage from "../pages/PublicPage/OrgsPage";
import LoginPage from "../pages/PublicPage/LoginPage";
import RegisterPage from "../pages/PublicPage/RegisterPage";
import DashBoardPage from "../pages/ManagerPage/DashBoardPage";
import OrgInfoPage from "../pages/ManagerPage/OrgInfoPage";
import StdDashboardPage from "../pages/StudentPage/StdDashboardPage";
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
import StudentDocumentsPage from "../pages/StudentPage/StudentGroupPage/DocumentsPage/DocumentsPage";
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
import SemestorMentorPage from "../pages/ManagerPage/SemesterMentorPage/SemesterMentorPage";
import MentorAssignmentPage from "../pages/LecturerPage/LecGroupPage/AssignmentPage/MentorAssignmentPage";
import MentorAssignmentDetailsPage from "../pages/LecturerPage/LecGroupPage/AssignmentPage/MentorAssignmentDetailsPage";
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
import StdGroupPage from "../pages/StudentPage/StudentGroupPage/StdGroupPage";
import NotFoundPage from "../pages/PublicPage/NotFoundPage";
import StudentThesesPage from "../pages/StudentPage/StudentThesesPage/StudentThesesPage";
import StudentThesisLayout from "../components/layouts/StudentThesisLayout";
import ThesisDraftPage from "../pages/StudentPage/StudentThesesPage/ThesisDraftPage";
import ThesisOverviewPage from "../pages/StudentPage/StudentThesesPage/ThesisOverviewPage/ThesisOverviewPage";
import DefensePage from "../pages/ManagerPage/DefensePage/DefensePage";
import LecCouncilPage from "../pages/LecturerPage/LecCouncilPage/LecCouncilPage";
import CouncilDetailsPage from "../pages/LecturerPage/LecCouncilPage/CouncilDetailsPage";
import CouncilDefensePage from "../pages/LecturerPage/LecCouncilPage/DefensePage/CouncilDefensePage";
import ThesisResultPage from "../pages/StudentPage/StudentThesesPage/ThesisResultPage/ThesisResultPage";
import OrgHomePage from "../pages/OrganizationPage/OrgHomePage";
import SemesterThesesManagementPage from "../pages/ManagerPage/SemesterThesisManagementPage/SemesterThesesManagementPage";
import ThesisSubmissionsPage from "../pages/StudentPage/StudentThesesPage/ThesisSubmissionsPage/ThesisSubmissionsPage";
import ThesesGroupPage from "../pages/LecturerPage/LecGroupPage/ThesesGroupPage/ThesesGroupPage";
import ThesisDetailsPage from "../pages/LecturerPage/LecGroupPage/ThesesGroupPage/ThesisDetailsPage";
import AssignmentDetailsPage from "../pages/StudentPage/StudentGroupPage/AssignmentsPage/AssignmentDetailsPage";
import LecDashboardPage from "../pages/LecturerPage/LecDashboardPage";
import AdminThesesPage from "../pages/AdminPage/ThesesPage/AdminThesesPage";
import ManagerThesisLayout from "../pages/ManagerPage/SemesterThesisManagementPage/ThesisDetailsPage/ManagerThesisLayout";
import ManagerThesisOverviewPage from "../pages/ManagerPage/SemesterThesisManagementPage/ThesisDetailsPage/ThesisOverviewPage/ManagerThesisOverviewPage";
import ManagerThesisSubmissionsPage from "../pages/ManagerPage/SemesterThesisManagementPage/ThesisDetailsPage/ThesisSubmissionsPage/ManagerThesisSubmissionsPage";
import ManagerThesisResultPage from "../pages/ManagerPage/SemesterThesisManagementPage/ThesisDetailsPage/ThesisResultPage/ManagerThesisResultPage";
import ThesisSuggestionPage from "../pages/StudentPage/StudentThesesPage/ThesisSuggestionPage/ThesisSuggestionPage";
import PublicThesisDetailsPage from "../pages/PublicPage/PublicThesisDetailsPage";
import LecturerStatisticsPage from "../pages/LecturerPage/LecturerStatisticsPage/LecturerStatisticsPage";
import DepartmentManagementPage from "../pages/ManagerPage/DepartmentManagementPage/DepartmentManagementPage";
import FacultyManagementPage from "../pages/ManagerPage/FacultyManagementPage/FacultyManagementPage";
import FieldManagementPage from "../pages/ManagerPage/FieldManagementPage.tsx/FieldManagementPage";

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
        <Route path="/theses">
          <Route index element={<ThesesPage />} />
          <Route path=":thesis-id" element={<PublicThesisDetailsPage />} />
        </Route>
        <Route path="/orgs" element={<OrgsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="oauth2/redirect" element={<OAuth2RedirectPage />} />
      {/* ORG */}

      <Route path="a" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="theses" element={<AdminThesesPage />} />
        <Route path="statistics" element={<StatisticsManagementPage />} />
      </Route>

      <Route path=":org-code" element={<OrgLayout />}>
        <Route index element={<OrgHomePage />} />
        <Route path="login" element={<OrgLoginPage />} />
        {/* MANAGER */}
        <Route path="m" element={<OrgAdminLayout />}>
          <Route index element={<DashBoardPage />} />
          <Route path="info" element={<OrgInfoPage />} />
          <Route path="structure" element={<StructureManagementPage />} />
          <Route path="colleges" element={<CollegeManagement />} />
          <Route path="faculties" element={<FacultyManagementPage />} />
          <Route path="departments" element={<DepartmentManagementPage />} />
          <Route path="semesters" element={<SemesterManagementPage />} />
          <Route path="courses" element={<CourseManagementPage />} />
          <Route path="roles" element={<CouncilRoleManagementPage />} />
          <Route path="fields" element={<FieldManagementPage />} />

          <Route path="programs" element={<ProgramManagementPage />} />
          <Route path="students" element={<StudentManagementPage />} />
          <Route path="lecturers" element={<LecturerManagementPage />} />
          <Route path="timeline" element={<TimelineManager />} />
          <Route path="semester-students" element={<SemesterStudentPage />} />
          <Route path="semester-mentors" element={<SemestorMentorPage />} />
          <Route path="semester-defenses" element={<DefensePage />} />
          <Route path="semester-councils" element={<CouncilManagementPage />} />
          <Route path="semester-theses">
            <Route index element={<SemesterThesesManagementPage />} />
            <Route path=":thesis-id" element={<ManagerThesisLayout />}>
              <Route index element={<ManagerThesisOverviewPage />} />
              <Route
                path="submission"
                element={<ManagerThesisSubmissionsPage />}
              />
              <Route path="result" element={<ManagerThesisResultPage />} />
            </Route>
          </Route>
        </Route>
        {/* STUDENT */}
        <Route path="s" element={<StudentLayout />}>
          <Route index element={<StdDashboardPage />} />
          <Route path="profile" element={<StdProfilePage />} />
          <Route path="register" element={<StdRegisterPage />} />
          <Route path="group">
            <Route index element={<StdGroupPage />} />
            <Route path=":group-id" element={<StdGroupLayout />}>
              <Route index />
              <Route path="assignments">
                <Route index element={<AssignmentsPage />} />
                <Route
                  path=":assignment-id"
                  element={<AssignmentDetailsPage />}
                />
              </Route>
              <Route path="meetings" element={<MeetingsPage />} />
              <Route path="chat" element={<ChatGroupPage />} />
              <Route path="documents" element={<StudentDocumentsPage />} />
            </Route>
          </Route>
          <Route path="theses">
            <Route index element={<StudentThesesPage />} />
            <Route path=":thesis-id" element={<StudentThesisLayout />}>
              <Route index element={<ThesisOverviewPage />} />
              <Route path="draft" element={<ThesisDraftPage />} />
              <Route path="submission" element={<ThesisSubmissionsPage />} />
              <Route path="result" element={<ThesisResultPage />} />
              <Route path="suggest" element={<ThesisSuggestionPage />} />
            </Route>
          </Route>
        </Route>
        {/* LECTURER */}
        <Route path="l" element={<LecturerLayout />}>
          <Route index element={<LecDashboardPage />} />
          <Route path="info" element={<LecProfilePage />} />
          <Route path="group">
            <Route index element={<LecGroupPage />} />
            <Route path=":group-id" element={<MentorGroupLayout />}>
              <Route path="assignments">
                <Route index element={<MentorAssignmentPage />} />
                <Route
                  path=":assignment-id"
                  element={<MentorAssignmentDetailsPage />}
                />
              </Route>
              <Route path="meetings" element={<MentorMeetingPage />} />
              <Route path="documents" element={<MentorDocumentPage />} />
              <Route path="members" element={<MentorMembersPage />} />
              <Route path="topics" element={<MentorThesisTopicPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="theses">
                <Route index element={<ThesesGroupPage />} />
                <Route path=":thesis-id" element={<ThesisDetailsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="councils">
            <Route index element={<LecCouncilPage />} />
            <Route path=":council-id">
              <Route index element={<CouncilDetailsPage />} />
              <Route
                path="defenses/:defense-id"
                element={<CouncilDefensePage />}
              />
            </Route>
          </Route>
          <Route path="statistics" element={<LecturerStatisticsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
