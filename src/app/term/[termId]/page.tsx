import { notFound } from "next/navigation";
import type { LexiconEntry } from "@/lib/types";
import TermCard from "@/components/TermCard";

// ── importa léxico como módulo TS (dentro de src/) ──────
import { LEXICON } from "@/lib/lexicon-data";

const lexicon = LEXICON;

/* ── generateStaticParams (OBRIGATÓRIO para output: export) */
export function generateStaticParams() {
  return lexicon.map((entry) => ({
    termId: entry.term_id,
  }));
}

/* ── Metadata dinâmica ──────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const { termId } = await params;
  const entry = lexicon.find((e) => e.term_id === termId);
  return {
    title: entry
      ? `${entry.term} — Visual Law`
      : "Termo não encontrado — Visual Law",
  };
}

/* ── Page Component ─────────────────────────────────── */
export default async function TermPage({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const { termId } = await params;
  const entry = lexicon.find((e) => e.term_id === termId);

  if (!entry) {
    notFound();
  }

  return <TermCard entry={entry} />;
}
