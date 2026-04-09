"use client";



import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

// Types
interface Service {
  id: string;
  ten: string;
  maDichVu: string;
  dangHoatDong?: boolean;
}

interface ServicesEnvelope {
  muc?: Service[];
  danhSach?: Service[];
}

interface SubmitApplicationResult {
  id?: string;
  maTheoDoi?: string;
}

function ApplicationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceIdParam = searchParams?.get("dichVuId");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceLoadError, setServiceLoadError] = useState<string | null>(null);
  
  // Form State
  const [dichVuId, setDichVuId] = useState(serviceIdParam || "");
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [email, setEmail] = useState("");
  const [cccd, setCccd] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [tepDinhKemList, setTepDinhKemList] = useState<File[]>([]);
  
  // Submit state
  const [submitting, setSubmitting] = useState(false);

  // Auth Check State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // [CẬP NHẬT THEO ĐỀ XUẤT]: Kiểm tra Auth (Token/Cookie)
    // Giả lập bằng localStorage hoặc logic thực tế của bạn
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Vui lòng đăng nhập hệ thống để thực hiện Nộp hồ sơ.");
      // Lưu lại link hiện tại để redirect về sau khi login
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/dang-nhap?redirect=${encodeURIComponent(currentUrl)}`);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchServices() {
      try {
        setServiceLoadError(null);
        const res = await fetchApi("/api/public/services?kichThuocTrang=100", {
          cache: "no-store",
        });

        if (!res.ok) {
          setServiceLoadError("Không tải được danh sách thủ tục. Vui lòng thử lại.");
          return;
        }

        const payload = await res.json().catch(() => null);
        const { success, data } = unwrapApiEnvelope<ServicesEnvelope>(payload);
        if (!success || !data) {
          setServiceLoadError("Không tải được danh sách thủ tục. Vui lòng thử lại.");
          return;
        }

        const danhSach = Array.isArray(data.muc)
          ? data.muc
          : Array.isArray(data.danhSach)
            ? data.danhSach
            : [];

        const activeServices = danhSach.filter((s: Service) => s.dangHoatDong ?? true);
        setServices(activeServices);
        if (activeServices.length === 0) {
          setServiceLoadError("Hiện chưa có thủ tục đang mở để nộp hồ sơ.");
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách thủ tục:", error);
        setServiceLoadError("Không thể kết nối để tải danh sách thủ tục.");
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Chuyển FileList thành Array và lưu
      const newFiles = Array.from(e.target.files);
      setTepDinhKemList([...tepDinhKemList, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...tepDinhKemList];
    newFiles.splice(index, 1);
    setTepDinhKemList(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email để nhận mã tra cứu hồ sơ.");
      return;
    }

    if (!dichVuId) {
      toast.error("Vui lòng chọn thủ tục bạn muốn nộp hồ sơ.");
      return;
    }

    setSubmitting(true);
    try {
      const requestBody = {
        dichVuId,
        tenNguoiNop: hoTen.trim(),
        emailNguoiNop: email.trim(),
        dienThoaiNguoiNop: soDienThoai.trim(),
        diaChiNguoiNop: diaChi.trim() || undefined,
        ghiChu: cccd.trim() ? `CCCD: ${cccd.trim()}` : undefined,
      };

      const res = await fetchApi("/api/public/applications/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const payload = await res.json().catch(() => null);
      const { success, message, data } = unwrapApiEnvelope<SubmitApplicationResult>(payload);

      if (!res.ok || !success || !data?.id) {
        toast.error(message || "Thao tác không thành công. Vui lòng kiểm tra lại.");
        return;
      }

      if (tepDinhKemList.length > 0) {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const formData = new FormData();
        tepDinhKemList.forEach((file) => {
          formData.append("cacTep", file);
        });

        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const uploadRes = await fetchApi(`/api/public/applications/${data.id}/upload-files`, {
          method: "POST",
          headers,
          body: formData,
          credentials: "include",
        });

        if (!uploadRes.ok) {
          const uploadPayload = await uploadRes.json().catch(() => null);
          const { message: uploadMessage } = unwrapApiEnvelope(uploadPayload);
          toast.error(uploadMessage || "Đã tạo hồ sơ nhưng tải tệp đính kèm thất bại.");
        }
      }

      toast.success(
        data.maTheoDoi
          ? `Nộp hồ sơ thành công. Mã tra cứu: ${data.maTheoDoi}`
          : "Nộp hồ sơ thành công.",
      );

      router.push(
        data.maTheoDoi
          ? `/tra-cuu?ma=${encodeURIComponent(data.maTheoDoi)}&email=${encodeURIComponent(email.trim())}`
          : "/tra-cuu",
      );
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) return (
     <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
         <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-4">progress_activity</span>
         <p className="text-slate-500 font-medium">Đang kiểm tra thông tin Đăng nhập...</p>
     </div>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Chọn Thủ tục */}
        <div>
          <label className="mb-2 flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined mr-2 text-primary">assignment</span>
            Thủ tục cần nộp / Dịch vụ đăng ký <span className="ml-1 text-red-500">*</span>
          </label>
          {loading ? (
             <div className="h-12 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"></div>
          ) : (
            <select
                title="Chọn thủ tục"
                aria-label="Chọn thủ tục"
                value={dichVuId}
                onChange={(e) => setDichVuId(e.target.value)}
                required={services.length > 0}
                disabled={services.length === 0}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 text-slate-900 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
                <option value="" disabled>
                  {services.length > 0 ? "--- Chọn thủ tục hành chính ---" : "--- Chưa có thủ tục khả dụng ---"}
                </option>
                {services.map(s => (
                <option key={s.id} value={s.id}>{s.ten}</option>
                ))}
            </select>
          )}
          {serviceLoadError && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{serviceLoadError}</p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {/* Họ tên */}
            <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Họ và tên người nộp <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                required
                value={hoTen}
                onChange={(e) => setHoTen(e.target.value)}
                placeholder="VD: Nguyễn Văn A"
                className="w-full rounded-lg border border-slate-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
            />
            </div>

            {/* CCCD */}
            <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Số CCCD / Mã định danh <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                required
                value={cccd}
                onChange={(e) => setCccd(e.target.value)}
                pattern="\d{12}"
                title="CCCD phải đủ 12 số"
                placeholder="VD: 079123456789"
                className="w-full rounded-lg border border-slate-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
            />
            </div>

            {/* SĐT */}
            <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Số điện thoại liên hệ <span className="text-red-500">*</span>
            </label>
            <input
                type="tel"
                required
                value={soDienThoai}
                onChange={(e) => setSoDienThoai(e.target.value)}
                placeholder="VD: 0901234567"
                className="w-full rounded-lg border border-slate-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
            />
            </div>

            {/* Email */}
            <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Địa chỉ Email
            </label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Để nhận thông báo tiến độ"
                className="w-full rounded-lg border border-slate-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
            />
            </div>
        </div>

        {/* Địa chỉ */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Địa chỉ Nơi ở / Thường trú
          </label>
          <input
            type="text"
            value={diaChi}
            onChange={(e) => setDiaChi(e.target.value)}
            placeholder="Số nhà, đường, thôn xóm..."
            className="w-full rounded-lg border border-slate-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        {/* Đính kèm tài liệu */}
        <div className="rounded-lg border border-dashed border-slate-300 p-6 dark:border-slate-700">
          <label className="mb-4 flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300">
            <span className="material-symbols-outlined mr-2 text-primary">upload_file</span>
            Giấy tờ, thành phần hồ sơ đính kèm
          </label>

          <input 
            type="file" 
            multiple 
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500
              file:mr-4 file:rounded-full file:border-0
              file:bg-primary/10 file:px-4 file:py-2
              file:text-sm file:font-semibold
              file:text-primary hover:file:bg-primary/20
              dark:text-slate-400 dark:file:bg-primary/20 dark:file:text-primary dark:hover:file:bg-primary/30"
           title="Input" aria-label="Input" placeholder="Nhập..." />
          <p className="mt-2 text-xs text-slate-500">Định dạng hỗ trợ: PDF, JPG, PNG, DOCX. Tối đa chuẩn bị 5MB/file.</p>

          {/* List files */}
          {tepDinhKemList.length > 0 && (
            <ul className="mt-4 space-y-2">
              {tepDinhKemList.map((file, index) => (
                <li key={index} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span className="flex items-center truncate">
                    <span className="material-symbols-outlined mr-2 text-slate-400 text-[18px]">draft</span>
                    {file.name} <span className="ml-2 text-xs text-slate-400">({(file.size / 1024).toFixed(1)} KB)</span>
                  </span>
                  <button 
                    type="button" 
                    onClick={() => removeFile(index)}
                    className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cautions */}
        <div className="rounded-lg bg-orange-50 p-4 text-sm text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border border-orange-200 dark:border-orange-800/30">
          <p className="flex items-start">
            <span className="material-symbols-outlined mr-2 shrink-0">info</span>
            <span>
              Tôi xin chịu trách nhiệm trước pháp luật về lời khai và toàn bộ giấy tờ đính kèm cung cấp. Cán bộ trực có thể yêu cầu cung cấp bản chính để đối chiếu khi nhận kết quả.
            </span>
          </p>
        </div>

        {/* Lệnh */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
                Hủy
            </button>
            <button
                type="submit"
                disabled={submitting || loading || services.length === 0}
                className="flex items-center rounded-lg bg-primary px-8 py-2.5 font-semibold text-white shadow-md hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {submitting ? (
                   <>
                     <span className="material-symbols-outlined mr-2 animate-spin text-[18px]">progress_activity</span>
                     Đang xử lý...
                   </>
                ) : (
                    <>
                     <span className="material-symbols-outlined mr-2 text-[18px]">send</span>
                     Gửi Hồ Sơ
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
}

export default function NopHoSoPage() {
  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <Toaster position="top-right" />
      

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-12 md:px-10">
        
         <div className="mb-8 flex items-center justify-between">
            <div>
             <h1 className="gov-section-title text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Nộp hồ sơ trực tuyến</h1>
             <p className="mt-2 text-slate-600 dark:text-slate-400">Vui lòng điền đầy đủ và chính xác thông tin để bộ phận Một Cửa xử lý nhanh chóng.</p>
            </div>
            
            <Link href="/dich-vu-cong" className="hidden flex-col items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">
                 <span className="material-symbols-outlined gov-icon rounded-full bg-primary/10 p-2 text-primary">menu_book</span>
                 Tra cứu thủ tục
            </Link>
        </div>
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Hồ sơ nộp trực tuyến cần đầy đủ thành phần theo yêu cầu từng thủ tục; thông tin kê khai phải trung thực và chịu trách nhiệm trước pháp luật.
        </div>

        <Suspense fallback={<div className="h-64 w-full animate-pulse rounded-xl bg-white dark:bg-slate-900"></div>}>
           <ApplicationForm />
        </Suspense>

      </main>

      
    </div>
  );
}
