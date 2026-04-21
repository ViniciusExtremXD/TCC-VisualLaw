import type { Category, Impact, LexiconEntry } from "./types";

const CATEGORY_TEMPLATES: Record<Category, string> = {
  data_collection:
    "Em linguagem simples, a cláusula informa quais dados a plataforma coleta e em que momento isso acontece.",
  purpose_use:
    "Em linguagem simples, a cláusula explica para que a plataforma usa os dados e qual finalidade declara para esse uso.",
  sharing_third_parties:
    "Em linguagem simples, a cláusula informa com quem os dados podem ser compartilhados e em quais cenários isso ocorre.",
  retention_storage:
    "Em linguagem simples, a cláusula descreve por quanto tempo os dados podem continuar guardados e em que condições podem ser apagados ou anonimizados.",
  user_rights:
    "Em linguagem simples, a cláusula apresenta direitos do titular e como o usuário pode agir diante da plataforma.",
  security_incidents:
    "Em linguagem simples, a cláusula descreve medidas de proteção e o que a empresa promete fazer diante de incidentes de segurança.",
};

const IMPACT_NOTES: Record<Impact, string> = {
  high:
    "O impacto foi classificado como alto porque a cláusula pode alterar privacidade, controle sobre dados ou exposição a risco.",
  medium:
    "O impacto foi classificado como médio porque a cláusula afeta privacidade ou uso da plataforma, mas com efeito menos imediato.",
  low:
    "O impacto foi classificado como baixo porque a cláusula é mais informativa do que decisiva para risco imediato.",
};

function compactSentence(value: string): string {
  return value.replace(/\s+/g, " ").trim().replace(/[.;:]+$/g, "");
}

export function summarizeClausePlainLanguage(input: {
  category: Category;
  impact: Impact;
  lgpdRefs: string[];
  matchedEntries: LexiconEntry[];
  existingSummary?: string;
}): string {
  if (input.existingSummary?.trim()) {
    return input.existingSummary.trim();
  }

  const highlightedTerms = input.matchedEntries.slice(0, 3).map((entry) => {
    const translation = compactSentence(entry.traducao_direta);
    return `${entry.term}: ${translation}`;
  });

  const termsSnippet =
    highlightedTerms.length > 0 ? ` Termos-chave: ${highlightedTerms.join("; ")}.` : "";

  const lgpdSnippet =
    input.lgpdRefs.length > 0
      ? ` Direitos LGPD relacionados: ${input.lgpdRefs.join(", ")}.`
      : "";

  return `${CATEGORY_TEMPLATES[input.category]} ${IMPACT_NOTES[input.impact]}${termsSnippet}${lgpdSnippet}`;
}
