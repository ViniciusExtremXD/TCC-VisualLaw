import type {
  Category,
  DocumentRecord,
  DocumentSemanticProfile,
  ProcessStepDefinition,
} from "@/lib/types";

interface PlatformRule {
  platform: string;
  extra_categories: Category[];
  note: string;
}

const DOC_TYPE_SEMANTICS: Record<
  DocumentSemanticProfile["doc_type"],
  DocumentSemanticProfile
> = {
  privacy: {
    doc_type: "privacy",
    label: "Politica de Privacidade",
    primary_icon: "bi-shield-lock",
    icon_justification:
      "O escudo representa protecao e governanca de dados pessoais ao longo de todo o ciclo de tratamento.",
    target_categories: [
      "data_collection",
      "purpose_use",
      "sharing_third_parties",
      "retention_storage",
      "user_rights",
      "security_incidents",
    ],
    rule_summary:
      "Politica de Privacidade prioriza Coleta, Finalidade, Compartilhamento, Retencao, Direitos e Seguranca.",
  },
  terms: {
    doc_type: "terms",
    label: "Termos de Servico",
    primary_icon: "bi-journal-text",
    icon_justification:
      "O simbolo de documento representa regras contratuais, obrigacoes e limites de uso da plataforma.",
    target_categories: [
      "purpose_use",
      "sharing_third_parties",
      "retention_storage",
      "user_rights",
    ],
    rule_summary:
      "Termos de Servico priorizam Finalidade de uso, condicoes de compartilhamento, retencao contratual e direitos.",
  },
  cookies: {
    doc_type: "cookies",
    label: "Politica de Cookies",
    primary_icon: "bi-cookie",
    icon_justification:
      "O icone de cookie sinaliza rastreamento de navegacao e configuracoes de publicidade comportamental.",
    target_categories: ["data_collection", "purpose_use", "sharing_third_parties"],
    rule_summary:
      "Politica de Cookies prioriza rastreadores, finalidades de personalizacao e compartilhamento com parceiros de ads.",
  },
  other: {
    doc_type: "other",
    label: "Documento Geral",
    primary_icon: "bi-files",
    icon_justification:
      "O conjunto de arquivos representa um documento sem tipologia fechada, exigindo leitura categoria por categoria.",
    target_categories: [
      "data_collection",
      "purpose_use",
      "sharing_third_parties",
      "retention_storage",
      "user_rights",
      "security_incidents",
    ],
    rule_summary:
      "Documento geral usa mapeamento completo para nao perder evidencias de classificacao e highlights.",
  },
};

const PLATFORM_RULES: PlatformRule[] = [
  {
    platform: "X",
    extra_categories: ["sharing_third_parties"],
    note: "Plataformas de ads e recomendacao elevam foco em compartilhamento e finalidade publicitaria.",
  },
  {
    platform: "Meta",
    extra_categories: ["sharing_third_parties", "security_incidents"],
    note: "Ecossistema multi-produto requer rastreabilidade de integracoes e controles de seguranca.",
  },
  {
    platform: "WhatsApp",
    extra_categories: ["security_incidents", "user_rights"],
    note: "Mensageria exige enfase em seguranca, transparencia e direitos sobre metadados.",
  },
  {
    platform: "Instagram",
    extra_categories: ["purpose_use", "sharing_third_parties"],
    note: "Plataforma orientada a conteudo e anuncios reforca finalidade de uso e compartilhamento.",
  },
  {
    platform: "Facebook",
    extra_categories: ["sharing_third_parties", "retention_storage"],
    note: "Historico e amplitude de dados elevam relevancia de retencao e terceiros.",
  },
];

export const PROCESS_SEMIOTIC_STEPS: ProcessStepDefinition[] = [
  {
    id: "P1_INGEST",
    title: "Ingestao",
    objective: "Registrar o texto de origem e metadados do documento.",
    input: "Texto bruto + documento selecionado",
    output: "Sessao de processamento inicial",
    evidence: "doc_id, plataforma, tipo, timestamp",
  },
  {
    id: "P2_SEGMENT",
    title: "Segmentacao",
    objective: "Quebrar o texto em clausulas auditaveis.",
    input: "Texto bruto",
    output: "Lista de clausulas com clause_id",
    evidence: "regra de split + evidencia de segmentacao",
  },
  {
    id: "P3_CLASSIFY",
    title: "Classificacao",
    objective: "Atribuir categoria e impacto por heuristicas explicitas.",
    input: "Clausula normalizada",
    output: "Categoria, impacto e score por regra",
    evidence: "rules_fired, keywords, score",
  },
  {
    id: "P4_LEXICON",
    title: "Lexico",
    objective: "Detectar termos juridicos e origem do match.",
    input: "Texto da clausula",
    output: "Highlights com offsets",
    evidence: "term_id, start/end, lookup provenance",
  },
  {
    id: "P5_SEMIOTIC",
    title: "Semiotica",
    objective: "Mapear categoria e impacto para signos visuais justificaveis.",
    input: "Categoria e impacto",
    output: "Icone, badge e justificativa",
    evidence: "regra categoria->icone e impacto->interpretacao",
  },
  {
    id: "P6_VISUAL_CARD",
    title: "Card Visual Law",
    objective: "Apresentar explicacao completa e acao orientada ao usuario.",
    input: "Termo identificado + lexico",
    output: "Card academico com FAQ",
    evidence: "meaning, why, action, FAQ",
  },
  {
    id: "P7_AUDIT_REPORT",
    title: "Auditoria e Relatorio",
    objective: "Consolidar rastreabilidade em evidencias exportaveis.",
    input: "Pipeline + clausulas + termos",
    output: "Relatorio printavel/PDF",
    evidence: "timeline da sessao + apendice semiotico",
  },
];

export function getDocumentSemanticProfile(
  document: Pick<DocumentRecord, "type" | "platform">
): { profile: DocumentSemanticProfile; platformNote?: string; categories: Category[] } {
  const profile = DOC_TYPE_SEMANTICS[document.type] ?? DOC_TYPE_SEMANTICS.other;
  const rule = PLATFORM_RULES.find(
    (entry) => entry.platform.toLowerCase() === document.platform.toLowerCase()
  );

  const categories = new Set<Category>(profile.target_categories);
  if (rule) {
    for (const category of rule.extra_categories) {
      categories.add(category);
    }
  }

  return {
    profile,
    platformNote: rule?.note,
    categories: Array.from(categories),
  };
}

export const DOCUMENT_SEMIOTIC_MAP = {
  doc_type_semantics: DOC_TYPE_SEMANTICS,
  platform_rules: PLATFORM_RULES,
};
