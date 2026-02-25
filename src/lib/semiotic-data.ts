import type { ImpactSemioticEntry, SemioticEntry } from "./types";

export const SEMIOTIC_MAP: SemioticEntry[] = [
  {
    category: "data_collection",
    icon_id: "user-circle",
    icon_label: "Dados pessoais",
    color: "#3B82F6",
    significance:
      "O ícone de pessoa representa a identidade digital do titular e a esfera de proteção dos seus dados.",
    impact_interpretation:
      "Impacto alto quando envolve identificadores diretos ou dados sensíveis; médio em dados comportamentais; baixo em dados agregados.",
  },
  {
    category: "purpose_use",
    icon_id: "target",
    icon_label: "Finalidade",
    color: "#0EA5E9",
    significance:
      "O alvo representa a exigência de finalidade específica: dados devem ser tratados para um objetivo claro e verificável.",
    impact_interpretation:
      "Impacto alto para finalidades vagas; médio para finalidades amplas; baixo para finalidades objetivas e limitadas.",
  },
  {
    category: "sharing_third_parties",
    icon_id: "share-2",
    icon_label: "Compartilhamento",
    color: "#EF4444",
    significance:
      "As setas de compartilhamento indicam saída de dados para terceiros e aumento do risco de perda de controle.",
    impact_interpretation:
      "Impacto alto sem transparência ou base legal clara; médio quando há base contratual; baixo em obrigação legal explícita.",
  },
  {
    category: "retention_storage",
    icon_id: "clock",
    icon_label: "Retenção",
    color: "#64748B",
    significance:
      "O relógio simboliza o tempo de exposição dos dados e a necessidade de prazo definido para eliminação.",
    impact_interpretation:
      "Impacto alto sem prazo definido; médio com prazo genérico; baixo quando há política de descarte clara.",
  },
  {
    category: "user_rights",
    icon_id: "check-circle",
    icon_label: "Direitos do titular",
    color: "#22C55E",
    significance:
      "O check simboliza agência do titular para acessar, corrigir, excluir e portar seus dados.",
    impact_interpretation:
      "Impacto alto quando o texto facilita exercício de direitos; médio para menção genérica; baixo quando omite procedimentos.",
  },
  {
    category: "security_incidents",
    icon_id: "alert-triangle",
    icon_label: "Incidentes de segurança",
    color: "#DC2626",
    significance:
      "O triângulo de alerta indica risco concreto à confidencialidade, integridade e disponibilidade dos dados.",
    impact_interpretation:
      "Impacto alto em menção a incidentes ou ausência de medidas; médio com medidas genéricas; baixo com controles técnicos objetivos.",
  },
];

export const IMPACT_SEMIOTIC_MAP: ImpactSemioticEntry[] = [
  {
    impact: "high",
    label: "Alto",
    icon: "bi-exclamation-triangle-fill",
    color: "#DC2626",
    interpretation:
      "Risco significativo para privacidade e autodeterminação informativa. Requer leitura crítica imediata.",
  },
  {
    impact: "medium",
    label: "Médio",
    icon: "bi-dash-circle-fill",
    color: "#D97706",
    interpretation:
      "Risco moderado. Exige avaliação de contexto, base legal e possibilidade de opt-out.",
  },
  {
    impact: "low",
    label: "Baixo",
    icon: "bi-check-circle-fill",
    color: "#16A34A",
    interpretation:
      "Risco reduzido no texto analisado, sem eliminar necessidade de monitoramento.",
  },
];
