import Link from "next/link";
import { DichVuDto } from "@/lib/services-api";

export default function DichVuCard({ service }: { service: DichVuDto }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
          ${
            service.mucDo === 3
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              : service.mucDo === 4
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
          }`}
        >
          Mức độ {service.mucDo}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
          ${
            service.dangHoatDong
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
          }`}
        >
          {service.dangHoatDong ? "Trực tuyến" : "Tạm ngưng"}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
        {service.ten}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
        {service.moTa || "Chưa có mô tả chi tiết cho thủ tục này."}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
            Thời gian xử lý
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {service.soNgayXuLy > 0
              ? `${service.soNgayXuLy} ngày`
              : "Tùy hồ sơ"}
          </span>
        </div>
        <div>
          <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
            Lệ phí
          </span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {service.lePhi != null && service.lePhi > 0
              ? `${service.lePhi.toLocaleString("vi-VN")}đ`
              : "Miễn phí"}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-auto">
        <Link
          href={`/dich-vu-cong/${service.id}`}
          className="flex-1 flex justify-center items-center py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-sm"
        >
          Xem chi tiết
        </Link>
        <Link
          href={`/dich-vu-cong/${service.id}/nop-truc-tuyen`}
          className={`flex-1 flex justify-center items-center py-2 px-4 rounded-lg font-medium text-sm transition-colors text-white 
          ${
            service.dangHoatDong
              ? "bg-primary hover:bg-primary-dark"
              : "bg-slate-400 cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!service.dangHoatDong) {
              e.preventDefault();
            }
          }}
        >
          Nộp hồ sơ
        </Link>
      </div>
    </div>
  );
}