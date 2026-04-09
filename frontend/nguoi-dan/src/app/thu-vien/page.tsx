import { AlbumList } from "@/components/media/album-list";
import { VideoList } from "@/components/media/video-list";

export const dynamic = "force-dynamic";

export default async function ThuVienPage() {
  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 md:px-10">
        <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
            <div>
              <p className="mb-2 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary-100 px-3 py-1 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined gov-icon text-base">auto_stories</span>
                Thư viện tư liệu
              </p>
              <h1 className="gov-section-title mb-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
                Thư viện hình ảnh và video
              </h1>
              <p className="max-w-2xl text-slate-600 dark:text-slate-400">
                Cập nhật tư liệu truyền thông về hoạt động chỉ đạo, điều hành và sự kiện trên địa bàn. Người dân có thể theo dõi theo từng album hoặc video chuyên đề.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                  href="#albums"
                >
                  Đến mục album
                </a>
                <a
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  href="#videos"
                >
                  Đến mục video
                </a>
              </div>
            </div>
            {/* The stats section can be a client component if it needs to be dynamic */}
          </div>
        </div>

        <AlbumList />
        <VideoList />
      </main>
    </div>
  );
}
