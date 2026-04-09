/* eslint-disable @next/next/no-img-element */

import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsCommentForm } from "@/components/portal/NewsCommentForm";


import {
  formatViDateTime,
  getNewsComments,
  getNewsDetailBySlug,
  getNewsList,
  isGuid,
  type NewsComment,
} from "@/lib/news-api";

export const dynamic = "force-dynamic";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

const defaultKeywords = [
  "#ChuyenDoiSo",
  "#KinhTeSo",
  "#CaiCachHanhChinh",
  "#SmartCity",
  "#HoiNghi",
  "#CongNghe4.0",
];

const getDetailCached = cache(async (slug: string) => getNewsDetailBySlug(slug));

function renderComment(comment: NewsComment, depth = 0) {
  const hasReplies = comment.replies.length > 0;

  return (
    <article
      key={`${comment.id}-${depth}`}
      className={`rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40 ${
        depth > 0 ? "ml-6" : ""
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{comment.authorName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{formatViDateTime(comment.createdAt)}</p>
        </div>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">{comment.content}</p>

      {hasReplies ? (
        <div className="mt-4 space-y-3 border-l border-slate-200 pl-4 dark:border-slate-700">
          {comment.replies.map((item) => renderComment(item, depth + 1))}
        </div>
      ) : null}
    </article>
  );
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const detailResult = await getDetailCached(slug);

  if (!detailResult) {
    return {
      title: "Không tìm thấy bài viết",
      description: "Bài viết bạn đang tìm có thể đã được gỡ hoặc không tồn tại.",
    };
  }

  const article = detailResult.article;
  const title = article.seoTitle?.trim() || article.title;
  const description = article.seoDescription?.trim() || article.excerpt || "Tin tức địa phương";
  const canonical = `/tin-tuc/${article.slug}`;

  return {
    title,
    description,
    keywords: article.tags.length > 0 ? article.tags : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      locale: "vi_VN",
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;

  const detailResult = await getDetailCached(slug);

  if (!detailResult) {
    notFound();
  }

  const article = detailResult.article;

  const [latestResult, commentsResult] = await Promise.all([
    getNewsList({ page: 1, pageSize: 6 }),
    getNewsComments(article.id, { page: 1, pageSize: 10 }),
  ]);

  const relatedArticles = latestResult.items.filter((item) => item.slug !== article.slug).slice(0, 2);
  const latestArticles = latestResult.items.slice(0, 3);

  const keywords =
    article.tags.length > 0
      ? article.tags.map((tag) => (tag.startsWith("#") ? tag : `#${tag.replace(/\s+/g, "")}`))
      : defaultKeywords;

  const warnings = [detailResult.warning, latestResult.warning, commentsResult.warning].filter(
    (item, index, array): item is string => Boolean(item) && array.indexOf(item) === index,
  );

  const commentsEnabled = isGuid(article.id);
  const commentsTotal = commentsResult.pagination.total;

  return (
    <div className="flex-1 h-full bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {warnings.length > 0 ? (
          <div className="mb-6 space-y-2">
            {warnings.map((warning) => (
              <div
                key={warning}
                className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200"
              >
                {warning}
              </div>
            ))}
          </div>
        ) : null}

        <nav className="mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
          <Link className="hover:text-primary" href="/">
            Trang chủ
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary" href="/tin-tuc">
            Tin tức
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link className="hover:text-primary" href="/tin-tuc">
            {article.category}
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-bold text-primary">Chi tiết tin tức</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="p-6 md:p-8">
                <h1 className="gov-section-title mb-6 text-3xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
                  {article.title}
                </h1>

                <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span>{formatViDateTime(article.publishedAt ?? article.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">person</span>
                    <span>Tác giả: {article.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>{article.views.toLocaleString("vi-VN")} lượt xem</span>
                  </div>
                </div>

                <figure className="mb-8">
                  {article.imageUrl ? (
                    <img
                      alt={article.title}
                      className="aspect-video h-auto w-full rounded-lg object-cover"
                      src={article.imageUrl}
                    />
                  ) : (
                    <div className="aspect-video h-auto w-full rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 dark:bg-slate-800">
                      <span className="material-symbols-outlined text-4xl">newspaper</span>
                    </div>
                  )}
                  <figcaption className="mt-3 text-center text-sm italic text-slate-500 dark:text-slate-400">
                    Ảnh minh họa cho nội dung bài viết
                  </figcaption>
                </figure>

                <div
                  className="max-w-none text-lg leading-relaxed text-slate-700 dark:text-slate-300 [&_p]:mb-4 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_blockquote]:my-6 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:py-2 [&_blockquote]:pl-4 [&_blockquote]:italic"
                  // Noi dung da duoc backend lam sach HTML truoc khi tra ve.
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold tracking-wider text-slate-500 uppercase">
                      Chia sẻ bài viết:
                    </span>
                    <div className="flex gap-2">
                      <button title="Button" aria-label="Button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-opacity hover:opacity-90"
                        type="button"
                      >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>

                      <button title="Button" aria-label="Button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-white transition-opacity hover:opacity-90"
                        type="button"
                      >
                        Zalo
                      </button>

                      <button title="Button" aria-label="Button"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-colors hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-xl">link</span>
                      </button>
                    </div>
                  </div>

                  <button title="Button" aria-label="Button"
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">print</span>
                    In bài viết
                  </button>
                </div>
              </div>
            </article>

            <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                <span className="material-symbols-outlined gov-icon">forum</span>
                Bình luận ({commentsTotal})
              </h3>

              <NewsCommentForm articleId={article.id} enabled={commentsEnabled} />

              {commentsResult.comments.length === 0 ? (
                <p className="mt-4 text-center text-sm text-slate-400 dark:text-slate-500">
                  Chưa có bình luận nào. Hãy là người đầu tiên nêu ý kiến!
                </p>
              ) : (
                <div className="mt-6 space-y-4">
                  {commentsResult.comments.map((item) => renderComment(item))}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Bài viết liên quan</h3>
              {relatedArticles.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  Chưa có bài viết liên quan.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      className="group flex gap-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                      href={`/tin-tuc/${related.slug}`}
                    >
                      <div className="h-24 w-24 flex-shrink-0">
                        {related.imageUrl ? (
                          <img
                            alt={related.title}
                            className="h-full w-full rounded-lg object-cover"
                            src={related.imageUrl}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                            <span className="material-symbols-outlined text-2xl">newspaper</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="line-clamp-2 font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                          {related.title}
                        </h4>
                        <span className="mt-2 text-xs text-slate-400">
                          {formatViDateTime(related.publishedAt ?? related.createdAt)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                  Tin mới nhất
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {latestArticles.map((item, index) => (
                  <div
                    key={item.id}
                    className="group p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <Link className="block" href={`/tin-tuc/${item.slug}`}>
                      <span
                        className={`mb-1 block text-[10px] font-bold uppercase ${
                          index === 0 ? "text-primary" : index === 1 ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {item.category}
                      </span>
                      <h4 className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-slate-200">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {formatViDateTime(item.publishedAt ?? item.createdAt)}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="p-4 text-center">
                <Link className="text-sm font-bold text-primary hover:underline" href="/tin-tuc">
                  Xem tất cả tin tức
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <span className="material-symbols-outlined text-primary">sell</span>
                Từ khóa phổ biến
              </h3>

              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <Link
                    key={keyword}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-300"
                    href={`/tin-tuc?q=${encodeURIComponent(keyword.replace(/^#/, ""))}`}
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-white shadow-lg">
              <div className="relative z-10">
                <h4 className="mb-2 text-lg font-bold">Hỏi đáp trực tuyến</h4>
                <p className="mb-4 text-sm text-white/80">
                  Gửi câu hỏi của bạn cho chính quyền để được giải đáp thắc mắc kịp thời.
                </p>
                <button title="Button" aria-label="Button"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-slate-100"
                  type="button"
                >
                  Gửi câu hỏi ngay
                </button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl text-white/10">help</span>
            </div>
          </aside>
        </div>
      </main>

      
    </div>
  );
}
