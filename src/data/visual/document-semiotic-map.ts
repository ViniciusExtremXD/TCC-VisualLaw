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
    label: "Política de privacidade",
    primary_icon: "bi-shield-lock",
    icon_justification:
      "O escudo representa proteção e governança de dados pessoais ao longo de todo o ciclo de tratamento.",
    target_categories: [
      "data_collection",
      "purpose_use",
      "sharing_third_parties",
      "retention_storage",
      "user_rights",
      "security_incidents",
    ],
    rule_summary:
      "Política de privacidade prioriza coleta, finalidade, compartilhamento, retenção, direitos e segurança.",
  },
  terms: {
    doc_type: "terms",
    label: "Termos de serviço",
    primary_icon: "bi-journal-text",
    icon_justification:
      "O símbolo de documento representa regras contratuais, obrigações e limites de uso da plataforma.",
    target_categories: [
      "purpose_use",
      "sharing_third_parties",
      "retention_storage",
      "user_rights",
    ],
    rule_summary:
      "Termos de serviço priorizam finalidade de uso, condições de compartilhamento, retenção contratual e direitos.",
  },
  cookies: {
    doc_type: "cookies",
    label: "Política de cookies",
    primary_icon: "bi-cookie",
    icon_justification:
      "O ícone de cookie sinaliza rastreamento de navegação e configurações de publicidade comportamental.",
    target_categories: ["data_collection", "purpose_use", "sharing_third_parties"],
    rule_summary:
      "Política de cookies prioriza rastreadores, finalidades de personalização e compartilhamento com parceiros de ads.",
  },
  other: {
    doc_type: "other",
    label: "Documento geral",
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
      "Documento geral usa mapeamento completo para não perder evidências de classificação e highlights.",
  },
};

const PLATFORM_RULES: PlatformRule[] = [
  {
    platform: "X",
    extra_categories: ["sharing_third_parties"],
    note: "Plataformas de ads e recomendação elevam foco em compartilhamento e finalidade publicitária.",
  },
  {
    platform: "Meta",
    extra_categories: ["sharing_third_parties", "security_incidents"],
    note: "Ecossistema multiproduto requer rastreabilidade de integrações e controles de segurança.",
  },
  {
    platform: "WhatsApp",
    extra_categories: ["security_incidents", "user_rights"],
    note: "Mensageria exige ênfase em segurança, transparência e direitos sobre metadados.",
  },
  {
    platform: "Instagram",
    extra_categories: ["purpose_use", "sharing_third_parties"],
    note: "Plataforma orientada a conteúdo e anúncios reforça finalidade de uso e compartilhamento.",
  },
  {
    platform: "Facebook",
    extra_categories: ["sharing_third_parties", "retention_storage"],
    note: "Histórico e amplitude de dados elevam relevância de retenção e terceiros.",
  },
];

export const PROCESS_SEMIOTIC_STEPS: ProcessStepDefinition[] = [
  {
    id: "P1_INGEST",
    title: "Ingestão",
    objective: "Registrar o texto de origem e metadados do documento.",
    input: "Texto bruto + documento selecionado",
    output: "Sessão de processamento inicial",
    evidence: "doc_id, plataforma, tipo, timestamp",
  },
  {
    id: "P2_SEGMENT",
    title: "Segmentação",
    objective: "Quebrar o texto em cláusulas auditáveis.",
    input: "Texto bruto",
    output: "Lista de cláusulas com clause_id",
    evidence: "regra de split + evidência de segmentação",
  },
  {
    id: "P3_CLASSIFY",
    title: "Classificação",
    objective: "Atribuir categoria e impacto por heurísticas explícitas.",
    input: "Cláusula normalizada",
    output: "Categoria, impacto e score por regra",
    evidence: "rules_fired, keywords, score",
  },
  {
    id: "P4_LEXICON",
    title: "Léxico",
    objective: "Detectar termos jurídicos e origem do match.",
    input: "Texto da cláusula",
    output: "Highlights com offsets",
    evidence: "term_id, start/end, lookup provenance",
  },
  {
    id: "P5_SEMIOTIC",
    title: "Semiótica",
    objective: "Mapear categoria e impacto para signos visuais justificáveis.",
    input: "Categoria e impacto",
    output: "Ícone, badge e justificativa",
    evidence: "regra categoria->ícone e impacto->interpretação",
  },
  {
    id: "P6_VISUAL_CARD",
    title: "Card Visual Law",
    objective: "Apresentar explicação completa e ação orientada ao usuário.",
    input: "Termo identificado + léxico",
    output: "Card acadêmico com FAQ",
    evidence: "meaning, why, action, FAQ",
  },
  {
    id: "P7_AUDIT_REPORT",
    title: "Auditoria e relatório",
    objective: "Consolidar rastreabilidade em evidências exportáveis.",
    input: "Pipeline + cláusulas + termos",
    output: "Relatório em PDF",
    evidence: "timeline da sessão + apêndice semiótico",
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
