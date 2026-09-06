import Link from "next/link";
import { createSupabaseClient, type Post } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  });
}

export default async function HomePage() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as Post[];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
      <header className="mb-10">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          매출 정보
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">매출 정보</h1>
        <p className="mt-2 text-sm text-muted">
          매출 정보를 자유롭게 공유하는 공간입니다. 로그인 없이 누구나 익명으로
          글을 남길 수 있습니다.
        </p>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-muted">전체 {posts.length}개</span>
        <Link
          href="/write"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          글쓰기
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-border bg-card px-4 py-3 text-sm text-red-600">
          목록을 불러오지 못했습니다: {error.message}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {!error && posts.length === 0 && (
          <li className="rounded-lg border border-border bg-card px-5 py-10 text-center text-sm text-muted">
            아직 게시글이 없습니다. 첫 글을 남겨보세요.
          </li>
        )}

        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-lg border border-border bg-card px-5 py-4"
          >
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="rounded bg-background px-2 py-0.5 font-medium">
                {post.category}
              </span>
              <span>{post.author}</span>
              <span>·</span>
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
            </div>
            <h2 className="mt-2 text-base font-semibold">{post.title}</h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">
              {post.content}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
