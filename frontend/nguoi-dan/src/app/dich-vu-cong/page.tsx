import Link from "next/link";
import { buildApiUrl, isGuid } from "@/lib/api";



// Äá»‹nh nghÄ©a cÆ¡ báº£n DTO tá»« BE
interface DichVuDto {
  id: string;
  maDichVu: string;
  ten: string;
  moTa: string;
  soNgayXuLy: number;
  lePhi: number | null;
  dangHoatDong: boolean;
  mucDo: number;
  linhVucId: string | null;
  tenLinhVuc: string | null;
}

// Params cho Server Component (Next.js 15 params/searchParams are Promises)
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getServices(page: number, keyword: string = "", category: string = "") {
  try {
    const query = new URLSearchParams();
    query.append("trang", page.toString());
    query.append("kichThuocTrang", "6");
    if (keyword) query.append("tuKhoa", keyword);
    // Náº¿u BE cĂ³ tham sá»‘ lá»c theo lÄ©nh vá»±c, thĂªm vĂ o Ä‘Ă¢y
    if (category && isGuid(category)) query.append("danhMucId", category);

    const res = await fetch(buildApiUrl(`/api/services?${query.toString()}`), {
        cache: "no-store",
    });
    if (!res.ok) return { items: [], totalPages: 1 };
    
    const data = await res.json();
    if (data.thanhCong && data.duLieu) {
      const danhSach = Array.isArray(data.duLieu.muc)
        ? data.duLieu.muc
        : Array.isArray(data.duLieu.danhSach)
          ? data.duLieu.danhSach
          : [];

      const tongSoTrang = typeof data.duLieu.tongSoTrang === "number"
        ? data.duLieu.tongSoTrang
        : typeof data.duLieu.tongTrang === "number"
          ? data.duLieu.tongTrang
          : 1;

      const tongSoMuc = typeof data.duLieu.tongSoMuc === "number"
        ? data.duLieu.tongSoMuc
        : typeof data.duLieu.tongSo === "number"
          ? data.duLieu.tongSo
          : danhSach.length;

      return {
        items: danhSach as DichVuDto[],
        totalPages: Math.max(1, tongSoTrang),
        totalCount: tongSoMuc,
      };
    }
    return { items: [], totalPages: 1 };
  } catch (error) {
    console.error("Lá»—i khi gá»i API dá»‹ch vá»¥:", error);
    return { items: [], totalPages: 1 };
  }
}

export default async function DichVuCongPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const keyword = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const currentCategory = typeof resolvedSearchParams?.cat === "string" ? resolvedSearchParams.cat : "";

  const { items: services, totalPages, totalCount } = await getServices(currentPage, keyword, currentCategory);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 py-16 dark:bg-slate-900 md:px-10">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.svg')] bg-center opacity-5 dark:opacity-10"></div>
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary dark:bg-primary/20">
            Cá»•ng Dá»‹ch Vá»¥ CĂ´ng
          </span>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
            Nhanh chĂ³ng, Minh báº¡ch & <span className="text-secondary">Hiá»‡u quáº£</span>
          </h1>
          <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
            Thá»±c hiá»‡n cĂ¡c thá»§ tá»¥c hĂ nh chĂ­nh má»i lĂºc, má»i nÆ¡i. Há»‡ thá»‘ng cung cáº¥p hĂ ng trÄƒm dá»‹ch vá»¥ cĂ´ng trá»±c tuyáº¿n má»©c Ä‘á»™ cao, giĂºp tiáº¿t kiá»‡m thá»i gian vĂ  chi phĂ­ cho ngÆ°á»i dĂ¢n vĂ  doanh nghiá»‡p.
          </p>

          {/* Search Form (Server Component fallback using form action method GET) */}
          <form action="/dich-vu-cong" method="GET" className="mx-auto flex max-w-2xl flex-col items-center gap-3 sm:flex-row">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="material-symbols-outlined text-slate-400">search</span>
              </div>
              <input
                type="text"
                name="q"
                defaultValue={keyword}
                className="block w-full rounded-xl border border-slate-300 bg-slate-50 p-4 pl-12 text-sm text-slate-900 shadow-sm transition-colors focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-primary dark:focus:ring-primary"
                placeholder="Nháº­p tĂªn thá»§ tá»¥c, tá»« khĂ³a... (VD: Khai sinh)"
              />
               {/* Preserve category  */}
               {currentCategory && <input type="hidden" name="cat" value={currentCategory} />}
            </div>
            <button
              type="submit"
              className="w-full whitespace-nowrap rounded-xl bg-primary px-8 py-4 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 sm:w-auto"
            >
              TĂ¬m kiáº¿m
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-12 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row">
          
          {/* Sidebar / Filters */}
          <aside className="w-full shrink-0 md:w-64 lg:w-72">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">LÄ©nh vá»±c thá»§ tá»¥c</h3>
              <ul className="space-y-2">
                {[
                  { id: "", name: "Táº¥t cáº£ lÄ©nh vá»±c", icon: "widgets" },
                  { id: "ho-tich", name: "Há»™ tá»‹ch", icon: "family_history" },
                  { id: "dat-dai", name: "Äáº¥t Ä‘ai, XĂ¢y dá»±ng", icon: "holiday_village" },
                  { id: "kinh-doanh", name: "ÄÄƒng kĂ½ kinh doanh", icon: "storefront" },
                  { id: "chung-thuc", name: "Chá»©ng thá»±c", icon: "verified" },
                ].map((cat) => (
                  <li key={cat.id || "all"}>
                    <Link
                      href={`/dich-vu-cong?${new URLSearchParams({
                         ...(keyword ? { q: keyword } : {}),
                         ...(cat.id ? { cat: cat.id } : {})
                      }).toString()}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        currentCategory === cat.id 
                        ? "bg-primary/10 font-bold text-primary dark:bg-primary/20" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Services List */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {keyword ? `Káº¿t quáº£ tĂ¬m kiáº¿m cho "${keyword}"` : "Danh sĂ¡ch Dá»‹ch vá»¥ cĂ´ng"}
              </h2>
              <span className="text-sm text-slate-500 font-medium">
                {totalCount !== undefined ? `TĂ¬m tháº¥y ${totalCount}` : services.length} thá»§ tá»¥c
              </span>
            </div>

            {services.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="material-symbols-outlined mb-4 text-6xl text-slate-300 dark:text-slate-700">search_off</span>
                  <h3 className="mb-2 text-xl font-bold text-slate-700 dark:text-slate-300">KhĂ´ng tĂ¬m tháº¥y thá»§ tá»¥c nĂ o</h3>
                  <p className="text-slate-500 dark:text-slate-400">Vui lĂ²ng thá»­ láº¡i vá»›i tá»« khĂ³a khĂ¡c hoáº·c Ä‘iá»u chá»‰nh bá»™ lá»c.</p>
                  <Link href="/dich-vu-cong" className="mt-4 text-primary hover:underline font-semibold">Xem táº¥t cáº£ thá»§ tá»¥c</Link>
               </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                {services.map((service) => (
                    <div key={service.id} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary/50">
                    <div>
                        <div className="mb-3 flex items-start justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[14px]">folder</span>
                            {service.tenLinhVuc || "Chung"}
                        </span>
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${service.dangHoatDong ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                            {service.dangHoatDong ? 'Trá»±c tuyáº¿n' : 'Táº¡m ngÆ°ng'}
                        </span>
                        </div>
                        <Link href={`/dich-vu-cong/${service.id}`}>
                        <h3 className="mb-3 text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-primary dark:text-slate-100">
                            {service.ten}
                        </h3>
                        </Link>
                        <p className="mb-4 text-sm text-slate-600 line-clamp-3 dark:text-slate-400">
                           {service.moTa || "ChÆ°a cĂ³ mĂ´ táº£ chi tiáº¿t cho thá»§ tá»¥c nĂ y."}
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">schedule</span>
                            {service.soNgayXuLy > 0 ? `${service.soNgayXuLy} ngĂ y` : 'TĂ¹y há»“ sÆ¡'}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">payments</span>
                            {service.lePhi != null && service.lePhi > 0 ? `${service.lePhi.toLocaleString('vi-VN')}Ä‘` : 'Miá»…n phĂ­'}
                        </span>
                        </div>
                        
                        <Link
                        href={`/dich-vu-cong/${service.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-primary group-hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-primary dark:group-hover:text-white"
                        >
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                    </div>
                ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <Link
                    href={`/dich-vu-cong?${new URLSearchParams({ page: Math.max(1, currentPage - 1).toString(), ...(keyword ? {q: keyword} : {}), ...(currentCategory ? {cat: currentCategory} : {}) }).toString()}`}
                    className={`flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "pointer-events-none text-slate-300 dark:text-slate-600"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </Link>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link
                      key={i + 1}
                      href={`/dich-vu-cong?${new URLSearchParams({ page: (i + 1).toString(), ...(keyword ? {q: keyword} : {}), ...(currentCategory ? {cat: currentCategory} : {}) }).toString()}`}
                      className={`flex items-center border-l border-slate-200 px-4 py-2 text-sm font-bold transition-colors dark:border-slate-800 ${
                        currentPage === i + 1
                          ? "bg-primary text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}

                  <Link
                    href={`/dich-vu-cong?${new URLSearchParams({ page: Math.min(totalPages, currentPage + 1).toString(), ...(keyword ? {q: keyword} : {}), ...(currentCategory ? {cat: currentCategory} : {}) }).toString()}`}
                    className={`flex items-center border-l border-slate-200 px-4 py-2 text-sm font-medium transition-colors dark:border-slate-800 ${
                      currentPage === totalPages
                        ? "pointer-events-none text-slate-300 dark:text-slate-600"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>

      
    </div>
  );
}

