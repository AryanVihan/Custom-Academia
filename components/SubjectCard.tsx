"use client";

import { useState } from "react";
import { Subject } from "@/types";
import { processSubject } from "@/lib/calculations";
import MarksBreakdown from "./MarksBreakdown";
import EndSemSlider from "./EndSemSlider";
import EditModal from "./EditModal";
import { Pencil, ChevronDown, ChevronUp } from "lucide-react";

const gradeColors: Record<string, string> = {
  O: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  "A+": "bg-green-500/15 text-green-400 border-green-500/40",
  A: "bg-lime-500/15 text-lime-400 border-lime-500/40",
  "B+": "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  B: "bg-orange-500/15 text-orange-400 border-orange-500/40",
  C: "bg-red-500/15 text-red-400 border-red-500/40",
  F: "bg-red-900/20 text-red-500 border-red-800/40",
  "—": "bg-violet-900/20 text-violet-500/60 border-violet-800/30",
};

interface Props {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
}

export default function SubjectCard({ subject, onUpdate }: Props) {
  const p = processSubject(subject);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  const attendanceBarWidth = Math.min(p.attendancePct, 100);
  const isSafe = p.attendanceStatus === "safe";

  return (
    <>
      <div
        className="group rounded-xl overflow-hidden border transition-all duration-300 hover:border-violet-700/50 hover:shadow-lg hover:shadow-violet-950/40"
        style={{ background: "rgba(15,5,35,0.7)", backdropFilter: "blur(8px)", borderColor: "rgba(109,40,217,0.2)" }}
      >
        <div className="p-3.5">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-violet-300/50 text-xs font-mono shrink-0">{subject.code}</span>
                {subject.credits > 0 && (
                  <span className="text-xs bg-violet-900/40 text-violet-300/60 px-1.5 py-0.5 rounded-full border border-violet-800/30">
                    {subject.credits}cr
                  </span>
                )}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColors[p.grade] ?? ""}`}>
                  {p.grade}
                </span>
              </div>
              <p className="text-white/90 text-sm font-medium leading-snug mt-1 line-clamp-2">
                {subject.title}
              </p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 rounded-lg text-violet-500/50 hover:text-violet-300 hover:bg-violet-500/10 transition-all duration-200"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1.5 rounded-lg text-violet-500/50 hover:text-violet-200 hover:bg-violet-500/10 transition-all duration-200"
              >
                {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>

          {/* Attendance */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-violet-300/50">
                Attendance — {p.present}/{subject.conducted}
              </span>
              <span className={isSafe ? "text-emerald-400" : "text-red-400"}>
                {p.attendancePct.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-violet-950/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isSafe ? "bg-gradient-to-r from-emerald-600 to-teal-500" : "bg-gradient-to-r from-red-600 to-rose-500"}`}
                style={{ width: `${attendanceBarWidth}%` }}
              />
            </div>
            <p className={`text-xs ${isSafe ? "text-emerald-400/70" : "text-red-400/70"}`}>
              {isSafe
                ? `Can miss ${p.margin} more class${p.margin === 1 ? "" : "es"}`
                : `Need ${p.required} more class${p.required === 1 ? "" : "es"} to reach 75%`}
            </p>
          </div>
        </div>

        {expanded && (
          <div className="px-3.5 pb-3.5 border-t border-violet-900/30 pt-3">
            {subject.components.length > 0 && (
              <MarksBreakdown
                components={subject.components}
                obtainedTotal={p.obtainedTotal}
                maxTotal={p.maxTotal}
                ciaPct={p.ciaPct}
                marksLost={p.marksLost}
              />
            )}
            {subject.ciaMax === 60 && subject.components.length > 0 && (
              <EndSemSlider
                obtained={p.obtainedTotal}
                max={p.maxTotal}
                currentPct={p.ciaPct}
              />
            )}
            {subject.ciaMax === 100 && (
              <p className="text-xs text-violet-400/40 mt-3 text-center">
                Fully internal — no external exam
              </p>
            )}
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          subject={subject}
          onSave={(updated) => {
            onUpdate(updated);
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}
