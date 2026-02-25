"use client";

import { useState, type ReactNode } from "react";

interface AccordionProps {
  title: string;
  summary?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  testId?: string;
}

export default function Accordion({
  title,
  summary,
  children,
  defaultOpen = false,
  testId,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion-ios" data-testid={testId}>
      <button
        type="button"
        className="accordion-ios-trigger"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{title}</span>
        <i className={`bi ${open ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
      </button>

      {summary && <p className="accordion-ios-summary">{summary}</p>}

      {open && <div className="accordion-ios-content">{children}</div>}
    </div>
  );
}
