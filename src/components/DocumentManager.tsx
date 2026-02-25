"use client";

import { useMemo, useState } from "react";
import type { DocumentRecord, DocumentType } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { createDocumentId } from "@/lib/docRegistry";
import { getDocumentSemanticProfile } from "@/data/visual/document-semiotic-map";
import Accordion from "@/components/Accordion";
import { strings } from "@/i18n/ptBR";

interface DocumentManagerProps {
  documents: DocumentRecord[];
  onSave: (document: DocumentRecord) => void;
  onRemove: (docId: string) => void;
  onActivate: (docId: string) => void;
  onToggleStatus: (docId: string) => void;
}

const DOCUMENT_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: "privacy", label: "Política de privacidade" },
  { value: "terms", label: "Termos de serviço" },
  { value: "cookies", label: "Política de cookies" },
  { value: "other", label: "Outro" },
];

const EMPTY_DRAFT: Omit<DocumentRecord, "doc_id" | "status"> = {
  name: "",
  type: "privacy",
  platform: "",
  language: "pt-BR",
  url: "",
  last_updated: "",
};

export default function DocumentManager({
  documents,
  onSave,
  onRemove,
  onActivate,
  onToggleStatus,
}: DocumentManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const activeDocument = useMemo(
    () => documents.find((item) => item.status === "active") ?? null,
    [documents]
  );

  const startCreate = () => {
    setEditingId("__new__");
    setDraft(EMPTY_DRAFT);
  };

  const startEdit = (document: DocumentRecord) => {
    setEditingId(document.doc_id);
    setDraft({
      name: document.name,
      type: document.type,
      platform: document.platform,
      language: document.language,
      url: document.url ?? "",
      last_updated: document.last_updated ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  };

  const saveDraft = () => {
    if (draft.name.trim().length < 3 || draft.platform.trim().length < 2) {
      return;
    }

    const current = documents.find((item) => item.doc_id === editingId);
    onSave({
      doc_id:
        editingId && editingId !== "__new__"
          ? editingId
          : createDocumentId(draft.name),
      name: draft.name.trim(),
      type: draft.type,
      platform: draft.platform.trim(),
      language: draft.language.trim() || "pt-BR",
      url: draft.url?.trim() || undefined,
      last_updated: draft.last_updated?.trim() || undefined,
      status: current?.status ?? (activeDocument ? "inactive" : "active"),
    });

    cancelEdit();
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="ios-card-inset p-3" data-testid="active-document-card">
        <div className="fw-semibold mb-1">{strings.home.activeDocument}</div>
        {activeDocument ? (
          <>
            <div>{activeDocument.name}</div>
            <div className="text-ios-secondary" style={{ fontSize: "0.82rem" }}>
              {activeDocument.platform} | {activeDocument.type} | {activeDocument.language}
            </div>
          </>
        ) : (
          <div className="text-ios-secondary" style={{ fontSize: "0.82rem" }}>
            {strings.home.noActiveDocument}
          </div>
        )}
      </div>

      <Accordion
        title={strings.home.docManagerDetails}
        summary={strings.home.docManagerSummary}
        testId="doc-manager-accordion"
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <h3 className="fw-semibold mb-0" style={{ fontSize: "1rem" }}>
            {strings.home.docManagerTitle}
          </h3>
          <button
            type="button"
            className="btn btn-ios btn-ios-secondary"
            onClick={startCreate}
            data-testid="doc-add-button"
          >
            <i className="bi bi-plus-circle me-1"></i>
            Adicionar
          </button>
        </div>

        {editingId && (
          <div className="ios-card-inset p-3 d-flex flex-column gap-2 mb-2" data-testid="doc-editor">
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>
                  Nome do documento
                </label>
                <input
                  className="form-control form-control-ios"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, name: event.target.value }))
                  }
                  data-testid="doc-name-input"
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>
                  Tipo
                </label>
                <select
                  className="form-select form-select-ios"
                  value={draft.type}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      type: event.target.value as DocumentType,
                    }))
                  }
                >
                  {DOCUMENT_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>
                  Idioma
                </label>
                <input
                  className="form-control form-control-ios"
                  value={draft.language}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, language: event.target.value }))
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>
                  Plataforma
                </label>
                <input
                  className="form-control form-control-ios"
                  value={draft.platform}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, platform: event.target.value }))
                  }
                  data-testid="doc-platform-input"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>
                  URL oficial (opcional)
                </label>
                <input
                  className="form-control form-control-ios"
                  value={draft.url}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, url: event.target.value }))
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" style={{ fontSize: "0.8rem" }}>
                  Última atualização (opcional)
                </label>
                <input
                  className="form-control form-control-ios"
                  value={draft.last_updated}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, last_updated: event.target.value }))
                  }
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-ios btn-ios-tertiary"
                onClick={cancelEdit}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-ios btn-ios-primary"
                onClick={saveDraft}
                data-testid="doc-save-button"
              >
                Salvar documento
              </button>
            </div>
          </div>
        )}

        <div className="d-flex flex-column gap-2" data-testid="doc-list">
          {documents.map((document) => {
            const semantic = getDocumentSemanticProfile(document);
            return (
              <article key={document.doc_id} className="ios-card-inset p-3" data-testid="doc-item">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <span className="fw-semibold">{document.name}</span>
                      <span
                        className={`badge-ios ${document.status === "active" ? "badge-impact-low" : "badge-impact-medium"}`}
                      >
                        {document.status === "active"
                          ? strings.common.active
                          : strings.common.inactive}
                      </span>
                    </div>
                    <div className="text-ios-secondary" style={{ fontSize: "0.8rem" }}>
                      doc_id: <code>{document.doc_id}</code> | plataforma: {document.platform} |
                      tipo: {document.type}
                    </div>
                    <div className="text-ios-secondary" style={{ fontSize: "0.8rem" }}>
                      idioma: {document.language}
                      {document.last_updated
                        ? ` | última atualização: ${document.last_updated}`
                        : ""}
                    </div>
                    {document.url && (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {document.url}
                      </a>
                    )}
                  </div>

                  <div className="d-flex gap-1 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-ios btn-ios-secondary"
                      style={{ fontSize: "0.78rem", padding: "0.35rem 0.7rem" }}
                      onClick={() => onActivate(document.doc_id)}
                    >
                      Ativar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ios btn-ios-tertiary"
                      style={{ fontSize: "0.78rem", padding: "0.35rem 0.7rem" }}
                      onClick={() => onToggleStatus(document.doc_id)}
                    >
                      {document.status === "active" ? "Desativar" : "Status"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ios btn-ios-tertiary"
                      style={{ fontSize: "0.78rem", padding: "0.35rem 0.7rem" }}
                      onClick={() => startEdit(document)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-ios"
                      style={{
                        fontSize: "0.78rem",
                        padding: "0.35rem 0.7rem",
                        background: "rgba(220,38,38,0.12)",
                        color: "#b91c1c",
                      }}
                      onClick={() => onRemove(document.doc_id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <div className="mt-2 p-2 rounded" style={{ background: "rgba(0,122,255,0.06)" }}>
                  <div className="fw-semibold mb-1" style={{ fontSize: "0.82rem" }}>
                    Mapeamento semântico do documento
                  </div>
                  <div style={{ fontSize: "0.8rem" }}>
                    <div>
                      <span className="fw-semibold">Regra principal:</span>{" "}
                      {semantic.profile.rule_summary}
                    </div>
                    <div>
                      <span className="fw-semibold">Ícone principal:</span>{" "}
                      <code>{semantic.profile.primary_icon}</code>
                    </div>
                    <div>
                      <span className="fw-semibold">Justificativa:</span>{" "}
                      {semantic.profile.icon_justification}
                    </div>
                    <div>
                      <span className="fw-semibold">Categorias-alvo:</span>{" "}
                      {semantic.categories
                        .map((category) => CATEGORY_LABELS[category])
                        .join(", ")}
                    </div>
                    {semantic.platformNote && (
                      <div>
                        <span className="fw-semibold">Ajuste por plataforma:</span>{" "}
                        {semantic.platformNote}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Accordion>
    </div>
  );
}
