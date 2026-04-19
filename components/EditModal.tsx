"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Subject, MarkComponent } from "@/types";
import { X, Plus, Trash2 } from "lucide-react";

interface Props {
  subject: Subject;
  onSave: (updated: Subject) => void;
  onClose: () => void;
}

export default function EditModal({ subject, onSave, onClose }: Props) {
  const [conducted, setConducted] = useState(subject.conducted);
  const [absent, setAbsent] = useState(subject.absent);
  const [components, setComponents] = useState<MarkComponent[]>(
    subject.components.map((c) => ({ ...c }))
  );

  function updateComponent(i: number, field: keyof MarkComponent, value: string) {
    setComponents((prev) =>
      prev.map((c, idx) =>
        idx === i ? { ...c, [field]: field === "name" ? value : parseFloat(value) || 0 } : c
      )
    );
  }

  function addComponent() {
    setComponents((prev) => [...prev, { name: "", obtained: 0, max: 0 }]);
  }

  function removeComponent(i: number) {
    setComponents((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    const absentClamped = Math.min(absent, conducted);
    onSave({ ...subject, conducted, absent: absentClamped, components });
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}>
      <div
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-violet-800/40 animate-scale-in"
        style={{ background: "rgba(12,3,30,0.95)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-start justify-between p-4 border-b border-violet-900/40">
          <div>
            <p className="text-xs text-violet-400/50 font-mono">{subject.code}</p>
            <p className="text-white/90 font-semibold text-sm leading-snug mt-0.5">
              {subject.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-violet-500/50 hover:text-violet-200 ml-3 mt-0.5 shrink-0 p-1 rounded-lg hover:bg-violet-500/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div>
            <p className="text-violet-300/50 text-xs font-semibold uppercase tracking-widest mb-2">
              Attendance
            </p>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-violet-300/50 text-xs">Hours Conducted</span>
                <input
                  type="number"
                  min={0}
                  value={conducted}
                  onChange={(e) => setConducted(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  style={{ background: "rgba(30,10,60,0.8)", border: "1px solid rgba(109,40,217,0.3)" }}
                />
              </label>
              <label className="block">
                <span className="text-violet-300/50 text-xs">Hours Absent</span>
                <input
                  type="number"
                  min={0}
                  value={absent}
                  onChange={(e) => setAbsent(parseInt(e.target.value) || 0)}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                  style={{ background: "rgba(30,10,60,0.8)", border: "1px solid rgba(109,40,217,0.3)" }}
                />
              </label>
            </div>
          </div>

          {subject.type === "graded" && (
            <div>
              <p className="text-violet-300/50 text-xs font-semibold uppercase tracking-widest mb-2">
                Mark Components
              </p>
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_80px_80px_32px] gap-2 text-xs text-violet-400/40 px-1">
                  <span>Component</span>
                  <span className="text-right">Obtained</span>
                  <span className="text-right">Max</span>
                  <span />
                </div>
                {components.map((c, i) => (
                  <div key={i} className="grid grid-cols-[1fr_80px_80px_32px] gap-2 items-center">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateComponent(i, "name", e.target.value)}
                      placeholder="e.g. FT-I"
                      className="rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                      style={{ background: "rgba(30,10,60,0.8)", border: "1px solid rgba(109,40,217,0.25)" }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={c.obtained}
                      onChange={(e) => updateComponent(i, "obtained", e.target.value)}
                      className="rounded px-2 py-1.5 text-white text-xs text-right focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                      style={{ background: "rgba(30,10,60,0.8)", border: "1px solid rgba(109,40,217,0.25)" }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      value={c.max}
                      onChange={(e) => updateComponent(i, "max", e.target.value)}
                      className="rounded px-2 py-1.5 text-white text-xs text-right focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all"
                      style={{ background: "rgba(30,10,60,0.8)", border: "1px solid rgba(109,40,217,0.25)" }}
                    />
                    <button
                      onClick={() => removeComponent(i)}
                      className="text-violet-600/50 hover:text-red-400 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addComponent}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-200 mt-1 transition-colors"
                >
                  <Plus size={13} /> Add component
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-4 border-t border-violet-900/40">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-violet-800/40 text-violet-400/60 hover:text-violet-200 text-sm transition-all hover:border-violet-700/60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-900/40"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
