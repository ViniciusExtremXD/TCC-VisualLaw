"use client";

import type { CSSProperties } from "react";
import type { LucideProps } from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  ClipboardPaste,
  ExternalLink,
  Eye,
  FileText,
  FolderOpen,
  Info,
  Languages,
  ListChecks,
  MinusCircle,
  Palette,
  PlayCircle,
  PlusCircle,
  Scissors,
  Search,
  ShieldCheck,
  Tag,
  Type,
  XCircle,
  Zap,
  Inbox,
} from "lucide-react";

export type IconName =
  | "shield-check"
  | "scissors"
  | "search"
  | "eye"
  | "zap"
  | "clipboard-paste"
  | "play-circle"
  | "external-link"
  | "chevron-down"
  | "x-circle"
  | "folder-open"
  | "plus-circle"
  | "inbox"
  | "file-text"
  | "palette"
  | "bookmark"
  | "clipboard-list"
  | "chevron-left"
  | "chevron-right"
  | "list-checks"
  | "tag"
  | "book-open"
  | "type"
  | "info"
  | "circle"
  | "alert-triangle"
  | "minus-circle"
  | "check-circle"
  | "briefcase"
  | "languages";

const ICONS = {
  "shield-check": ShieldCheck,
  scissors: Scissors,
  search: Search,
  eye: Eye,
  zap: Zap,
  "clipboard-paste": ClipboardPaste,
  "play-circle": PlayCircle,
  "external-link": ExternalLink,
  "chevron-down": ChevronDown,
  "x-circle": XCircle,
  "folder-open": FolderOpen,
  "plus-circle": PlusCircle,
  inbox: Inbox,
  "file-text": FileText,
  palette: Palette,
  bookmark: Bookmark,
  "clipboard-list": ClipboardList,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "list-checks": ListChecks,
  tag: Tag,
  "book-open": BookOpen,
  type: Type,
  info: Info,
  circle: Circle,
  "alert-triangle": AlertTriangle,
  "minus-circle": MinusCircle,
  "check-circle": CheckCircle2,
  briefcase: BriefcaseBusiness,
  languages: Languages,
} as const;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
}

export default function Icon({
  name,
  size = 16,
  className,
  style,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const LucideIcon = ICONS[name];
  return (
    <LucideIcon
      size={size}
      strokeWidth={1.75}
      className={className}
      style={style}
      aria-hidden={ariaHidden}
    />
  );
}
