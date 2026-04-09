/* eslint-disable @next/next/no-img-element */
"use client";

import { buildApiUrl, resolveMediaUrl, unwrapApiEnvelope } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type ApiEnvelope<T> = {
  thanhCong?: boolean;
  ThanhCong?: boolean;
  duLieu?: T;
  DuLieu?: T;
};

type PagedResult<T> = {
  danhSach?: T[];
  DanhSach?: T[];
};

type VideoItem = {
  id: string;
  tieuDe: string;
  urlTep?: string | null;
  duongDanAnh?: string | null;
  thoiGianTao?: string;
};

function formatViDate(value?: string): string {
  if (!value) return "Đang cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Đang cập nhật";
  return date.toLocaleDateString("vi-VN");
}

async function getVideos() {
  try {
    // 1 là Video theo LoaiPhuongTien
    const res = await fetch(buildApiUrl("/api/media?loai=1&kichThuocTrang=8"), { cache: "no-store" });
    if (!res.ok) return [];

    const payload = (await res.json()) as ApiEnvelope<PagedResult<VideoItem>>;
    const envelope = unwrapApiEnvelope<PagedResult<VideoItem>>(payload);
    const data = envelope.data;
    const normalizedItems = data?.danhSach ?? data?.DanhSach ?? [];
    return envelope.success && Array.isArray(normalizedItems) ? normalizedItems : [];
  } catch (error) {
    console.error("Lỗi lấy danh sách video:", error);
    return [];
  }
}

export function VideoList() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getVideos();
      setVideos(data);
    });
  }, []);

  if (isPending) {
    return (
      <section className="mb-12" id="videos">
        <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <h2 className="gov-section-title text-2xl font-bold text-slate-900 dark:text-slate-100">Video tuyên truyền</h2>
        </div>
        <div className="animate-pulse">
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            <div className="aspect-[16/9] rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="aspect-[16/9] rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="aspect-video w-full rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="mt-3 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const primaryVideos = videos.slice(0, 2);
  const secondaryVideos = videos.slice(2, 8);

  return (
    <section className="mb-12" id="videos">
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="gov-section-title text-2xl font-bold text-slate-900 dark:text-slate-100">Video tuyên truyền</h2>
        <span className="text-sm text-slate-500">{videos.length} video</span>
      </div>

      {videos.length > 0 ? (
        <>
          {/* Primary Videos */}
          <div className="mb-6 grid gap-6 lg:grid-cols-2">
            {primaryVideos.map((video) => (
              <Link
                key={video.id}
                href={`/thu-vien/video/${video.id}`}
                className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-900"
              >
                <img
                  alt={video.tieuDe}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                  src={resolveMediaUrl(video.duongDanAnh, "https://placehold.co/600x400?text=Video")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl backdrop-blur-sm transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined gov-icon ml-1 text-4xl">play_arrow</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <h3 className="mb-2 line-clamp-2 text-xl font-bold">{video.tieuDe}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center">
                      <span className="material-symbols-outlined gov-icon mr-1 text-[16px]">calendar_today</span>
                      {formatViDate(video.thoiGianTao)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary Videos Grid */}
          {secondaryVideos.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {secondaryVideos.map((video) => (
                <Link key={video.id} href={`/thu-vien/video/${video.id}`} className="group flex flex-col gap-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
                    <img
                      alt={video.tieuDe}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-hover:opacity-90"
                      src={resolveMediaUrl(video.duongDanAnh, "https://placehold.co/400x300?text=Video")}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="material-symbols-outlined gov-icon text-4xl text-white">play_circle</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="line-clamp-2 font-bold text-slate-900 group-hover:text-primary dark:text-slate-100">
                      {video.tieuDe}
                    </h4>
                    <div className="mt-1 text-xs text-slate-500">{formatViDate(video.thoiGianTao)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="material-symbols-outlined gov-icon mb-2 text-4xl text-slate-400">videocam_off</span>
          <p className="font-medium text-slate-600 dark:text-slate-400">Chưa có video nào.</p>
        </div>
      )}
    </section>
  );
}