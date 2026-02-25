"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DocumentManager from "@/components/DocumentManager";
import ProcessMap from "@/components/ProcessMap";
import Accordion from "@/components/Accordion";
import { strings } from "@/i18n/ptBR";
import { useSession } from "@/store/SessionContext";
import {
  processText,
  loadMockSession,
  SAMPLE_TEXT,
  getLexicon,
} from "@/lib/processor";
import type { DocumentRecord } from "@/lib/types";
import {
  activateDocument,
  getActiveDocument,
  loadDocRegistry,
  removeDocument,
  saveDocRegistry,
  toggleDocumentStatus,
  upsertDocument,
} from "@/lib/docRegistry";

const FLOW_CARDS = [
  {
    icon: "bi-scissors",
    title: strings.home.segmentation,
    description: strings.home.segmentationDesc,
  },
  {
    icon: "bi-search",
    title: strings.home.highlight,
    description: strings.home.highlightDesc,
  },
  {
    icon: "bi-eye",
    title: strings.home.visualLaw,
    description: strings.home.visualLawDesc,
  },
];

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const router = useRouter();
  const { setResults } = useSession();

  useEffect(() => {
    setDocuments(loadDocRegistry());
  }, []);

  const activeDocument = useMemo(() => getActiveDocument(documents), [documents]);

  const persistDocuments = (next: DocumentRecord[]) => {
    setDocuments(next);
    saveDocRegistry(next);
  };

  const handleProcess = () => {
    if (text.trim().length < 20 || !activeDocument) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const result = processText(text.trim(), activeDocument.doc_id);
        setResults({
          ...result,
          lexicon: getLexicon(),
          selectedDocument: activeDocument,
        });
        router.push("/reader");
      } finally {
        setLoading(false);
      }
    }, 80);
  };

  const handleDemo = () => {
    if (!activeDocument) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const result = loadMockSession(activeDocument.doc_id);
        setResults({
          ...result,
          lexicon: getLexicon(),
          selectedDocument: activeDocument,
        });
        router.push("/reader");
      } finally {
        setLoading(false);
      }
    }, 80);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <section className="text-center py-2">
        <div className="mb-3" style={{ fontSize: "3rem" }}>
          <i className="bi bi-mortarboard text-ios-accent"></i>
        </div>
        <h1 className="fw-bold mb-2" style={{ fontSize: "1.8rem" }}>
          {strings.home.heroTitle}
        </h1>
        <p
          className="text-ios-secondary mx-auto"
          style={{ maxWidth: 640, fontSize: "0.92rem", lineHeight: 1.5 }}
        >
          {strings.home.heroText}
        </p>
      </section>

      {/* (1) Entrada */}
      <section className="ios-card p-4 d-flex flex-column gap-3" data-testid="home-entry-block">
        <h2 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>
          {strings.home.entryTitle}
        </h2>

        <DocumentManager
          documents={documents}
          onSave={(document) => persistDocuments(upsertDocument(documents, document))}
          onRemove={(docId) => persistDocuments(removeDocument(documents, docId))}
          onActivate={(docId) => persistDocuments(activateDocument(documents, docId))}
          onToggleStatus={(docId) => persistDocuments(toggleDocumentStatus(documents, docId))}
        />

        <div>
          <label htmlFor="text-input" className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
            {strings.home.textInputLabel}
          </label>
          <textarea
            id="text-input"
            className="form-control form-control-ios"
            rows={11}
            placeholder={strings.home.textInputPlaceholder}
            value={text}
            onChange={(event) => setText(event.target.value)}
          ></textarea>
          <div className="text-ios-secondary mt-1" style={{ fontSize: "0.8rem" }}>
            {text.length > 0
              ? `${text.length} caracteres`
              : strings.home.minChars}
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2">
          <button
            type="button"
            className="btn btn-ios btn-ios-primary flex-fill"
            onClick={handleProcess}
            disabled={loading || !activeDocument || text.trim().length < 20}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {strings.home.processing}
              </>
            ) : (
              <>
                <i className="bi bi-lightning-charge-fill me-1"></i>
                {strings.home.process}
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-ios btn-ios-secondary"
            onClick={() => setText(SAMPLE_TEXT)}
            disabled={loading}
          >
            <i className="bi bi-clipboard me-1"></i>
            {strings.home.pasteExample}
          </button>

          <button
            type="button"
            className="btn btn-ios btn-ios-tertiary"
            onClick={handleDemo}
            disabled={loading || !activeDocument}
          >
            <i className="bi bi-play-circle me-1"></i>
            {strings.home.demo}
          </button>
        </div>

        <Accordion
          title={strings.home.contractTitle}
          summary={strings.home.contractSummary}
          testId="swagger-accordion"
        >
          <div className="text-ios-secondary mb-2" style={{ fontSize: "0.84rem" }}>
            MVP front-end only (static export), sem backend publicado.
          </div>
          <Link
            href="/swagger/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ios btn-ios-tertiary"
            data-testid="swagger-link"
          >
            <i className="bi bi-box-arrow-up-right me-1"></i>
            {strings.home.contractLink}
          </Link>
        </Accordion>
      </section>

      {/* (2) Cards centrais */}
      <section className="row g-3" data-testid="home-flow-cards">
        {FLOW_CARDS.map((card) => (
          <div key={card.title} className="col-12 col-sm-4">
            <article className="ios-card p-3 text-center h-100">
              <i className={`bi ${card.icon} text-ios-accent d-block mb-2`} style={{ fontSize: "1.7rem" }}></i>
              <h3 className="fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>{card.title}</h3>
              <p className="text-ios-secondary mb-0" style={{ fontSize: "0.82rem" }}>{card.description}</p>
            </article>
          </div>
        ))}
      </section>

      {/* (3) Mapa do processo */}
      <div data-testid="home-process-block">
        <ProcessMap />
      </div>
    </div>
  );
}
