import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

interface BlogPostsListProps {
  posts: Post[];
}

export default function BlogPostsList({ posts }: BlogPostsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="flex flex-col overflow-hidden border border-white border-1 rounded-2xl transition-all duration-200 hover:shadow-md"
        >
          <Link href={`/blog/${post.slug}`} className="group">
            <div className="relative h-48 w-full overflow-hidden rounded-2xl">
              {post.previewImage || post.coverImage ? (
                <Image
                  src={post.previewImage || post.coverImage || ""}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gray-100 dark:bg-gray-800">
                  <span className="text-gray-400">Image not available</span>
                </div>
              )}
            </div>

            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </div>

              <h2 className="font-bold text-2xl mb-3 transition-all duration-200 group-hover:scale-106 origin-left">
                {post.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {post.excerpt}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
