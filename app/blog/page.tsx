import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import AnimatedTitle from "@/components/blog/AnimatedTitle";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles, tutoriels et actualités sur nos projets et technologies",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Script id="reset-position">
        {`
          // Réinitialiser la position et les styles
          document.addEventListener('DOMContentLoaded', function() {
            window.scrollTo(0, 0);
            document.documentElement.style.scrollBehavior = 'auto';
            
            // Corriger le positionnement
            const pageContent = document.querySelector('.content-page');
            if (pageContent) {
              pageContent.style.position = 'relative';
              pageContent.style.top = '0';
              pageContent.style.marginTop = '0';
              pageContent.style.transform = 'none';
            }
          });
        `}
      </Script>
      <div
        className="container mx-auto px-4 py-8 max-w-7xl content-page"
        style={{ marginTop: 0, paddingTop: "1rem" }}
      >
        <ScrollToTopButton />
        <div className="space-y-6">
          <div className="mb-8">
            {/* Titre animé côté client */}
            <AnimatedTitle titles={posts.map((post) => post.title)} />

            {/* Filtres */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-8">
                <Link href="/blog" className="text-white font-medium">
                  All
                </Link>
                <Link
                  href="/blog?tag=Snak"
                  className="text-gray-400 hover:text-white"
                >
                  Snak
                </Link>
                <Link
                  href="/blog?tag=Quaza"
                  className="text-gray-400 hover:text-white"
                >
                  Quaza
                </Link>
                <Link
                  href="/blog?tag=Madara"
                  className="text-gray-400 hover:text-white"
                >
                  Madara
                </Link>
                <Link
                  href="/blog?tag=Sn Stack"
                  className="text-gray-400 hover:text-white"
                >
                  Sn Stack
                </Link>
                <Link
                  href="/blog?tag=Kasar"
                  className="text-gray-400 hover:text-white"
                >
                  Stories
                </Link>
              </div>
            </div>

            {/* Grille d'articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          <span className="text-gray-400">
                            Image not available
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <h2 className="text-xl font-bold mb-2 text-white">
                        {post.title}
                      </h2>
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="capitalize">
                          {post.tags?.[0] || "Madara"}
                        </span>
                        <span className="mx-2">•</span>
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}

              {/* Articles placeholder */}
              {Array.from({ length: 2 }).map((_, index) => (
                <article
                  key={`placeholder-${index}`}
                  className="flex flex-col overflow-hidden group"
                >
                  <div className="relative">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl mb-4 bg-gray-900"></div>

                    <div className="flex flex-col">
                      <div className="h-7 bg-gray-900 rounded w-3/4 mb-2"></div>
                      <div className="flex items-center text-sm text-gray-400">
                        <div className="h-4 bg-gray-900 rounded w-16"></div>
                        <span className="mx-2">•</span>
                        <div className="h-4 bg-gray-900 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
