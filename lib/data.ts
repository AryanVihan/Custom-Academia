import { Subject, UserData } from "@/types";

function subject(
  code: string,
  title: string,
  ciaMax: 60 | 100,
  obtained: number,
  max: number
): Subject {
  return {
    code,
    title,
    credits: 3,
    ciaMax,
    type: "graded",
    conducted: 0,
    absent: 0,
    components: [{ name: "CIA", obtained, max }],
  };
}

const user1Subjects: Subject[] = [
  subject("21CSE465T", "Cloud Application Development", 60, 16.2, 20),
  subject("21CSE461T", "Cloud Security", 60, 50.5, 60),
  subject("21CSE463T", "Cloud Strategy Planning and Management", 60, 39.55, 50),
  subject("21MGO108T", "Open Elective", 60, 39.5, 50),
  subject("21IPE333P", "Essentials in Cloud and DevOps", 100, 25, 30),
];

const user2Subjects: Subject[] = [
  subject("21CSE465T", "Cloud Application Development", 60, 14.8, 20),
  subject("21CSE461T", "Cloud Security", 60, 48.6, 60),
  subject("21CSE463T", "Cloud Strategy Planning and Management", 60, 41.1, 50),
  subject("21NTO406T", "Open Elective", 60, 28.5, 35),
  subject("21IPE333P", "Essentials in Cloud and DevOps", 100, 24.9, 30),
];

export const DEFAULT_DATA: UserData = {
  user1: user1Subjects,
  user2: user2Subjects,
};
