import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ cacheLife: vi.fn() }));

import { ARTICLE_SOURCES } from "@/features/articles/sources";
import {
  cleanContent,
  fetchArticles,
  toArticle,
  toPlainText,
} from "@/features/articles/fetch-articles";

afterEach(() => vi.restoreAllMocks());

describe("toPlainText", () => {
  it("retire les balises et décode les entités", () => {
    expect(toPlainText("<p>Tom &amp; Jerry</p>")).toBe("Tom & Jerry");
  });

  it("décode les apostrophes typographiques de WordPress", () => {
    expect(toPlainText("L&#8217;épilepsie")).toBe("L’épilepsie");
  });

  it("réduit les espaces et retours à la ligne", () => {
    expect(toPlainText("<p>a   b\n c</p>")).toBe("a b c");
  });
});

describe("cleanContent", () => {
  it("supprime les scripts et leur contenu", () => {
    const out = cleanContent("<p>Salut</p><script>alert(1)</script>");
    expect(out).not.toContain("script");
    expect(out).not.toContain("alert");
  });

  it("supprime les gestionnaires d'événements (onerror)", () => {
    const out = cleanContent('<img src="https://x.fr/a.jpg" onerror="alert(1)">');
    expect(out).not.toContain("onerror");
    expect(out).toContain("https://x.fr/a.jpg");
  });

  it("supprime les images en http://", () => {
    expect(cleanContent('<img src="http://x.fr/a.jpg">')).not.toContain("http://");
  });

  it("supprime les liens javascript:", () => {
    expect(cleanContent('<a href="javascript:alert(1)">x</a>')).not.toContain("javascript:");
  });

  it("ouvre les liens dans un nouvel onglet avec rel sécurisé", () => {
    const out = cleanContent('<a href="https://a.fr">x</a>');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it("ne garde que text-align dans les styles", () => {
    const out = cleanContent('<p style="color:red; text-align:center">x</p>');
    expect(out).toContain("text-align:center");
    expect(out).not.toContain("color");
  });

  it("retire les paragraphes vides mais garde ceux qui contiennent une image", () => {
    const out = cleanContent(
      '<p></p><p>   </p><p>Texte</p><p><img src="https://x.fr/a.jpg"></p>',
    );
    expect(out).toContain("<p>Texte</p>");
    expect(out).toContain("<img");
    expect(out).not.toContain("<p></p>");
    expect(out).not.toContain("<p>   </p>");
  });

  it("retire les conteneurs mais conserve leur contenu", () => {
    expect(cleanContent("<div><section><p>Texte</p></section></div>")).toBe("<p>Texte</p>");
  });
});

const source = ARTICLE_SOURCES[0];

const wpPost = (overrides: object = {}) => ({
  id: 7,
  date: "2026-11-20T10:00:00",
  link: "https://exemple.fr/article",
  title: { rendered: "Mon titre" },
  ...overrides,
});

describe("toArticle", () => {
  it("construit l'id à partir de la source et de l'id WordPress", () => {
    expect(toArticle(wpPost(), source).id).toBe(`${source.id}-7`);
  });

  it("garde une image HTTPS et utilise son texte alternatif", () => {
    const article = toArticle(
      wpPost({
        _embedded: {
          "wp:featuredmedia": [{ source_url: "https://x.fr/a.jpg", alt_text: "  Un schéma  " }],
        },
      }),
      source,
    );
    expect(article.imageUrl).toBe("https://x.fr/a.jpg");
    expect(article.imageAlt).toBe("Un schéma");
  });

  it("ignore une image non HTTPS", () => {
    const article = toArticle(
      wpPost({ _embedded: { "wp:featuredmedia": [{ source_url: "http://x.fr/a.jpg" }] } }),
      source,
    );
    expect(article.imageUrl).toBeNull();
  });

  it("utilise le titre comme alt de repli", () => {
    const article = toArticle(
      wpPost({
        _embedded: { "wp:featuredmedia": [{ source_url: "https://x.fr/a.jpg", alt_text: "" }] },
      }),
      source,
    );
    expect(article.imageAlt).toBe("Mon titre");
  });

  it("préfère date_gmt (en UTC) à date", () => {
    expect(toArticle(wpPost({ date_gmt: "2026-11-20T09:00:00" }), source).publishedAt).toBe(
      "2026-11-20T09:00:00Z",
    );
    expect(toArticle(wpPost(), source).publishedAt).toBe("2026-11-20T10:00:00");
  });
});

describe("fetchArticles", () => {
  const ok = (posts: object[]) => new Response(JSON.stringify(posts), { status: 200 });
  const bySource = (handlers: Record<string, () => Response>) =>
    vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);
      const entry = ARTICLE_SOURCES.find((s) => url.startsWith(s.baseUrl));
      if (!entry) throw new Error(`URL inattendue : ${url}`);
      return handlers[entry.id]();
    });

  const [a, b] = ARTICLE_SOURCES;

  it("fusionne les sources et trie du plus récent au plus ancien", async () => {
    bySource({
      [a.id]: () => ok([wpPost({ id: 1, date: "2026-11-01T10:00:00" })]),
      [b.id]: () =>
        ok([wpPost({ id: 2, date: "2026-11-10T10:00:00" }), wpPost({ id: 3, date: "2026-10-01T10:00:00" })]),
    });

    const { articles, failedSources } = await fetchArticles();

    expect(articles.map((x) => x.id)).toEqual([`${b.id}-2`, `${a.id}-1`, `${b.id}-3`]);
    expect(failedSources).toEqual([]);
  });

  it("une source en erreur n'empêche pas l'autre", async () => {
    bySource({
      [a.id]: () => new Response("Erreur", { status: 500 }),
      [b.id]: () => ok([wpPost({ id: 2 })]),
    });

    const { articles, failedSources } = await fetchArticles();

    expect(articles).toHaveLength(1);
    expect(articles[0].source).toBe(b.id);
    expect(failedSources).toEqual([a.name]);
  });

  it("renvoie tout en échec sans lever d'erreur", async () => {
    bySource({
      [a.id]: () => new Response("", { status: 503 }),
      [b.id]: () => new Response("", { status: 404 }),
    });

    const { articles, failedSources } = await fetchArticles();

    expect(articles).toEqual([]);
    expect(failedSources).toEqual([a.name, b.name]);
  });
});