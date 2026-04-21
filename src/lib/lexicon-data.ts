import academicLexicon from "../../data/lexicon/lexicon.json";
import { LEXICON_FAQ_BY_TERM } from "../data/mock/lexicon";
import type { AcademicLexiconRecord, Category, LexiconEntry } from "./types";

const ACADEMIC_LEXICON = academicLexicon as AcademicLexiconRecord[];

const CATEGORY_WHY: Record<Category, string> = {
  data_collection:
    "A cláusula descreve quais dados entram no ecossistema da plataforma e, portanto, define a superfície inicial de exposição do titular.",
  purpose_use:
    "A cláusula esclarece para que os dados são usados e permite avaliar se a finalidade declarada é proporcional ao tratamento realizado.",
  sharing_third_parties:
    "A cláusula indica circulação de dados fora do controle direto do titular, o que amplia risco, assimetria informacional e dificuldade de oposição.",
  retention_storage:
    "A cláusula revela por quanto tempo os dados permanecem armazenados e se existe política de descarte minimamente verificável.",
  user_rights:
    "A cláusula informa se o titular tem meios concretos para exercer direitos previstos na LGPD e contestar usos indevidos.",
  security_incidents:
    "A cláusula mostra se a plataforma reconhece riscos de segurança, comunica incidentes e adota medidas mínimas de proteção.",
};

const CATEGORY_ACTION: Record<Category, string> = {
  data_collection:
    "Na leitura guiada, observe o volume de coleta, a necessidade do dado e se o participante consegue apontar o que está sendo obtido.",
  purpose_use:
    "Na validação, verifique se a tradução permite ao participante explicar a finalidade, a base declarada e eventual excesso de uso.",
  sharing_third_parties:
    "Na prova de conceito, o usuário deve conseguir identificar com quem os dados podem ser compartilhados e qual o impacto prático disso.",
  retention_storage:
    "Na avaliação, o participante deve conseguir localizar prazo de guarda, descarte ou ausência dessa informação.",
  user_rights:
    "O leitor deve sair da tela sabendo qual direito pode exercer, por qual canal e em que situação isso faz sentido.",
  security_incidents:
    "Use a cláusula para avaliar se o participante reconhece sinais de risco, resposta a incidente e ausência de medidas concretas.",
};

function decodeMojibake(value: string): string {
  if (!/(Ã|Â|â|�)/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded || value;
  } catch {
    return value;
  }
}

function sanitizeText(value: string | undefined): string {
  return decodeMojibake(String(value ?? ""))
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeList(values: string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => sanitizeText(value)).filter(Boolean))];
}

function buildWhyItMatters(entry: AcademicLexiconRecord): string {
  const base = CATEGORY_WHY[entry.categoria];
  const impactText =
    entry.nivel_impacto === "high"
      ? "O impacto metodológico deste termo é alto porque ele afeta compreensão de risco, direito ou compartilhamento."
      : entry.nivel_impacto === "medium"
        ? "O impacto metodológico deste termo é médio porque ele contextualiza governança e uso dos dados."
        : "O impacto metodológico deste termo é baixo, mas ainda contribui para leitura guiada e transparência.";

  return `${base} ${impactText}`;
}

function buildWhatYouCanDo(entry: AcademicLexiconRecord): string {
  const refs = sanitizeList(entry.direito_lgpd_relacionado);
  const rightsText =
    refs.length > 0
      ? `Use esta explicação para relacionar o termo aos dispositivos ${refs.join(", ")} da LGPD.`
      : "Use esta explicação para discutir transparência, necessidade e possibilidade de oposição pelo titular.";

  return `${CATEGORY_ACTION[entry.categoria]} ${rightsText}`;
}

export const LEXICON: LexiconEntry[] = ACADEMIC_LEXICON.map((entry) => ({
  term_id: entry.term_id,
  term: sanitizeText(entry.termo_juridico),
  aliases: sanitizeList(entry.aliases ?? entry.palavras_chave_relacionadas),
  category: entry.categoria,
  traducao_direta: sanitizeText(entry.traducao_direta),
  meaning: sanitizeText(entry.definicao_leiga),
  why_it_matters: buildWhyItMatters(entry),
  what_you_can_do: buildWhatYouCanDo(entry),
  exemplo_pratico: sanitizeText(entry.exemplo_pratico),
  impact: entry.nivel_impacto,
  icon_id: sanitizeText(entry.icone_id),
  lgpd_refs: sanitizeList(entry.lgpd_refs ?? entry.direito_lgpd_relacionado),
  faqs: LEXICON_FAQ_BY_TERM[entry.term_id],
  observacao_metodologica: entry.observacao_metodologica
    ? sanitizeText(entry.observacao_metodologica)
    : undefined,
}));
