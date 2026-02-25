"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import DocumentManager from "@/components/DocumentManager";
import ProcessMap from "@/components/ProcessMap";

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const router = useRouter();
  const { setResults } = useSession();

  useEffect(() => {
    const loaded = loadDocRegistry();
    setDocuments(loaded);
  }, []);

  const activeDocument = useMemo(
    () => getActiveDocument(documents),
    [documents]
  );

  const persistDocuments = (next: DocumentRecord[]) => {
    setDocuments(next);
    saveDocRegistry(next);
  };

  const handleSaveDocument = (document: DocumentRecord) => {
    const next = upsertDocument(documents, document);
    persistDocuments(next);
  };

  const handleRemoveDocument = (docId: string) => {
    const next = removeDocument(documents, docId);
    persistDocuments(next);
  };

  const handleActivateDocument = (docId: string) => {
    const next = activateDocument(documents, docId);
    persistDocuments(next);
  };

  const handleToggleStatus = (docId: string) => {
    const next = toggleDocumentStatus(documents, docId);
    persistDocuments(next);
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
      } catch (error) {
        console.error("Erro ao processar texto:", error);
        alert("Falha no processamento. Revise o texto e tente novamente.");
      } finally {
        setLoading(false);
      }
    }, 60);
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
      } catch (error) {
        console.error("Erro ao carregar demo:", error);
      } finally {
        setLoading(false);
      }
    }, 60);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <section className="text-center py-2">
        <div className="mb-3" style={{ fontSize: "3rem" }}>
          <i className="bi bi-mortarboard text-ios-accent"></i>
        </div>
        <h1 className="fw-bold mb-2" style={{ fontSize: "1.8rem" }}>
          Analise Academica de Termos e Politicas
        </h1>
        <p className="text-ios-secondary mx-auto" style={{ maxWidth: 640, fontSize: "0.92rem", lineHeight: 1.5 }}>
          Ambiente unico em modo academico: processamento explicavel, rastreabilidade por etapa,
          mapeamento semiotico explicito e relatorio final em PDF.
        </p>
      </section>

      <DocumentManager
        documents={documents}
        onSave={handleSaveDocument}
        onRemove={handleRemoveDocument}
        onActivate={handleActivateDocument}
        onToggleStatus={handleToggleStatus}
      />

      <ProcessMap />

      <section className="ios-card p-4 d-flex flex-column gap-3">
        <div>
          <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
            Documento ativo para a sessao
          </div>
          {activeDocument ? (
            <div className="text-ios-secondary" style={{ fontSize: "0.84rem" }} data-testid="active-document-label">
              {activeDocument.name} | {activeDocument.platform} | {activeDocument.type} | {activeDocument.language}
            </div>
          ) : (
            <div className="text-danger" style={{ fontSize: "0.84rem" }}>
              Nenhum documento ativo. Ative um documento no gerenciador acima.
            </div>
          )}
        </div>

        <div>
          <label htmlFor="text-input" className="form-label fw-semibold" style={{ fontSize: "0.88rem" }}>
            Texto de entrada (sem PDF)
          </label>
          <textarea
            id="text-input"
            className="form-control form-control-ios"
            rows={11}
            placeholder="Cole o texto integral para gerar segmentacao, classificacao, lexico, semiotica e auditoria."
            value={text}
            onChange={(event) => setText(event.target.value)}
          ></textarea>
          <div className="text-ios-secondary mt-1" style={{ fontSize: "0.8rem" }}>
            {text.length > 0
              ? `${text.length} caracteres | minimo recomendado: 20`
              : "Minimo 20 caracteres para processar"}
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
                Processando trilha academica...
              </>
            ) : (
              <>
                <i className="bi bi-lightning-charge-fill me-1"></i>
                Processar texto
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
            Colar exemplo
          </button>

          <button
            type="button"
            className="btn btn-ios btn-ios-tertiary"
            onClick={handleDemo}
            disabled={loading || !activeDocument}
          >
            <i className="bi bi-play-circle me-1"></i>
            Demo academica
          </button>
        </div>
      </section>
    </div>
  );
}
