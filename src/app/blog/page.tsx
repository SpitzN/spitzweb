// src/app/blog/page.tsx

import { env } from "@/lib/env/client";
import Link from "next/link";

export default async function BlogPage() {
  const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/blog`);
  const blogPosts = await response.json();

  return (
    <div className="container">
      <h1 className="p-8">Blog</h1>
      <ul className="grid grid-cols-1 p-4 md:grid-cols-2 lg:grid-cols-4">
        {blogPosts.map((post: { id: number; title: string; slug: string; content: string }) => (
          <li key={post.id} className="cursor p-4">
            <Link href={`/blog/${post.slug}`}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
