import { useParams } from "react-router-dom";
import { useGetStudentThesisByIdQuery } from "../../../services/thesisApi";
import Loader from "../../../components/UI/Loader";
import NavItem from "../../../components/header/NavItem";

import { FiAward } from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";
import { Compass, FolderUp, SquarePen } from "lucide-react";

const StudentThesisTopbar = () => {
  const { ["org-code"]: orgCode, ["thesis-id"]: id } = useParams();

  const { data: thesisResponse, isLoading } = useGetStudentThesisByIdQuery(
    id as string,
  );

  const thesis = thesisResponse?.data;

  const basePath = `/${orgCode}/s/theses/${id}`;

  if (isLoading) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 pt-6 rounded-2xl">
        <div className="flex justify-between px-6">
          <div className="flex items-center gap-5">
            {/* ICON */}
            <div className="h-16 w-16 rounded-3xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FaUserGraduate size={36} />
            </div>

            {/* INFO */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                {thesis?.title}
              </h1>

              {thesis?.titleEn && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {thesis.titleEn}
                </p>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Sinh viên thực hiện:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {thesis?.student?.fullName}
                </span>
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Giảng viên hướng dẫn:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {thesis?.mentor?.fullName}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="mt-6 pb-2 md:px-4">
          <nav className="flex flex-wrap gap-6 justify-center md:justify-start">
            <NavItem
              to={`${basePath}`}
              label="Tổng quan"
              icon={Compass}
              borderPosition="bottom"
              exact
            />

            <NavItem
              to={`${basePath}/draft`}
              label="Bản thảo"
              icon={SquarePen}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/submission`}
              label="Nộp chính thức"
              icon={FolderUp}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/result`}
              label="Bảo vệ luận văn"
              icon={FiAward}
              borderPosition="bottom"
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentThesisTopbar;
