"use client";

import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  inset?: boolean;
  children: ReactNode;
  as?: "section" | "article" | "div";
}

export default function Card({
  inset = false,
  children,
  className = "",
  as = "section",
  ...props
}: CardProps) {
  const Element = as;
  return (
    <Element
      className={`${inset ? "cupertino-card-inset" : "cupertino-card"} ${className}`.trim()}
      {...props}
    >
      {children}
    </Element>
  );
}
