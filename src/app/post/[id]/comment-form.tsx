"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";

export default function CommentForm({ postId }: { postId: number }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = content.trim() !== "" && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    const supabase = createSupabaseClient();
    // 작성자(author)는 전송하지 않음 → DB 기본값 '익명'으로 저장됨
    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      content: content.trim(),
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    setContent("");
    setSubmitting(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요 (익명)"
        rows={3}
        className="resize-y rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
      />
      {error && (
        <p className="text-sm text-red-600">저장에 실패했습니다: {error}</p>
      )}
      <div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "등록 중…" : "댓글 등록"}
        </button>
      </div>
    </form>
  );
}
