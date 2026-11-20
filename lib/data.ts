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
  subject("21CSE465T", "Cloud Application Development", 60, 40.2, 50),
  subject("21CSE461T", "Cloud Security", 60, 50.5, 60),
  subject("21CSE463T", "Cloud Strategy Planning and Management", 60, 49.55, 60),
  subject("21MGO108T", "Consumer Behaviour (Open Elective)", 60, 49.5, 60),
  subject("21IPE333P", "Essentials in Cloud and DevOps", 100, 81.3, 100),
];

const user2Subjects: Subject[] = [
  subject("21CSE465T", "Cloud Application Development", 60, 38.8, 50),
  subject("21CSE461T", "Cloud Security", 60, 48.6, 60),
  subject("21CSE463T", "Cloud Strategy Planning and Management", 60, 51.1, 60),
  subject("21NTO406T", "Industrial Nanotechnology (Open Elective)", 60, 39.5, 50),
  subject("21IPE333P", "Essentials in Cloud and DevOps", 100, 78, 100),
];

export const DEFAULT_DATA: UserData = {
  user1: user1Subjects,
  user2: user2Subjects,
};
