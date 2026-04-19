"use client";

import { useState } from "react";
import { Subject } from "@/types";
import { processSubject } from "@/lib/calculations";
import EditModal from "./EditModal";
import { Pencil } from "lucide-react";

interface Props {
  subject: Subject;
  onUpdate: (updated: Subject) => void;
}

export default function AttendanceOnlyCard({ subject, onUpdate }: Props) {
  const p = processSubject(subject);
  const [editing, setEditing] = useState(false);
  const attendanceBarWidth = Math.min(p.attendancePct, 100);
  const isSafe = p.attendanceStatus === "safe";

  return (
    <>
      <div
        className="rounded-lg p-3 border transition-all duration-200 hover:border-violet-700/40"
        style={{ background: "rgba(15,5,35,0.5)", backdropFilter: "blur(8px)", borderColor: "rgba(109,40,217,0.15)" }}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-violet-400/40 text-xs font-mono">{subject.code}</span>
            </div>
            <p className="text-violet-100/80 text-sm leading-snug line-clamp-1">{subject.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-sm font-bold ${isSafe ? "text-emerald-400" : "text-red-400"}`}>
              {p.attendancePct.toFixed(1)}%
            </span>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-violet-500/40 hover:text-violet-300 hover:bg-violet-500/10 transition-all duration-200"
            >
              <Pencil size={13} />
            </button>
          </div>
        </div>
        <div className="mt-2 space-y-1">
          <div className="h-1 bg-violet-950/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isSafe ? "bg-gradient-to-r from-emerald-600 to-teal-500" : "bg-gradient-to-r from-red-600 to-rose-500"}`}
              style={{ width: `${attendanceBarWidth}%` }}
            />
          </div>
          <p className="text-xs text-violet-400/40">
            {p.present}/{subject.conducted} present
            {isSafe
              ? ` · can miss ${p.margin} more`
              : ` · need ${p.required} more`}
          </p>
        </div>
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
