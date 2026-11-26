"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Petit texte au-dessus du titre (ex. nom de la source). */
  eyebrow?: string;
  children: ReactNode;
  /** Zone d'actions en bas de la fenêtre (boutons). */
  footer?: ReactNode;
  size?: "sm" | "md";
  closeLabel?: string;
};

const SIZES = {
  sm: "w-[min(92vw,26rem)]",
  md: "w-[min(92vw,48rem)]",
} as const;

// Fenêtre modale basée sur le <dialog> natif : affichée au-dessus de la page, fermée par Échap,
// focus géré par le navigateur. Le parent reste maître de l'état `open`.
// Pour choisir l'élément qui reçoit le focus à l'ouverture, ajouter `data-autofocus` dessus.
export default function Dialog({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = "md",
  closeLabel = "Fermer",
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pressStartedOnBackdrop = useRef(false);
  const titleId = useId();

  // Synchronise l'état React avec le <dialog> natif.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Bloque le défilement de la page tant que la fenêtre est ouverte,
  // et le rend même si le composant disparaît pendant l'ouverture.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Déclenché aussi par Échap : le parent est ainsi toujours prévenu de la fermeture.
      onClose={onClose}
      // Le dialogue n'a aucun padding : un clic dont la cible est le <dialog> lui-même
      // est donc un clic sur le fond. On ignore les sélections de texte qui finissent dehors.
      onMouseDown={(event) => {
        pressStartedOnBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressStartedOnBackdrop.current && event.target === event.currentTarget) {
          onClose();
        }
      }}
      className={`m-auto max-h-[85vh] ${SIZES[size]} overflow-hidden rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-2xl backdrop:bg-black/60 open:flex open:flex-col dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100`}
    >
      {open && (
        <>
          <div className="flex items-start justify-between gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div>
              {eyebrow && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{eyebrow}</p>
              )}
              <h2 id={titleId} className="text-xl font-semibold">
                {title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="shrink-0 rounded-full border border-zinc-300 px-3 py-1 text-lg leading-none hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto px-6 py-5">{children}</div>

          {footer && (
            <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-4 dark:border-zinc-700">
              {footer}
            </div>
          )}
        </>
      )}
    </dialog>
  );
}