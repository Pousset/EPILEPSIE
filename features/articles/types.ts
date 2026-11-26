export type ArticleSourceId = "epilepsie-france" | "fondation-epilepsie";

export type ArticleSource = {
  id: ArticleSourceId;
  name: string;
  baseUrl: string;
};

export type Article = {
  id: string;
  source: ArticleSourceId;
  sourceName: string;
  title: string;
  excerpt: string;
  contentHtml: string; // HTML déjà nettoyé côté serveur
  imageUrl: string | null;
  imageAlt: string;
  url: string; // URL d'origine de l'article
  publishedAt: string; // ISO 8601
};

export type ArticlesResult = {
  articles: Article[];
  failedSources: string[];
};