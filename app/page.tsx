"use client";

import { useEffect, useState } from "react";
import { UserData, Subject } from "@/types";
import { loadData, saveData } from "@/lib/storage";
import { DEFAULT_DATA } from "@/lib/data";
import UserColumn from "@/components/UserColumn";

type Tab = "user1" | "both" | "user2";

export default function Home() {
  const [data, setData] = useState<UserData>(DEFAULT_DATA);
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>("both");

  useEffect(() => {
    setData(loadData());
    setMounted(true);
  }, []);

  function updateSubject(user: "user1" | "user2", code: string, updated: Subject) {
    setData((prev) => {
      const newData = {
        ...prev,
        [user]: prev[user].map((s) => (s.code === code ? updated : s)),
      };
      saveData(newData);
      return newData;
    });
  }

  function handleReset(user: "user1" | "user2") {
    setData((prev) => {
      const newData = { ...prev, [user]: DEFAULT_DATA[user] };
      saveData(newData);
      return newData;
    });
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-violet-400/60 text-xs tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: "var(--background)" }}>
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-violet-900/30" style={{ background: "rgba(5,0,15,0.85)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-black tracking-tight">
              Academia{" "}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Ultra Pro Max
              </span>
            </h1>
            <p className="text-violet-400/50 text-xs">SRM Dashboard · 2023–24</p>
          </div>
          <div className="flex bg-violet-950/60 border border-violet-800/40 rounded-xl p-1 gap-0.5">
            {(["user1", "both", "user2"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40"
                    : "text-violet-400/70 hover:text-violet-200 hover:bg-violet-900/40"
                }`}
              >
                {t === "user1" ? "Vajeeda" : t === "user2" ? "Aryan" : "Both"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-6">
        {tab === "both" ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
              <UserColumn
                subjects={data.user1}
                userName="Vajeeda"
                onUpdate={(code, updated) => updateSubject("user1", code, updated)}
                onReset={() => handleReset("user1")}
              />
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <UserColumn
                subjects={data.user2}
                userName="Aryan"
                onUpdate={(code, updated) => updateSubject("user2", code, updated)}
                onReset={() => handleReset("user2")}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto animate-slide-up">
            <UserColumn
              subjects={tab === "user1" ? data.user1 : data.user2}
              userName={tab === "user1" ? "Vajeeda" : "Aryan"}
              onUpdate={(code, updated) =>
                updateSubject(tab === "user1" ? "user1" : "user2", code, updated)
              }
              onReset={() => handleReset(tab === "user1" ? "user1" : "user2")}
            />
          </div>
        )}
      </main>
    </div>
  );
}
