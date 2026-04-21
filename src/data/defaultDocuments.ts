import corpusManifest from "../../data/corpus/corpus-manifest.json";
import type { CorpusManifestRecord, DocumentRecord } from "@/lib/types";

const BASE_DOCUMENTS = (corpusManifest as CorpusManifestRecord[]).map<DocumentRecord>(
  (document, index) => ({
    doc_id: document.document_id,
    name: document.titulo,
    type: document.tipo,
    platform: document.plataforma,
    language: document.idioma,
    last_updated: document.coleta_referencia,
    status: index === 0 ? "active" : "inactive",
  })
);

export const DEFAULT_DOCUMENTS: DocumentRecord[] = [
  ...BASE_DOCUMENTS,
  {
    doc_id: "CUSTOM_DOC",
    name: "Entrada livre do pesquisador",
    type: "other",
    platform: "Manual",
    language: "pt-BR",
    status: "inactive",
  },
];
