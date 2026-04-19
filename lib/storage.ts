import { UserData } from "@/types";
import { DEFAULT_DATA } from "./data";

const STORAGE_KEY = "academia_data";

export function loadData(): UserData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    return JSON.parse(raw) as UserData;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: UserData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetToDefaults(): UserData {
  saveData(DEFAULT_DATA);
  return DEFAULT_DATA;
}
