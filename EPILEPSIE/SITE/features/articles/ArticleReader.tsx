"use client";

import { useEffect, useId, useRef } from "react";

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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressStartedOnBackdrop = useRef(false);
  const titleId = useId();

  // Rend le défilement de la page si le composant disparaît pendant l'ouverture.
  useEffect(() => () => {
    document.body.style.overflow = "";
  }, []);

  function open() {
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="w-fit rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Lire l&apos;article
      </button>

      {/* <dialog> natif : affiché au-dessus de la page, fermé par Échap, focus géré par le navigateur. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => {
          document.body.style.overflow = "";
        }}
        // Le dialogue n'a aucun padding : un clic dont la cible est le <dialog> lui-même
        // est donc un clic sur le fond. On ignore les sélections de texte qui finissent dehors.
        onMouseDown={(event) => {
          pressStartedOnBackdrop.current = event.target === event.currentTarget;
        }}
        onClick={(event) => {
          if (pressStartedOnBackdrop.current && event.target === event.currentTarget) {
            close();
          }
        }}
        className="m-auto max-h-[85vh] w-[min(92vw,48rem)] overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/60 open:flex open:flex-col dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{sourceName}</p>
            <h2 id={titleId} className="text-xl font-semibold">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fermer l'article"
            className="shrink-0 rounded-full border border-zinc-300 px-3 py-1 text-lg leading-none hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5">
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
        </div>
      </dialog>
    </>
  );
}