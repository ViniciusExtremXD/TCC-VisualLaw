"use client";

import type { ReactNode } from "react";

interface InsetGroupedListProps {
  children: ReactNode;
  className?: string;
}

interface ListCellProps {
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  right?: ReactNode;
  onClick?: () => void;
  testId?: string;
}

export function InsetGroupedList({ children, className = "" }: InsetGroupedListProps) {
  return <div className={`cupertino-inset-group ${className}`.trim()}>{children}</div>;
}

export function ListCell({
  title,
  subtitle,
  meta,
  right,
  onClick,
  testId,
}: ListCellProps) {
  const content = (
    <>
      <div className="cupertino-list-main">
        <div className="cupertino-list-title">{title}</div>
        {subtitle ? <div className="cupertino-list-subtitle">{subtitle}</div> : null}
        {meta ? <div className="cupertino-list-meta">{meta}</div> : null}
      </div>
      {right ? <div className="cupertino-list-right">{right}</div> : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className="cupertino-list-cell cupertino-list-cell-button"
        onClick={onClick}
        data-testid={testId}
      >
        {content}
      </button>
    );
  }

  return (
    <div className="cupertino-list-cell" data-testid={testId}>
      {content}
    </div>
  );
}
