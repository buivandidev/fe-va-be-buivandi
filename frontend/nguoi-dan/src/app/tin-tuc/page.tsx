import Link from 'next/link';
import { getNewsCategories, getNewsCategoryTotals } from "@/lib/news-api";
import { NewsList } from "@/components/news/news-list";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  page?: string;
  category?: string;
};

type NewsListPageProps = {
  searchParams: Promise<SearchParams>;
};


const tags = ["Chính sách mới", "Phát triển đô thị", "An sinh xã hội", "Số hóa", "Môi trường"];
const categoryIcons = ["analytics", "account_balance", "map", "medical_services", "school", "article"];

function buildCategoryHref(categoryId: string, keyword: string): string {
  const query = new URLSearchParams();
  if (keyword) query.set("q", keyword);
  if (categoryId) query.set("category", categoryId);
  const suffix = query.toString();
  return suffix ? `/tin-tuc?${suffix}` : "/tin-tuc";
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

  const categoryTotals = await getNewsCategoryTotals(categories.map((item) => item.id));

  const warning = categoriesResult.warning;

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
                  <span className="material-symbols-outlined gov-icon">analytics</span>
                  <span className={selectedCategoryId ? "text-sm font-medium" : "text-sm font-semibold"}>Tất cả</span>
                  <span
                    className={
                      selectedCategoryId
                        ? "ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800"
                        : "ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs"
                    }
                  >
                    {Object.values(categoryTotals).reduce((a, b) => a + b, 0)}
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
                      <span className="material-symbols-outlined gov-icon">{icon}</span>
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
                  <Link
                    key={tag}
                    className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary hover:text-white dark:bg-slate-800"
                    href={`/tin-tuc?q=${encodeURIComponent(tag)}`}
                  >
                    {tag}
                  </Link>
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
                <h1 className="gov-section-title mb-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
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
            <NewsList
              page={currentPage}
              pageSize={6}
              keyword={keyword}
              categoryId={selectedCategoryId}
              fallbackCategoryName={activeCategory?.name}
            />
          </section>
        </div>
      </main>

      
    </div>
  );
}
