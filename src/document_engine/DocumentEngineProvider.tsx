"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { PaperItem } from "@/document_engine/types";
import { toSessionDocument } from "@/document_engine/types";
import { officialShelf } from "@/document_engine/vault";

interface EngineState {
  activePaper: PaperItem | null;
  sessionDocument: ReturnType<typeof toSessionDocument>;
  placePaper: Dispatch<SetStateAction<PaperItem | null>>;
}

const EngineContext = createContext<EngineState | null>(null);

export function DocumentEngineProvider({ children }: { children: ReactNode }) {
  const [activePaper, setActivePaper] = useState<PaperItem | null>(
    () => officialShelf()[0] ?? null
  );

  const state = useMemo<EngineState>(
    () => ({
      activePaper,
      sessionDocument: toSessionDocument(activePaper),
      placePaper: setActivePaper,
    }),
    [activePaper]
  );

  return <EngineContext.Provider value={state}>{children}</EngineContext.Provider>;
}

export function useDocumentEngine() {
  const state = useContext(EngineContext);
  if (!state) {
    throw new Error("DocumentEngineProvider ausente na arvore da aplicacao.");
  }

  return state;
}
