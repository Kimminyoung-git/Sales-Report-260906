"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

export type Post = {
  id: number;
  title: string;
  category: string;
  content: string;
  author: string;
  createdAt: string;
};

// 데이터베이스 미연동: 아래 샘플은 메모리에만 존재하며 새로고침 시 초기화됩니다.
const SEED_POSTS: Post[] = [
  {
    id: 3,
    title: "3월 2주차 매출 요약",
    category: "매출",
    content:
      "온라인 채널 매출이 전주 대비 12% 증가했습니다. 신규 프로모션 유입이 주요 원인으로 보입니다.",
    author: "익명",
    createdAt: "2026-03-09T09:20:00.000Z",
  },
  {
    id: 2,
    title: "오프라인 매장 일별 매출 공유",
    category: "매출",
    content:
      "주말 매출이 평일 대비 약 1.8배 높게 유지되고 있습니다. 재고 보충 주기를 조정할 필요가 있어 보입니다.",
    author: "익명",
    createdAt: "2026-03-05T02:10:00.000Z",
  },
  {
    id: 1,
    title: "2월 마감 매출 정산 완료",
    category: "매출",
    content: "2월 총매출 정산이 완료되었습니다. 목표 대비 103% 달성했습니다.",
    author: "익명",
    createdAt: "2026-03-02T06:00:00.000Z",
  },
];

type PostsContextValue = {
  posts: Post[];
  addPost: (data: { title: string; content: string; category: string }) => void;
};

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const nextId = useRef(SEED_POSTS.length + 1);

  function addPost(data: { title: string; content: string; category: string }) {
    const post: Post = {
      id: nextId.current++,
      title: data.title,
      content: data.content,
      category: data.category,
      author: "익명",
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <PostsContext.Provider value={{ posts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error("usePosts는 PostsProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
