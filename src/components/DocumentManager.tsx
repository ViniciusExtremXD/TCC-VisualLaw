"use client";

import { useMemo, useState } from "react";
import type { DocumentRecord, DocumentType } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { createDocumentId } from "@/lib/docRegistry";
import { getDocumentSemanticProfile } from "@/data/visual/document-semiotic-map";
import Accordion from "@/components/Accordion";
import { strings } from "@/i18n/ptBR";
import Button from "@/ui/components/Button";
import { InsetGroupedList, ListCell } from "@/ui/components/InsetGroupedList";
import Sheet from "@/ui/components/Sheet";

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const activeDocument = useMemo(
    () => documents.find((item) => item.status === "active") ?? null,
    [documents]
  );

  const openSheet = () => setSheetOpen(true);
  const closeSheet = () => {
    setSheetOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  };

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
    <>
      <InsetGroupedList>
        <ListCell
          testId="active-document-card"
          title={activeDocument ? activeDocument.name : strings.home.noActiveDocument}
          subtitle={
            activeDocument
              ? `${activeDocument.platform} • ${activeDocument.type} • ${activeDocument.language}`
              : strings.home.activeDocument
          }
          meta={
            activeDocument
              ? `doc_id ${activeDocument.doc_id}${
                  activeDocument.last_updated
                    ? ` • atualização ${activeDocument.last_updated}`
                    : ""
                }`
              : undefined
          }
          right={
            <Button
              variant="secondary"
              size="sm"
              onClick={openSheet}
              data-testid="doc-manager-open-button"
            >
              <i className="bi bi-folder2-open"></i>
              Gerenciar
            </Button>
          }
        />
      </InsetGroupedList>

      <Sheet
        open={sheetOpen}
        onClose={closeSheet}
        title={strings.home.docManagerTitle}
        subtitle="Cadastro local para rastreabilidade de plataforma, tipo documental e status."
        testId="doc-manager-sheet"
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <Button variant="secondary" size="sm" onClick={startCreate} data-testid="doc-add-button">
            <i className="bi bi-plus-circle"></i>
            Adicionar
          </Button>
          <span className="text-ios-secondary" style={{ fontSize: "0.76rem" }}>
            Documento ativo: {activeDocument?.doc_id ?? "nenhum"}
          </span>
        </div>

        {editingId && (
          <div className="cupertino-card-inset p-3 mb-3" data-testid="doc-editor">
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <label className="form-label" style={{ fontSize: "0.78rem" }}>
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
                <label className="form-label" style={{ fontSize: "0.78rem" }}>
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
                <label className="form-label" style={{ fontSize: "0.78rem" }}>
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
                <label className="form-label" style={{ fontSize: "0.78rem" }}>
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
                <label className="form-label" style={{ fontSize: "0.78rem" }}>
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
                <label className="form-label" style={{ fontSize: "0.78rem" }}>
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

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={saveDraft} data-testid="doc-save-button">
                Salvar documento
              </Button>
            </div>
          </div>
        )}

        <div className="d-flex flex-column gap-2" data-testid="doc-list">
          {documents.map((document) => {
            const semantic = getDocumentSemanticProfile(document);
            return (
              <article key={document.doc_id} className="cupertino-card-inset p-3" data-testid="doc-item">
                <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <span className="fw-semibold">{document.name}</span>
                      <span
                        className={`badge-ios ${
                          document.status === "active" ? "badge-impact-low" : "badge-impact-medium"
                        }`}
                      >
                        {document.status === "active" ? strings.common.active : strings.common.inactive}
                      </span>
                    </div>
                    <div className="text-ios-secondary" style={{ fontSize: "0.78rem" }}>
                      doc_id {document.doc_id} • plataforma {document.platform} • tipo {document.type}
                    </div>
                    <div className="text-ios-secondary" style={{ fontSize: "0.78rem" }}>
                      idioma {document.language}
                      {document.last_updated ? ` • atualização ${document.last_updated}` : ""}
                    </div>
                    {document.url ? (
                      <a href={document.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.77rem" }}>
                        {document.url}
                      </a>
                    ) : null}
                  </div>

                  <div className="d-flex gap-1 flex-wrap">
                    <Button variant="secondary" size="sm" onClick={() => onActivate(document.doc_id)}>
                      Ativar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onToggleStatus(document.doc_id)}>
                      {document.status === "active" ? "Desativar" : "Alternar"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => startEdit(document)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onRemove(document.doc_id)}>
                      Remover
                    </Button>
                  </div>
                </div>

                <div className="mt-2">
                  <Accordion title="Mapeamento semântico do documento" summary="Regras e categorias associadas" >
                    <div style={{ fontSize: "0.8rem" }}>
                      <div>
                        <span className="fw-semibold">Regra principal:</span> {semantic.profile.rule_summary}
                      </div>
                      <div>
                        <span className="fw-semibold">Ícone principal:</span> <code>{semantic.profile.primary_icon}</code>
                      </div>
                      <div>
                        <span className="fw-semibold">Justificativa:</span> {semantic.profile.icon_justification}
                      </div>
                      <div>
                        <span className="fw-semibold">Categorias-alvo:</span>{" "}
                        {semantic.categories.map((category) => CATEGORY_LABELS[category]).join(", ")}
                      </div>
                      {semantic.platformNote ? (
                        <div>
                          <span className="fw-semibold">Ajuste por plataforma:</span> {semantic.platformNote}
                        </div>
                      ) : null}
                    </div>
                  </Accordion>
                </div>
              </article>
            );
          })}
        </div>
      </Sheet>
    </>
  );
}
