"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

type ApiEnvelope = {
  thanhCong?: boolean;
  ThanhCong?: boolean;
  thongDiep?: string;
  ThongDiep?: string;
};

type FormStatus = {
  type: "success" | "error";
  message: string;
} | null;

type NewsCommentFormProps = {
  articleId: string;
  enabled: boolean;
};

export function NewsCommentForm({ articleId, enabled }: NewsCommentFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!enabled) {
      setStatus({ type: "error", message: "Không thể gửi bình luận cho bài viết này." });
      return;
    }

    if (!name.trim() || !email.trim() || content.trim().length < 2) {
      setStatus({
        type: "error",
        message: "Vui lòng nhập đầy đủ tên, email và nội dung bình luận (tối thiểu 2 ký tự).",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetchApi("/api/comments", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          baiVietId: articleId,
          tenKhach: name.trim(),
          emailKhach: email.trim(),
          noiDung: content.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as ApiEnvelope | null;
      const success = payload?.thanhCong ?? payload?.ThanhCong ?? response.ok;
      const message = payload?.thongDiep ?? payload?.ThongDiep;

      if (!success || !response.ok) {
        setStatus({ type: "error", message: message ?? "Gửi bình luận thất bại. Vui lòng thử lại." });
        return;
      }

      setContent("");
      setStatus({ type: "success", message: message ?? "Đã gửi bình luận thành công." });
      router.refresh();
    } catch {
      setStatus({
        type: "error",
        message: "Không kết nối được máy chủ bình luận. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm transition-all focus:ring-2 focus:ring-primary/50 dark:border-slate-800 dark:bg-slate-800"
          disabled={!enabled || isSubmitting}
          onChange={(event) => setName(event.target.value)}
          placeholder="Họ và tên"
          required
          type="text"
          value={name}
        />
        <input
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm transition-all focus:ring-2 focus:ring-primary/50 dark:border-slate-800 dark:bg-slate-800"
          disabled={!enabled || isSubmitting}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
      </div>

      <textarea
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm transition-all focus:ring-2 focus:ring-primary/50 dark:border-slate-800 dark:bg-slate-800"
        disabled={!enabled || isSubmitting}
        minLength={2}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Nhập ý kiến của bạn tại đây..."
        required
        rows={4}
        value={content}
      />

      {status ? (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            status.type === "success"
              ? "border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
              : "border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-900/20 dark:text-rose-200"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      {!enabled ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Bài viết này đang ở chế độ dữ liệu mẫu nên không thể gửi bình luận trực tiếp.
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          className="rounded-xl bg-primary px-8 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!enabled || isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
        </button>
      </div>
    </form>
  );
}
