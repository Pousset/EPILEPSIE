// app/page.tsx
import Link from "next/link";
import SeizureCalendar from "@/components/SeizureCalendar";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold">Suis tes crises, simplement</h1>
      <p className="max-w-xl text-lg text-gray-500">
        Note tes crises dans un calendrier pour mieux comprendre ton quotidien
        et en parler à ton médecin. Voici un exemple avec de fausses données.
      </p>
      <SeizureCalendar mode="demo" />
      <Link
        href="/calendrier"
        className="rounded-lg bg-black px-6 py-3 text-white hover:opacity-80 dark:bg-white dark:text-black"
      >
        Commencer mon calendrier
      </Link>
    </section>
  );
}