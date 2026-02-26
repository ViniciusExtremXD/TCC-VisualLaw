"use client";

import type { ReactNode } from "react";

interface NavigationBarProps {
  title: string;
  subtitle?: string;
  caption?: string;
  actions?: ReactNode;
  largeTitle?: boolean;
  testId?: string;
}

export default function NavigationBar({
  title,
  subtitle,
  caption,
  actions,
  largeTitle = true,
  testId,
}: NavigationBarProps) {
  return (
    <header className="cupertino-nav" data-testid={testId}>
      <div className="cupertino-nav-top-row">
        {subtitle ? <span className="cupertino-nav-subtitle">{subtitle}</span> : <span></span>}
        {actions ? <div className="d-flex align-items-center gap-2 flex-wrap">{actions}</div> : null}
      </div>

      {largeTitle ? (
        <h1 className="cupertino-large-title mb-0">{title}</h1>
      ) : (
        <h2 className="cupertino-title mb-0">{title}</h2>
      )}

      {caption ? <p className="cupertino-caption mb-0 mt-2">{caption}</p> : null}
    </header>
  );
}
