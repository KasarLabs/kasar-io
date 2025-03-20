import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Types
export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  previewImage?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
  readingTime: number;
}

// Chemin vers les fichiers markdown
const postsDirectory = path.join(process.cwd(), "content/blog");

// Calculer le temps de lecture (en minutes)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/g).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Récupérer tous les slugs des articles
export async function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => ({
        params: {
          slug: fileName.replace(/\.md$/, ""),
        },
      }));
  } catch (error) {
    console.error("Erreur lors de la récupération des slugs:", error);
    return [];
  }
}

// Récupérer tous les articles triés par date
export async function getAllPosts(): Promise<Post[]> {
  try {
    // Vérifier si le répertoire existe, sinon retourner un tableau vide
    if (!fs.existsSync(postsDirectory)) {
      console.warn(
        "Le répertoire de blog n'existe pas encore:",
        postsDirectory,
      );

      // Si nous sommes en développement, créer des articles d'exemple
      if (process.env.NODE_ENV === "development") {
        return generateSamplePosts();
      }

      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith(".md"))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.md$/, "");
          const post = await getPostBySlug(slug);
          return post;
        }),
    );

    // Filtrer les posts undefined et trier par date
    const filteredPosts = allPostsData.filter(Boolean) as Post[];
    return filteredPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des articles:", error);

    // Si nous sommes en développement, créer des articles d'exemple
    if (process.env.NODE_ENV === "development") {
      return generateSamplePosts();
    }

    return [];
  }
}

// Récupérer un article par son slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Vérifier si le répertoire existe
    if (!fs.existsSync(postsDirectory)) {
      console.warn(
        "Le répertoire de blog n'existe pas encore:",
        postsDirectory,
      );

      // Si nous sommes en développement et que c'est un slug d'exemple
      if (
        process.env.NODE_ENV === "development" &&
        slug.startsWith("sample-post-")
      ) {
        const samplePosts = generateSamplePosts();
        const samplePost = samplePosts.find((post) => post.slug === slug);
        return samplePost || null;
      }

      return null;
    }

    const fullPath = path.join(postsDirectory, `${slug}.md`);

    // Vérifier si le fichier existe
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Calculer le temps de lecture
    const readingTime = calculateReadingTime(content);

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt || "",
      content: content,
      coverImage: data.coverImage,
      previewImage: data.previewImage,
      author: data.author,
      tags: data.tags || [],
      readingTime,
    };
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de l'article ${slug}:`,
      error,
    );
    return null;
  }
}

// Récupérer tous les tags
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();

  const tagsSet = new Set<string>();
  posts.forEach((post) => {
    post.tags?.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet);
}

// Récupérer les articles par tag
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.tags?.includes(tag));
}

// Générer des articles d'exemple pour le développement
function generateSamplePosts(): Post[] {
  const samplePosts: Post[] = [];

  for (let i = 1; i <= 6; i++) {
    const slug = `sample-post-${i}`;
    const date = new Date();
    date.setDate(date.getDate() - i);

    const sampleTags = [
      ["nextjs", "react", "frontend"],
      ["markdown", "blog", "tutorial"],
      ["design", "ui", "ux"],
      ["performance", "web", "optimization"],
      ["typescript", "javascript", "programming"],
      ["api", "backend", "serverless"],
    ];

    const samplePost: Post = {
      slug,
      title: `Exemple d'article ${i}: Comment construire un blog moderne avec Next.js`,
      date: date.toISOString().split("T")[0],
      excerpt: `Ceci est un exemple d'extrait pour l'article ${i}. Il contient un résumé concis du contenu de l'article qui donne envie de lire la suite.`,
      content: `
# Exemple d'article ${i}: Comment construire un blog moderne avec Next.js

Ceci est un exemple d'article généré automatiquement pour le développement de votre blog.

## Introduction

Dans cet article, nous allons explorer comment créer un blog moderne avec Next.js et Markdown.

## Les avantages de Next.js pour un blog

- Génération de site statique (SSG)
- Optimisation des images
- Routing intégré
- Support de TypeScript

## Conclusion

Next.js est un excellent choix pour créer un blog moderne et performant.
      `,
      coverImage: `/blog/previews/gradient-${1 + (i % 3)}.png`,
      previewImage: `/blog/previews/gradient-${1 + (i % 3)}.png`,
      author: {
        name: "Auteur Exemple",
        avatar: `https://i.pravatar.cc/150?u=${slug}`,
      },
      tags: sampleTags[i % sampleTags.length],
      readingTime: 3 + (i % 5),
    };

    samplePosts.push(samplePost);
  }

  return samplePosts;
}
