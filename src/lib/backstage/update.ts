"use client";

import type { BackstageEvent } from "./types";
import { loadBackstageState, saveBackstageState } from "./store";

export function updateBackstageEvent(id: string, patch: Partial<BackstageEvent>) {
  const state = loadBackstageState();
  const idx = state.events.findIndex((e) => e.id === id);
  if (idx === -1) return null;

  state.events[idx] = {
    ...state.events[idx],
    ...patch,
    mcq: {
      ...(state.events[idx].mcq ?? {}),
      ...(patch.mcq ?? {}),
    },
  };

  saveBackstageState(state);
  return state.events[idx];
}
