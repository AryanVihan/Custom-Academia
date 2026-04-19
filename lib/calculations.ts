import { Subject, ProcessedSubject } from "@/types";

export function getGrade(pct: number): { grade: string; gradePoints: number } {
  if (pct >= 91) return { grade: "O", gradePoints: 10 };
  if (pct >= 81) return { grade: "A+", gradePoints: 9 };
  if (pct >= 71) return { grade: "A", gradePoints: 8 };
  if (pct >= 61) return { grade: "B+", gradePoints: 7 };
  if (pct >= 56) return { grade: "B", gradePoints: 6 };
  if (pct >= 50) return { grade: "C", gradePoints: 5 };
  return { grade: "F", gradePoints: 0 };
}

export function processSubject(subject: Subject): ProcessedSubject {
  const present = subject.conducted - subject.absent;
  const attendancePct =
    subject.conducted > 0 ? (present / subject.conducted) * 100 : 0;
  const attendanceStatus = attendancePct >= 75 ? "safe" : "danger";

  let margin: number | undefined;
  let required: number | undefined;
  if (attendancePct >= 75) {
    margin = Math.floor((present - 0.75 * subject.conducted) / 0.75);
  } else {
    required = Math.ceil(
      (0.75 * subject.conducted - present) / 0.25
    );
  }

  const obtainedTotal = subject.components.reduce((s, c) => s + c.obtained, 0);
  const maxTotal = subject.components.reduce((s, c) => s + c.max, 0);
  const ciaPct = maxTotal > 0 ? (obtainedTotal / maxTotal) * 100 : 0;
  const marksLost = maxTotal - obtainedTotal;

  const { grade, gradePoints } = subject.type === "graded"
    ? getGrade(ciaPct)
    : { grade: "—", gradePoints: 0 };

  return {
    ...subject,
    present,
    attendancePct,
    attendanceStatus,
    margin,
    required,
    obtainedTotal,
    maxTotal,
    ciaPct,
    marksLost,
    grade,
    gradePoints,
  };
}

export function computeSGPA(subjects: Subject[]): number {
  const graded = subjects.filter((s) => s.type === "graded");
  let totalWGP = 0;
  let totalCredits = 0;
  for (const s of graded) {
    if (s.credits === 0) continue;
    const processed = processSubject(s);
    totalWGP += s.credits * processed.gradePoints;
    totalCredits += s.credits;
  }
  return totalCredits > 0 ? totalWGP / totalCredits : 0;
}

export const GRADE_THRESHOLDS = [
  { grade: "O", gradePoints: 10, minPct: 91 },
  { grade: "A+", gradePoints: 9, minPct: 81 },
  { grade: "A", gradePoints: 8, minPct: 71 },
  { grade: "B+", gradePoints: 7, minPct: 61 },
  { grade: "B", gradePoints: 6, minPct: 56 },
  { grade: "C", gradePoints: 5, minPct: 50 },
];

export interface EndSemResult {
  grade: string;
  minPct: number;
  requiredOut40: number;
  requiredOut75: number;
  achievable: boolean;
}

export function calcEndSem(
  obtained: number,
  max: number,
  targetPct: number
): { requiredOut40: number; requiredOut75: number; achievable: boolean } {
  const ciaScore60 = max > 0 ? (obtained / max) * 60 : 0;
  const requiredOut40 = targetPct - ciaScore60;
  const requiredOut75 = requiredOut40 * (75 / 40);
  return {
    requiredOut40: Math.round(requiredOut40 * 100) / 100,
    requiredOut75: Math.round(requiredOut75 * 100) / 100,
    achievable: requiredOut40 >= 0 && requiredOut40 <= 40,
  };
}

export function calcAllGradeThresholds(
  obtained: number,
  max: number
): EndSemResult[] {
  return GRADE_THRESHOLDS.map((t) => {
    const r = calcEndSem(obtained, max, t.minPct);
    return { ...t, ...r };
  });
}
