import Link from "next/link";

export default function EmergencyButton() {
  return (
    <Link
      href="/urgence"
      className="rounded-full bg-red-700 px-6 py-3 font-bold text-white shadow hover:bg-red-800"
    >
      Urgence
    </Link>
  );
}