/* eslint-disable @next/next/no-img-element */

import Link from "next/link";



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

type AlbumItem = {
  id: string;
  ten: string;
  duongDanAnh?: string | null;
  soPhuongTien?: number;
  thoiGianTao?: string;
  chuDe?: string | null;
};

type VideoItem = {
  id: string;
  tieuDe: string;
  urlTep?: string | null;
  thoiGianTao?: string;
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

async function getAlbums() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/media/albums`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = (await res.json()) as ApiEnvelope<AlbumItem[]>;
    const success = data.thanhCong ?? data.ThanhCong ?? false;
    const payload = data.duLieu ?? data.DuLieu;
    return success && Array.isArray(payload) ? payload : [];
  } catch (error) {
    console.error("Lỗi lấy danh sách album:", error);
    return [];
  }
}

async function getVideos() {
  try {
    // 1 là Video theo LoaiPhuongTien
    const res = await fetch(`${API_BASE_URL}/api/media?loai=1&kichThuocTrang=6`, { cache: "no-store" });
    if (!res.ok) return [];

    const data = (await res.json()) as ApiEnvelope<PagedResult<VideoItem>>;
    const success = data.thanhCong ?? data.ThanhCong ?? false;
    const payload = data.duLieu ?? data.DuLieu;
    const items = payload?.danhSach ?? payload?.DanhSach ?? [];
    return success && Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Lỗi lấy danh sách video:", error);
    return [];
  }
}

export default async function ThuVienPage() {
  const albums = await getAlbums();
  const videos = await getVideos();

  const primaryVideos = videos.slice(0, 2);
  const secondaryVideos = videos.slice(2, 6);

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 md:px-10">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold text-slate-900 dark:text-slate-100">Thư viện Media</h1>
          <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
            Khám phá các hình ảnh, video và tài liệu về các hoạt động, sự kiện nổi bật của địa phương chúng tôi.
          </p>
        </div>

        {/* Albums */}
        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Album hình ảnh mới nhất</h2>
          </div>
          {albums.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <Link key={album.id} href={`/thu-vien/album/${album.id}`} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <img
                      alt={album.ten}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={resolveMediaUrl(album.duongDanAnh, "https://placehold.co/600x400?text=No+Image")}
                    />
                    <div className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      <span className="material-symbols-outlined mr-1 align-middle text-[14px]">photo_library</span>
                      {album.soPhuongTien || 0} ảnh
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 line-clamp-2 font-bold text-slate-900 group-hover:text-primary dark:text-slate-100 dark:group-hover:text-primary-light">
                      {album.ten}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <span className="material-symbols-outlined mr-1 text-[16px]">calendar_today</span>
                        {formatViDate(album.thoiGianTao)}
                      </span>
                      {album.chuDe && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {album.chuDe}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">Chưa có album hình ảnh nào.</div>
          )}
        </section>

        {/* Videos */}
        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Video tiêu biểu</h2>
          </div>
          
          {videos.length > 0 ? (
            <>
              {/* Primary Videos */}
              <div className="mb-6 grid gap-6 lg:grid-cols-2">
                {primaryVideos.map((video) => (
                  <Link key={video.id} href={`/thu-vien/video/${video.id}`} className="group relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-900">
                    <img
                      alt={video.tieuDe}
                      className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                      src={resolveMediaUrl(video.urlTep, "https://placehold.co/600x400?text=Video")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl backdrop-blur-sm transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined ml-1 text-4xl">play_arrow</span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                      <h3 className="mb-2 line-clamp-2 text-xl font-bold">{video.tieuDe}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center">
                          <span className="material-symbols-outlined mr-1 text-[16px]">calendar_today</span>
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
                          src={resolveMediaUrl(video.urlTep, "https://placehold.co/400x300?text=Video")}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-4xl text-white">play_circle</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="line-clamp-2 font-bold text-slate-900 group-hover:text-primary dark:text-slate-100">
                          {video.tieuDe}
                        </h4>
                        <div className="mt-1 text-xs text-slate-500">
                          {formatViDate(video.thoiGianTao)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">Chưa có video nào.</div>
          )}
        </section>

      </main>

      
    </div>
  );
}