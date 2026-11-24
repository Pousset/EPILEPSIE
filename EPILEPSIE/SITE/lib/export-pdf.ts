// lib/export-pdf.ts
import type { Seizure } from "@/data/fakeSeizures";

// "2026-11-24" -> "24/11/2026" (sans passer par Date, donc sans décalage de fuseau)
export function formatDate(key: string) {
  return key.split("-").reverse().join("/");
}

// Date -> "AAAA-MM-JJ" (heure locale)
export function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function countBy(list: Seizure[], key: "type" | "trigger") {
  const map = new Map<string, number>();
  for (const s of list) map.set(s[key], (map.get(s[key]) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

type ExportOptions = {
  seizures: Seizure[];
  userName: string;
  periodLabel: string;
};

export async function exportSeizuresPdf({ seizures, userName, periodLabel }: ExportOptions) {
  // Import dynamique : la librairie ne se charge que quand on clique sur "Exporter"
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const sorted = [...seizures].sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time)
  );

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let y = 20;

  // En-tête
  doc.setFontSize(18);
  doc.text("Journal des crises d'épilepsie", 14, y);
  y += 9;

  doc.setFontSize(10);
  doc.setTextColor(90);
  if (userName) {
    doc.text(`Patient : ${userName}`, 14, y);
    y += 5;
  }
  const periodLines = doc.splitTextToSize(`Période : ${periodLabel}`, pageWidth - 28) as string[];
  doc.text(periodLines, 14, y);
  y += periodLines.length * 5;
  doc.text(`Document généré le ${formatDate(dateKey(new Date()))}`, 14, y);
  y += 9;
  doc.setTextColor(0);

  // Résumé
  doc.setFontSize(12);
  doc.text("Résumé", 14, y);
  y += 6;
  doc.setFontSize(10);

  const byType = countBy(sorted, "type").map(([k, v]) => `${k} (${v})`).join(", ");
  const byTrigger = countBy(sorted, "trigger").map(([k, v]) => `${k} (${v})`).join(", ");

  const summary = [
    `Nombre total de crises : ${sorted.length}`,
    `Par type : ${byType}`,
    `Déclencheurs notés : ${byTrigger}`,
  ];

  for (const line of summary) {
    const wrapped = doc.splitTextToSize(line, pageWidth - 28) as string[];
    doc.text(wrapped, 14, y);
    y += wrapped.length * 5;
  }
  y += 4;

  // Tableau détaillé
  autoTable(doc, {
    startY: y,
    head: [["Date", "Heure", "Type", "Durée", "Déclencheur"]],
    body: sorted.map((s) => [formatDate(s.date), s.time, s.type, s.duration, s.trigger]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 14, right: 14, bottom: 16 },
  });

  // Pied de page sur chaque page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      "Document généré à partir de notes saisies par le patient. Il ne constitue pas un avis médical.",
      14,
      pageHeight - 8
    );
    doc.text(`Page ${i} / ${pages}`, pageWidth - 14, pageHeight - 8, { align: "right" });
  }

  doc.save(`journal-crises-${dateKey(new Date())}.pdf`);
}