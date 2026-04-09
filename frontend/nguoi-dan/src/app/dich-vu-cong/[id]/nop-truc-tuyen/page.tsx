"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { fetchApi, unwrapApiEnvelope } from "@/lib/api";

const STEPS = [
  { key: "service", title: "Thủ tục", icon: "assignment" },
  { key: "applicant", title: "Người nộp", icon: "person" },
  { key: "files", title: "Đính kèm", icon: "upload_file" },
  { key: "review", title: "Xác nhận", icon: "verified" },
] as const;

type StepIndex = 0 | 1 | 2 | 3;

interface SubmitApplicationResult {
  id?: string;
  maTheoDoi?: string;
}

export default function NopTrucTuyenMultiStep({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: serviceId } = use(params);
  const router = useRouter();

  const [step, setStep] = useState<StepIndex>(0);
  const [submitting, setSubmitting] = useState(false);

  const [hoTen, setHoTen] = useState("");
  const [cccd, setCccd] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [email, setEmail] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [ghiChu, setGhiChu] = useState("");
  const [tepDinhKemList, setTepDinhKemList] = useState<File[]>([]);
  const [acceptedDeclaration, setAcceptedDeclaration] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push(`/dang-nhap?returnUrl=${encodeURIComponent(`/dich-vu-cong/${serviceId}/nop-truc-tuyen`)}`);
    }
  }, [router, serviceId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const selected = Array.from(e.target.files);
    const total = tepDinhKemList.length + selected.length;
    if (total > 8) {
      toast.error("Tối đa 8 tệp đính kèm.");
      return;
    }

    const tooLarge = selected.find((f) => f.size > 5 * 1024 * 1024);
    if (tooLarge) {
      toast.error(`Tệp ${tooLarge.name} vượt quá 5MB.`);
      return;
    }

    setTepDinhKemList((prev) => [...prev, ...selected]);
  };

  const removeFile = (index: number) => {
    setTepDinhKemList((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep = (target: StepIndex) => {
    if (target === 0) return true;
    if (target >= 2) {
      if (!hoTen.trim()) {
        toast.error("Vui lòng nhập họ tên người nộp.");
        return false;
      }
      if (!/^\d{12}$/.test(cccd.trim())) {
        toast.error("CCCD phải đủ 12 số.");
        return false;
      }
      if (!/^(0|\+84)\d{9,10}$/.test(soDienThoai.trim())) {
        toast.error("Số điện thoại chưa hợp lệ.");
        return false;
      }
      if (!email.trim()) {
        toast.error("Vui lòng nhập email để nhận mã hồ sơ.");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    const next = Math.min(step + 1, 3) as StepIndex;
    if (!validateStep(next)) return;
    setStep(next);
  };

  const goPrev = () => {
    const prev = Math.max(step - 1, 0) as StepIndex;
    setStep(prev);
  };

  const submitApplication = async () => {
    if (!validateStep(3)) return;
    if (!acceptedDeclaration) {
      toast.error("Vui lòng xác nhận cam kết trước khi gửi hồ sơ.");
      return;
    }

    setSubmitting(true);
    try {
      const requestBody = {
        dichVuId: serviceId,
        tenNguoiNop: hoTen.trim(),
        emailNguoiNop: email.trim(),
        dienThoaiNguoiNop: soDienThoai.trim(),
        diaChiNguoiNop: diaChi.trim() || undefined,
        ghiChu: [cccd.trim() ? `CCCD: ${cccd.trim()}` : "", ghiChu.trim()].filter(Boolean).join(" | ") || undefined,
      };

      const submitRes = await fetchApi("/api/public/applications/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const submitPayload = await submitRes.json().catch(() => null);
      const { success, message, data } = unwrapApiEnvelope<SubmitApplicationResult>(submitPayload);
      if (!submitRes.ok || !success || !data?.id) {
        toast.error(message || "Không thể tạo hồ sơ. Vui lòng thử lại.");
        return;
      }

      if (tepDinhKemList.length > 0) {
        const formData = new FormData();
        tepDinhKemList.forEach((file) => formData.append("cacTep", file));
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers: Record<string, string> = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        const uploadRes = await fetchApi(`/api/public/applications/${data.id}/upload-files`, {
          method: "POST",
          headers,
          body: formData,
          credentials: "include",
        });

        if (!uploadRes.ok) {
          toast.error("Đã tạo hồ sơ nhưng tải tệp thất bại.");
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
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/50 dark:bg-background-dark min-h-screen pb-20">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
        <Toaster position="top-right" />

        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <nav className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-base">verified_user</span>
              Cổng dịch vụ công trực tuyến
            </nav>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Khai báo hồ sơ điện tử
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-xl text-sm md:text-base leading-relaxed">
              Vui lòng thực hiện cung cấp thông tin theo đúng quy trình 4 bước để đảm bảo tính pháp lý của hồ sơ.
            </p>
          </div>
          <Link
            href={`/dich-vu-cong/${serviceId}`}
            className="group flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Trở lại chi tiết
          </Link>
        </div>

        {/* Improved Stepper */}
        <div className="mb-10 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 hidden md:block" />
          <div className="relative flex flex-col md:flex-row justify-between gap-4">
            {STEPS.map((s, index) => {
              const isActive = index === step;
              const isCompleted = index < step;
              return (
                <div key={s.key} className="flex-1 flex flex-row md:flex-col items-center gap-4 md:gap-3 z-10 transition-all duration-500">
                  <div className={`
                    flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-500 shadow-lg
                    ${isActive ? "bg-primary border-primary text-white scale-110" : 
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : 
                      "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"}
                  `}>
                    <span className="material-symbols-outlined text-2xl">
                      {isCompleted ? "check" : s.icon}
                    </span>
                  </div>
                  <div className="flex flex-col md:items-center">
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? "text-primary" : "text-slate-400"}`}>
                      Bước {index + 1}
                    </span>
                    <span className={`text-sm font-black ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                      {s.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 md:p-12">
            {step === 0 && (
              <div className="space-y-8">
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Xác nhận nộp trực tuyến</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase">Thủ tục đã chọn</p>
                      <p className="text-lg font-bold text-primary">Dịch vụ công Portal</p>
                      <p className="text-sm font-medium text-slate-500 italic">Mã số: {serviceId}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase">Phòng ban tiếp nhận</p>
                      <p className="text-base font-bold text-slate-700 dark:text-slate-200">Bộ phận Tiếp nhận & Trả kết quả</p>
                      <p className="text-sm text-slate-500">UBND Phường/Xã sở tại</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase text-slate-400 tracking-widest">Lưu ý trước khi nộp</h3>
                  <div className="grid gap-3">
                    {[
                      "Vui lòng chuẩn bị đầy đủ các tệp SCAN từ bản gốc.",
                      "Thông tin định danh (CCCD) phải trùng khớp với người nộp.",
                      "Hệ thống sẽ gửi mã tra cứu qua Email ngay khi tiếp nhận."
                    ].map((text, i) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-emerald-500 material-symbols-outlined text-lg">verified</span>
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Thông tin định danh</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="group space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Họ và tên người nộp *</label>
                    <input
                      value={hoTen}
                      onChange={(e) => setHoTen(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Số định danh (CCCD) *</label>
                    <input
                      value={cccd}
                      onChange={(e) => setCccd(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-mono"
                      placeholder="012345678901"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Số điện thoại liên hệ *</label>
                    <input
                      value={soDienThoai}
                      onChange={(e) => setSoDienThoai(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                      placeholder="0987xxx..."
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Hộp thư điện tử (Email) *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                      placeholder="example@gmail.com"
                    />
                  </div>
                  <div className="md:col-span-2 group space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Địa chỉ thường trú / tạm trú</label>
                    <input
                      value={diaChi}
                      onChange={(e) => setDiaChi(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                      placeholder="Nhập địa chỉ chi tiết của bạn..."
                    />
                  </div>
                  <div className="md:col-span-2 group space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ghi chú bổ sung</label>
                    <textarea
                      value={ghiChu}
                      onChange={(e) => setGhiChu(e.target.value)}
                      className="min-h-32 w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 focus:border-primary focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium"
                      placeholder="Nếu hồ sơ có điểm đặc biệt cần lưu ý..."
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Thành phần hồ sơ</h2>
                  <p className="text-slate-500 text-sm mt-1 italic">Vui lòng cung cấp các bản chụp/quét rõ nét từ bản chính.</p>
                </div>
                
                <div className="relative group">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-700 dark:text-slate-200">Nhấn hoặc kéo thả để tải tệp</p>
                      <p className="text-sm text-slate-400 mt-1">Hỗ trợ PDF, Ảnh (JPG, PNG), Word. Tối đa 5MB/tệp.</p>
                    </div>
                  </div>
                </div>

                {tepDinhKemList.length > 0 && (
                  <div className="grid gap-3">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-widest">{tepDinhKemList.length} tệp đã chọn</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {tepDinhKemList.map((file, idx) => {
                        const isImage = file.type.startsWith('image/');
                        const isPdf = file.type === 'application/pdf';
                        return (
                          <div key={`${file.name}-${idx}`} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow">
                            <div className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center ${isImage ? 'bg-blue-100 text-blue-600' : isPdf ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                              <span className="material-symbols-outlined">{isImage ? 'image' : isPdf ? 'picture_as_pdf' : 'description'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate dark:text-slate-100">{file.name}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="h-8 w-8 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kiểm tra thông tin</h2>
                <div className="overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="bg-slate-900 p-4">
                    <p className="text-white text-xs font-bold uppercase tracking-widest text-center">Bản kê khai xác nhận hồ sơ</p>
                  </div>
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <section className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Đối tượng</p>
                          <p className="text-lg font-black text-slate-800 dark:text-slate-100">{hoTen}</p>
                        </section>
                        <section className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Định danh CCCD</p>
                          <p className="text-sm font-bold font-mono tracking-wider">{cccd}</p>
                        </section>
                      </div>
                      <div className="space-y-4">
                        <section className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Số điện thoại / Email</p>
                          <p className="text-sm font-bold">{soDienThoai}</p>
                          <p className="text-sm text-slate-500 font-medium">{email}</p>
                        </section>
                      </div>
                      <div className="md:col-span-2">
                        <section className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Địa chỉ kê khai</p>
                          <p className="text-sm font-medium leading-relaxed">{diaChi || "Không cung cấp"}</p>
                        </section>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                        <section className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Số lượng tài liệu đính kèm</p>
                          <div className="flex flex-wrap gap-2">
                            {tepDinhKemList.length > 0 ? (
                              tepDinhKemList.map((f, i) => (
                                <span key={i} className="inline-flex items-center px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-500">
                                  Tài liệu {i+1}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs italic text-slate-400">Không có tệp đính kèm</span>
                            )}
                          </div>
                        </section>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                  <h4 className="text-amber-800 dark:text-amber-300 font-black mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">gavel</span>
                    Lưu ý pháp lý quan trọng
                  </h4>
                  <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed mb-4">
                    Việc cố ý kê khai thông tin sai sự thật hoặc giả mạo tài liệu có thể bị truy cứu trách nhiệm hình sự theo các quy định của pháp luật hiện hành.
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="mt-1 relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={acceptedDeclaration}
                        onChange={(e) => setAcceptedDeclaration(e.target.checked)}
                        className="peer h-5 w-5 rounded-lg border-2 border-amber-300 text-amber-600 focus:ring-amber-500 transition-all cursor-pointer opacity-0 absolute"
                      />
                      <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${acceptedDeclaration ? 'bg-amber-600 border-amber-600 text-white' : 'border-amber-300 bg-white dark:bg-slate-900'}`}>
                        {acceptedDeclaration && <span className="material-symbols-outlined text-sm font-bold">check</span>}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-300 select-none">
                      Tôi xác nhận những thông tin trên là hoàn toàn chính xác và xin chịu trách nhiệm trước pháp luật.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 md:px-12 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 0 || submitting}
              className="px-8 py-3 rounded-2xl font-black text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Quay lại
            </button>

            <div className="flex gap-4">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-10 py-3 rounded-2xl bg-slate-900 dark:bg-primary text-white text-sm font-black hover:bg-slate-800 dark:hover:bg-primary-dark transition-all shadow-xl shadow-slate-200 dark:shadow-none"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submitApplication}
                  disabled={submitting}
                  className="px-10 py-3 rounded-2xl bg-primary text-white text-sm font-black hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 disabled:opacity-60 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Gửi hồ sơ ngay
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
