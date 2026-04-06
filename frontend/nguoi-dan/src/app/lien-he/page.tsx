"use client";

import Link from "next/link";
import { useState } from "react";
import { buildApiUrl } from "@/lib/api";



type ApiEnvelope = {
  thanhCong?: boolean;
  ThanhCong?: boolean;
  thongDiep?: string;
  ThongDiep?: string;
};

export default function LienHePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(buildApiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hoTen: formData.name,
          email: formData.email,
          dienThoai: formData.phone,
          chuDe: "Liên hệ nhanh từ trang liên hệ",
          noiDung: formData.message,
        }),
      });

      const payload = (await response.json().catch(() => null)) as ApiEnvelope | null;
      const success = payload?.thanhCong ?? payload?.ThanhCong ?? response.ok;
      const message = payload?.thongDiep ?? payload?.ThongDiep;

      if (!response.ok || !success) {
        throw new Error(message ?? "Có lỗi xảy ra khi gửi lời nhắn. Vui lòng thử lại sau.");
      }

      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 md:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex text-sm font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link className="flex items-center text-slate-500 hover:text-primary dark:text-slate-400" href="/">
                <span className="material-symbols-outlined mr-1 text-lg">home</span>
                Trang chủ
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined mx-1 text-sm text-slate-400">chevron_right</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Liên hệ & Hỗ trợ</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Liên hệ & Hỗ trợ</h1>
          <p className="text-slate-600 dark:text-slate-400">Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-4">
          <Link href="/lien-he/gop-y" className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
            <span className="material-symbols-outlined">rate_review</span>
            Gửi phản ánh, kiến nghị
          </Link>
          <Link href="/lien-he/hoi-dap" className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/50 hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary/50 dark:hover:text-primary">
            <span className="material-symbols-outlined">help</span>
            Câu hỏi thường gặp (FAQ)
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-slate-100">Thông tin liên hệ</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Trụ sở làm việc</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">123 Đường Điện Biên Phủ, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">phone</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Điện thoại</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">(028) 3812 3456 - Tổng đài: 1900 1234</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Email</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">hotro@phuongxa.gov.vn</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">Giờ làm việc</h3>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">Thứ 2 - Thứ 6: 07:30 - 17:00<br/>Thứ 7: 07:30 - 11:30</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map Placeholder */}
            <div className="h-64 w-full overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15676.65778431952!2d106.69707252033878!3d10.78125433246337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4943f77341%3A0xe54e60bf7e8ab9b7!2zUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1703004381814!5m2!1svi!2s"
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ chỉ dẫn"
              ></iframe>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-slate-100">Gửi lời nhắn nhanh</h2>
            
            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200 flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600">check_circle</span>
                <span>Gửi lời nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.</span>
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ email"
                  className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nội dung <span className="text-red-500">*</span></label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  minLength={10}
                  placeholder="Nhập nội dung lời nhắn..."
                  className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {loading ? <span className="material-symbols-outlined animate-spin text-[20px]">sync</span> : <span className="material-symbols-outlined text-[20px]">send</span>}
                {loading ? "Đang gửi..." : "Gửi lời nhắn"}
              </button>
            </form>
          </div>
        </div>
      </main>

      
    </div>
  );
}
