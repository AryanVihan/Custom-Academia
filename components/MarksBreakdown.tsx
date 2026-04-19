"use client";

import { MarkComponent } from "@/types";

interface Props {
  components: MarkComponent[];
  obtainedTotal: number;
  maxTotal: number;
  ciaPct: number;
  marksLost: number;
}

export default function MarksBreakdown({
  components,
  obtainedTotal,
  maxTotal,
  ciaPct,
  marksLost,
}: Props) {
  if (components.length === 0) return null;

  return (
    <div className="mt-3">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-violet-300/50 border-b border-violet-900/40">
            <th className="text-left py-1 font-medium">Component</th>
            <th className="text-right py-1 font-medium">Obtained</th>
            <th className="text-right py-1 font-medium">Max</th>
            <th className="text-right py-1 font-medium text-red-400/80">Lost</th>
          </tr>
        </thead>
        <tbody>
          {components.map((c) => (
            <tr key={c.name} className="border-b border-violet-950/60">
              <td className="py-1 text-violet-200/70 font-mono">{c.name}</td>
              <td className="py-1 text-right text-white/90">{c.obtained}</td>
              <td className="py-1 text-right text-violet-300/50">{c.max}</td>
              <td className="py-1 text-right text-red-400/70">
                {parseFloat((c.max - c.obtained).toFixed(2))}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-violet-800/40 font-semibold">
            <td className="py-1 text-violet-200/80 text-xs">Total</td>
            <td className="py-1 text-right text-emerald-400">
              {parseFloat(obtainedTotal.toFixed(2))}
            </td>
            <td className="py-1 text-right text-violet-300/50">{parseFloat(maxTotal.toFixed(2))}</td>
            <td className="py-1 text-right text-red-400/80">
              {parseFloat(marksLost.toFixed(2))}
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="pt-1 text-right text-xs text-violet-400">
              CIA: {ciaPct.toFixed(1)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
