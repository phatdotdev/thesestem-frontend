import { Building2, Globe, Mail, MapPin, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";
import { useSearchOrgsQuery } from "../../services/orgApi";
import type { OrgProps } from "../../types/organization";

const OrgsPage = () => {
  const [keyword, setKeyword] = useState("");

  const {
    data: orgsResponse,
    isLoading,
    isError,
  } = useSearchOrgsQuery({
    page: 0,
    size: 6,
  });

  const orgs = (orgsResponse?.data?.content || []) as OrgProps[];

  const filteredOrgs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (!normalizedKeyword) return orgs;

    return orgs.filter((org) => {
      const haystack = [org.name, org.code, org.email, org.address, org.website]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedKeyword);
    });
  }, [keyword, orgs]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                <Building2 size={14} />
                Danh mục tổ chức
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-3xl">
                Khám phá các tổ chức tham gia hệ thống luận văn
              </h1>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Tìm nhanh theo tên tổ chức, mã, email hoặc địa chỉ và truy cập
                trực tiếp trang tổ chức để đăng nhập.
              </p>
            </div>

            <div className="w-full md:w-96">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tìm kiếm tổ chức
              </label>

              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Nhập tên, mã, email..."
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
              Danh sách tổ chức
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {filteredOrgs.length} tổ chức
            </span>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
              Không thể tải danh sách tổ chức. Vui lòng thử lại sau.
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="font-medium text-gray-700 dark:text-gray-200">
                Không tìm thấy tổ chức phù hợp
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Thử từ khóa khác hoặc xóa bộ lọc tìm kiếm.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredOrgs.map((org) => (
                <article
                  key={org.code}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-gray-800 overflow-hidden">
                      {org.logoUrl ? (
                        <img
                          src={org.logoUrl}
                          alt="Logo"
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <Building2
                          size={24}
                          className="text-blue-600 dark:text-blue-300"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                        {org.name}
                      </h3>
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-300">
                        {org.code}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                    <p className="flex items-start gap-2">
                      <Mail
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />
                      <span className="truncate">{org.email || "-"}</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <Phone
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />
                      <span>{org.phone || "-"}</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />
                      <span className="line-clamp-1">{org.address || "-"}</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <Globe
                        size={16}
                        className="mt-0.5 shrink-0 text-gray-400"
                      />
                      <span className="truncate">{org.website || "-"}</span>
                    </p>
                  </div>

                  <div className="mt-5">
                    <Link to={`/${org.code}`}>
                      <Button
                        fullWidth
                        size="sm"
                        variant="outline-primary"
                        label="Vào trang tổ chức"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OrgsPage;
