import Link from "next/link";



export default function HoiDapPage() {
  const faqs = [
    {
      q: "Thời gian làm việc của Bộ phận một cửa là khi nào?",
      a: "Bộ phận một cửa làm việc từ Thứ 2 đến Thứ 6. Sáng từ 07:30 đến 11:30, Chiều từ 13:30 đến 17:00. Thứ 7 làm việc buổi sáng từ 07:30 đến 11:30. Nghỉ Chủ nhật và các ngày Lễ, Tết theo quy định.",
    },
    {
      q: "Làm thế nào để tra cứu tình trạng hồ sơ trực tuyến?",
      a: "Bạn có thể tra cứu tình trạng hồ sơ bằng cách vào mục 'Dịch vụ công' -> 'Tra cứu hồ sơ', sau đó nhập Mã hồ sơ và Số điện thoại đã đăng ký để hệ thống hiển thị trạng thái hiện tại.",
    },
    {
      q: "Thủ tục đăng ký khai sinh cần những giấy tờ gì?",
      a: "Cần chuẩn bị: Giấy chứng sinh bản chính; CMND/CCCD của người đi đăng ký; Sổ hộ khẩu/Giấy chứng nhận nhân khẩu tập thể/Giấy tạm trú; Giấy chứng nhận kết hôn của cha mẹ (nếu có).",
    },
    {
      q: "Phản ánh, kiến nghị hiện trường được xử lý trong bao lâu?",
      a: "Tùy thuộc vào tính chất và mức độ phức tạp của sự việc, thông thường thời gian tiếp nhận và xử lý phản ánh kiến nghị là từ 1 đến 3 ngày làm việc.",
    },
    {
      q: "Làm sao để đăng ký tài khoản trên Cổng dịch vụ công?",
      a: "Bạn chọn nút 'Đăng nhập/Đăng ký' ở góc trên bên phải màn hình, chọn 'Đăng ký công dân', sau đó điền đầy đủ các thông tin cá nhân (Họ tên, CMND/CCCD, SĐT, Email...) và làm theo hướng dẫn hệ thống.",
    }
  ];

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 md:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex text-sm font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link className="flex items-center text-slate-500 hover:text-primary dark:text-slate-400" href="/">
                <span className="material-symbols-outlined mr-1 text-lg">home</span>
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined mx-1 text-sm text-slate-400">chevron_right</span>
                <Link className="text-slate-500 hover:text-primary dark:text-slate-400" href="/lien-he">
                  Liên hệ & Hỗ trợ
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined mx-1 text-sm text-slate-400">chevron_right</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Câu hỏi thường gặp</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-3xl">live_help</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-slate-900 dark:text-slate-100">Câu hỏi thường gặp (FAQ)</h1>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Tổng hợp các câu hỏi phổ biến và lời giải đáp từ Ban quản trị cổng dịch vụ. Nếu bạn không tìm thấy câu trả lời cho vấn đề của mình, vui lòng gửi kiến nghị phản ánh.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">Q</span>
                  {faq.q}
                </div>
                <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="mt-4 flex gap-3 border-t border-slate-100 pt-4 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">A</span>
                <p className="flex-1 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-primary/5 p-8 text-center border border-primary/10">
          <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">Vẫn còn vấn đề thắc mắc?</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/lien-he/gop-y" className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90">
              <span className="material-symbols-outlined">edit_square</span>
              Gửi câu hỏi / Phản ánh mới
            </Link>
            <Link href="/lien-he" className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/80">
              <span className="material-symbols-outlined">call</span>
              Xem thông tin liên hệ
            </Link>
          </div>
        </div>
      </main>

      
    </div>
  );
}