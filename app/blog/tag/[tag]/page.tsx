import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostsByTag, getAllTags } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import AnimatedTitle from "@/components/blog/AnimatedTitle";

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  const posts = await getPostsByTag(tag);

  if (!posts.length) {
    return {
      title: "Tag non trouvé | Kasar.io",
      description: "Aucun article trouvé pour ce tag",
    };
  }

  return {
    title: `Articles sur ${tag} | Kasar.io`,
    description: `Explorez nos articles sur ${tag}`,
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({
    tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  const posts = await getPostsByTag(tag);

  if (!posts.length) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-transparent transition-all hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-5 hover:scale-105 mr-4"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5px] text-gray-800 dark:text-white" />
          </Link>
          <h1 className="text-3xl font-bold">
            Articles sur <span className="capitalize">{tag}</span>
          </h1>
        </div>

        <AnimatedTitle titles={posts.map((post) => post.title)} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden group"
            >
              <Link href={`/blog/${post.slug}`} className="relative">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl mb-4">
                  {post.previewImage || post.coverImage ? (
                    <Image
                      src={post.previewImage || post.coverImage || ""}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-800">
                      <span className="text-gray-400">Image not available</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-bold mb-2 text-white">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="capitalize">{tag}</span>
                    <span className="mx-2">•</span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
