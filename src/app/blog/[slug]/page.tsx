// src/app/blog/[slug]/page.tsx

import { getSinglePost } from "@/server/database/db";
import { notFound } from "next/navigation";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const response = await getSinglePost(slug);
  const post = await response.json();

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
