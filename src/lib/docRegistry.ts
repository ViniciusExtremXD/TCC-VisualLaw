import { DEFAULT_DOCUMENTS } from "@/data/defaultDocuments";
import type { DocumentRecord } from "@/lib/types";

const DOC_REGISTRY_KEY = "vlaw_doc_registry_v1";

function ensureSingleActive(documents: DocumentRecord[]): DocumentRecord[] {
  if (documents.length === 0) {
    return [];
  }

  const activeCount = documents.filter((doc) => doc.status === "active").length;
  if (activeCount === 1) {
    return documents;
  }

  return documents.map((doc, index) => ({
    ...doc,
    status: index === 0 ? "active" : "inactive",
  }));
}

export function loadDocRegistry(): DocumentRecord[] {
  if (typeof window === "undefined") {
    return ensureSingleActive([...DEFAULT_DOCUMENTS]);
  }

  try {
    const raw = localStorage.getItem(DOC_REGISTRY_KEY);
    if (!raw) {
      const defaults = ensureSingleActive([...DEFAULT_DOCUMENTS]);
      saveDocRegistry(defaults);
      return defaults;
    }

    const parsed = JSON.parse(raw) as DocumentRecord[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const defaults = ensureSingleActive([...DEFAULT_DOCUMENTS]);
      saveDocRegistry(defaults);
      return defaults;
    }

    return ensureSingleActive(parsed);
  } catch {
    const defaults = ensureSingleActive([...DEFAULT_DOCUMENTS]);
    saveDocRegistry(defaults);
    return defaults;
  }
}

export function saveDocRegistry(documents: DocumentRecord[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      DOC_REGISTRY_KEY,
      JSON.stringify(ensureSingleActive(documents))
    );
  } catch {
    // Ignore quota/storage errors for MVP.
  }
}

export function createDocumentId(name: string): string {
  const safe = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 28);
  return `${safe || "DOC"}_${Date.now().toString().slice(-6)}`;
}

export function getActiveDocument(
  documents: DocumentRecord[]
): DocumentRecord | null {
  if (documents.length === 0) {
    return null;
  }
  return documents.find((doc) => doc.status === "active") ?? documents[0] ?? null;
}

export function activateDocument(
  documents: DocumentRecord[],
  docId: string
): DocumentRecord[] {
  return documents.map((doc) => ({
    ...doc,
    status: doc.doc_id === docId ? "active" : "inactive",
  }));
}

export function toggleDocumentStatus(
  documents: DocumentRecord[],
  docId: string
): DocumentRecord[] {
  const target = documents.find((doc) => doc.doc_id === docId);
  if (!target) {
    return documents;
  }

  if (target.status === "active") {
    const next = documents.map((doc) =>
      doc.doc_id === docId ? { ...doc, status: "inactive" as const } : doc
    );
    return ensureSingleActive(next);
  }

  return activateDocument(documents, docId);
}

export function upsertDocument(
  documents: DocumentRecord[],
  incoming: DocumentRecord
): DocumentRecord[] {
  const exists = documents.some((doc) => doc.doc_id === incoming.doc_id);
  const next = exists
    ? documents.map((doc) => (doc.doc_id === incoming.doc_id ? incoming : doc))
    : [...documents, incoming];

  return incoming.status === "active"
    ? activateDocument(next, incoming.doc_id)
    : ensureSingleActive(next);
}

export function removeDocument(
  documents: DocumentRecord[],
  docId: string
): DocumentRecord[] {
  const next = documents.filter((doc) => doc.doc_id !== docId);
  if (next.length === 0) {
    return ensureSingleActive([...DEFAULT_DOCUMENTS]);
  }
  return ensureSingleActive(next);
}

export { DOC_REGISTRY_KEY };
