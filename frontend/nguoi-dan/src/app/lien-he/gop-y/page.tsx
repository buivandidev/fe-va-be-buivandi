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

export default function PhienAnhKienNghiPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    hoTen: "",
    dienThoai: "",
    email: "",
    linhVuc: "",
    chuDe: "",
    noiDung: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          hoTen: formData.hoTen,
          email: formData.email, 
          dienThoai: formData.dienThoai,
          chuDe: formData.chuDe,
          noiDung: `[Lĩnh vực: ${formData.linhVuc}]\n${formData.noiDung}`,
        }),
      });

      const payload = (await response.json().catch(() => null)) as ApiEnvelope | null;
      const success = payload?.thanhCong ?? payload?.ThanhCong ?? response.ok;
      const message = payload?.thongDiep ?? payload?.ThongDiep;

      if (!response.ok || !success) {
        throw new Error(message ?? "Có lỗi xảy ra khi gửi phản ánh. Vui lòng thử lại sau.");
      }

      setSuccess(true);
      setFormData({
        hoTen: "",
        dienThoai: "",
        email: "",
        linhVuc: "",
        chuDe: "",
        noiDung: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 md:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex text-sm font-medium">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link className="flex items-center text-slate-500 hover:text-primary dark:text-slate-400" href="/">
                <span className="material-symbols-outlined gov-icon mr-1 text-lg">home</span>
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined gov-icon mx-1 text-sm text-slate-400">chevron_right</span>
                <Link className="text-slate-500 hover:text-primary dark:text-slate-400" href="/lien-he">
                  Liên hệ & Hỗ trợ
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined gov-icon mx-1 text-sm text-slate-400">chevron_right</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Góp ý, Phản ánh</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mb-8 text-center">
          <h1 className="gov-section-title mb-3 text-3xl font-bold text-slate-900 dark:text-slate-100">Gửi Phản ánh & Kiến nghị</h1>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Xin vui lòng điền đầy đủ thông tin vào biểu mẫu dưới đây. Các ý kiến đóng góp, phản ánh của bạn sẽ được tiếp nhận và xử lý nhanh chóng nhằm nâng cao chất lượng dịch vụ công.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
          {success && (
            <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200 flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600">check_circle</span>
              <span>Gửi phản ánh thành công! Xin cảm ơn những đóng góp quý báu của bạn.</span>
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <span className="material-symbols-outlined text-lg">person</span>
                  </div>
                  <input
                    type="text"
                    name="hoTen"
                    value={formData.hoTen}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                    placeholder="Nguyễn Văn A"
                    required
                   title="Input" aria-label="Input" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Điện thoại liên hệ
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <span className="material-symbols-outlined text-lg">call</span>
                  </div>
                  <input
                    type="tel"
                    name="dienThoai"
                    value={formData.dienThoai}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                    placeholder="09xx xxx xxx"
                   title="Input" aria-label="Input" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-4 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                    placeholder="email@example.com"
                    required
                   title="Input" aria-label="Input" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Lĩnh vực <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <span className="material-symbols-outlined text-lg">category</span>
                  </div>
                  <select 
                    name="linhVuc" 
                    value={formData.linhVuc} 
                    onChange={handleChange} 
                    className="w-full appearance-none rounded-lg border border-slate-300 bg-transparent py-2 pl-10 pr-8 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100" 
                    required
                   title="Select" aria-label="Select">
                    <option value="" disabled>Chọn lĩnh vực</option>
                    <option value="hanh-chinh">Hành chính công</option>
                    <option value="giao-thong">Giao thông vận tải</option>
                    <option value="an-ninh">An ninh trật tự</option>
                    <option value="moi-truong">Môi trường, Đô thị</option>
                    <option value="khac">Khác</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <span className="material-symbols-outlined text-lg">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Tiêu đề kiến nghị/ phản ánh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="chuDe"
                value={formData.chuDe}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                placeholder="Nhập tiêu đề ngắn gọn"
                required
               title="Input" aria-label="Input" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Nội dung chi tiết (Ít nhất 10 ký tự) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="noiDung"
                value={formData.noiDung}
                onChange={handleChange}
                rows={6}
                minLength={10}
                className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-3 text-slate-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:text-slate-100"
                placeholder="Mô tả chi tiết nội dung phản ánh, kiến nghị..."
                required
              ></textarea>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" required  title="Input" aria-label="Input" placeholder="Nhập..." />
              <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                Tôi cam đoan những thông tin cung cấp ở trên là hoàn toàn đúng sự thật.
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setFormData({ hoTen: "", dienThoai: "", email: "", linhVuc: "", chuDe: "", noiDung: "" })}
                className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Nhập lại
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {loading ? (
                   <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                ) : (
                   <span className="material-symbols-outlined text-[20px]">send</span>
                )}
                {loading ? "Đang gửi..." : "Gửi phản ánh"}
              </button>
            </div>
          </form>
        </div>
      </main>

      
    </div>
  );
}
