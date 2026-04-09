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

type AlbumItem = {
  id: string;
  ten: string;
  duongDanAnh?: string | null;
  soPhuongTien?: number;
  thoiGianTao?: string;
  chuDe?: string | null;
};

function formatViDate(value?: string): string {
  if (!value) return "Đang cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Đang cập nhật";
  return date.toLocaleDateString("vi-VN");
}

async function getAlbums() {
  try {
    const res = await fetch(buildApiUrl("/api/media/albums"), { cache: "no-store" });
    if (!res.ok) return [];
    const payload = (await res.json()) as ApiEnvelope<AlbumItem[]>;
    const envelope = unwrapApiEnvelope<AlbumItem[]>(payload);
    return envelope.success && Array.isArray(envelope.data) ? envelope.data : [];
  } catch (error) {
    console.error("Lỗi lấy danh sách album:", error);
    return [];
  }
}

export function AlbumList() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getAlbums();
      setAlbums(data);
    });
  }, []);

  if (isPending) {
    return (
      <section className="mb-12" id="albums">
        <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <h2 className="gov-section-title text-2xl font-bold text-slate-900 dark:text-slate-100">Album hình ảnh</h2>
        </div>
        <div className="grid animate-pulse gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex h-full flex-col rounded-2xl bg-white p-4 dark:bg-slate-900">
              <div className="relative mb-4 aspect-[4/3] w-full rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div>
                <div className="mb-2 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="mb-3 h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12" id="albums">
      <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <h2 className="gov-section-title text-2xl font-bold text-slate-900 dark:text-slate-100">Album hình ảnh</h2>
        <span className="text-sm text-slate-500">{albums.length} album</span>
      </div>
      {albums.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/thu-vien/album/${album.id}`}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                <img
                  alt={album.ten}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={resolveMediaUrl(album.duongDanAnh, "https://placehold.co/600x400?text=No+Image")}
                />
                <div className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  <span className="material-symbols-outlined gov-icon mr-1 align-middle text-[14px]">photo_library</span>
                  {album.soPhuongTien || 0} ảnh
                </div>
              </div>
              <div>
                <h3 className="mb-2 line-clamp-2 font-bold text-slate-900 group-hover:text-primary dark:text-slate-100 dark:group-hover:text-primary-light">
                  {album.ten}
                </h3>
                <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center">
                    <span className="material-symbols-outlined gov-icon mr-1 text-[16px]">calendar_today</span>
                    {formatViDate(album.thoiGianTao)}
                  </span>
                  {album.chuDe && (
                    <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {album.chuDe}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Xem chi tiết
                  <span className="material-symbols-outlined gov-icon text-base">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <span className="material-symbols-outlined gov-icon mb-2 text-4xl text-slate-400">photo_library</span>
          <p className="font-medium text-slate-600 dark:text-slate-400">Chưa có album hình ảnh nào.</p>
        </div>
      )}
    </section>
  );
}