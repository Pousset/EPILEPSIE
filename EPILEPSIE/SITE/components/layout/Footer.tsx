// components/Footer.tsx
import Link from "next/link";

async function getYear() {
  "use cache";
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = await getYear();

  return (
    <footer className="border-t px-6 py-6 mt-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          © {year} MonSite. Tous droits réservés.
        </p>
        <ul className="flex gap-6 text-sm">
          <li><Link href="/about">À propos</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}