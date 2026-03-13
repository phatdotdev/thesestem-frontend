import {
  MdInfo,
  MdAccountTree,
  MdApartment,
  MdMenuBook,
  MdDateRange,
  MdAssignmentInd,
  MdTopic,
  MdTimeline,
  MdSettings,
  MdLayers,
  MdOutlineRateReview,
} from "react-icons/md";
import {
  FaUniversity,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLandmark,
  FaUserTie,
} from "react-icons/fa";

import { useParams } from "react-router-dom";
import NavItem from "../../components/header/NavItem";
import { useAppSelector } from "../../app/hook";

const Section = ({ title, children }: any) => (
  <div className="space-y-1">
    <p className="hidden lg:block px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
      {title}
    </p>
    {children}
  </div>
);

const OrgSidebar = () => {
  const { "org-code": orgCode } = useParams();
  const logoUrl = useAppSelector((state) => state.organization.logoUrl);

  return (
    <aside
      className="
        flex flex-col
        w-20 md:w-60
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300
      "
    >
      {/* LOGO */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100 dark:border-gray-800 gap-4">
        <img
          src={logoUrl}
          alt="logo"
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-contain"
        />
        <div className="md:block hidden">
          <p className="font-bold text-gray-800 uppercase text-sm">
            Manager Portal
          </p>
          <p className="text-gray-600 font-md text-xs">Quản lý</p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        <Section title="Quản lý tổ chức">
          <NavItem to={`/${orgCode}/m/info`} label="Thông tin" icon={MdInfo} />
          <NavItem
            to={`/${orgCode}/m/structure`}
            label="Cơ cấu"
            icon={MdAccountTree}
          />
        </Section>

        <Section title="Đào tạo">
          <NavItem
            to={`/${orgCode}/m/colleges`}
            label="Trường"
            icon={FaUniversity}
          />
          <NavItem
            to={`/${orgCode}/m/faculties`}
            label="Khoa"
            icon={MdApartment}
          />
          <NavItem
            to={`/${orgCode}/m/programs`}
            label="Ngành"
            icon={MdMenuBook}
          />
        </Section>

        <Section title="Nhân sự">
          <NavItem
            to={`/${orgCode}/m/students`}
            label="Sinh viên"
            icon={FaUserGraduate}
          />
          <NavItem
            to={`/${orgCode}/m/lecturers`}
            label="Giảng viên"
            icon={FaUserTie}
          />
        </Section>

        <Section title="Danh mục">
          <NavItem
            to={`/${orgCode}/m/roles`}
            label="Hội đồng"
            icon={FaLandmark}
          />
          <NavItem
            to={`/${orgCode}/m/fields`}
            label="Lĩnh vực"
            icon={MdMenuBook}
          />
          <NavItem
            to={`/${orgCode}/m/semesters`}
            label="Học kỳ"
            icon={MdDateRange}
          />
          <NavItem
            to={`/${orgCode}/m/courses`}
            label="Khóa học"
            icon={MdLayers}
          />
        </Section>

        <Section title="Luận văn">
          <NavItem
            to={`/${orgCode}/m/semester-students`}
            label="Sinh viên"
            icon={MdAssignmentInd}
          />
          <NavItem
            to={`/${orgCode}/m/semester-mentors`}
            label="Giảng viên"
            icon={FaChalkboardTeacher}
          />
          <NavItem
            to={`/${orgCode}/m/thesis-topics`}
            label="Đề tài"
            icon={MdTopic}
          />
          <NavItem
            to={`/${orgCode}/m/semester-committees`}
            label="Hội đồng"
            icon={MdOutlineRateReview}
          />
          <NavItem
            to={`/${orgCode}/m/timeline`}
            label="Thời gian"
            icon={MdTimeline}
          />
        </Section>

        <Section title="Hệ thống">
          <NavItem
            to={`/${orgCode}/m/settings`}
            label="Cài đặt"
            icon={MdSettings}
          />
        </Section>
      </nav>
    </aside>
  );
};

export default OrgSidebar;
