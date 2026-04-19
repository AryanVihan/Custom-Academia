export interface MarkComponent {
  name: string;
  obtained: number;
  max: number;
}

export type SubjectType = "graded" | "attend-only";
export type CIAMax = 60 | 100;

export interface Subject {
  code: string;
  title: string;
  credits: number;
  ciaMax: CIAMax;
  type: SubjectType;
  conducted: number;
  absent: number;
  components: MarkComponent[];
}

export interface ProcessedSubject extends Subject {
  present: number;
  attendancePct: number;
  attendanceStatus: "safe" | "danger";
  margin?: number;
  required?: number;
  obtainedTotal: number;
  maxTotal: number;
  ciaPct: number;
  marksLost: number;
  grade: string;
  gradePoints: number;
}

export interface UserData {
  user1: Subject[];
  user2: Subject[];
}
