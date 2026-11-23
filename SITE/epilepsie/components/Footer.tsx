import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t px-6 py-6 mt-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} MonSite. Tous droits réservés.
        </p>
        <ul className="flex gap-6 text-sm">
          <li><Link href="/about">À propos</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}