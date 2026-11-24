import ArticleCard from "@/features/articles/ArticleCard";
import { fetchArticles } from "@/features/articles/fetch-articles";

export const metadata = {
  title: "Articles sur l'épilepsie",
};

export default async function ArticlesPage() {
  const { articles, failedSources } = await fetchArticles();

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Articles sur l&apos;épilepsie</h1>
      <p className="mt-2 text-zinc-700 dark:text-zinc-300">
        Sélection d&apos;articles publiés par Épilepsie-France et la Fondation
        Française pour la Recherche sur l&apos;Épilepsie. Chaque article renvoie vers
        sa page d&apos;origine. Ces informations ne remplacent pas un avis médical.
      </p>

      {failedSources.length > 0 && (
        <p role="status" className="mt-4 rounded-md border border-amber-500 p-3 text-sm">
          Impossible de charger les articles de : {failedSources.join(", ")}.
        </p>
      )}

      {articles.length === 0 ? (
        <p className="mt-8">Aucun article disponible pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}