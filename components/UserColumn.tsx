"use client";

import { Subject } from "@/types";
import SGPAHeader from "./SGPAHeader";
import SubjectCard from "./SubjectCard";
import AttendanceOnlyCard from "./AttendanceOnlyCard";

interface Props {
  subjects: Subject[];
  userName: string;
  onUpdate: (code: string, updated: Subject) => void;
  onReset: () => void;
}

export default function UserColumn({ subjects, userName, onUpdate, onReset }: Props) {
  const graded = subjects.filter((s) => s.type === "graded");
  const attendOnly = subjects.filter((s) => s.type === "attend-only");

  return (
    <div className="flex flex-col gap-4">
      <SGPAHeader subjects={subjects} userName={userName} onReset={onReset} />

      <section>
        <p className="text-violet-400/50 text-xs font-semibold uppercase tracking-widest mb-2.5 px-0.5 flex items-center gap-2">
          <span className="inline-block w-3 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          Subjects
        </p>
        <div className="flex flex-col gap-2.5">
          {graded.map((s, i) => (
            <div key={s.code} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <SubjectCard
                subject={s}
                onUpdate={(updated) => onUpdate(s.code, updated)}
              />
            </div>
          ))}
        </div>
      </section>

      {attendOnly.length > 0 && (
        <section>
          <p className="text-violet-400/50 text-xs font-semibold uppercase tracking-widest mb-2.5 px-0.5 flex items-center gap-2">
            <span className="inline-block w-3 h-px bg-gradient-to-r from-violet-500 to-transparent" />
            Lab Attendance
          </p>
          <div className="flex flex-col gap-2">
            {attendOnly.map((s, i) => (
              <div key={s.code} className="animate-fade-in" style={{ animationDelay: `${(graded.length + i) * 50}ms` }}>
                <AttendanceOnlyCard
                  subject={s}
                  onUpdate={(updated) => onUpdate(s.code, updated)}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
