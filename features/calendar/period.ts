// Retire des mois à une date sans déborder : 31 août - 6 mois = 28 février (ou 29 en année bissextile)
export function subtractMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() - months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}