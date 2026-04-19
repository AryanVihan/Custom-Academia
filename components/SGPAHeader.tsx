"use client";

import { Subject } from "@/types";
import { computeSGPA, processSubject, GRADE_THRESHOLDS } from "@/lib/calculations";

interface Props {
  subjects: Subject[];
  userName: string;
  onReset: () => void;
}

export default function SGPAHeader({ subjects, userName, onReset }: Props) {
  const sgpa = computeSGPA(subjects);
  const totalCredits = subjects
    .filter((s) => s.type === "graded" && s.credits > 0)
    .reduce((sum, s) => sum + s.credits, 0);

  const gradeDist: Record<string, number> = {};
  for (const s of subjects.filter((s) => s.type === "graded")) {
    const p = processSubject(s);
    gradeDist[p.grade] = (gradeDist[p.grade] ?? 0) + 1;
  }

  const sgpaGradient =
    sgpa >= 9 ? "from-emerald-400 via-teal-400 to-green-400" :
    sgpa >= 8 ? "from-green-400 via-lime-400 to-emerald-400" :
    sgpa >= 7 ? "from-yellow-400 via-amber-400 to-orange-400" :
    sgpa >= 6 ? "from-orange-400 via-amber-500 to-yellow-500" :
    "from-red-400 via-rose-500 to-pink-500";

  const gradeColors: Record<string, string> = {
    O: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
    "A+": "bg-green-500/15 border-green-500/40 text-green-400",
    A: "bg-lime-500/15 border-lime-500/40 text-lime-400",
    "B+": "bg-yellow-500/15 border-yellow-500/40 text-yellow-400",
    B: "bg-orange-500/15 border-orange-500/40 text-orange-400",
    C: "bg-red-500/15 border-red-500/40 text-red-400",
  };

  return (
    <div className="mb-4 rounded-2xl border border-violet-800/30 overflow-hidden" style={{ background: "rgba(20,5,50,0.6)", backdropFilter: "blur(12px)" }}>
      {/* Top gradient bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${sgpaGradient}`} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-violet-300/60 text-xs font-semibold uppercase tracking-widest">{userName}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl font-black bg-gradient-to-r ${sgpaGradient} bg-clip-text text-transparent`}>
                {sgpa.toFixed(2)}
              </span>
              <span className="text-violet-400/50 text-sm">/ 10 SGPA</span>
            </div>
            <p className="text-violet-400/40 text-xs mt-0.5">{totalCredits} credits</p>
          </div>
          <button
            onClick={onReset}
            className="text-xs text-violet-400/50 hover:text-red-400 border border-violet-800/40 hover:border-red-800/60 px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-red-950/20"
          >
            Reset defaults
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {GRADE_THRESHOLDS.map((t) => {
            const count = gradeDist[t.grade] ?? 0;
            return (
              <div
                key={t.grade}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  count > 0
                    ? (gradeColors[t.grade] ?? "bg-gray-700/60 border-gray-600 text-gray-200")
                    : "bg-violet-950/30 border-violet-900/30 text-violet-700/50"
                }`}
              >
                {t.grade} × {count}
              </div>
            );
          })}
          {(gradeDist["F"] ?? 0) > 0 && (
            <div className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-red-900/30 border-red-800/40 text-red-400">
              F × {gradeDist["F"]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
