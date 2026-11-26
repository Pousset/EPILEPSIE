"use client";

import { useState } from "react";
import Dialog from "@/components/ui/Dialog";

type ArticleReaderProps = {
  title: string;
  sourceName: string;
  contentHtml: string; // HTML déjà nettoyé côté serveur
  url: string;
  imageUrl: string | null;
  imageAlt: string;
};

// Mise en forme maison du contenu : le HTML des sites sources est nettoyé (classes et
// styles supprimés), on le stylise donc ici, avec des couleurs adaptées au mode sombre.
const CONTENT_CLASSES = [
  "text-base leading-7 text-zinc-800 dark:text-zinc-200",
  "[&>*+*]:mt-4",
  "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold",
  "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold",
  "[&_h4]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold",
  "[&_a]:font-medium [&_a]:text-blue-700 [&_a]:underline dark:[&_a]:text-blue-400",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-zinc-600",
  "[&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg",
  "[&_figcaption]:mt-2 [&_figcaption]:text-sm [&_figcaption]:text-zinc-600 dark:[&_figcaption]:text-zinc-400",
  "[&_table]:block [&_table]:overflow-x-auto [&_table]:text-sm",
  "[&_th]:border [&_th]:border-zinc-300 [&_th]:p-2 [&_td]:border [&_td]:border-zinc-300 [&_td]:p-2 dark:[&_th]:border-zinc-600 dark:[&_td]:border-zinc-600",
  "[&_hr]:border-zinc-300 dark:[&_hr]:border-zinc-600",
].join(" ");

export default function ArticleReader({
  title,
  sourceName,
  contentHtml,
  url,
  imageUrl,
  imageAlt,
}: ArticleReaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Lire l&apos;article
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        eyebrow={sourceName}
        closeLabel="Fermer l'article"
      >
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            className="max-h-72 w-full rounded-lg object-cover"
          />
        )}

        <div
          className={CONTENT_CLASSES}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium underline"
        >
          Lire l&apos;article sur {sourceName}
          <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
        </a>
      </Dialog>
    </>
  );
}