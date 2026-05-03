import { Building2, Layers3, Lightbulb, Link2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../../../components/UI/Badge";
import Button from "../../../../components/UI/Button";
import { useSuggestThesisMutation } from "../../../../services/llmApi";
import { useGetSimilarThesesQuery } from "../../../../services/thesisApi";

const ThesisSuggestionPage = () => {
  const { "thesis-id": thesisId } = useParams();

  const [hasRequested, setHasRequested] = useState(false);

  const {
    data: similarResponse,
    isLoading: isSimilarLoading,
    error: similarError,
  } = useGetSimilarThesesQuery(thesisId as string, { skip: !thesisId });
  console.log(similarResponse);
  const [suggestThesis, { data, isLoading, error }] =
    useSuggestThesisMutation();

  const internals = data?.data?.internals ?? similarResponse?.data ?? [];
  const externals = data?.data?.externals ?? [];

  const similarErrorMessage =
    (similarError as any)?.data?.message ||
    "Không thể lấy danh sách luận văn tương tự trong hệ thống.";

  const errorMessage =
    (error as any)?.data?.message ||
    "Không thể lấy gợi ý đề tài. Vui lòng thử lại.";

  const handleSuggest = async () => {
    if (!thesisId || isLoading) return;

    try {
      setHasRequested(true);
      await suggestThesis({ thesisId }).unwrap();
    } catch (err) {
      console.error("Suggest thesis failed", err);
    }
  };

  return (
    <div className="mt-6 space-y-6 rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* HEADERS */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl border border-amber-100 dark:border-amber-900/70 bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Sparkles size={24} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Gợi ý đề tài liên quan
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Nhấn nút để lấy danh sách luận văn liên quan trong và ngoài hệ
              thống.
            </p>
          </div>
        </div>

        <Button
          label={isLoading ? "Đang gợi ý..." : "Lấy gợi ý"}
          icon={Lightbulb}
          size="sm"
          loading={isLoading}
          onClick={handleSuggest}
          disabled={!thesisId}
        />
      </div>

      <div className="space-y-5">
        <section className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
          <div className="flex items-center gap-2">
            <Layers3 size={16} className="text-blue-500" />
            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              Luận văn trong hệ thống ({internals.length})
            </h2>
          </div>

          {isSimilarLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Đang tải danh sách luận văn tương tự...
            </p>
          ) : similarError ? (
            <div className="rounded-lg border border-red-200 dark:border-red-900/70 bg-red-50 dark:bg-red-950/20 px-3 py-2 text-sm text-red-600 dark:text-red-300">
              {similarErrorMessage}
            </div>
          ) : internals.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Không có luận văn nội bộ phù hợp.
            </p>
          ) : (
            <div className="space-y-3">
              {internals.map((item) => (
                <article
                  key={item.id}
                  className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100">
                        {item.title}
                      </h3>

                      {item.organizationName && (
                        <Badge
                          label={`Tổ chức: ${item.organizationName}`}
                          icon={Building2}
                          variant="outline-info"
                          size="sm"
                          className="mt-1"
                        />
                      )}
                    </div>

                    <Badge
                      label={`Score: ${item.score?.toFixed(2) ?? "-"}`}
                      variant="info"
                      size="sm"
                    />
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {item.reason && (
                      <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/70 rounded-lg px-3 py-2 flex-1 min-w-[220px]">
                        <span className="font-semibold">Lý do gợi ý:</span>{" "}
                        {item.reason}
                      </div>
                    )}

                    <a
                      href={`/theses/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <Link2 size={14} />
                      Truy cập
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {!hasRequested && (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 py-8 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Gợi ý luận văn ngoài hệ thống sẽ hiển thị sau khi bấm "Lấy gợi ý".
          </div>
        )}

        {hasRequested && error && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/70 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {hasRequested && !error && (
          <section className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-emerald-500" />
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Luận văn ngoài hệ thống ({externals.length})
              </h2>
            </div>

            {externals.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Không có luận văn ngoài hệ thống phù hợp.
              </p>
            ) : (
              <div className="space-y-3">
                {externals.map((item) => (
                  <article
                    key={`${item.title}-${item.link}`}
                    className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                  >
                    <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {item.description}
                    </p>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Link2 size={14} />
                        Xem tài liệu tham khảo
                      </a>
                    )}

                    <div className="text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/70 rounded-lg px-3 py-2">
                      <span className="font-semibold">Lý do gợi ý:</span>{" "}
                      {item.reason}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ThesisSuggestionPage;
