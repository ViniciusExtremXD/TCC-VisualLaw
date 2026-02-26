"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DocumentManager from "@/components/DocumentManager";
import ProcessMap from "@/components/ProcessMap";
import Accordion from "@/components/Accordion";
import { strings } from "@/i18n/ptBR";
import { useSession } from "@/store/SessionContext";
import { processText, loadMockSession, SAMPLE_TEXT, getLexicon } from "@/lib/processor";
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
import Button from "@/ui/components/Button";
import Card from "@/ui/components/Card";
import NavigationBar from "@/ui/components/NavigationBar";
import Sheet from "@/ui/components/Sheet";

const FLOW_CARDS = [
  {
    id: "segmentation",
    icon: "bi-scissors",
    title: strings.home.segmentation,
    description: strings.home.segmentationDesc,
    accent: "#0a84ff",
    objective:
      "Separar o texto em cláusulas auditáveis e numeradas para análise controlada.",
    input: "Texto bruto da política ou termo selecionado na sessão.",
    output: "Lista ordenada de cláusulas com clause_id e posição no documento.",
    evidence: "Regra de split aplicada e evidência de segmentação no audit trail.",
    value:
      "Permite rastrear cada decisão do pipeline até um trecho específico do texto original.",
  },
  {
    id: "highlight",
    icon: "bi-search",
    title: strings.home.highlight,
    description: strings.home.highlightDesc,
    accent: "#30b0c7",
    objective:
      "Detectar termos jurídicos do léxico e registrar offsets com proveniência.",
    input: "Cláusula individual já segmentada e normalizada.",
    output: "Highlights com term_id, match, start/end e variante correspondente.",
    evidence: "Campo do léxico usado, variante batida e contexto do match por cláusula.",
    value:
      "Garante auditabilidade técnica da explicação, sem depender de interpretação opaca.",
  },
  {
    id: "visual-law",
    icon: "bi-eye",
    title: strings.home.visualLaw,
    description: strings.home.visualLawDesc,
    accent: "#5856d6",
    objective:
      "Apresentar explicação jurídica em linguagem clara com camada semiótica explícita.",
    input: "Termo identificado + categoria + impacto + referências LGPD.",
    output: "Card completo com significado, relevância prática, ação recomendada e FAQ.",
    evidence: "Regra categoria->ícone, impacto->badge e bloco de evidência do termo.",
    value:
      "Une compreensão do usuário e rigor acadêmico no mesmo artefato de leitura.",
  },
] as const;

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedFlowCard, setSelectedFlowCard] =
    useState<(typeof FLOW_CARDS)[number] | null>(null);
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
      <NavigationBar
        title={strings.home.heroTitle}
        subtitle={strings.app.title}
        caption={strings.home.heroText}
      />

      <Card className="p-4 d-flex flex-column gap-3" data-testid="home-entry-block">
        <h2 className="cupertino-title mb-0" style={{ fontSize: "1.1rem" }}>
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
            rows={10}
            placeholder={strings.home.textInputPlaceholder}
            value={text}
            onChange={(event) => setText(event.target.value)}
          ></textarea>
          <div className="text-ios-secondary mt-1" style={{ fontSize: "0.8rem" }}>
            {text.length > 0 ? `${text.length} caracteres` : strings.home.minChars}
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-2">
          <Button
            variant="primary"
            className="flex-fill"
            onClick={handleProcess}
            disabled={loading || !activeDocument || text.trim().length < 20}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                {strings.home.processing}
              </>
            ) : (
              <>
                <i className="bi bi-lightning-charge-fill"></i>
                {strings.home.process}
              </>
            )}
          </Button>

          <Button variant="secondary" onClick={() => setText(SAMPLE_TEXT)} disabled={loading}>
            <i className="bi bi-clipboard"></i>
            {strings.home.pasteExample}
          </Button>

          <Button variant="ghost" onClick={handleDemo} disabled={loading || !activeDocument}>
            <i className="bi bi-play-circle"></i>
            {strings.home.demo}
          </Button>
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
            className="cupertino-btn cupertino-btn-ghost cupertino-btn-sm"
            data-testid="swagger-link"
          >
            <i className="bi bi-box-arrow-up-right"></i>
            {strings.home.contractLink}
          </Link>
        </Accordion>
      </Card>

      <section className="row g-3" data-testid="home-flow-cards">
        {FLOW_CARDS.map((card) => (
          <div key={card.id} className="col-12 col-sm-4">
            <button
              type="button"
              className="ios-feature-card h-100 w-100"
              onClick={() => setSelectedFlowCard(card)}
              aria-label={`Detalhes de ${card.title}`}
            >
              <span className="ios-feature-card-inner">
                <span
                  className="ios-feature-icon"
                  style={{ color: card.accent, background: `${card.accent}1f` }}
                >
                  <i className={`bi ${card.icon}`}></i>
                </span>
                <span
                  className="ios-feature-ring"
                  style={{ boxShadow: `0 0 0 1px ${card.accent}33 inset` }}
                ></span>
                <span className="fw-semibold mb-1" style={{ fontSize: "0.95rem" }}>
                  {card.title}
                </span>
                <span className="text-ios-secondary" style={{ fontSize: "0.82rem" }}>
                  {card.description}
                </span>
                <span className="ios-feature-link">Toque para ver detalhes</span>
              </span>
            </button>
          </div>
        ))}
      </section>

      <div data-testid="home-process-block">
        <ProcessMap />
      </div>

      <Sheet
        open={Boolean(selectedFlowCard)}
        onClose={() => setSelectedFlowCard(null)}
        title={selectedFlowCard?.title}
        subtitle={selectedFlowCard?.description}
        testId="flow-detail-sheet"
        maxWidth={620}
      >
        {selectedFlowCard ? (
          <div className="cupertino-card-inset p-3 d-flex flex-column gap-2" style={{ fontSize: "0.88rem" }}>
            <div>
              <span className="fw-semibold">Objetivo:</span> {selectedFlowCard.objective}
            </div>
            <div>
              <span className="fw-semibold">Entrada:</span> {selectedFlowCard.input}
            </div>
            <div>
              <span className="fw-semibold">Saída:</span> {selectedFlowCard.output}
            </div>
            <div>
              <span className="fw-semibold">Evidência gerada:</span> {selectedFlowCard.evidence}
            </div>
            <div>
              <span className="fw-semibold">Valor acadêmico:</span> {selectedFlowCard.value}
            </div>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}
