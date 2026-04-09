import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceDetail } from "@/lib/news-api";

// Trang chi tiết thủ tục hành chính
export default async function DichVuCongDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const service = await getServiceDetail(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-slate-50/50 dark:bg-background-dark min-h-screen pb-20">
      <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/dich-vu-cong" className="hover:text-primary transition-colors">Danh sách dịch vụ</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-bold text-primary truncate max-w-[200px] md:max-w-none">{service.name}</span>
        </nav>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Top Banner section */}
          <div className="bg-primary/5 p-8 md:p-12 border-b border-primary/10">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Mức độ: Toàn trình
              </span>
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-black px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                Lĩnh vực: {service.categoryName}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
              {service.name}
            </h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-lg">
              Mã thủ tục: <span className="text-primary font-bold">{service.code}</span>
            </p>
          </div>

          <div className="p-8 md:p-12">
            {/* Procedure Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-primary mb-4">
                  <span className="material-symbols-outlined text-2xl">schedule</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Thời gian giải quyết</p>
                <p className="text-lg font-black text-slate-800 dark:text-slate-100">{service.processingDays} ngày làm việc</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-emerald-500 mb-4">
                  <span className="material-symbols-outlined text-2xl">payments</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phí & Lệ phí</p>
                <p className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {service.fee > 0 ? `${service.fee.toLocaleString('vi-VN')} VNĐ` : 'Miễn phí'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-blue-500 mb-4">
                  <span className="material-symbols-outlined text-2xl">account_balance</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Cơ quan thực hiện</p>
                <p className="text-lg font-black text-slate-800 dark:text-slate-100">UBND Phường/Xã</p>
              </div>
            </div>

            {/* Detailed Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <section>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="h-8 w-1 bg-primary rounded-full" />
                    Mô tả trình tự thực hiện
                  </h3>
                  <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {service.description}
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                    <span className="h-8 w-1 bg-primary rounded-full" />
                    Thành phần hồ sơ
                  </h3>
                  <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                    {service.requiredDocuments}
                  </div>
                </section>
              </div>

              <aside className="space-y-6">
                <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 animate-in zoom-in-95 duration-1000">
                  <h4 className="text-2xl font-black mb-4">Sẵn sàng nộp hồ sơ?</h4>
                  <p className="text-white/80 text-sm mb-8 leading-relaxed font-medium">
                    Sử dụng tài khoản công dân Portal để thực hiện nộp hồ sơ trực tuyến một cách nhanh chóng nhất.
                  </p>
                  <Link 
                    href={`/dich-vu-cong/${id}/nop-truc-tuyen`}
                    className="flex w-full items-center justify-center gap-3 bg-white py-4 rounded-2xl text-primary font-black text-sm hover:bg-slate-50 transition-all shadow-lg group"
                  >
                    <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">send</span>
                    NỘP HỒ SƠ NGAY
                  </Link>
                </div>

                <div className="p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-4">
                  <h5 className="font-bold text-slate-900 dark:text-white">Hỗ trợ trực tuyến</h5>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="material-symbols-outlined text-primary">call</span>
                    0123-456-789
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="material-symbols-outlined text-primary">help</span>
                    Hướng dẫn quy trình
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
