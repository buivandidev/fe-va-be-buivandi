import Link from "next/link";

export default function KhaoSat() {
  const surveys = [
    {
      title: "Lấy ý kiến dự thảo chính sách an sinh xã hội",
      deadline: "10/10/2024 - 25/11/2024",
      status: "Đang mở",
    },
    {
      title: "Đánh giá mức độ hài lòng khi sử dụng dịch vụ công trực tuyến",
      deadline: "Thực hiện thường xuyên",
      status: "Đang mở",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          Khảo sát
        </span>
        <h1 className="gov-section-title mt-3 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Khảo sát và lấy ý kiến người dân</h1>
        <p className="mt-4 border-b border-slate-200 pb-6 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300 md:text-base">
          Mời bạn tham gia đóng góp ý kiến cho các chương trình, chính sách và chất lượng phục vụ hành chính công. Mọi phản hồi
          đều được tổng hợp để cải tiến trải nghiệm thực tế.
        </p>

        <div className="mt-6 space-y-4">
          {surveys.map((survey) => (
            <article
              key={survey.title}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 p-5 transition-colors hover:border-primary/40 dark:border-slate-700 md:flex-row md:items-center"
            >
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{survey.title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Thời gian: {survey.deadline}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                  {survey.status}
                </span>
                <Link
                  href="/lien-he/gop-y"
                  className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Tham gia
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/lien-he/gop-y" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Gửi góp ý chi tiết
          </Link>
          <Link href="/lien-he/hoi-dap" className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
            Cần hỗ trợ giải đáp
          </Link>
        </div>
      </div>
    </main>
  );
}
