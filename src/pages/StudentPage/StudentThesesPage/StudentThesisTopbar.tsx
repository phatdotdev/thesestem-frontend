import { useParams } from "react-router-dom";
import { useGetStudentThesisByIdQuery } from "../../../services/thesisApi";
import Loader from "../../../components/UI/Loader";
import NavItem from "../../../components/header/NavItem";

import { FiAward } from "react-icons/fi";
import { FaUserGraduate } from "react-icons/fa";
import { Compass, FolderUp, Layers, SquarePen } from "lucide-react";

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
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-700 dark:bg-gray-900 sm:pt-6">
        <div className="px-4 sm:px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* ICON */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-md dark:bg-gray-800 dark:text-blue-400 sm:h-16 sm:w-16 sm:rounded-3xl">
              <FaUserGraduate size={36} />
            </div>

            {/* INFO */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-2xl">
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
        <div className="mt-4 pb-2 sm:mt-6 md:px-4">
          <nav className="flex gap-2 overflow-x-auto px-2 sm:flex-wrap sm:justify-start sm:gap-6 sm:px-0 md:justify-start">
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

            <NavItem
              to={`${basePath}/suggest`}
              label="Gợi ý đề tài"
              icon={Layers}
              borderPosition="bottom"
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentThesisTopbar;
