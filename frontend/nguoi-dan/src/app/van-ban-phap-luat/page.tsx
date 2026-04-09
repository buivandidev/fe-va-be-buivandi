"use client";

import Link from "next/link";

export default function VanBanPhapLuat() {
  const documents = [
    {
      id: "102-2023-qd-ubnd",
      soKyHieu: "102/2023/QD-UBND",
      coQuan: "Ủy ban nhân dân tỉnh",
      trichYeu: "Quy định về phân cấp quản lý trật tự xây dựng trên địa bàn tỉnh.",
      ngayBanHanh: "15/10/2023",
      hieuLuc: "Đang hiệu lực",
      loai: "Quyết định",
    },
    {
      id: "85-ct-ubnd",
      soKyHieu: "85/CT-UBND",
      coQuan: "Chủ tịch UBND tỉnh",
      trichYeu: "Chỉ thị về đẩy mạnh chuyển đổi số toàn diện trong các cơ quan nhà nước năm 2024.",
      ngayBanHanh: "02/01/2024",
      hieuLuc: "Đang hiệu lực",
      loai: "Chỉ thị",
    },
    {
      id: "231-kh-stp",
      soKyHieu: "231/KH-STP",
      coQuan: "Sở Tư pháp",
      trichYeu: "Kế hoạch phổ biến, giáo dục pháp luật cho người dân và doanh nghiệp quý II/2024.",
      ngayBanHanh: "20/03/2024",
      hieuLuc: "Mới ban hành",
      loai: "Kế hoạch",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            Cổng tra cứu
          </span>
          <h1 className="gov-section-title text-3xl font-black text-slate-900 dark:text-white md:text-4xl">Hệ thống văn bản pháp quy</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
            Tra cứu nhanh văn bản quy phạm pháp luật, chỉ thị điều hành và kế hoạch chuyên đề. Thông tin được trình bày
            rõ ràng để người dân và doanh nghiệp dễ theo dõi, đối chiếu và sử dụng.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Nhập số ký hiệu, cơ quan ban hành hoặc từ khóa trích yếu..."
              className="h-12 flex-1 rounded-lg border border-slate-300 px-4 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            <button className="h-12 rounded-lg bg-primary px-6 text-sm font-bold text-white transition-colors hover:bg-primary-dark">
              Tìm kiếm
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Từ khóa gợi ý:</span>
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-900">chuyển đổi số</span>
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-900">quy hoạch</span>
            <span className="rounded-full bg-white px-3 py-1 dark:bg-slate-900">đất đai</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Danh sách văn bản mới cập nhật</p>
            <span className="text-xs text-slate-500 dark:text-slate-400">{documents.length} văn bản</span>
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/70">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">Số, ký hiệu</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">Cơ quan ban hành</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">Trích yếu</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">Ngày ban hành</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">Hiệu lực</th>
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.soKyHieu}
                    className="border-t border-slate-200 bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-100">{doc.soKyHieu}</p>
                      <p className="mt-1 text-xs text-slate-500">{doc.loai}</p>
                    </td>
                    <td className="px-5 py-4">{doc.coQuan}</td>
                    <td className="px-5 py-4">
                      <p className="line-clamp-2 max-w-[420px] leading-relaxed">{doc.trichYeu}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">{doc.ngayBanHanh}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          doc.hieuLuc === "Mới ban hành"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                        }`}
                      >
                        {doc.hieuLuc}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/van-ban/${doc.id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          Xem chi tiết
                        </Link>
                        <Link
                          href={`/van-ban/${doc.id}`}
                          className="flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-primary hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/van-ban/${doc.id}`;
                            setTimeout(() => {
                              const downloadBtn = document.querySelector('[data-download]') as HTMLButtonElement;
                              downloadBtn?.click();
                            }, 500);
                          }}
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          Tải về
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300 md:flex-row md:items-center md:justify-between">
          <p>
            Cần hỗ trợ tra cứu nâng cao hoặc xác minh văn bản? Vui lòng liên hệ bộ phận một cửa hoặc gửi câu hỏi trực tuyến.
          </p>
          <Link
            href="/lien-he/hoi-dap"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-primary px-4 font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Gửi câu hỏi
          </Link>
        </div>
      </div>
    </main>
  );
}
