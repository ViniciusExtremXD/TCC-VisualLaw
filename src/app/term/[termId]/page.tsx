import { notFound } from "next/navigation";
import TermCard from "@/components/TermCard";
import { LEXICON } from "@/lib/lexicon-data";

const lexicon = LEXICON;

export function generateStaticParams() {
  return lexicon.map((entry) => ({
    termId: entry.term_id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const { termId } = await params;
  const entry = lexicon.find((item) => item.term_id === termId);

  return {
    title: entry ? `${entry.term} - Visual Law` : "Termo não encontrado - Visual Law",
  };
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const { termId } = await params;
  const entry = lexicon.find((item) => item.term_id === termId);

  if (!entry) {
    notFound();
  }

  return <TermCard entry={entry} />;
}
