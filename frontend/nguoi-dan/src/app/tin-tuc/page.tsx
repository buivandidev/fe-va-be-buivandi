/* eslint-disable @next/next/no-img-element */

import Link from "next/link";


import {
  formatViDateTime,
  getNewsCategories,
  getNewsCategoryTotals,
  getNewsList,
  type NewsCategory,
} from "@/lib/news-api";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  page?: string;
  category?: string;
};

type NewsListPageProps = {
  searchParams: Promise<SearchParams>;
};

type PageToken = number | "ellipsis";

const tags = ["Chính sách mới", "Phát triển đô thị", "An sinh xã hội", "Số hóa", "Môi trường"];
const categoryIcons = ["analytics", "account_balance", "map", "medical_services", "school", "article"];

function buildHref(targetPage: number, keyword: string, categoryId: string): string {
  const query = new URLSearchParams();
  query.set("page", String(targetPage));
  if (keyword) query.set("q", keyword);
  if (categoryId) query.set("category", categoryId);
  return `/tin-tuc?${query.toString()}`;
}

function buildCategoryHref(categoryId: string, keyword: string): string {
  const query = new URLSearchParams();
  if (keyword) query.set("q", keyword);
  if (categoryId) query.set("category", categoryId);
  const suffix = query.toString();
  return suffix ? `/tin-tuc?${suffix}` : "/tin-tuc";
}

function buildPageTokens(currentPage: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function totalCount(categoryTotals: Record<string, number>, categories: NewsCategory[], fallbackTotal: number): number {
  const sum = categories.reduce((acc, item) => acc + (categoryTotals[item.id] ?? 0), 0);
  return sum > 0 ? sum : fallbackTotal;
}

export default async function NewsListPage({ searchParams }: NewsListPageProps) {
  const resolvedSearchParams = await searchParams;
  const keyword = (resolvedSearchParams.q ?? "").trim();
  const selectedCategoryId = (resolvedSearchParams.category ?? "").trim();

  const parsedPage = Number(resolvedSearchParams.page ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const categoriesResult = await getNewsCategories();
  const categories = categoriesResult.categories;

  const activeCategory = categories.find((item) => item.id === selectedCategoryId);

  const [newsResult, categoryTotals] = await Promise.all([
    getNewsList({
      page: currentPage,
      pageSize: 6,
      keyword,
      categoryId: selectedCategoryId,
      fallbackCategoryName: activeCategory?.name,
    }),
    getNewsCategoryTotals(categories.map((item) => item.id)),
  ]);

  const warning = newsResult.warning ?? categoriesResult.warning;
  const pageTokens = buildPageTokens(newsResult.pagination.page, newsResult.pagination.totalPages);
  const totalAll = totalCount(categoryTotals, categories, newsResult.pagination.total);

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex text-sm font-medium text-slate-500 dark:text-slate-400"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link className="hover:text-primary" href="/">
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined mx-1 text-base">chevron_right</span>
                <span className="text-slate-900 dark:text-slate-100">Tin tức &amp; Sự kiện</span>
              </div>
            </li>
          </ol>
        </nav>

        {warning ? (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
            {warning}
          </div>
        ) : null}

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="order-2 flex w-full flex-col gap-8 lg:order-1 lg:w-80">
            <section className="lg:hidden">
              <form action="/tin-tuc" className="relative" method="get">
                {selectedCategoryId ? <input name="category" type="hidden" value={selectedCategoryId} /> : null}
                <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-slate-400">search</span>
                </span>
                <input
                  className="w-full rounded-xl border-none bg-white py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary dark:bg-slate-800"
                  defaultValue={keyword}
                  name="q"
                  placeholder="Tìm kiếm tin tức..."
                  type="text"
                />
              </form>
            </section>

            <section className="overflow-hidden rounded-2xl border border-primary/20 border-b-4 border-b-primary bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold">Danh mục tin tức</h2>
              </div>

              <div className="p-2">
                <Link
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    selectedCategoryId
                      ? "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      : "bg-primary/10 text-primary"
                  }`}
                  href={buildCategoryHref("", keyword)}
                >
                  <span className="material-symbols-outlined">analytics</span>
                  <span className={selectedCategoryId ? "text-sm font-medium" : "text-sm font-semibold"}>Tất cả</span>
                  <span
                    className={
                      selectedCategoryId
                        ? "ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800"
                        : "ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs"
                    }
                  >
                    {totalAll}
                  </span>
                </Link>

                {categories.map((category, index) => {
                  const icon = categoryIcons[index % categoryIcons.length];
                  const isActive = category.id === selectedCategoryId;
                  return (
                    <Link
                      key={category.id}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                      href={buildCategoryHref(category.id, keyword)}
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                      <span className={isActive ? "text-sm font-semibold" : "text-sm font-medium"}>{category.name}</span>
                      <span
                        className={
                          isActive
                            ? "ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs"
                            : "ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800"
                        }
                      >
                        {categoryTotals[category.id] ?? 0}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-4 px-1 text-base font-bold">Tags phổ biến</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <a
                    key={tag}
                    className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary hover:text-white dark:bg-slate-800"
                    href="#"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-xl bg-primary p-6 text-white">
              <h3 className="mb-2 text-lg font-bold">Hỗ trợ thông tin</h3>
              <p className="mb-4 text-sm leading-relaxed text-white/80">
                Gửi câu hỏi hoặc ý kiến đóng góp cho chúng tôi để cải thiện chất lượng dịch vụ.
              </p>
              <button
                className="w-full rounded-xl bg-white py-2 font-bold text-primary shadow-lg transition-all hover:bg-white/90"
                type="button"
              >
                Gửi yêu cầu
              </button>
            </section>
          </aside>

          <section className="order-1 flex-1 lg:order-2">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="mb-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                  Tin tức &amp; Sự kiện
                </h1>
                <div className="h-1.5 w-20 rounded-full bg-primary" />
              </div>

              <form action="/tin-tuc" className="flex items-center gap-2" method="get">
                {selectedCategoryId ? <input name="category" type="hidden" value={selectedCategoryId} /> : null}
                <input
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  defaultValue={keyword}
                  name="q"
                  placeholder="Từ khóa tìm kiếm"
                  type="text"
                />
                <button
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  type="submit"
                >
                  Tìm
                </button>
              </form>
            </div>

            {newsResult.items.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                Không tìm thấy bài viết phù hợp với điều kiện hiện tại.
              </div>
            ) : (
              <div className="space-y-6">
                {newsResult.items.map((item) => (
                  <article
                    key={item.id}
                    className="group flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-primary/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary/40 sm:flex-row"
                  >
                    <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg sm:w-56">
                      <img
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={item.imageUrl}
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold tracking-wider text-primary uppercase">{item.category}</span>
                          <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            {formatViDateTime(item.publishedAt ?? item.createdAt)}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
                          <Link href={`/tin-tuc/${item.slug}`}>{item.title}</Link>
                        </h2>

                        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                          href={`/tin-tuc/${item.slug}`}
                        >
                          Xem chi tiết
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>

                        <button className="text-slate-400 hover:text-primary" type="button">
                          <span className="material-symbols-outlined">bookmark</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-12 flex items-center justify-center gap-2">
              <Link
                aria-disabled={!newsResult.pagination.hasPrev}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors dark:border-slate-800 dark:text-slate-400 ${
                  newsResult.pagination.hasPrev
                    ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "pointer-events-none opacity-40"
                }`}
                href={buildHref(Math.max(newsResult.pagination.page - 1, 1), keyword, selectedCategoryId)}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </Link>

              {pageTokens.map((token, index) => {
                if (token === "ellipsis") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                      ...
                    </span>
                  );
                }

                const isActive = token === newsResult.pagination.page;
                return isActive ? (
                  <span
                    key={token}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-white"
                  >
                    {token}
                  </span>
                ) : (
                  <Link
                    key={token}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                    href={buildHref(token, keyword, selectedCategoryId)}
                  >
                    {token}
                  </Link>
                );
              })}

              <Link
                aria-disabled={!newsResult.pagination.hasNext}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors dark:border-slate-800 dark:text-slate-400 ${
                  newsResult.pagination.hasNext
                    ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "pointer-events-none opacity-40"
                }`}
                href={buildHref(
                  Math.min(newsResult.pagination.page + 1, newsResult.pagination.totalPages),
                  keyword,
                  selectedCategoryId,
                )}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      
    </div>
  );
}
