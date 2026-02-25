"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  Clause,
  HighlightsMap,
  ExplanationsMap,
  LexiconEntry,
  AuditSession,
} from "@/lib/types";

/* ── Shape ──────────────────────────────────────────── */
interface SessionState {
  clauses: Clause[];
  highlights: HighlightsMap;
  explanations: ExplanationsMap;
  lexicon: LexiconEntry[];
  audit: AuditSession | null;
  currentIndex: number;
  isProcessed: boolean;
  academicMode: boolean;
}

interface SessionActions {
  setResults: (data: {
    clauses: Clause[];
    highlights: HighlightsMap;
    explanations: ExplanationsMap;
    lexicon?: LexiconEntry[];
    audit?: AuditSession;
  }) => void;
  setCurrentIndex: (index: number) => void;
  setAcademicMode: (mode: boolean) => void;
  reset: () => void;
}

type SessionContextType = SessionState & SessionActions;

const STORAGE_KEY = "vlaw_session";
const MODE_KEY = "vlaw_academic_mode";

const INITIAL: SessionState = {
  clauses: [],
  highlights: {},
  explanations: {},
  lexicon: [],
  audit: null,
  currentIndex: 0,
  isProcessed: false,
  academicMode: false,
};

/* ── localStorage helpers ───────────────────────────── */

function saveToStorage(state: SessionState): void {
  try {
    const { lexicon: _lex, ...rest } = state;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // sessionStorage cheio ou indisponível — ignora
  }
}

function loadFromStorage(): Partial<SessionState> | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadAcademicMode(): boolean {
  try {
    return localStorage.getItem(MODE_KEY) === "true";
  } catch {
    return false;
  }
}

function saveAcademicMode(mode: boolean): void {
  try {
    localStorage.setItem(MODE_KEY, String(mode));
  } catch { /* ignore */ }
}

/* ── Context ────────────────────────────────────────── */
const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  // Restaura sessão do sessionStorage na montagem
  useEffect(() => {
    const saved = loadFromStorage();
    const savedMode = loadAcademicMode();
    if (saved && saved.isProcessed && saved.clauses && saved.clauses.length > 0) {
      setState((prev) => ({
        ...prev,
        ...saved,
        lexicon: prev.lexicon,
        academicMode: savedMode,
      }));
    } else {
      setState((prev) => ({ ...prev, academicMode: savedMode }));
    }
    setHydrated(true);
  }, []);

  // Persiste mudanças no sessionStorage
  useEffect(() => {
    if (hydrated && state.isProcessed) {
      saveToStorage(state);
    }
  }, [state, hydrated]);

  const setResults = useCallback(
    (data: {
      clauses: Clause[];
      highlights: HighlightsMap;
      explanations: ExplanationsMap;
      lexicon?: LexiconEntry[];
      audit?: AuditSession;
    }) => {
      setState((prev) => ({
        ...prev,
        clauses: data.clauses,
        highlights: data.highlights,
        explanations: data.explanations,
        lexicon: data.lexicon ?? [],
        audit: data.audit ?? null,
        currentIndex: 0,
        isProcessed: true,
      }));
    },
    []
  );

  const setCurrentIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentIndex: index }));
  }, []);

  const setAcademicMode = useCallback((mode: boolean) => {
    saveAcademicMode(mode);
    setState((prev) => ({ ...prev, academicMode: mode }));
  }, []);

  const reset = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
    setState((prev) => ({ ...INITIAL, academicMode: prev.academicMode }));
  }, []);

  return (
    <SessionContext.Provider
      value={{ ...state, setResults, setCurrentIndex, setAcademicMode, reset }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx)
    throw new Error("useSession must be used within <SessionProvider>");
  return ctx;
}
