"use client";

import type { ButtonHTMLAttributes } from "react";

export type CupertinoButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type CupertinoButtonSize = "sm" | "md";

export function getCupertinoButtonClassName(
  variant: CupertinoButtonVariant = "primary",
  size: CupertinoButtonSize = "md",
  className = ""
): string {
  const base = [
    "cupertino-btn",
    `cupertino-btn-${variant}`,
    `cupertino-btn-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return base;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CupertinoButtonVariant;
  size?: CupertinoButtonSize;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={getCupertinoButtonClassName(variant, size, className)}
      {...props}
    />
  );
}
