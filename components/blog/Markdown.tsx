"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Support GitHub Flavored Markdown (tables, strikethrough, etc.)
        rehypePlugins={[rehypeSlug, rehypeSanitize, rehypeHighlight]} // Add IDs to headings, sanitize HTML, and highlight code
        components={{
          // Personnalisation des titres
          h1: ({ ...props }) => (
            <h1
              className="text-4xl font-bold mt-8 mb-4 text-[#9e9e9e]"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-[1.725rem] font-bold mt-6 mb-3 text-[#9e9e9e]"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-[1.38rem] font-bold mt-5 mb-2 text-[#9e9e9e]"
              {...props}
            />
          ),
          h4: ({ ...props }) => (
            <h4
              className="text-[1.15rem] font-bold mt-4 mb-2 text-[#9e9e9e]"
              {...props}
            />
          ),

          // Personnalisation des paragraphes
          p: ({ children, ...props }) => {
            // Si un paragraphe contient uniquement une image, ne pas le rendre du tout
            const hasOnlyImageChild = React.Children.toArray(children).every(
              (child) =>
                React.isValidElement(child) &&
                (child.type === "img" || (child.props && child.props.src)),
            );

            if (hasOnlyImageChild) {
              return <>{children}</>;
            }

            return (
              <p className="my-4 leading-relaxed text-[#9e9e9e]" {...props}>
                {children}
              </p>
            );
          },

          // Personnalisation des liens
          a: ({ href, ...props }) => {
            const isInternalLink =
              href && (href.startsWith("/") || href.startsWith("#"));

            if (isInternalLink) {
              return (
                <Link
                  href={href}
                  className="text-gray-400 dark:text-gray-400 hover:underline font-medium"
                  {...props}
                />
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-400 hover:underline font-medium inline-flex items-center"
                {...props}
              >
                {props.children}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 ml-1 inline"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            );
          },

          // Personnalisation des images - approche simplifiée pour éviter les problèmes d'hydratation
          img: ({ src, alt }) => {
            if (!src) return null;

            // Vérifions si l'image est mcp-schema.png et appliquons une classe spéciale
            const isMcpSchema = src.includes("mcp-schema.png");
            const imageClasses = `w-full h-auto rounded-2xl overflow-hidden shadow-lg object-cover ${isMcpSchema ? "w-2/3 mx-auto" : ""}`;

            return (
              <figure className="my-6">
                <Image
                  src={src}
                  alt={alt || ""}
                  width={800}
                  height={450}
                  className={imageClasses}
                />
                {alt && (
                  <figcaption className="text-center text-sm text-gray-400 dark:text-gray-400 mt-2">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },

          // Personnalisation des blocs de code
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!className) {
              return (
                <code
                  className="bg-gray-800 dark:bg-gray-900 text-white dark:text-white px-1 py-0.5 rounded-md text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="my-6 rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gray-800 text-gray-200 text-xs px-4 py-2 flex justify-between items-center">
                  <span>{language}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        String(children).replace(/\n$/, ""),
                      );
                    }}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>
                </div>
                <pre className="bg-gray-900 p-4 overflow-x-auto text-white text-sm">
                  <code className={className}>{String(children)}</code>
                </pre>
              </div>
            );
          },

          // Personnalisation des listes
          ul: ({ ...props }) => (
            <ul
              className="list-disc pl-6 mb-4 space-y-2 text-[#9e9e9e]"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="list-decimal pl-6 mb-4 space-y-2 text-[#9e9e9e]"
              {...props}
            />
          ),
          li: ({ ...props }) => (
            <li className="leading-relaxed text-[#9e9e9e]" {...props} />
          ),

          // Personnalisation des blocs de citation
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-1 my-6 italic bg-gray-50 dark:bg-gray-800 text-[#9e9e9e] rounded-r-2xl shadow-md"
              {...props}
            />
          ),

          // Personnalisation des tables
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead
              className="bg-gray-100 dark:bg-gray-800 text-white dark:text-white"
              {...props}
            />
          ),
          th: ({ ...props }) => (
            <th
              className="px-6 py-3 text-left text-xs font-medium text-white dark:text-white uppercase tracking-wider"
              {...props}
            />
          ),
          tbody: ({ ...props }) => (
            <tbody
              className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 text-[#9e9e9e]"
              {...props}
            />
          ),
          tr: ({ ...props }) => (
            <tr
              className="hover:bg-gray-50 dark:hover:bg-gray-800"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td
              className="px-6 py-4 whitespace-nowrap text-sm text-[#9e9e9e]"
              {...props}
            />
          ),

          // Personnalisation des éléments horizontaux
          hr: ({ ...props }) => <hr className="hidden" {...props} />,

          // Personnalisation des éléments de mise en forme
          strong: ({ ...props }) => (
            <strong className="font-bold text-[#9e9e9e]" {...props} />
          ),
          em: ({ ...props }) => (
            <em className="italic text-[#9e9e9e]" {...props} />
          ),
          del: ({ ...props }) => (
            <del className="line-through text-gray-400" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
