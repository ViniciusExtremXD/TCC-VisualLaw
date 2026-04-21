import type { Category, Clause } from "./types";

interface ClauseInsight {
  whyItMatters: string;
  practicalConsequence: string;
  validationHint: string;
}

const WHY_BY_CATEGORY: Record<Category, string> = {
  data_collection:
    "Esta cláusula define quais dados entram no tratamento e quais sinais de rastreamento a plataforma considera legítimos.",
  purpose_use:
    "Esta cláusula explica a finalidade declarada e ajuda a verificar se o uso descrito é proporcional ao dado coletado.",
  sharing_third_parties:
    "Esta cláusula é sensível porque expande o fluxo de dados para outras entidades e reduz o controle perceptível do titular.",
  retention_storage:
    "Esta cláusula importa porque prazo de guarda e descarte afetam risco acumulado e conformidade com necessidade e minimização.",
  user_rights:
    "Esta cláusula é central para o TCC porque conecta o juridiquês aos direitos práticos que o titular pode exercer.",
  security_incidents:
    "Esta cláusula trata de risco, resposta a incidente e medidas de proteção, elementos essenciais para leitura crítica.",
};

const CONSEQUENCE_BY_CATEGORY: Record<Category, string> = {
  data_collection:
    "Se a coleta for ampla, o usuário pode fornecer mais dados do que imagina e dificultar revogação posterior.",
  purpose_use:
    "Finalidades vagas permitem expansão de uso para marketing, perfilamento ou publicidade sem percepção clara do usuário.",
  sharing_third_parties:
    "O compartilhamento com terceiros pode multiplicar destinatários, tornar a oposição mais difícil e aumentar risco de exposição.",
  retention_storage:
    "Sem prazo claro, os dados podem continuar armazenados após o fim da relação, ampliando superfície de risco e reutilização.",
  user_rights:
    "Quando os direitos aparecem de forma confusa, o titular tende a não exercer acesso, exclusão, portabilidade ou oposição.",
  security_incidents:
    "Cláusulas vagas sobre segurança podem esconder ausência de controles concretos ou de procedimentos de notificação.",
};

function impactLabel(impact: Clause["impact"]): string {
  return impact === "high" ? "alto" : impact === "medium" ? "médio" : "baixo";
}

export function buildClauseInsight(clause: Clause): ClauseInsight {
  const detectedTerms =
    clause.detected_terms.length > 0
      ? `Termos detectados nesta leitura: ${clause.detected_terms.join(", ")}.`
      : "Não houve termo do léxico explicitamente destacado nesta cláusula.";

  const lgpdHint =
    clause.lgpd_refs.length > 0
      ? `Na prova de conceito, o participante deve conseguir associar a cláusula aos dispositivos ${clause.lgpd_refs.join(", ")}.`
      : "Na prova de conceito, observe se o participante consegue descrever o direito ou risco envolvido mesmo sem referência normativa explícita.";

  return {
    whyItMatters: `${WHY_BY_CATEGORY[clause.category]} O impacto atribuído pelo MVP é ${impactLabel(clause.impact)}.`,
    practicalConsequence: `${CONSEQUENCE_BY_CATEGORY[clause.category]} ${detectedTerms}`,
    validationHint: `${lgpdHint} Isso ajuda a comparar texto original versus linguagem simples na avaliação de compreensão.`,
  };
}
