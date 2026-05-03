import {
  BookOpen,
  Search,
  TrendingUp,
  User,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../../../components/UI/Button";
import { useGetThesesByGroupQuery } from "../../../../services/thesisApi";
import type { ThesisResponse } from "../../../../types/thesis";
import EmptyState from "../../../../components/UI/EmptyState";

const ITEMS_PER_PAGE = 9;

/* ── Progress bar ── */
const ProgressBar = ({ value }: { value: number }) => {
  const pct = Math.max(0, Math.min(value, 100));
  const color =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 50
        ? "bg-blue-500"
        : pct >= 20
          ? "bg-amber-400"
          : "bg-gray-300";

  return (
    <div className="flex items-center gap-2">
      <TrendingUp size={12} className="shrink-0 text-gray-400" />
      <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="min-w-[32px] text-right text-xs font-medium text-gray-500 dark:text-gray-400">
        {pct}%
      </span>
    </div>
  );
};

/* ── Thesis card ── */
const ThesisCard = ({ thesis }: { thesis: ThesisResponse }) => (
  <article className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md dark:hover:shadow-blue-950/20 transition-all duration-150">
    <div className="h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
          <BookOpen size={15} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {thesis.title || "—"}
          </h3>
          {thesis.description && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed italic">
              {thesis.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <User size={13} className="shrink-0 text-gray-400" />
        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
          {thesis.student?.fullName || "—"}
          {thesis.student?.studentCode && (
            <span className="ml-1.5 font-mono text-[10px] text-gray-400">
              ({thesis.student.studentCode})
            </span>
          )}
        </p>
      </div>
      <ProgressBar value={thesis.progressPercent || 0} />
      <div className="flex justify-end pt-0.5">
        <Link to={`${thesis.id}`}>
          <Button label="Xem chi tiết" variant="outline-primary" size="xs" />
        </Link>
      </div>
    </div>
  </article>
);

/* ═══ PAGE ═══ */
const ThesesGroupPage = () => {
  const { "group-id": groupId } = useParams();
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: thesesResponse,
    isLoading,
    isError,
  } = useGetThesesByGroupQuery(groupId as string, { skip: !groupId });
  const theses = (thesesResponse?.data || []) as ThesisResponse[];

  // 1. Lọc dữ liệu theo Search
  const allFiltered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return theses;
    return theses.filter((t) =>
      [t.title, t.description, t.student?.fullName, t.student?.studentCode]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(kw),
    );
  }, [keyword, theses]);

  // 2. Tính toán phân trang
  const totalPages = Math.ceil(allFiltered.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allFiltered.slice(start, start + ITEMS_PER_PAGE);
  }, [allFiltered, currentPage]);

  // 3. Reset trang khi tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  return (
    <div className="space-y-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <GraduationCap size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý đề tài luận văn
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Danh sách luận văn trong nhóm hướng dẫn
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm sinh viên, tiêu đề..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Danh sách
        </h2>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
          {allFiltered.length} luận văn
        </span>
      </div>

      {/* STATES */}
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-950/30">
          Lỗi tải dữ liệu.
        </div>
      ) : paginatedData.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Chưa có luận văn nào"
          description="Thực hiện phân công đề tài cho sinh viên để quản lý tiến độ và hỗ trợ hiệu quả hơn."
        />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            {paginatedData.map((thesis) => (
              <ThesisCard key={thesis.id} thesis={thesis} />
            ))}
          </div>

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                      currentPage === i + 1
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p - 1)} // Sửa thành p + 1
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThesesGroupPage;
