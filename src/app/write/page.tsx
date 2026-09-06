"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const CATEGORY = "매출";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = title.trim() !== "" && content.trim() !== "" && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    // 작성자는 서버에서 '익명'으로 저장되고, 서버가 AI 댓글도 이어서 생성한다.
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "저장에 실패했습니다.");
      setSubmitting(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
      <header className="mb-8">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ← 목록으로
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">글쓰기</h1>
        <p className="mt-2 text-sm text-muted">
          작성자는 익명으로 저장됩니다.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">카테고리</label>
          <input
            value={CATEGORY}
            disabled
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium">
            제목
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-medium">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            className="resize-y rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {error && (
          <p className="rounded-md border border-border bg-card px-3 py-2 text-sm text-red-600">
            저장에 실패했습니다: {error}
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "등록 중…" : "등록"}
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-card"
          >
            취소
          </Link>
        </div>
      </form>
    </main>
  );
}
