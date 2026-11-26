import type { EmergencyCardData } from "@/features/emergency/types";

function lines(text: string) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid rounded-lg border border-zinc-400 p-3">
      <h2 className="mb-1 text-sm font-bold uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  );
}

function List({ text, marker }: { text: string; marker: string }) {
  const items = lines(text);
  if (items.length === 0) return <p>—</p>;
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true">{marker} </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function EmergencyCardView({ card }: { card: EmergencyCardData }) {
  return (
    <article className="emergency-sheet mx-auto w-full max-w-[190mm] space-y-3 rounded-xl border-2 border-red-700 bg-white p-6 text-sm text-black">
      <header className="flex items-start justify-between gap-4 border-b-2 border-red-700 pb-3">
        <div>
          <p className="text-xs font-bold uppercase text-red-700">Fiche d&apos;urgence — Épilepsie</p>
          <h1 className="text-2xl font-bold">{card.fullName}</h1>
        </div>
        <a
          href="tel:112"
          className="rounded-lg bg-red-700 px-4 py-2 text-center font-bold text-white print:border print:border-red-700 print:bg-white print:text-red-700"
        >
          Appeler le 112
        </a>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Section title="Personne à contacter">
          <p className="font-semibold">{card.contactName || "—"}</p>
          <p>{card.contactPhone || "—"}</p>
        </Section>
        <Section title="Neurologue">
          <p className="font-semibold">{card.neurologistName || "—"}</p>
          <p>{card.neurologistPhone || "—"}</p>
        </Section>
        <Section title="Type d'épilepsie">
          <p>{card.epilepsyType || "—"}</p>
        </Section>
        <Section title="Durée habituelle d'une crise">
          <p>{card.usualDuration || "—"}</p>
        </Section>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Section title="À faire">
          <List text={card.doList} marker="✔" />
        </Section>
        <Section title="À éviter">
          <List text={card.dontList} marker="✘" />
        </Section>
      </div>

      <Section title="Appeler le 112 si">
        <p>
          la crise dure plus de 5 minutes, si les crises se répètent sans réveil complet entre
          elles, en cas de blessure ou de difficultés respiratoires, ou s&apos;il s&apos;agit d&apos;une
          première crise.
        </p>
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <Section title="Médicaments importants">
          <List text={card.medications} marker="•" />
        </Section>
        <Section title="Allergies">
          <List text={card.allergies} marker="•" />
        </Section>
      </div>

      <p className="text-xs text-zinc-600">
        Fiche rédigée par le patient. Elle ne constitue pas un avis médical.
      </p>
    </article>
  );
}