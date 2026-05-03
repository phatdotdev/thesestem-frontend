import {
  BookMarked,
  Building,
  RefreshCcw,
  Search,
  TrendingUp,
  User,
  UserCheck,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/UI/Button";
import Loader from "../../../components/UI/Loader";
import { useSearchThesesQuery } from "../../../services/thesisApi";
import type { ThesisResponse } from "../../../types/thesis";
import { useAsyncThesisEmbeddingMutation } from "../../../services/llmApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

const AdminThesesPage = () => {
  const [filters, setFilters] = useState({
    keyword: "",
    page: 0,
    size: 20,
  });

  const {
    data: thesesResponse,
    isLoading,
    isError,
  } = useSearchThesesQuery({
    page: filters.page,
    size: filters.size,
  });

  const [asyncThesisEmbedding, { isLoading: isAsyncThesisEmbeddingLoading }] =
    useAsyncThesisEmbeddingMutation();

  const allTheses = (thesesResponse?.data.content || []) as ThesisResponse[];
  const totalPages = thesesResponse?.data.totalPages || 0;

  const filteredTheses = useMemo(() => {
    const normalizedKeyword = filters.keyword.trim().toLowerCase();
    if (!normalizedKeyword) return allTheses;

    return allTheses.filter((thesis) => {
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
  }, [filters.keyword, allTheses]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-300";
      case "rejected":
        return "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-300";
      case "draft":
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
      default:
        return "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300";
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

  const dispatch = useAppDispatch();

  const asyncTheses = async () => {
    try {
      await asyncThesisEmbedding();
      dispatch(
        addToast({
          type: "success",
          message: "Đồng bộ hệ thống gợi ý thành công!",
        }),
      );
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          message:
            "Đã có lỗi xảy ra khi đồng bộ hệ thống gợi ý. Vui lòng thử lại.",
        }),
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
            <BookMarked size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Quản lý đề tài
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Danh sách và quản lý các đề tài luận văn trong hệ thống
            </p>
          </div>
        </div>

        <div>
          <Button
            icon={RefreshCcw}
            label="Đồng bộ hệ thống gợi ý"
            size="sm"
            onClick={asyncTheses}
            loading={isAsyncThesisEmbeddingLoading}
          />
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-700 dark:text-gray-200">
            Tìm kiếm đề tài
          </h2>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              placeholder="Tìm theo tiêu đề, sinh viên, giảng viên..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-700 dark:text-gray-200">
            Danh sách đề tài
          </h2>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {filteredTheses.length} / {allTheses.length} đề tài
          </span>
        </div>

        {isLoading ? (
          <Loader size={36} />
        ) : isError ? (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-600 dark:text-red-400">
            Không tải được danh sách đề tài. Vui lòng thử lại.
          </div>
        ) : filteredTheses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-10 text-center">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Không tìm thấy đề tài phù hợp
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
                className="
                          flex flex-col
                          rounded-xl
                          border border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-900
                          p-5
                          shadow-sm hover:shadow-md
                          transition
                        "
              >
                {/* HEADER */}
                <div className="flex items-start justify-between gap-4">
                  {/* LEFT */}
                  <div className="flex gap-3 mb-4">
                    <div
                      className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-lg
          bg-blue-50 dark:bg-blue-950/40
          text-blue-600 dark:text-blue-400
        "
                    >
                      <BookMarked size={18} />
                    </div>

                    <div className="space-y-1">
                      {/* Title VI */}
                      <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {thesis.title || "-"}
                      </h3>

                      {/* Title EN */}
                      <p className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                        {thesis.titleEn || "-"}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      thesis.status,
                    )}`}
                  >
                    {getStatusLabel(thesis.status)}
                  </span>
                </div>

                {/* INFO SECTION */}
                <div
                  className="
                            mt-auto
                            grid grid-cols-1 md:grid-cols-2
                            gap-3
                            text-xs
                            border-t border-gray-100 dark:border-gray-800
                            pt-4
                          "
                >
                  {/* Student */}
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Sinh viên:</span>{" "}
                      {thesis.student?.fullName || "-"}
                    </span>
                  </div>

                  {/* Mentor */}
                  <div className="flex items-center gap-2">
                    <UserCheck size={14} />
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">GV hướng dẫn:</span>{" "}
                      {thesis.mentor?.fullName || "-"}
                    </span>
                  </div>

                  {/* Organization */}
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Building size={14} />
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Tổ chức:</span>{" "}
                      {thesis.organization?.name || "-"}
                    </span>
                  </div>
                </div>

                {/* ACTION */}
                <div className="mt-4">
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              size="xs"
              label="Prev"
              variant="outline"
              disabled={filters.page === 0}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            />

            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                size="xs"
                label={(i + 1).toString()}
                variant={i === filters.page ? "primary" : "outline"}
                onClick={() => setFilters((prev) => ({ ...prev, page: i }))}
              />
            ))}

            <Button
              size="xs"
              label="Next"
              variant="outline"
              disabled={filters.page === totalPages - 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminThesesPage;
