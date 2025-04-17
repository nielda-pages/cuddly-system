import { useState, useEffect, useRef } from 'react';

export interface PedalKeyInfo {
  /** Label shown in the top half (single press). */
  label: string;
  /** Description shown in the bottom half (double‑tap / uppercase). */
  doubleTapDescription: string;
}

export interface UsePedalInputsOptions {
  /** Map of physical keys ➜ game labels/descriptions. */
  keyConfig: Record<string, PedalKeyInfo>;
  /** How long (ms) a half stays highlighted.  */
  highlightDuration?: number;
  /** Max items kept in history. */
  historyLimit?: number;
}

export type InputHalf = 'top' | 'bottom';

export interface PedalHistoryItem {
  key: string;
  half: InputHalf;
  timestamp: string;
}

/**
 * Centralised pedal/key handling.
 * Returns the currently‑active halves and an interaction history.
 */
export function usePedalInputs({
  keyConfig,
  highlightDuration = 200,
  historyLimit = 10,
}: UsePedalInputsOptions) {
  const [activeHalves, setActiveHalves] = useState<Record<string, InputHalf>>({});
  const [history, setHistory] = useState<PedalHistoryItem[]>([]);
  const timeoutIds = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const rawKey = e.key;
      const key = rawKey.toLowerCase();

      if (!keyConfig[key]) return;

      const isUppercase =
        rawKey.length === 1 && rawKey === rawKey.toUpperCase() && rawKey !== rawKey.toLowerCase();
      const half: InputHalf = isUppercase ? 'bottom' : 'top';

      // trigger highlight
      setActiveHalves((prev) => ({ ...prev, [key]: half }));

      // schedule un‑highlight
      clearTimeout(timeoutIds.current[key]);
      timeoutIds.current[key] = setTimeout(() => {
        setActiveHalves((prev) => {
          const clone = { ...prev };
          delete clone[key];
          return clone;
        });
      }, highlightDuration);

      // push to history
      setHistory((prev) => [
        {
          key,
          half,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, historyLimit - 1),
      ]);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [keyConfig, highlightDuration, historyLimit]);

  return { activeHalves, history };
}
