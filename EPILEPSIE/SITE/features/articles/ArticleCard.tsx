import type { Article } from "@/features/articles/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      {article.imageUrl && (
        // Image hébergée sur le site d'origine : <img> évite de configurer next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-48 w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {article.sourceName} ·{" "}
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>

        <h2 className="text-lg font-semibold">{article.title}</h2>

        {article.excerpt && (
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{article.excerpt}</p>
        )}

        {article.contentHtml && (
          <details className="text-sm">
            <summary className="cursor-pointer font-medium underline">
              Lire le contenu ici
            </summary>
            <div
              className="mt-3 space-y-3 [&_a]:underline [&_img]:h-auto [&_img]:max-w-full"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </details>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-block pt-2 text-sm font-medium underline"
        >
          Lire l&apos;article sur {article.sourceName}
          <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
        </a>
      </div>
    </article>
  );
}