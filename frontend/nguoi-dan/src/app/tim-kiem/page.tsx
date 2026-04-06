import Link from "next/link";

// Định nghĩa types từ Search API
interface SearchResult {
  loai: "TinTuc" | "DichVuCong" | "TaiLieu";
  id: string;
  tieuDe: string;
  moTa: string;
  ungDungTrucTuyen?: boolean;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getGlobalSearch(keyword: string) {
  if (!keyword) return [];
  try {
    const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(keyword)}`, { 
        cache: "no-store" 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.thanhCong ? (data.duLieu as SearchResult[]) : [];
  } catch (error) {
    console.error("Lỗi tim kiếm toàn cục:", error);
    return [];
  }
}

export default async function GlobalSearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const keyword = typeof params.q === "string" ? params.q : "";
  const results = await getGlobalSearch(keyword);

  const getIconForType = (type: string) => {
    switch (type) {
      case "TinTuc": return "article";
      case "DichVuCong": return "assignment";
      case "TaiLieu": return "description";
      default: return "search";
    }
  };

  const getLinkForType = (type: string, id: string) => {
    switch (type) {
      case "TinTuc": return `/tin-tuc/${id}`;
      case "DichVuCong": return `/dich-vu-cong/${id}`;
      case "TaiLieu": return `/tai-lieu/${id}`;
      default: return "#";
    }
  };

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-12 md:px-10">
        
        <div className="mb-10 text-center">
             <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl">Tìm kiếm</h1>
             <form action="/tim-kiem" method="GET" className="mx-auto flex max-w-2xl flex-col items-center gap-3 sm:flex-row">
                <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="material-symbols-outlined text-slate-400">search</span>
                    </div>
                    <input
                        type="text"
                        name="q"
                        defaultValue={keyword}
                        autoFocus
                        className="block w-full rounded-full border border-slate-300 bg-white p-4 pl-12 text-sm text-slate-900 shadow-sm transition-colors focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-primary dark:focus:ring-primary"
                        placeholder="Tìm kiếm tin tức, thủ tục hành chính, tài liệu..."
                    />
                </div>
                <button
                    type="submit"
                    className="w-full whitespace-nowrap rounded-full bg-primary px-8 py-4 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 sm:w-auto"
                >
                    Tìm
                </button>
            </form>
        </div>

        {/* Kết quả */}
        {keyword && (
           <div className="mt-4 border-t border-slate-200 pt-8 dark:border-slate-800">
              <h2 className="mb-6 text-xl font-bold dark:text-white">
                  {`Tìm thấy `}<span className="text-primary">{results.length}</span>{` kết quả cho "${keyword}"`}
              </h2>

              {results.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined mb-2 text-6xl opacity-50">search_off</span>
                    <p>Rất tiếc! Không có nội dung nào phù hợp.</p>
                 </div>
              ) : (
                  <div className="space-y-6">
                    {results.map((item, idx) => (
                       <Link key={`${item.id}-${idx}`} href={getLinkForType(item.loai, item.id)} className="group block rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md hover:ring-primary dark:bg-slate-900 dark:ring-slate-800 dark:hover:ring-primary/50">
                          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                             <div className="flex items-center gap-1.5 uppercase tracking-wider">
                                <span className="material-symbols-outlined text-[16px]">{getIconForType(item.loai)}</span>
                                {item.loai === "DichVuCong" ? "Dịch vụ công" : item.loai === "TinTuc" ? "Tin tức" : "Khác"}
                             </div>
                             {item.loai === "DichVuCong" && (
                               <span className="rounded bg-green-100 px-2 py-0.5 font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">Nộp qua mạng</span>
                             )}
                          </div>
                          <h3 className="mb-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
                             {/* Simple Highlight simulation (nếu cần dùng thư viện) */}
                             {item.tieuDe}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-400">{item.moTa}</p>
                       </Link>
                    ))}
                  </div>
              )}
           </div>
        )}
      </main>

      
    </div>
  );
}