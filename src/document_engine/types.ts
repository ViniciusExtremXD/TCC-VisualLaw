import type { DocumentRecord, DocumentType } from "@/lib/types";

export interface PaperItem {
  id: string;
  title: string;
  content: string;
  source: string;
  kind: DocumentType;
  locale: string;
  stamp: string;
  link: string;
  groupId: string;
  description: string;
}

export interface PaperGroup {
  id: string;
  label: string;
  hint: string;
  accent: string;
  documents: PaperItem[];
}

export function toSessionDocument(paper: PaperItem | null): DocumentRecord | null {
  if (!paper) {
    return null;
  }

  return {
    doc_id: paper.id,
    name: paper.title,
    type: paper.kind,
    platform: paper.source,
    language: paper.locale,
    url: paper.link,
    last_updated: paper.stamp,
    content: paper.content,
    status: "active",
  };
}
