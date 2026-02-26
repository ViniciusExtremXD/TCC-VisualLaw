"use client";

import type { LexiconEntry, TermEvidence } from "@/lib/types";
import TermCard from "@/components/TermCard";
import Sheet from "@/ui/components/Sheet";

interface TermCardModalProps {
  entry: LexiconEntry;
  evidence?: TermEvidence | null;
  onClose: () => void;
}

export default function TermCardModal({ entry, evidence, onClose }: TermCardModalProps) {
  return (
    <Sheet
      open
      onClose={onClose}
      title={entry.term}
      subtitle={entry.term_id}
      testId="term-card-sheet"
      maxWidth={900}
    >
      <TermCard entry={entry} evidence={evidence} mode="modal" />
    </Sheet>
  );
}
