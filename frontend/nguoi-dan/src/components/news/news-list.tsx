/* eslint-disable @next/next/no-img-element */
"use client";

import {
  formatViDateTime,
  getNewsList,
  type NewsListItem as NewsListItemType,
  type PaginationInfo,
} from "@/lib/news-api";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

type PageToken = number | "ellipsis";

function buildHref(targetPage: number, keyword: string, categoryId: string): string {
  const query = new URLSearchParams();
  query.set("page", String(targetPage));
  if (keyword) query.set("q", keyword);
  if (categoryId) query.set("category", categoryId);
  return `/tin-tuc?${query.toString()}`;
}

function buildPageTokens(currentPage: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export function NewsList({
  page,
  pageSize,
  keyword,
  categoryId,
  fallbackCategoryName,
}: {
  page: number;
  pageSize: number;
  keyword: string;
  categoryId: string;
  fallbackCategoryName?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<NewsListItemType[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [warning, setWarning] = useState<string | undefined>();

  useEffect(() => {
    startTransition(async () => {
      const result = await getNewsList({
        page,
        pageSize,
        keyword,
        categoryId,
        fallbackCategoryName,
      });
      setItems(result.items);
      setPagination(result.pagination);
      setWarning(result.warning);
    });
  }, [page, pageSize, keyword, categoryId, fallbackCategoryName]);

  if (isPending && items.length === 0) {
    return (
      <div className="space-y-6">
        {[...Array(pageSize)].map((_, i) => (
          <div key={i} className="group flex animate-pulse flex-col gap-6 rounded-2xl bg-white p-4 dark:bg-slate-900 sm:flex-row">
            <div className="h-40 w-full shrink-0 rounded-lg bg-slate-200 dark:bg-slate-700 sm:w-56" />
            <div className="flex flex-1 flex-col justify-between">
              <div className="space-y-3">
                <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-full rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="mt-4 h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!pagination) {
    return null;
  }

  const pageTokens = buildPageTokens(pagination.page, pagination.totalPages);

  return (
    <>
      {warning ? (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
          {warning}
        </div>
      ) : null}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Không tìm thấy bài viết phù hợp với điều kiện hiện tại.
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors hover:border-primary/40 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary/40 sm:flex-row"
            >
              <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg sm:w-56">
                {item.imageUrl ? (
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    src={item.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-800">
                    <span className="material-symbols-outlined text-4xl">newspaper</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold tracking-wider text-primary uppercase">{item.category}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {formatViDateTime(item.publishedAt ?? item.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
                    <Link href={`/tin-tuc/${item.slug}`}>{item.title}</Link>
                  </h2>

                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    className="flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                    href={`/tin-tuc/${item.slug}`}
                  >
                    Xem chi tiết
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>

                  <button className="text-slate-400 hover:text-primary" type="button">
                    <span className="material-symbols-outlined gov-icon">bookmark</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-12 flex items-center justify-center gap-2">
        <Link
          aria-disabled={!pagination.hasPrev}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors dark:border-slate-800 dark:text-slate-400 ${
            pagination.hasPrev ? "hover:bg-slate-100 dark:hover:bg-slate-800" : "pointer-events-none opacity-40"
          }`}
          href={buildHref(Math.max(pagination.page - 1, 1), keyword, categoryId)}
        >
          <span className="material-symbols-outlined gov-icon">chevron_left</span>
        </Link>

        {pageTokens.map((token, index) => {
          if (token === "ellipsis") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
                ...
              </span>
            );
          }

          const isActive = token === pagination.page;
          return isActive ? (
            <span key={token} className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-white">
              {token}
            </span>
          ) : (
            <Link
              key={token}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              href={buildHref(token, keyword, categoryId)}
            >
              {token}
            </Link>
          );
        })}

        <Link
          aria-disabled={!pagination.hasNext}
          className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors dark:border-slate-800 dark:text-slate-400 ${
            pagination.hasNext ? "hover:bg-slate-100 dark:hover:bg-slate-800" : "pointer-events-none opacity-40"
          }`}
          href={buildHref(Math.min(pagination.page + 1, pagination.totalPages), keyword, categoryId)}
        >
          <span className="material-symbols-outlined gov-icon">chevron_right</span>
        </Link>
      </div>
    </>
  );
}