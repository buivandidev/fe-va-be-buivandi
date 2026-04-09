import Link from "next/link";

export default function QuyHoachKienTruc() {
  const planningItems = [
    {
      title: "Bản đồ định hướng không gian đô thị",
      desc: "Cập nhật khu vực phát triển mới, vùng chỉnh trang và các trục giao thông ưu tiên.",
    },
    {
      title: "Kế hoạch sử dụng đất theo giai đoạn",
      desc: "Thông tin chỉ tiêu sử dụng đất phục vụ tra cứu và đối chiếu hồ sơ đầu tư, xây dựng.",
    },
    {
      title: "Danh mục dự án trọng điểm",
      desc: "Theo dõi tiến độ các dự án hạ tầng, nhà ở xã hội và công trình công cộng thiết yếu.",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          Quy hoạch
        </span>
        <h1 className="gov-section-title mt-3 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Quy hoạch kiến trúc và phát triển đô thị</h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
          Cung cấp thông tin công khai về đồ án quy hoạch phân khu, quy hoạch chi tiết và các dự án trọng điểm. Dữ liệu được
          trình bày dễ tra cứu để hỗ trợ người dân, doanh nghiệp và nhà đầu tư theo dõi định hướng phát triển địa phương.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {planningItems.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm leading-relaxed text-primary">
          Dữ liệu quy hoạch được cập nhật theo từng đợt công bố chính thức. Người dân có thể liên hệ bộ phận chuyên môn để xác
          minh thông tin phục vụ hồ sơ xây dựng, đất đai và đầu tư.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/lien-he" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Liên hệ phòng quản lý đô thị
          </Link>
          <Link href="/van-ban-phap-luat" className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
            Tra cứu văn bản liên quan
          </Link>
        </div>
      </div>
    </main>
  );
}
