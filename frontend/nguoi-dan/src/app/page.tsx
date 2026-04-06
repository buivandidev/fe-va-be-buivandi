/* eslint-disable @next/next/no-img-element */




export default function Home() {
  const heroImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCdFKs-drI7Z8zzU48bGqfKoO_wkgHzuh0mk-1bEX6LcReeqkvsNNEf1_kUGN2W9Fwg5iyQBK5O1QzhITqEh1dUNCD6S71wlpjRXGDd_Uu3h0J55VSa38uS05OolRIWmKGZydgK0_jyubmXDIv4IfEQT4WjXKg7fhTbWNPq5sJjJ5ZLpi7gsRZJuWpJEqwyKBtkf5Xpg_nSzq46x0VsD3YJmaPEYrWzR51zirLUmBO6_bfMxsL48rnV48xt31SI8F0chwLje3u8Z8c";
  const conferenceImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBS27jvw3boywaPh3K-87t7twnQXcgItg4Pd-o3Ez9Q4HFzE94R0heA2O8mJfiXYl7WpXpt2fo9UCXjundP7hkxhJCCZCt8dtbMYSb9qXSUcwBsGbcLFNVATxis249IcmIBwp95bcpulEzigUlu4213ek4REfyUm8bPWWq8MTDyPum_osWgCC3jNiun7u0Ib_P4JI6I1hVNXOmbz740VZGa3GFvkfQSJDGNmq3gemYjnQFhXnUDgLIHjhCMQiMeDr4oGBQuc7nhSpo";
  const bridgeImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAxHgT4p_VO3LSJw01gsVOzoiMVXztJz97ryTxGrY7El5UrVFWXRUU25nq76p3149WwWTYNItxcnbmyyT2eE9If4Spw4YpoGCgXqRNE6rWwT3TsVHhhvkV8IJfBDhxvMlt2AtXVZQEFv--G-aIAKQQcoUcy5U5TXDJZbJwuLSP5hdbrcGgS1bkegTEERAUOGCYT4WLVGomHML3iA1FOYHuvWKj2D6wC2Qx0nUmjmVX0Rzx1PdLAkm0xT4dxqD1MsCdr7GoNMKVdUYw";
  const digitalImage =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC0hpTC4F854wrl5a6X7gJOid6OwxeZpoTtaK16weEJ65ppVsK4jiZg3P5_D4vNF31ohXOxaYxXXXwQNz52LThJQkVXyxqf1grH5qMTPysIUxLHhY7uejFSdLJ8KVQcq84eiVd7SgeA0YNFdysBsDqA0yE9H1Zi13kOYMYvDMG_lDV8HLoPSeKDb6Eo-dv5mzjYugFE6u55H9TDYOuEPLMbtjuzsRiVfyt2YmP9nNoV4VFkH6h4wJOWBKa66N1iuy1MNdbJiQoMlAU";

  const stats = [
    {
      icon: "groups",
      iconStyle: "bg-primary/10 text-primary",
      label: "Dân số",
      value: "1.280.000+",
    },
    {
      icon: "map",
      iconStyle: "bg-emerald-100 text-emerald-600",
      label: "Diện tích (km²)",
      value: "1.542,8",
    },
    {
      icon: "payments",
      iconStyle: "bg-amber-100 text-amber-600",
      label: "Vốn đầu tư (Tỷ VNĐ)",
      value: "45.600",
    },
    {
      icon: "check_circle",
      iconStyle: "bg-violet-100 text-violet-600",
      label: "Hồ sơ xử lý đúng hạn",
      value: "99,8%",
    },
  ];

  const newsItems = [
    {
      title: "Hội nghị triển khai kế hoạch phát triển kinh tế xã hội quý IV/2023",
      excerpt:
        "Lãnh đạo UBND tỉnh chủ trì hội nghị trực tuyến với 12 huyện, thành phố về việc đẩy nhanh tiến độ giải ngân vốn đầu tư công.",
      date: "15/10/2023",
      category: "Kế hoạch",
      categoryClass: "bg-primary",
      image: conferenceImage,
    },
    {
      title: "Khánh thành công trình cầu vượt sông trọng điểm, nối liền 2 khu công nghiệp",
      excerpt:
        "Công trình có tổng mức đầu tư 500 tỷ đồng, hoàn thành sớm hơn 2 tháng so với kế hoạch đề ra.",
      date: "14/10/2023",
      category: "Hạ tầng",
      categoryClass: "bg-emerald-600",
      image: bridgeImage,
    },
    {
      title: "Đẩy mạnh chuyển đổi số trong quản lý hành chính và phục vụ nhân dân",
      excerpt:
        "Tỷ lệ hồ sơ trực tuyến toàn trình đạt 85%, góp phần giảm thiểu thời gian và chi phí cho người dân và doanh nghiệp.",
      date: "12/10/2023",
      category: "Chuyển đổi số",
      categoryClass: "bg-amber-600",
      image: digitalImage,
    },
  ];

  const services = [
    { icon: "badge", title: "Cư trú & Hộ tịch" },
    { icon: "apartment", title: "Xây dựng & Nhà đất" },
    { icon: "medical_services", title: "Y tế & Bảo hiểm" },
    { icon: "school", title: "Giáo dục & Đào tạo" },
    { icon: "business_center", title: "Đăng ký Kinh doanh" },
    { icon: "directions_car", title: "Giao thông Vận tải" },
  ];

  const sideVideos = [
    {
      title: "Khai mạc lễ hội văn hóa đặc sắc vùng cao 2023",
      date: "10/10/2023",
      image: bridgeImage,
    },
    {
      title: "Hướng dẫn nộp hồ sơ trực tuyến chỉ trong 5 phút",
      date: "08/10/2023",
      image: digitalImage,
    },
    {
      title: "Toàn cảnh quy hoạch hạ tầng giao thông giai đoạn 2025-2030",
      date: "05/10/2023",
      image: heroImage,
    },
  ];

  const documents = [
    {
      code: "Số: 45/2023/QĐ-UBND",
      date: "12/10/2023",
      title:
        "Quyết định về việc ban hành Quy chế quản lý và sử dụng hạ tầng công nghệ thông tin tỉnh",
      icon: "description",
      iconStyle: "bg-red-50 text-red-600",
    },
    {
      code: "Số: 128/BC-SKHĐT",
      date: "10/10/2023",
      title:
        "Báo cáo tình hình thực hiện kế hoạch phát triển kinh tế - xã hội 9 tháng đầu năm 2023",
      icon: "analytics",
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      code: "Số: 09/CT-UBND",
      date: "08/10/2023",
      title:
        "Chỉ thị về việc tăng cường công tác phòng chống thiên tai và tìm kiếm cứu nạn cuối năm 2023",
      icon: "article",
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      code: "Số: 231/KH-STP",
      date: "05/10/2023",
      title:
        "Kế hoạch phổ biến, giáo dục pháp luật quý IV năm 2023 cho thanh thiếu niên địa phương",
      icon: "fact_check",
      iconStyle: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 font-display">
      

      <main>
        <section className="relative flex h-[560px] items-center">
          <div className="absolute inset-0">
            <img alt="Toàn cảnh thành phố hiện đại" className="h-full w-full object-cover" src={heroImage} />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="mb-4 inline-block rounded bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                Chính phủ điện tử
              </span>
              <h2 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-6xl">
                Vì một cuộc sống <br /> thuận tiện & số hóa
              </h2>
              <p className="mb-10 text-lg leading-relaxed text-slate-200">
                Truy cập nhanh chóng các dịch vụ hành chính công trực tuyến, cập nhật tin tức kinh tế xã
                hội và phản hồi ý kiến đến chính quyền địa phương.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  className="flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-bold text-white transition-all hover:bg-blue-700"
                  type="button"
                >
                  Dịch vụ công trực tuyến
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button
                  className="rounded-lg border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                  type="button"
                >
                  Xem tin tức mới nhất
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-16 px-4 py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-slate-100 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800"
              >
                <div className={`mb-4 flex size-12 items-center justify-center rounded-lg ${item.iconStyle}`}>
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-background-light py-16 dark:bg-background-dark">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Tin tức & Sự kiện</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Cập nhật thông tin mới nhất từ các cơ quan ban ngành
                </p>
              </div>
              <a className="flex items-center gap-1 font-bold text-primary hover:underline" href="#">
                Xem tất cả
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {newsItems.map((item) => (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={item.image}
                    />
                    <div className="absolute left-4 top-4">
                      <span className={`${item.categoryClass} rounded px-2 py-1 text-[10px] font-bold uppercase text-white`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="mb-2 flex items-center gap-1 text-xs text-slate-400">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {item.date}
                    </p>
                    <h4 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                      {item.title}
                    </h4>
                    <p className="mt-3 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                      {item.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Dịch vụ trực tuyến</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Dịch vụ công thiết yếu cho công dân và doanh nghiệp
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {services.map((item) => (
                <a
                  key={item.title}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-slate-100 p-6 text-center transition-all hover:border-primary hover:shadow-lg dark:border-slate-800 dark:hover:border-primary"
                  href="#"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary dark:bg-slate-800 dark:text-slate-300">
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.title}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Video Tiêu Điểm</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Hoạt động nổi bật của chính quyền địa phương qua hình ảnh video
                </p>
              </div>
              <a className="flex items-center gap-1 text-sm font-bold text-primary hover:underline" href="#">
                Xem thêm video
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <img alt="Video chính" className="h-full w-full object-cover" src={conferenceImage} />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="flex size-20 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform group-hover:scale-110">
                      <span className="material-symbols-outlined material-symbols-filled text-4xl">play_arrow</span>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h4 className="text-xl font-bold text-white">
                      Phóng sự: Thành phố thay đổi từng ngày sau 5 năm thực hiện chuyển đổi số
                    </h4>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {sideVideos.map((item) => (
                  <article key={item.title} className="group flex cursor-pointer gap-4">
                    <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                      <img alt={item.title} className="h-full w-full object-cover" src={item.image} />
                    </div>
                    <div className="flex-1">
                      <h5 className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                        {item.title}
                      </h5>
                      <p className="mt-1 text-xs text-slate-500">{item.date}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 dark:bg-background-dark">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Văn bản & Pháp quy</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Tra cứu các quyết định, chỉ thị và báo cáo mới nhất
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  type="button"
                >
                  Tất cả văn bản
                </button>
                <button
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  type="button"
                >
                  Công báo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {documents.map((item) => (
                <article
                  key={item.title}
                  className="group flex items-start gap-4 rounded-xl border border-slate-100 bg-white p-5 transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className={`flex size-12 flex-shrink-0 items-center justify-center rounded-lg ${item.iconStyle}`}>
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-start justify-between">
                      <span className="text-[10px] font-bold uppercase text-slate-400">{item.code}</span>
                      <span className="text-[10px] text-slate-400">{item.date}</span>
                    </div>
                    <h5 className="mb-2 line-clamp-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                      {item.title}
                    </h5>
                    <div className="flex items-center gap-4">
                      <a className="flex items-center gap-1 text-xs font-bold text-primary hover:underline" href="#">
                        <span className="material-symbols-outlined text-sm">download</span>
                        Tải về
                      </a>
                      <a
                        className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:underline"
                        href="#"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Xem chi tiết
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">Hình ảnh Địa phương nổi bật</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Khám phá vẻ đẹp thiên nhiên và sự phát triển của quê hương
              </p>
            </div>

            <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-4">
              <article className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl">
                <img
                  alt="Cầu Ánh Sao"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={heroImage}
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6 opacity-0 transition-opacity group-hover:opacity-100">
                  <h5 className="font-bold text-white">Cầu Ánh Sao - Biểu tượng hiện đại</h5>
                  <p className="text-sm text-white/80">Trung tâm thành phố về đêm</p>
                </div>
              </article>

              <div className="overflow-hidden rounded-2xl">
                <img
                  alt="Ảnh địa phương 2"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  src={conferenceImage}
                />
              </div>

              <div className="overflow-hidden rounded-2xl">
                <img
                  alt="Ảnh địa phương 3"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  src={bridgeImage}
                />
              </div>

              <div className="col-span-2 overflow-hidden rounded-2xl">
                <img
                  alt="Ảnh địa phương 4"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  src={digitalImage}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}
