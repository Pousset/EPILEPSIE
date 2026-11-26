// components/Footer.tsx
import Link from "next/link";
import EmergencyButton from "@/components/layout/EmergencyButton";

async function getYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await getYear();

  return (
    <footer className="mt-8 border-t p-6 print:hidden">
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
        <p className="text-sm text-gray-500">
          © {year} MonSite. Tous droits réservés.
        </p>
        <div className="flex justify-center">
          <EmergencyButton />
        </div>
        <ul className="flex justify-center gap-6 text-sm sm:justify-end">
          <li><Link href="/about">À propos</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}
