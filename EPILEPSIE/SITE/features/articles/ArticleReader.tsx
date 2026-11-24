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
            className="space-y-3 text-sm leading-relaxed [&_a]:underline [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold [&_img]:h-auto [&_img]:max-w-full [&_li]:ml-5 [&_li]:list-disc"
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