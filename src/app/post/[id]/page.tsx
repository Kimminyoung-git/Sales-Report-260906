import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseClient, type Post, type Comment } from "@/lib/supabase";
import CommentForm from "./comment-form";

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

export default async function PostPage({ params }: PageProps<"/post/[id]">) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const supabase = createSupabaseClient();

  const [{ data: post }, { data: commentData }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", postId).maybeSingle(),
    supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true }),
  ]);

  if (!post) notFound();

  const typedPost = post as Post;
  const comments = (commentData ?? []) as Comment[];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← 목록으로
      </Link>

      <article className="mt-4 border-b border-border pb-8">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="rounded bg-card px-2 py-0.5 font-medium">
            {typedPost.category}
          </span>
          <span>{typedPost.author}</span>
          <span>·</span>
          <time dateTime={typedPost.created_at}>
            {formatDate(typedPost.created_at)}
          </time>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {typedPost.title}
        </h1>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {typedPost.content}
        </p>
      </article>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">댓글 {comments.length}</h2>

        <ul className="mt-4 flex flex-col gap-3">
          {comments.length === 0 && (
            <li className="text-sm text-muted">첫 댓글을 남겨보세요.</li>
          )}
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center gap-2 text-xs text-muted">
                <span>{comment.author}</span>
                <span>·</span>
                <time dateTime={comment.created_at}>
                  {formatDate(comment.created_at)}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground/80">
                {comment.content}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <CommentForm postId={postId} />
        </div>
      </section>
    </main>
  );
}
