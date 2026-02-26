"use client";

import { useState, type ReactNode } from "react";

interface AccordionProps {
  title: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  testId?: string;
}

export default function CupertinoAccordion({
  title,
  summary,
  children,
  defaultOpen = false,
  testId,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="cupertino-accordion" data-testid={testId}>
      <button
        type="button"
        className="cupertino-accordion-trigger"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
      </button>

      {summary ? <p className="cupertino-accordion-summary">{summary}</p> : null}
      {open ? <div className="cupertino-accordion-content">{children}</div> : null}
    </div>
  );
}
