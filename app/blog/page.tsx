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
            
            // Animation de fade-in pour les articles
            const articles = document.querySelectorAll('.article-card');
            articles.forEach((article, index) => {
              article.style.opacity = '0';
              article.style.transform = 'translateY(20px)';
              setTimeout(() => {
                article.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
              }, 100 + (index * 100));
            });
          });
        `}
      </Script>
      <div
        className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl content-page"
        style={{ marginTop: 0, paddingTop: "1rem" }}
      >
        <ScrollToTopButton />
        <div className="space-y-6">
          <div className="mb-8">
            {/* Titre animé côté client */}
            <div className="mb-10">
              <AnimatedTitle titles={posts.map((post) => post.title)} />
            </div>

            {/* Filtres */}
            <div className="mb-8">
              {/* Version desktop et mobile: liens horizontaux */}
              <div className="flex flex-wrap items-center justify-start gap-6 sm:gap-8 overflow-x-auto py-3 px-2">
                <Link
                  href="/blog"
                  className="text-white font-medium whitespace-nowrap relative group"
                >
                  All
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/blog?tag=Snak"
                  className="text-gray-400 hover:text-white whitespace-nowrap relative group transition-colors duration-300"
                >
                  Snak
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/blog?tag=Quaza"
                  className="text-gray-400 hover:text-white whitespace-nowrap relative group transition-colors duration-300"
                >
                  Quaza
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/blog?tag=Madara"
                  className="text-gray-400 hover:text-white whitespace-nowrap relative group transition-colors duration-300"
                >
                  Madara
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/blog?tag=Sn Stack"
                  className="text-gray-400 hover:text-white whitespace-nowrap relative group transition-colors duration-300"
                >
                  Sn Stack
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href="/blog?tag=Kasar"
                  className="text-gray-400 hover:text-white whitespace-nowrap relative group transition-colors duration-300"
                >
                  Stories
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>

            {/* Grille d'articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="article-card flex flex-col overflow-hidden group bg-gray-900/20 rounded-3xl p-3 sm:p-4 hover:bg-gray-800/30 transition-colors duration-300"
                >
                  <Link href={`/blog/${post.slug}`} className="relative">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-3 sm:mb-4">
                      {post.previewImage || post.coverImage ? (
                        <Image
                          src={post.previewImage || post.coverImage || ""}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGYxMzFmIi8+PC9zdmc+"
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
                      <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white line-clamp-2">
                        {post.title}
                      </h2>
                      <div className="flex items-center text-xs sm:text-sm text-gray-400">
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
                  className="article-card flex flex-col overflow-hidden group bg-gray-900/20 rounded-3xl p-3 sm:p-4"
                >
                  <div className="relative">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-3 sm:mb-4 bg-gray-900"></div>

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
