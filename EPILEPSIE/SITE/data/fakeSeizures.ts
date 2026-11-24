// data/fakeSeizures.ts
export type Seizure = {
  id?: string;
  date: string; // AAAA-MM-JJ
  time: string;
  type: string;
  duration: string;
  trigger: string;
};



export const fakeSeizures: Seizure[] = [
  // Septembre
  { date: "2026-09-02", time: "08:15", type: "Absence", duration: "20 s", trigger: "Fatigue" },
  { date: "2026-09-05", time: "22:40", type: "Crise focale", duration: "1 min", trigger: "Manque de sommeil" },
  { date: "2026-09-09", time: "14:05", type: "Myoclonie", duration: "10 s", trigger: "Stress" },
  { date: "2026-09-13", time: "07:30", type: "Absence", duration: "25 s", trigger: "Aucun identifié" },
  { date: "2026-09-13", time: "19:10", type: "Absence", duration: "15 s", trigger: "Aucun identifié" },
  { date: "2026-09-18", time: "11:20", type: "Crise focale", duration: "1 min 30 s", trigger: "Stress" },
  { date: "2026-09-24", time: "03:50", type: "Crise tonico-clonique", duration: "2 min", trigger: "Oubli de traitement" },
  { date: "2026-09-29", time: "16:45", type: "Absence", duration: "30 s", trigger: "Fatigue" },

  // Octobre
  { date: "2026-10-01", time: "09:00", type: "Myoclonie", duration: "8 s", trigger: "Manque de sommeil" },
  { date: "2026-10-04", time: "20:15", type: "Absence", duration: "20 s", trigger: "Aucun identifié" },
  { date: "2026-10-08", time: "13:30", type: "Crise focale", duration: "45 s", trigger: "Stress" },
  { date: "2026-10-12", time: "06:55", type: "Myoclonie", duration: "12 s", trigger: "Manque de sommeil" },
  { date: "2026-10-15", time: "18:25", type: "Absence", duration: "35 s", trigger: "Fatigue" },
  { date: "2026-10-15", time: "23:10", type: "Crise focale", duration: "1 min", trigger: "Fatigue" },
  { date: "2026-10-21", time: "10:40", type: "Absence", duration: "20 s", trigger: "Aucun identifié" },
  { date: "2026-10-26", time: "02:30", type: "Crise tonico-clonique", duration: "3 min", trigger: "Manque de sommeil" },
  { date: "2026-10-30", time: "15:05", type: "Absence", duration: "25 s", trigger: "Stress" },

  // Novembre
  { date: "2026-11-03", time: "08:20", type: "Absence", duration: "30 s", trigger: "Fatigue" },
  { date: "2026-11-06", time: "21:00", type: "Myoclonie", duration: "10 s", trigger: "Manque de sommeil" },
  { date: "2026-11-09", time: "12:15", type: "Crise focale", duration: "1 min", trigger: "Stress" },
  { date: "2026-11-11", time: "17:45", type: "Absence", duration: "20 s", trigger: "Aucun identifié" },
  { date: "2026-11-14", time: "07:10", type: "Crise focale", duration: "1 min 15 s", trigger: "Oubli de traitement" },
  { date: "2026-11-14", time: "22:30", type: "Absence", duration: "15 s", trigger: "Fatigue" },
  { date: "2026-11-19", time: "14:50", type: "Absence", duration: "25 s", trigger: "Stress" },
  { date: "2026-11-22", time: "04:20", type: "Crise tonico-clonique", duration: "2 min", trigger: "Manque de sommeil" },
  { date: "2026-11-27", time: "19:35", type: "Myoclonie", duration: "9 s", trigger: "Fatigue" },
  { date: "2026-11-30", time: "11:00", type: "Absence", duration: "30 s", trigger: "Aucun identifié" },

  // Décembre
  { date: "2026-12-03", time: "09:25", type: "Absence", duration: "20 s", trigger: "Fatigue" },
  { date: "2026-12-08", time: "20:40", type: "Crise focale", duration: "50 s", trigger: "Stress" },
  { date: "2026-12-15", time: "05:10", type: "Myoclonie", duration: "11 s", trigger: "Manque de sommeil" },
];