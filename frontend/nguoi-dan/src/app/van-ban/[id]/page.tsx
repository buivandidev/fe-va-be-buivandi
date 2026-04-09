"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type DocumentDetail = {
  id: string;
  soKyHieu: string;
  coQuan: string;
  trichYeu: string;
  ngayBanHanh: string;
  ngayHieuLuc: string;
  hieuLuc: string;
  loai: string;
  noiDung: string;
  tepDinhKem?: string;
};

// Mock data - thay bằng API call thực tế
const mockDocuments: Record<string, DocumentDetail> = {
  "102-2023-qd-ubnd": {
    id: "102-2023-qd-ubnd",
    soKyHieu: "102/2023/QD-UBND",
    coQuan: "Ủy ban nhân dân tỉnh",
    trichYeu: "Quy định về phân cấp quản lý trật tự xây dựng trên địa bàn tỉnh.",
    ngayBanHanh: "15/10/2023",
    ngayHieuLuc: "01/11/2023",
    hieuLuc: "Đang hiệu lực",
    loai: "Quyết định",
    noiDung: `
      <h3>QUYẾT ĐỊNH</h3>
      <p><strong>Về việc ban hành Quy chế quản lý và sử dụng hạ tầng công nghệ thông tin tỉnh</strong></p>
      
      <h4>ỦY BAN NHÂN DÂN TỈNH</h4>
      
      <p>Căn cứ Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015;</p>
      <p>Căn cứ Luật Công nghệ thông tin ngày 29 tháng 6 năm 2006;</p>
      <p>Căn cứ Nghị định số 47/2020/NĐ-CP ngày 09 tháng 4 năm 2020 của Chính phủ;</p>
      <p>Xét đề nghị của Giám đốc Sở Thông tin và Truyền thông,</p>
      
      <h4>QUYẾT ĐỊNH:</h4>
      
      <p><strong>Điều 1.</strong> Ban hành kèm theo Quyết định này Quy chế quản lý và sử dụng hạ tầng công nghệ thông tin tỉnh.</p>
      
      <p><strong>Điều 2.</strong> Quyết định này có hiệu lực thi hành kể từ ngày 01 tháng 11 năm 2023.</p>
      
      <p><strong>Điều 3.</strong> Chánh Văn phòng UBND tỉnh, Giám đốc các Sở, ban ngành, Chủ tịch UBND các huyện, thành phố và các tổ chức, cá nhân có liên quan chịu trách nhiệm thi hành Quyết định này.</p>
      
      <div style="margin-top: 40px; text-align: right;">
        <p><strong>TM. ỦY BAN NHÂN DÂN TỈNH</strong></p>
        <p><strong>CHỦ TỊCH</strong></p>
        <p style="margin-top: 60px;"><em>(Đã ký)</em></p>
        <p><strong>Nguyễn Văn A</strong></p>
      </div>
    `,
    tepDinhKem: "/files/qd-102-2023.pdf",
  },
  "85-ct-ubnd": {
    id: "85-ct-ubnd",
    coQuan: "Chủ tịch UBND tỉnh",
    soKyHieu: "85/CT-UBND",
    trichYeu: "Chỉ thị về đẩy mạnh chuyển đổi số toàn diện trong các cơ quan nhà nước năm 2024.",
    ngayBanHanh: "02/01/2024",
    ngayHieuLuc: "02/01/2024",
    hieuLuc: "Đang hiệu lực",
    loai: "Chỉ thị",
    noiDung: `
      <h3>CHỈ THỊ</h3>
      <p><strong>Về việc đẩy mạnh chuyển đổi số toàn diện trong các cơ quan nhà nước năm 2024</strong></p>
      
      <p>Thực hiện Nghị quyết số 52-NQ/TW ngày 27/9/2019 của Bộ Chính trị về chủ trương chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030, Chủ tịch UBND tỉnh yêu cầu:</p>
      
      <h4>1. Mục tiêu</h4>
      <p>- Đạt 100% dịch vụ công trực tuyến mức độ 4 vào cuối năm 2024</p>
      <p>- Tỷ lệ hồ sơ xử lý trực tuyến đạt tối thiểu 85%</p>
      <p>- 100% cán bộ, công chức được đào tạo kỹ năng số cơ bản</p>
      
      <h4>2. Nhiệm vụ</h4>
      <p><strong>a) Đối với Sở Thông tin và Truyền thông:</strong></p>
      <p>- Xây dựng kế hoạch chi tiết triển khai chuyển đổi số</p>
      <p>- Tổ chức đào tạo, tập huấn cho cán bộ, công chức</p>
      
      <p><strong>b) Đối với các Sở, ban ngành:</strong></p>
      <p>- Rà soát, số hóa toàn bộ quy trình nghiệp vụ</p>
      <p>- Triển khai ứng dụng công nghệ trong quản lý, điều hành</p>
      
      <div style="margin-top: 40px; text-align: right;">
        <p><strong>CHỦ TỊCH</strong></p>
        <p style="margin-top: 60px;"><em>(Đã ký)</em></p>
        <p><strong>Nguyễn Văn A</strong></p>
      </div>
    `,
    tepDinhKem: "/files/ct-85-ubnd.pdf",
  },
  "231-kh-stp": {
    id: "231-kh-stp",
    soKyHieu: "231/KH-STP",
    coQuan: "Sở Tư pháp",
    trichYeu: "Kế hoạch phổ biến, giáo dục pháp luật cho người dân và doanh nghiệp quý II/2024.",
    ngayBanHanh: "20/03/2024",
    ngayHieuLuc: "01/04/2024",
    hieuLuc: "Mới ban hành",
    loai: "Kế hoạch",
    noiDung: `
      <h3>KẾ HOẠCH</h3>
      <p><strong>Phổ biến, giáo dục pháp luật cho người dân và doanh nghiệp quý II/2024</strong></p>
      
      <h4>I. MỤC ĐÍCH, YÊU CẦU</h4>
      <p>Nâng cao nhận thức pháp luật cho người dân và doanh nghiệp, góp phần xây dựng xã hội pháp quyền.</p>
      
      <h4>II. NỘI DUNG</h4>
      <p><strong>1. Đối tượng:</strong></p>
      <p>- Người dân trên địa bàn tỉnh</p>
      <p>- Doanh nghiệp, hộ kinh doanh</p>
      <p>- Cán bộ, công chức, viên chức</p>
      
      <p><strong>2. Hình thức:</strong></p>
      <p>- Tổ chức hội nghị, tọa đàm</p>
      <p>- Phát thanh, truyền hình</p>
      <p>- Tuyên truyền trực tuyến qua website, mạng xã hội</p>
      
      <p><strong>3. Thời gian:</strong> Từ ngày 01/04/2024 đến 30/06/2024</p>
      
      <h4>III. TỔ CHỨC THỰC HIỆN</h4>
      <p>Giao Sở Tư pháp chủ trì, phối hợp với các Sở, ban ngành triển khai thực hiện.</p>
      
      <div style="margin-top: 40px; text-align: right;">
        <p><strong>GIÁM ĐỐC</strong></p>
        <p style="margin-top: 60px;"><em>(Đã ký)</em></p>
        <p><strong>Trần Thị B</strong></p>
      </div>
    `,
    tepDinhKem: "/files/kh-231-stp.pdf",
  },
};

export default function VanBanDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [downloading, setDownloading] = useState(false);

  const vanBan = mockDocuments[id];

  if (!vanBan) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <span className="material-symbols-outlined text-6xl text-slate-300">description_off</span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900">Không tìm thấy văn bản</h2>
          <p className="mt-2 text-slate-600">Văn bản bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link
            href="/van-ban-phap-luat"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Quay lại danh sách
          </Link>
        </div>
      </main>
    );
  }

  const handleDownload = async () => {
    if (!vanBan.tepDinhKem) {
      alert("Văn bản này chưa có file đính kèm");
      return;
    }

    setDownloading(true);
    try {
      // Giả lập download - thay bằng API call thực tế
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Tạo link download
      const link = document.createElement("a");
      link.href = vanBan.tepDinhKem;
      link.download = `${vanBan.soKyHieu.replace(/\//g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi tải file:", error);
      alert("Không thể tải file. Vui lòng thử lại sau.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-slate-600">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/van-ban-phap-luat" className="hover:text-primary">Văn bản pháp quy</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-900 font-semibold">{vanBan.soKyHieu}</span>
      </nav>

      <div className="flex flex-col gap-6">
        {/* Header Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">
                {vanBan.loai}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-slate-900">{vanBan.soKyHieu}</h1>
              <p className="mt-3 text-lg text-slate-700">{vanBan.trichYeu}</p>
            </div>
            <span
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                vanBan.hieuLuc === "Mới ban hành"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {vanBan.hieuLuc}
            </span>
          </div>

          {/* Metadata */}
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Cơ quan ban hành</p>
              <p className="mt-1 font-semibold text-slate-900">{vanBan.coQuan}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Ngày ban hành</p>
              <p className="mt-1 font-semibold text-slate-900">{vanBan.ngayBanHanh}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Ngày hiệu lực</p>
              <p className="mt-1 font-semibold text-slate-900">{vanBan.ngayHieuLuc}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
            <button
              data-download
              onClick={handleDownload}
              disabled={downloading || !vanBan.tepDinhKem}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">download</span>
              {downloading ? "Đang tải..." : "Tải về PDF"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span className="material-symbols-outlined">print</span>
              In văn bản
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Đã sao chép link!");
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span className="material-symbols-outlined">share</span>
              Chia sẻ
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Nội dung văn bản</h2>
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: vanBan.noiDung }}
          />
        </div>

        {/* Related Documents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Văn bản liên quan</h2>
          <div className="space-y-3">
            {Object.values(mockDocuments)
              .filter((doc) => doc.id !== vanBan.id)
              .slice(0, 3)
              .map((doc) => (
                <Link
                  key={doc.id}
                  href={`/van-ban/${doc.id}`}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-primary hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-primary">description</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{doc.soKyHieu}</p>
                    <p className="mt-1 text-sm text-slate-600 line-clamp-2">{doc.trichYeu}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </Link>
              ))}
          </div>
        </div>

        {/* Back Button */}
        <Link
          href="/van-ban-phap-luat"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Quay lại danh sách văn bản
        </Link>
      </div>
    </main>
  );
}
