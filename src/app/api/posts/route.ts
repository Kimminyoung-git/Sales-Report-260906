import { after, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";
import { generateAiComment } from "@/lib/ai-comment";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const { title, content } = (body ?? {}) as {
    title?: unknown;
    content?: unknown;
  };
  const t = typeof title === "string" ? title.trim() : "";
  const c = typeof content === "string" ? content.trim() : "";

  if (!t || !c) {
    return NextResponse.json(
      { error: "제목과 내용을 입력하세요." },
      { status: 400 },
    );
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ title: t, content: c, category: "매출" })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "저장에 실패했습니다." },
      { status: 500 },
    );
  }

  const postId = data.id as number;

  // 응답을 보낸 뒤 백그라운드에서 AI 댓글 생성/저장 (사용자를 기다리게 하지 않음)
  after(async () => {
    try {
      const text = await generateAiComment(t, c);
      if (!text) return;
      await createSupabaseClient()
        .from("comments")
        .insert({ post_id: postId, content: text, author: "AI" });
    } catch (e) {
      console.error("AI 댓글 생성 실패:", e);
    }
  });

  return NextResponse.json({ id: postId });
}
