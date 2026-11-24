// app/page.tsx
import SeizureCalendar from "@/features/calendar/SeizureCalendar";
import StartCalendarButton from "@/features/auth/StartCalendarButton";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-16 text-center">
      <h1 className="text-4xl font-bold">Suis tes crises, simplement</h1>
      <p className="max-w-xl text-lg text-gray-500">
        Note tes crises dans un calendrier pour mieux comprendre ton quotidien
        et en parler à ton médecin. Voici un exemple avec de fausses données.
      </p>
      <SeizureCalendar mode="demo" />
      <StartCalendarButton />
    </section>
  );
}
