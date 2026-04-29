"use client";

import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import type { PaperItem } from "@/document_engine/types";
import { useDocumentEngine } from "@/document_engine/DocumentEngineProvider";
import {
  officialGroups,
  officialShelf,
  persistSelectedPaperSideEffect,
  readSelectedPaperSideEffect,
} from "@/document_engine/vault";
import Icon, { type IconName } from "@/ui/components/Icon";

interface DocumentWorkspaceProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

function iconForPaper(paper: PaperItem): IconName {
  if (paper.source === "Planalto") {
    return "scale";
  }

  if (paper.kind === "privacy") {
    return "shield-check";
  }

  if (paper.kind === "terms") {
    return "network";
  }

  return "file-text";
}

function kindLabel(paper: PaperItem) {
  if (paper.kind === "privacy") {
    return "Privacidade";
  }

  if (paper.kind === "terms") {
    return "Termos de uso";
  }

  if (paper.kind === "cookies") {
    return "Cookies";
  }

  return "Norma / referencia";
}

export default function DocumentWorkspace({
  value,
  onValueChange,
  disabled = false,
}: DocumentWorkspaceProps) {
  const { activePaper, placePaper } = useDocumentEngine();
  const groups = useMemo(() => officialGroups(), []);
  const papers = useMemo(() => officialShelf(), []);
  const [open, setOpen] = useState(false);
  const [readyForPortal, setReadyForPortal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() =>
    groups[0]?.id ? [groups[0].id] : []
  );

  useEffect(() => {
    setReadyForPortal(true);
    const restored = readSelectedPaperSideEffect();
    placePaper((current) => restored ?? current ?? papers[0] ?? null);
  }, [papers, placePaper]);

  useEffect(() => {
    persistSelectedPaperSideEffect(activePaper);
  }, [activePaper]);

  useEffect(() => {
    if (!activePaper?.groupId) {
      return;
    }

    setExpandedGroups((current) =>
      current.includes(activePaper.groupId) ? current : [activePaper.groupId, ...current]
    );
  }, [activePaper?.groupId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectedId = activePaper?.id ?? "";

  const openPanel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const targetGroup = activePaper?.groupId ?? groups[0]?.id;
    if (targetGroup) {
      setExpandedGroups((current) =>
        current.includes(targetGroup) ? current : [targetGroup, ...current]
      );
    }

    setOpen(true);
  };

  const closePanel = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    setOpen(false);
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId]
    );
  };

  const selectPaper = (paper: PaperItem) => {
    placePaper(paper);
    if (paper.content.trim()) {
      onValueChange(paper.content);
    }
    setOpen(false);
  };

  const modal = open ? (
    <div
      className="document-engine-overlay"
      data-testid="document-engine-modal"
      role="presentation"
      onMouseDown={() => setOpen(false)}
    >
      <section
        className="document-engine-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="document-engine-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="document-engine-header">
          <div>
            <h3 id="document-engine-title">Gerenciador de documentos</h3>
            <p>Selecione uma fonte oficial por plataforma para a leitura assistida.</p>
          </div>
          <button
            type="button"
            className="document-engine-icon-button"
            aria-label="Fechar"
            onClick={closePanel}
          >
            <Icon name="x-circle" size={20} />
          </button>
        </header>

        <div className="document-engine-toolbar">
          <span data-testid="document-engine-source-total">
            {papers.length} fonte(s) oficial(is)
          </span>
          <span>{groups.length} grupo(s) por plataforma</span>
        </div>

        <div className="document-engine-repository" data-testid="document-engine-list">
          {groups.map((group) => {
            const expanded = expandedGroups.includes(group.id);
            const panelId = `document-engine-panel-${group.id}`;
            return (
              <section
                key={group.id}
                className="document-engine-group"
                style={{ "--document-engine-accent": group.accent } as CSSProperties}
                data-testid="document-engine-group"
              >
                <button
                  type="button"
                  className="document-engine-group-trigger"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggleGroup(group.id)}
                  data-testid="document-engine-group-trigger"
                >
                  <span className="document-engine-group-marker" aria-hidden="true">
                    {group.label.slice(0, 1)}
                  </span>
                  <span className="document-engine-group-copy">
                    <strong>{group.label}</strong>
                    <span>{group.hint}</span>
                  </span>
                  <span className="document-engine-group-count">
                    {group.documents.length} fonte(s)
                  </span>
                  <Icon
                    name="chevron-down"
                    size={18}
                    className={expanded ? "document-engine-chevron-open" : undefined}
                  />
                </button>

                {expanded ? (
                  <div
                    id={panelId}
                    className="document-engine-group-panel"
                    data-testid="document-engine-group-panel"
                  >
                    {group.documents.map((paper) => {
                      const selected = paper.id === selectedId;
                      return (
                        <article
                          key={paper.id}
                          className={`document-engine-row ${
                            selected ? "document-engine-row-selected" : ""
                          }`}
                          data-testid="document-engine-row"
                        >
                          <div className="document-engine-row-icon" aria-hidden="true">
                            <Icon name={iconForPaper(paper)} size={18} />
                          </div>
                          <div className="document-engine-row-text">
                            <div className="document-engine-row-title">
                              <strong>{paper.title}</strong>
                              {selected ? (
                                <span className="document-engine-selected-badge">
                                  <Icon name="check-circle" size={14} />
                                  Selecionado
                                </span>
                              ) : null}
                            </div>
                            <span>
                              {paper.source} - {kindLabel(paper)} - {paper.locale} -{" "}
                              {paper.stamp}
                            </span>
                            <small>{paper.description}</small>
                          </div>
                          <div className="document-engine-row-actions">
                            <a
                              className="document-engine-reference-action"
                              href={paper.link}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              data-testid="document-engine-original"
                            >
                              <Icon name="external-link" size={15} />
                              Ver original
                            </a>
                            <button
                              type="button"
                              className="document-engine-primary-action"
                              onClick={() => selectPaper(paper)}
                              aria-pressed={selected}
                              data-testid="document-engine-select"
                            >
                              {selected ? "Selecionado" : "Selecionar"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>
      </section>
    </div>
  ) : null;

  return (
    <section className="document-engine-shell" data-testid="document-engine">
      <div className="document-engine-summary">
        <div>
          <div className="document-engine-kicker">Fonte ativa</div>
          <strong>{activePaper?.title ?? "Nenhum documento selecionado"}</strong>
          <span>
            {activePaper
              ? `${activePaper.source} - ${kindLabel(activePaper)} - ${activePaper.locale}`
              : "Abra o gerenciador para selecionar uma fonte."}
          </span>
        </div>
        <button
          type="button"
          className="document-engine-manage"
          onClick={openPanel}
          data-testid="document-engine-open"
        >
          Gerenciar
        </button>
      </div>

      <div className="document-engine-input-head">
        <label htmlFor="text-input">Texto de entrada</label>
        <span className="document-engine-closed-note">Repositorio oficial fechado</span>
      </div>

      <textarea
        id="text-input"
        className="form-control form-control-ios document-engine-textarea"
        rows={10}
        placeholder="Cole o texto integral para gerar segmentacao, classificacao, lexico, semiotica e auditoria."
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        disabled={disabled}
      />

      <div className="document-engine-foot">
        <span>
          {value.length > 0 ? `${value.length} caracteres` : "Minimo de 20 caracteres para processar"}
        </span>
        <span>
          {activePaper ? `Referencia: ${activePaper.title}` : "Selecione uma fonte oficial."}
        </span>
      </div>

      {readyForPortal ? createPortal(modal, document.body) : null}
    </section>
  );
}
