import Link from "next/link";
import { buildApiUrl, isGuid } from "@/lib/api";
import { getServiceCategories } from "@/lib/news-api";

// Định nghĩa cơ bản DTO từ BE
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

// Params cho Server Component
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getServices(page: number, keyword: string = "", category: string = "") {
  try {
    const query = new URLSearchParams();
    query.append("trang", page.toString());
    query.append("kichThuocTrang", "6");
    if (keyword) query.append("tuKhoa", keyword);
    if (category && isGuid(category)) query.append("danhMucId", category);

    const res = await fetch(buildApiUrl(`/api/services?${query.toString()}`), {
        cache: "no-store",
    });
    if (!res.ok) return { items: [], totalPages: 1 };
    
    const data = await res.json();
    if (data.thanhCong && data.duLieu) {
      const danhSach = Array.isArray(data.duLieu.muc) ? data.duLieu.muc : Array.isArray(data.duLieu.danhSach) ? data.duLieu.danhSach : [];
      const tongSoTrang = data.duLieu.tongSoTrang ?? data.duLieu.tongTrang ?? 1;
      const tongSoMuc = data.duLieu.tongSoMuc ?? data.duLieu.tongSo ?? danhSach.length;

      return {
        items: danhSach as DichVuDto[],
        totalPages: Math.max(1, tongSoTrang),
        totalCount: tongSoMuc,
      };
    }
    return { items: [], totalPages: 1 };
  } catch {
    return { items: [], totalPages: 1 };
  }
}

export default async function DichVuCongPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const keyword = typeof resolvedSearchParams?.q === "string" ? resolvedSearchParams.q : "";
  const currentCategory = typeof resolvedSearchParams?.cat === "string" ? resolvedSearchParams.cat : "";

  const [servicesData, categoriesData] = await Promise.all([
    getServices(currentPage, keyword, currentCategory),
    getServiceCategories()
  ]);

  const { items: services, totalPages, totalCount } = servicesData;
  const { categories } = categoriesData;

  const categoryIcons = ["family_history", "holiday_village", "storefront", "verified", "description"];

  return (
    <div className="bg-slate-50/50 dark:bg-background-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-slate-900 px-4 py-16 md:py-24 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] rounded-full translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2" />
        
        <div className="relative mx-auto max-w-5xl text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-black text-white/80 uppercase tracking-widest backdrop-blur-md border border-white/10 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Hệ thống Dịch vụ công trực tuyến
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Nhanh chóng. Minh bạch. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Gần gũi với Nhân dân.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 font-medium mb-12">
            Thực hiện các thủ tục hành chính mọi lúc, mọi nơi. Chúng tôi cam kết xử lý hồ sơ đúng hạn và công khai tiến độ.
          </p>

          <form action="/dich-vu-cong" method="GET" className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl group focus-within:border-primary/50 transition-all">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                type="text"
                name="q"
                defaultValue={keyword}
                className="block w-full rounded-2xl border-none bg-transparent py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-0"
                placeholder="Nhập tên dịch vụ, thủ tục..."
              />
              {currentCategory && <input type="hidden" name="cat" value={currentCategory} />}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
            >
              TÌM KIẾM
            </button>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row gap-8 px-4 py-12 md:px-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 px-1">Lĩnh vực phổ biến</h3>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/dich-vu-cong"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                    !currentCategory 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">all_inclusive</span>
                  Tất cả dịch vụ
                </Link>
                {categories.map((cat, index) => (
                  <Link
                    key={cat.id}
                    href={`/dich-vu-cong?cat=${cat.id}${keyword ? `&q=${keyword}` : ''}`}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                      currentCategory === cat.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{categoryIcons[index % categoryIcons.length]}</span>
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden lg:block rounded-[2.5rem] bg-slate-900 p-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <h4 className="text-xl font-black mb-4 relative z-10">Bạn cần hỗ trợ?</h4>
              <p className="text-slate-400 text-sm font-medium mb-6 relative z-10">Đội ngũ pháp lý sẵn sàng giải đáp thắc mắc về các thủ tục hành chính.</p>
              <Link href="/lien-he" className="flex items-center justify-center py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-slate-100 transition-colors relative z-10"> LIÊN HỆ NGAY </Link>
            </div>
          </div>
        </aside>

        {/* List Section */}
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {keyword ? `Kết quả cho "${keyword}"` : "Dịch vụ công cấp Phường/Xã"}
            </h2>
            <div className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-xs font-black text-slate-500 tracking-wider uppercase">
              {totalCount ?? 0} Thủ tục
            </div>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="material-symbols-outlined mb-6 text-7xl text-slate-200 dark:text-slate-800">find_in_page</span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">Không tìm thấy yêu cầu</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">Vui lòng điều chỉnh từ khóa tìm kiếm hoặc chọn lĩnh vực khác để tiếp tục.</p>
                <Link href="/dich-vu-cong" className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">Xóa bộ lọc</Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {services.map((service, index) => (
                <Link 
                  key={service.id} 
                  href={`/dich-vu-cong/${service.id}`}
                  className="group block p-1 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 transition-all hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1">
                    <div className="h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined text-3xl font-bold">assignment</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{service.tenLinhVuc || "Tiêu chuẩn"}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{service.maDichVu}</span>
                       </div>
                       <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary transition-colors">
                          {service.ten}
                       </h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 font-medium">
                          {service.moTa || "Vui lòng xem chi tiết quy trình thực hiện và thành phần hồ sơ theo hướng dẫn."}
                       </p>
                    </div>
                    <div className="flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Xử lý trong</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white italic">{service.soNgayXuLy} ngày</p>
                       </div>
                       <div className="h-12 w-12 rounded-full border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                          <span className="material-symbols-outlined">arrow_forward_ios</span>
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center pb-12">
              <nav className="inline-flex gap-2 p-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Link
                    key={i + 1}
                    href={`/dich-vu-cong?page=${i + 1}${keyword ? `&q=${keyword}` : ''}${currentCategory ? `&cat=${currentCategory}` : ''}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black transition-all ${
                      currentPage === i + 1
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

