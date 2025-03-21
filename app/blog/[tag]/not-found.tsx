import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Article non trouvé</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Désolé, l&apos;article que vous recherchez n&apos;existe pas ou a été
        déplacé.
      </p>
      <Link
        href="/blog"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        Retour aux articles
      </Link>
    </main>
  );
}
