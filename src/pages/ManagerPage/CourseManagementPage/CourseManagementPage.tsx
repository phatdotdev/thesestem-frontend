import { Edit, Trash2, BookOpen, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";

import CourseForm from "./CourseForm";
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from "../../../services/catApi";

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "";

const CourseManagementPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [openCourse, setOpenCourse] = useState(false);

  const { data, refetch } = useGetCoursesQuery();
  const courses = data?.data ?? [];

  const selectedCourse = useMemo(
    () => courses.find((c: any) => c.id === selectedCourseId) ?? null,
    [courses, selectedCourseId],
  );

  const [deleteCourse] = useDeleteCourseMutation();

  const deleteCourseById = async (id: string) => {
    if (confirm("Xác nhận xóa khóa học?")) {
      await deleteCourse(id).unwrap();
      setSelectedCourseId(null);
      refetch();
    }
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300">
            <BookOpen />
          </div>

          <div>
            <h1 className="text-xl font-semibold dark:text-gray-100">
              Quản lý khóa học
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý danh sách khóa học trong tổ chức
            </p>
          </div>
        </div>

        <Button
          icon={Plus}
          label="Thêm khóa học"
          size="sm"
          onClick={() => {
            setSelectedCourseId(null);
            setOpenCourse(true);
          }}
        />
      </div>

      <p className="text-lg font-semibold dark:text-gray-100">
        Danh sách khóa học
      </p>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-sm overflow-hidden">
        {courses.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Mã</th>
                <th className="px-6 py-3 text-left font-medium">
                  Tên khóa học
                </th>
                <th className="px-6 py-3 text-left font-medium">Năm</th>
                <th className="px-6 py-3 text-left font-medium">Thời gian</th>
                <th className="px-6 py-3 text-left font-medium">Trạng thái</th>
                <th className="px-6 py-3 text-center font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c: any) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 font-medium dark:text-gray-100">
                    {c.code}
                  </td>

                  <td className="px-6 py-4 dark:text-gray-200">{c.name}</td>

                  <td className="px-6 py-4 dark:text-gray-200">
                    {c.startYear} - {c.endYear}
                  </td>

                  <td className="px-6 py-4 dark:text-gray-200">
                    {formatDate(c.startDate)} → {formatDate(c.endDate)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        c.active
                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {c.active ? "Hoạt động" : "Ngừng"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Edit}
                      onClick={() => {
                        setSelectedCourseId(c.id);
                        setOpenCourse(true);
                      }}
                    />

                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => deleteCourseById(c.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40">
            <Badge label="Chưa có khóa học nào" variant="outline" />
          </div>
        )}
      </div>

      {/* Modal */}
      <CourseForm
        open={openCourse}
        initialData={selectedCourse}
        onClose={() => setOpenCourse(false)}
        onSuccess={async () => {
          await refetch();
          setOpenCourse(false);
        }}
      />
    </div>
  );
};

export default CourseManagementPage;
