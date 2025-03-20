import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import Markdown from "@/components/blog/Markdown";
import { ArrowLeft } from "lucide-react";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post not found | Kasar.io",
      description: "The post you are looking for does not exist",
    };
  }

  return {
    title: `${post.title} | Kasar.io`,
    description: post.excerpt,
    openGraph: post.coverImage
      ? {
          images: [{ url: post.coverImage, width: 1200, height: 630 }],
        }
      : undefined,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center p-3 rounded-2xl bg-transparent transition-all hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5 hover:scale-105"
        >
          <ArrowLeft className="w-6 h-6 stroke-[2.5px] text-gray-800 dark:text-white" />
        </Link>
      </div>

      <article className="prose dark:prose-invert lg:prose-lg max-w-none">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400 mb-8">
            <div className="flex items-center gap-2">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {post.author && (
              <div className="flex items-center gap-2">
                <span>By {post.author.name}</span>
              </div>
            )}
          </div>
        </div>

        {post.coverImage && (
          <div className="relative w-full h-[400px] mb-8 overflow-hidden rounded-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <Markdown content={post.content} />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
