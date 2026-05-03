import {
  Building2,
  BookCheck,
  BookDashed,
  BookOpen,
  BookText,
  FileCheck2,
  GraduationCap,
  Search,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import { useSearchPublicThesesQuery } from "../../services/thesisApi";
import type { ThesisResponse } from "../../types/thesis";
import { formatThesisStatus } from "../../utils/formatters";

const ThesesPage = () => {
  const [filters, setFilters] = useState({
    keyword: "",
    page: 0,
    size: 6,
  });

  const {
    data: thesesResponse,
    isLoading,
    isError,
  } = useSearchPublicThesesQuery({
    page: filters.page,
    size: filters.size,
  });

  const theses = (thesesResponse?.data.content || []) as ThesisResponse[];
  const totalPages = thesesResponse?.data?.totalPages || 0;

  const filteredTheses = useMemo(() => {
    const normalizedKeyword = filters.keyword.trim().toLowerCase();
    if (!normalizedKeyword) return theses;

    return theses.filter((thesis) => {
      const haystack = [
        thesis.title,
        thesis.titleEn,
        thesis.student?.fullName,
        thesis.student?.studentCode,
        thesis.mentor?.fullName,
        thesis.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedKeyword);
    });
  }, [filters.keyword, theses]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 0 }));
  }, [filters.keyword]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "proposal":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300";

      case "on_going":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

      case "approval":
        return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300";

      case "submitted":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300";

      case "graded":
        return "bg-teal-50 text-teal-700 dark:bg-teal-950/20 dark:text-teal-300";

      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      approved: "Đã duyệt",
      rejected: "Từ chối",
      pending: "Chờ duyệt",
      draft: "Nháp",
    };
    return statusMap[status?.toLowerCase()] || status || "-";
  };

  const getThesisIcon = (status: string): LucideIcon => {
    switch (status?.toLowerCase()) {
      case "proposal":
        return BookDashed;
      case "on_going":
        return BookText;
      case "submitted":
        return FileCheck2;
      case "graded":
        return BookCheck;
      default:
        return BookOpen;
    }
  };

  const getThesisIconColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "proposal":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-950/20 dark:text-amber-300 dark:ring-amber-900/40";
      case "on_going":
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700";
      case "approval":
        return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/70 dark:bg-indigo-950/20 dark:text-indigo-300 dark:ring-indigo-900/40";
      case "submitted":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-950/20 dark:text-emerald-300 dark:ring-emerald-900/40";
      case "graded":
        return "bg-teal-50 text-teal-700 ring-1 ring-teal-200/70 dark:bg-teal-950/20 dark:text-teal-300 dark:ring-teal-900/40";
      default:
        return "bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700";
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <BookOpen size={14} />
                Danh mục luận văn
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                Khám phá các luận văn trong hệ thống
              </h1>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Tìm nhanh theo tiêu đề, tên sinh viên, mã sinh viên hoặc hướng
                dẫn viên để xem các luận văn và chi tiết của chúng.
              </p>
            </div>

            <div className="w-full md:w-96">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tìm kiếm luận văn
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, keyword: e.target.value }))
                  }
                  placeholder="Nhập tiêu đề, sinh viên, giảng viên..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* List */}
        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Danh sách luận văn
            </h2>

            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {filteredTheses.length} luận văn
            </span>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              Không thể tải danh sách luận văn. Vui lòng thử lại sau.
            </div>
          ) : filteredTheses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="font-medium text-gray-700 dark:text-gray-200">
                Không tìm thấy luận văn phù hợp
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Thử từ khóa khác hoặc xóa bộ lọc tìm kiếm.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTheses.map((thesis) => (
                <article
                  key={thesis.id}
                  className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                >
                  {/* Header with status */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${getThesisIconColor(
                          thesis.status,
                        )}`}
                      >
                        {(() => {
                          const ThesisIcon = getThesisIcon(thesis.status);
                          return <ThesisIcon size={18} />;
                        })()}
                      </div>

                      <div>
                        {/* Title */}
                        <h3 className="mb-1.5 line-clamp-2 text-[15px] font-semibold leading-6 text-gray-900 dark:text-gray-100">
                          {thesis.title || "-"}
                        </h3>

                        <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                          {thesis.titleEn || "-"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                        thesis.status,
                      )}`}
                    >
                      {formatThesisStatus(getStatusLabel(thesis.status))}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="mb-4 space-y-2.5 border-t border-gray-100 pt-3 dark:border-gray-800">
                    {/* Student + Mentor */}
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <GraduationCap
                          size={14}
                          className="shrink-0 text-gray-400"
                        />
                        <span className="truncate text-gray-700 dark:text-gray-300">
                          SV: {thesis.student?.fullName || "-"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-center justify-end gap-2">
                        <User size={14} className="shrink-0 text-gray-400" />
                        <span className="truncate text-gray-600 dark:text-gray-400">
                          GVHD: {thesis.mentor?.fullName || "-"}
                        </span>
                      </div>
                    </div>

                    {/* Organization */}
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 size={14} className="shrink-0 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Tổ chức: {thesis?.organization?.name || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="mt-auto">
                    <Link to={`/theses/${thesis.id}`}>
                      <Button
                        fullWidth
                        size="sm"
                        variant="outline-primary"
                        label="Xem chi tiết"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <Button
                size="sm"
                label="Trang trước"
                variant="outline"
                disabled={filters.page === 0}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              />

              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  label={(i + 1).toString()}
                  variant={i === filters.page ? "primary" : "outline"}
                  onClick={() => setFilters((prev) => ({ ...prev, page: i }))}
                />
              ))}

              <Button
                size="xs"
                label="Trang sau"
                variant="outline"
                disabled={filters.page === totalPages - 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ThesesPage;
