/* eslint-disable @next/next/no-img-element */

import Link from "next/link";


import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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

type AlbumDetail = {
  id: string;
  ten: string;
  thoiGianTao?: string;
  chuDe?: string | null;
  moTa?: string | null;
};

type MediaItem = {
  id: string;
  tieuDe?: string;
  urlTep?: string | null;
};

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5187").replace(/\/+$/, "");

function resolveMediaUrl(path: string | null | undefined, fallback: string): string {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatViDate(value?: string): string {
  if (!value) return "Đang cập nhật";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Đang cập nhật";

  return date.toLocaleDateString("vi-VN");
}

async function getAlbum(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/media/albums/${id}`, { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as ApiEnvelope<AlbumDetail>;
    const success = data.thanhCong ?? data.ThanhCong ?? false;
    const payload = data.duLieu ?? data.DuLieu;
    return success && payload ? payload : null;
  } catch (error) {
    console.error("Lỗi lấy chi tiết album:", error);
    return null;
  }
}

async function getAlbumMedia(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/media?albumId=${id}&kichThuocTrang=100`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = (await res.json()) as ApiEnvelope<PagedResult<MediaItem>>;
    const success = data.thanhCong ?? data.ThanhCong ?? false;
    const payload = data.duLieu ?? data.DuLieu;
    const items = payload?.danhSach ?? payload?.DanhSach ?? [];
    return success && Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Lỗi lấy ảnh trong album:", error);
    return [];
  }
}

export default async function ChiTietAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = await getAlbum(id);

  if (!album) {
    notFound();
  }

  const mediaList = await getAlbumMedia(id);

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
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined mx-1 text-sm text-slate-400">chevron_right</span>
                <Link className="text-slate-500 hover:text-primary dark:text-slate-400" href="/thu-vien">
                  Thư viện
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined mx-1 text-sm text-slate-400">chevron_right</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Chi tiết Album</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <h1 className="mb-4 text-3xl font-bold leading-tight text-slate-900 dark:text-slate-100">
            {album.ten}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>{" "}
              {formatViDate(album.thoiGianTao)}
            </span>
            {album.chuDe && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">folder</span> {album.chuDe}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">photo_library</span> {mediaList.length} hình ảnh
            </span>
          </div>
          {album.moTa && (
            <p className="mt-4 text-slate-600 dark:text-slate-400">
                {album.moTa}
            </p>
          )}
        </div>

        {mediaList.length > 0 ? (
          <div className="columns-1 gap-4 space-y-4 sm:columns-2 md:columns-3">
            {mediaList.map((media) => {
              const imgUrl = resolveMediaUrl(media.urlTep, "https://placehold.co/600x400?text=No+Image");
              
              return (
                <div key={media.id} className="group relative break-inside-avoid overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <img
                    alt={media.tieuDe || "Hình ảnh"}
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
                    src={imgUrl}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <span className="material-symbols-outlined rounded-full bg-white/20 p-2 backdrop-blur-md transition-colors hover:bg-white/40 cursor-pointer">
                        zoom_in
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800">
             <span className="material-symbols-outlined mb-2 text-4xl text-slate-400">image_not_supported</span>
             <p className="text-slate-500">Album này chưa có hình ảnh nào.</p>
          </div>
        )}
      </main>

      
    </div>
  );
}