// app/calendrier/page.tsx
import SeizureCalendar from "@/components/SeizureCalendar";

export default function CalendrierPage() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-10">
      <h1 className="text-3xl font-bold">Mon calendrier</h1>
      <SeizureCalendar mode="personal" />
    </section>
  );
}