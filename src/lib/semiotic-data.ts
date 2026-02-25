import type { ImpactSemioticEntry, SemioticEntry } from "./types";

export const SEMIOTIC_MAP: SemioticEntry[] = [
  {
    category: "data_collection",
    icon_id: "user-circle",
    icon_label: "Dados Pessoais",
    color: "#3B82F6",
    significance:
      "O icone de pessoa representa a identidade digital do titular e a esfera de protecao dos seus dados.",
    impact_interpretation:
      "Impacto alto quando envolve identificadores diretos ou dados sensiveis; medio em dados comportamentais; baixo em dados agregados.",
  },
  {
    category: "purpose_use",
    icon_id: "target",
    icon_label: "Finalidade",
    color: "#0EA5E9",
    significance:
      "O alvo representa a exigencia de finalidade especifica: dados devem ser tratados para um objetivo claro e verificavel.",
    impact_interpretation:
      "Impacto alto para finalidades vagas; medio para finalidades amplas; baixo para finalidades objetivas e limitadas.",
  },
  {
    category: "sharing_third_parties",
    icon_id: "share-2",
    icon_label: "Compartilhamento",
    color: "#EF4444",
    significance:
      "As setas de compartilhamento indicam saida de dados para terceiros e aumento do risco de perda de controle.",
    impact_interpretation:
      "Impacto alto sem transparencia ou base legal clara; medio quando ha base contratual; baixo em obrigacao legal explicita.",
  },
  {
    category: "retention_storage",
    icon_id: "clock",
    icon_label: "Retencao",
    color: "#64748B",
    significance:
      "O relogio simboliza o tempo de exposicao dos dados e a necessidade de prazo definido para eliminacao.",
    impact_interpretation:
      "Impacto alto sem prazo definido; medio com prazo generico; baixo quando ha politica de descarte clara.",
  },
  {
    category: "user_rights",
    icon_id: "check-circle",
    icon_label: "Direitos do Titular",
    color: "#22C55E",
    significance:
      "O check simboliza agencia do titular para acessar, corrigir, excluir e portar seus dados.",
    impact_interpretation:
      "Impacto alto quando o texto facilita exercicio de direitos; medio para mencao generica; baixo quando omite procedimentos.",
  },
  {
    category: "security_incidents",
    icon_id: "alert-triangle",
    icon_label: "Incidentes de Seguranca",
    color: "#DC2626",
    significance:
      "O triangulo de alerta indica risco concreto a confidencialidade, integridade e disponibilidade dos dados.",
    impact_interpretation:
      "Impacto alto em mencao a incidentes ou ausencia de medidas; medio com medidas genericas; baixo com controles tecnicos objetivos.",
  },
];

export const IMPACT_SEMIOTIC_MAP: ImpactSemioticEntry[] = [
  {
    impact: "high",
    label: "Alto",
    icon: "bi-exclamation-triangle-fill",
    color: "#DC2626",
    interpretation:
      "Risco significativo para privacidade e autodeterminacao informativa. Requer leitura critica imediata.",
  },
  {
    impact: "medium",
    label: "Medio",
    icon: "bi-dash-circle-fill",
    color: "#D97706",
    interpretation:
      "Risco moderado. Exige avaliacao de contexto, base legal e possibilidade de opt-out.",
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
