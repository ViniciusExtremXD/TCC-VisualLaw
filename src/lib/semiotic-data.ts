/* Mapa semiótico — módulo TS dentro de src/ para evitar chunks webpack quebrados */
import type { SemioticEntry } from "./types";

export const SEMIOTIC_MAP: SemioticEntry[] = [
  {
    category: "data_collection",
    icon_id: "user-circle",
    icon_label: "Dados Pessoais",
    color: "#3B82F6",
    significance: "O ícone de pessoa em círculo representa a identidade digital do usuário — os dados pessoais são a projeção do indivíduo no meio digital, e o círculo delimita a esfera de proteção da privacidade.",
    impact_interpretation: "Impacto alto quando envolve dados sensíveis ou identificadores diretos (CPF, biometria). Médio para dados comportamentais (cookies, navegação). Baixo para dados agregados.",
  },
  {
    category: "purpose_use",
    icon_id: "target",
    icon_label: "Finalidade do Tratamento",
    color: "#0EA5E9",
    significance: "O alvo (target) simboliza a intencionalidade e precisão que a LGPD exige para o tratamento de dados — toda coleta deve ter propósito definido, assim como uma flecha deve ter destino certo.",
    impact_interpretation: "Impacto alto quando finalidades são vagas ou excessivamente amplas. Médio quando bem definidas mas abrangentes. Baixo quando específicas e limitadas.",
  },
  {
    category: "sharing_third_parties",
    icon_id: "share-2",
    icon_label: "Compartilhamento",
    color: "#EF4444",
    significance: "O ícone de compartilhamento (setas divergentes) representa a dispersão de dados para fora do controle direto do titular — a cor vermelha sinaliza risco, pois dados compartilhados multiplicam pontos de vulnerabilidade.",
    impact_interpretation: "Impacto alto quando dados são cedidos a terceiros sem consentimento granular. Médio quando há justificativa contratual. Baixo quando restrito a obrigações legais.",
  },
  {
    category: "retention_storage",
    icon_id: "clock",
    icon_label: "Retenção / Armazenamento",
    color: "#64748B",
    significance: "O relógio representa a dimensão temporal do tratamento de dados — quanto mais tempo os dados são retidos, maior a janela de exposição a riscos. A cor neutra (cinza) indica que retenção não é intrinsecamente boa ou má, mas depende do prazo.",
    impact_interpretation: "Impacto alto quando não há prazo definido ou retenção excede a finalidade. Médio quando há prazo razoável. Baixo quando há política clara de eliminação.",
  },
  {
    category: "user_rights",
    icon_id: "check-circle",
    icon_label: "Direitos do Titular",
    color: "#22C55E",
    significance: "O check em círculo verde representa a validação e o empoderamento do titular — a confirmação de que o usuário possui agência sobre seus dados. Verde sinaliza aspecto positivo: são garantias a favor do cidadão.",
    impact_interpretation: "Impacto alto quando direitos são mencionados explicitamente (acesso, exclusão, portabilidade). Médio quando mencionados genericamente. Baixo quando se referem a direitos básicos já implícitos.",
  },
  {
    category: "security_incidents",
    icon_id: "alert-triangle",
    icon_label: "Segurança / Incidentes",
    color: "#DC2626",
    significance: "O triângulo de alerta é um signo universal de perigo e atenção — aplicado à segurança de dados, representa a vulnerabilidade e a necessidade de vigilância constante. A cor vermelha reforça a urgência.",
    impact_interpretation: "Impacto alto quando há menção a incidentes, vazamentos ou ausência de medidas de segurança. Médio quando descreve medidas genéricas. Baixo quando detalha medidas técnicas específicas.",
  },
];
