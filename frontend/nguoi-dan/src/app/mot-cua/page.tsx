import Link from "next/link";

export default function MotCuaDienTu() {
  const benefits = [
    "Tiếp nhận và xử lý hồ sơ theo quy trình số hóa, liên thông nhiều cấp.",
    "Theo dõi trạng thái xử lý minh bạch, cập nhật theo từng bước nghiệp vụ.",
    "Giảm thời gian đi lại nhờ nộp hồ sơ trực tuyến và nhận thông báo tự động.",
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <div className="text-center">
          <span className="material-symbols-outlined gov-icon mb-4 block text-6xl text-primary">computer</span>
          <h1 className="gov-section-title text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Hệ thống một cửa điện tử</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
            Nền tảng hỗ trợ tiếp nhận, xử lý và trả kết quả thủ tục hành chính trên môi trường số, bảo đảm đồng bộ dữ liệu và
            minh bạch quy trình giữa các cơ quan chuyên môn.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((item) => (
            <article key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              {item}
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dang-nhap" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Đăng nhập hệ thống
          </Link>
          <Link href="/tra-cuu" className="rounded-lg border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
            Tra cứu hồ sơ
          </Link>
          <Link href="/lien-he/hoi-dap" className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-600 dark:text-slate-200">
            Hỗ trợ kỹ thuật
          </Link>
        </div>
      </div>
    </main>
  );
}
