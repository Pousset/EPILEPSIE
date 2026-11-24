import { cacheLife } from "next/cache";
import sanitizeHtml from "sanitize-html";
import { ARTICLE_SOURCES } from "@/features/articles/sources";
import type {
  Article,
  ArticleSource,
  ArticlesResult,
} from "@/features/articles/types";

const PER_PAGE = 9;
const TIMEOUT_MS = 8000;
const LAYOUT_TAGS = [
  "div",
  "section",
  "article",
  "aside",
  "header",
  "footer",
  "main",
  "nav",
  "address",
  "hgroup",
];

// Forme minimale de la réponse de l'API REST WordPress.
type WpPost = {
  id: number;
  date_gmt?: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: { source_url?: string; alt_text?: string }[];
  };
};

function toPlainText(html: string): string {
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
  // sanitize-html ré-encode ces caractères : on les remet en clair pour React.
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Le contenu vient d'un site tiers : il est toujours nettoyé avant affichage.
function cleanContent(html: string): string {
  return sanitizeHtml(html, {
    // Les conteneurs (div, section…) sont retirés mais leur contenu est conservé : le HTML
    // des constructeurs de pages comme Elementor imbrique le texte dans de nombreux blocs,
    // ce qui empêche d'espacer correctement les paragraphes.
    allowedTags: sanitizeHtml.defaults.allowedTags
      .filter((tag) => !LAYOUT_TAGS.includes(tag))
      .concat("img"),
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      "*": ["style"],
    },
    // Seul l'alignement du texte est conservé : les couleurs d'origine seraient
    // illisibles en mode sombre.
    allowedStyles: {
      "*": { "text-align": [/^(left|right|center|justify)$/] },
    },
    allowedSchemes: ["https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    // Supprime les paragraphes vides laissés par l'éditeur du site d'origine.
    exclusiveFilter: (frame) =>
      /^(p|h[1-6]|li|blockquote)$/.test(frame.tag) &&
      !frame.text.trim() &&
      !frame.mediaChildren.length,
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });
}

function toArticle(post: WpPost, source: ArticleSource): Article {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const title = toPlainText(post.title.rendered);

  return {
    id: `${source.id}-${post.id}`,
    source: source.id,
    sourceName: source.name,
    title,
    excerpt: toPlainText(post.excerpt?.rendered ?? ""),
    contentHtml: cleanContent(post.content?.rendered ?? ""),
    imageUrl: media?.source_url?.startsWith("https://") ? media.source_url : null,
    imageAlt: media?.alt_text?.trim() || title,
    url: post.link,
    publishedAt: post.date_gmt ? `${post.date_gmt}Z` : post.date,
  };
}

// Résultat mis en cache par source (cacheComponents). Si la requête échoue, l'erreur
// est levée : elle n'est donc pas mise en cache et sera retentée au prochain rendu.
async function fetchFromSource(source: ArticleSource): Promise<Article[]> {
  "use cache";
  cacheLife("hours");

  const params = new URLSearchParams({
    per_page: String(PER_PAGE),
    _embed: "wp:featuredmedia",
    _fields: "id,date,date_gmt,link,title,excerpt,content,_links,_embedded",
  });

  const response = await fetch(`${source.baseUrl}/wp-json/wp/v2/posts?${params}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`${source.name} : réponse HTTP ${response.status}`);
  }

  const posts = (await response.json()) as WpPost[];
  return posts.map((post) => toArticle(post, source));
}

// Une source indisponible ne doit jamais empêcher l'affichage des autres.
export async function fetchArticles(): Promise<ArticlesResult> {
  const results = await Promise.allSettled(ARTICLE_SOURCES.map(fetchFromSource));

  const articles: Article[] = [];
  const failedSources: string[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      failedSources.push(ARTICLE_SOURCES[index].name);
    }
  });

  articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return { articles, failedSources };
}