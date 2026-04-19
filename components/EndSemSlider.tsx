"use client";

import { useState } from "react";
import { calcEndSem, calcAllGradeThresholds } from "@/lib/calculations";

interface Props {
  obtained: number;
  max: number;
  currentPct: number;
}

const gradeColors: Record<string, string> = {
  O: "text-emerald-400",
  "A+": "text-green-400",
  A: "text-lime-400",
  "B+": "text-yellow-400",
  B: "text-orange-400",
  C: "text-red-400",
};

const gradeActiveBg: Record<string, string> = {
  O: "bg-emerald-500/20 border-emerald-500/60 ring-1 ring-emerald-500/40",
  "A+": "bg-green-500/20 border-green-500/60 ring-1 ring-green-500/40",
  A: "bg-lime-500/20 border-lime-500/60 ring-1 ring-lime-500/40",
  "B+": "bg-yellow-500/20 border-yellow-500/60 ring-1 ring-yellow-500/40",
  B: "bg-orange-500/20 border-orange-500/60 ring-1 ring-orange-500/40",
  C: "bg-red-500/20 border-red-500/60 ring-1 ring-red-500/40",
};

export default function EndSemSlider({ obtained, max, currentPct }: Props) {
  const [target, setTarget] = useState(Math.round(currentPct));
  const result = calcEndSem(obtained, max, target);
  const thresholds = calcAllGradeThresholds(obtained, max);

  const activeGrade = (() => {
    for (const t of thresholds) {
      if (target >= t.minPct) return t.grade;
    }
    return "F";
  })();

  return (
    <div className="mt-4 p-3 bg-violet-950/40 rounded-lg border border-violet-800/40 backdrop-blur-sm">
      <p className="text-xs text-violet-300/70 font-semibold mb-2 uppercase tracking-wide">
        End-Sem Prediction
      </p>

      <div className="flex items-center gap-3 mb-3">
        <input
          type="range"
          min={0}
          max={100}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="flex-1 accent-violet-500 h-1.5 cursor-pointer"
        />
        <span className="text-white font-bold text-sm w-10 text-right tabular-nums">
          {target}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-gray-950/60 rounded-lg p-2 text-center border border-violet-900/30">
          <p className="text-violet-300/60 text-xs">Required /40</p>
          <p className={`text-lg font-bold transition-colors ${result.achievable ? "text-white" : "text-red-500"}`}>
            {result.achievable ? result.requiredOut40.toFixed(1) : "—"}
          </p>
        </div>
        <div className="bg-gray-950/60 rounded-lg p-2 text-center border border-violet-900/30">
          <p className="text-violet-300/60 text-xs">Required /75</p>
          <p className={`text-lg font-bold transition-colors ${result.achievable ? "text-white" : "text-red-500"}`}>
            {result.achievable ? result.requiredOut75.toFixed(1) : "—"}
          </p>
        </div>
      </div>

      {!result.achievable && (
        <p className="text-red-400 text-xs text-center mb-2">
          {result.requiredOut40 < 0 ? "Already achieved at current CIA" : "Not achievable with external exam"}
        </p>
      )}

      <div className="border-t border-violet-800/30 pt-2">
        <p className="text-violet-300/50 text-xs mb-1.5">Click a grade to set target</p>
        <div className="grid grid-cols-3 gap-1">
          {thresholds.map((t) => {
            const isActive = activeGrade === t.grade;
            return (
              <button
                key={t.grade}
                onClick={() => setTarget(t.minPct)}
                className={`rounded-lg px-2 py-1.5 text-center border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  isActive
                    ? (gradeActiveBg[t.grade] ?? "bg-gray-700/60 border-gray-500 ring-1 ring-gray-400/40")
                    : "bg-gray-950/50 border-violet-900/30 hover:border-violet-700/50 hover:bg-violet-950/40"
                }`}
              >
                <span className={`text-xs font-bold block ${gradeColors[t.grade] ?? "text-gray-300"}`}>
                  {t.grade}
                </span>
                <p className="text-gray-400 text-xs">
                  {t.achievable
                    ? `${t.requiredOut75.toFixed(0)}/75`
                    : t.requiredOut40 < 0
                    ? "✓ done"
                    : "✗"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
