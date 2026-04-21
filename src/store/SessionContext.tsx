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
  DocumentRecord,
  TraceabilitySession,
} from "@/lib/types";

interface SessionState {
  clauses: Clause[];
  highlights: HighlightsMap;
  explanations: ExplanationsMap;
  lexicon: LexiconEntry[];
  audit: AuditSession | null;
  traceability: TraceabilitySession | null;
  selectedDocument: DocumentRecord | null;
  currentIndex: number;
  isProcessed: boolean;
}

interface SessionActions {
  setResults: (data: {
    clauses: Clause[];
    highlights: HighlightsMap;
    explanations: ExplanationsMap;
    lexicon?: LexiconEntry[];
    audit?: AuditSession;
    traceability?: TraceabilitySession;
    selectedDocument?: DocumentRecord | null;
  }) => void;
  setCurrentIndex: (index: number) => void;
  reset: () => void;
}

type SessionContextType = SessionState & SessionActions;

const STORAGE_KEY = "vlaw_session_v2";

const INITIAL: SessionState = {
  clauses: [],
  highlights: {},
  explanations: {},
  lexicon: [],
  audit: null,
  traceability: null,
  selectedDocument: null,
  currentIndex: 0,
  isProcessed: false,
};

function saveToStorage(state: SessionState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage write failures.
  }
}

function loadFromStorage(): Partial<SessionState> | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as Partial<SessionState>;
  } catch {
    return null;
  }
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(INITIAL);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved && saved.isProcessed && Array.isArray(saved.clauses) && saved.clauses.length > 0) {
      setState({
        clauses: saved.clauses ?? [],
        highlights: saved.highlights ?? {},
        explanations: saved.explanations ?? {},
        lexicon: saved.lexicon ?? [],
        audit: saved.audit ?? null,
        traceability: saved.traceability ?? null,
        selectedDocument: saved.selectedDocument ?? null,
        currentIndex: typeof saved.currentIndex === "number" ? saved.currentIndex : 0,
        isProcessed: true,
      });
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (state.isProcessed) {
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
      traceability?: TraceabilitySession;
      selectedDocument?: DocumentRecord | null;
    }) => {
      setState((prev) => ({
        ...prev,
        clauses: data.clauses,
        highlights: data.highlights,
        explanations: data.explanations,
        lexicon: data.lexicon ?? prev.lexicon,
        audit: data.audit ?? null,
        traceability: data.traceability ?? null,
        selectedDocument: data.selectedDocument ?? prev.selectedDocument,
        currentIndex: 0,
        isProcessed: true,
      }));
    },
    []
  );

  const setCurrentIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentIndex: index }));
  }, []);

  const reset = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }

    setState(INITIAL);
  }, []);

  return (
    <SessionContext.Provider value={{ ...state, setResults, setCurrentIndex, reset }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within <SessionProvider>");
  }
  return ctx;
}
