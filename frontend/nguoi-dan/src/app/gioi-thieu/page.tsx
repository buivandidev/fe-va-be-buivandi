import Link from "next/link";

export default function GioiThieu() {
  const commitments = [
    "Lấy người dân và doanh nghiệp làm trung tâm phục vụ.",
    "Minh bạch quy trình, rút ngắn thời gian giải quyết hồ sơ.",
    "Đẩy mạnh chuyển đổi số và liên thông dữ liệu hành chính.",
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          Giới thiệu
        </span>
        <h1 className="gov-section-title mt-3 text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Bộ máy chính quyền địa phương</h1>
        <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
          Trang thông tin giúp người dân và doanh nghiệp nắm rõ cơ cấu tổ chức, phạm vi nhiệm vụ và nguyên tắc vận hành của
          chính quyền địa phương. Mục tiêu là phục vụ nhanh hơn, minh bạch hơn và nhất quán trên toàn bộ quy trình hành chính.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {commitments.map((item) => (
            <article key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-200">{item}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cơ cấu tổ chức</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Gồm Hội đồng nhân dân, Ủy ban nhân dân, các cơ quan chuyên môn và đơn vị sự nghiệp công lập trực thuộc theo phân
              cấp quản lý của địa phương.
            </p>
          </section>
          <section className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nhóm chức năng chính</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <li>Quản lý nhà nước trên các lĩnh vực kinh tế, xã hội, quốc phòng và an ninh.</li>
              <li>Tổ chức cung cấp dịch vụ hành chính công cho người dân, tổ chức và doanh nghiệp.</li>
              <li>Theo dõi, đánh giá và cải tiến chất lượng phục vụ theo phản hồi thực tế.</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/so-do-trang" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Xem sơ đồ thông tin
          </Link>
          <Link href="/lien-he" className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">
            Liên hệ bộ phận phụ trách
          </Link>
        </div>
      </div>
    </main>
  );
}
