import { DOCUMENT_REPOSITORY } from "@/document_engine/data";
import type { PaperGroup, PaperItem } from "@/document_engine/types";
import { toSessionDocument } from "@/document_engine/types";
import type { DocumentRecord } from "@/lib/types";

const SELECTED_SLOT = "visual_law_document_engine_selected_v1";

export function officialShelf(): PaperItem[] {
  return DOCUMENT_REPOSITORY.flatMap((group) => group.documents);
}

export function officialGroups(): PaperGroup[] {
  return DOCUMENT_REPOSITORY;
}

export function findOfficialPaper(id: string | null | undefined): PaperItem | null {
  if (!id) {
    return null;
  }

  return officialShelf().find((paper) => paper.id === id) ?? null;
}

export function findOfficialGroup(id: string | null | undefined): PaperGroup | null {
  if (!id) {
    return null;
  }

  return DOCUMENT_REPOSITORY.find((group) => group.id === id) ?? null;
}

export function readSelectedPaperSideEffect(): PaperItem | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return findOfficialPaper(window.localStorage.getItem(SELECTED_SLOT));
  } catch {
    return null;
  }
}

export function persistSelectedPaperSideEffect(paper: PaperItem | null): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (paper) {
      window.localStorage.setItem(SELECTED_SLOT, paper.id);
    } else {
      window.localStorage.removeItem(SELECTED_SLOT);
    }
  } catch {
    // Persistencia e secundaria: o estado React continua sendo a fonte principal.
  }
}

export function readArchiveForReport(): DocumentRecord[] {
  return officialShelf().flatMap((paper) => {
    const sessionPaper = toSessionDocument(paper);
    return sessionPaper ? [sessionPaper] : [];
  });
}

export { SELECTED_SLOT };
