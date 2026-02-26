"use client";

import type { ReactNode } from "react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  testId?: string;
  maxWidth?: number;
}

export default function Sheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  testId,
  maxWidth = 860,
}: SheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="cupertino-sheet-overlay" onClick={onClose} data-testid={testId}>
      <div
        className="cupertino-sheet"
        style={{ maxWidth }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="cupertino-sheet-handle"></div>
        {(title || subtitle) && (
          <header className="cupertino-sheet-header">
            <div>
              {title ? <h3 className="cupertino-sheet-title">{title}</h3> : null}
              {subtitle ? <p className="cupertino-sheet-subtitle">{subtitle}</p> : null}
            </div>
            <button
              type="button"
              className="cupertino-sheet-close"
              aria-label="Fechar"
              onClick={onClose}
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          </header>
        )}

        <div className="cupertino-sheet-content">{children}</div>
        {footer ? <footer className="cupertino-sheet-footer">{footer}</footer> : null}
      </div>
    </div>
  );
}
