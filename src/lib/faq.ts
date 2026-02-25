import { LEXICON_FAQ_BY_TERM } from "@/data/mock/lexicon";
import type { Category, FAQItem, LexiconEntry } from "@/lib/types";

const CATEGORY_FALLBACK: Record<Category, FAQItem[]> = {
  data_collection: [
    {
      q: "Quais dados estão sendo coletados?",
      a: "Verifique se o texto lista categorias de dados e se a coleta é proporcional à finalidade.",
      source: "heuristic",
    },
    {
      q: "Posso limitar a coleta?",
      a: "Avalie configurações de privacidade, opt-out de rastreadores e contato com o controlador.",
      source: "heuristic",
    },
    {
      q: "Coleta automática precisa aviso?",
      a: "Sim. Cookies e trackers devem ser informados com finalidade e base legal.",
      source: "heuristic",
    },
  ],
  purpose_use: [
    {
      q: "A finalidade está clara?",
      a: "A finalidade deve ser específica e compreensível, evitando termos vagos.",
      source: "heuristic",
    },
    {
      q: "Finalidade pode ser alterada?",
      a: "Mudanças relevantes exigem transparência e, quando cabível, nova base legal.",
      source: "heuristic",
    },
    {
      q: "Como avaliar excesso de finalidade?",
      a: "Compare objetivo declarado com volume de dados e compartilhamentos descritos.",
      source: "heuristic",
    },
  ],
  sharing_third_parties: [
    {
      q: "Com quais terceiros os dados são compartilhados?",
      a: "Procure categorias de terceiros e finalidades de cada repasse.",
      source: "heuristic",
    },
    {
      q: "Existe opção de oposição?",
      a: "Alguns compartilhamentos permitem opt-out; outros dependem de base contratual ou legal.",
      source: "heuristic",
    },
    {
      q: "Como documentar esse risco?",
      a: "Registre categoria, impacto e ausência de transparência no relatório de auditoria.",
      source: "heuristic",
    },
  ],
  retention_storage: [
    {
      q: "Qual é o prazo de retenção?",
      a: "O prazo deve ser indicado ou justificável por obrigação legal específica.",
      source: "heuristic",
    },
    {
      q: "Depois da conta excluída os dados somem?",
      a: "Nem sempre. Verifique política de descarte e backup.",
      source: "heuristic",
    },
    {
      q: "Como o titular comprova pedido de exclusão?",
      a: "Guarde protocolo da solicitação e resposta do controlador.",
      source: "heuristic",
    },
  ],
  user_rights: [
    {
      q: "Quais direitos posso exercer?",
      a: "Acesso, correção, eliminação, portabilidade e informações sobre compartilhamento.",
      source: "heuristic",
    },
    {
      q: "Existe prazo para resposta?",
      a: "A empresa deve responder em prazo razoável, com canal de atendimento identificável.",
      source: "heuristic",
    },
    {
      q: "O pedido pode ser negado?",
      a: "Pode, mas a negativa deve ser fundamentada e auditável.",
      source: "heuristic",
    },
  ],
  security_incidents: [
    {
      q: "Como saber se houve incidente?",
      a: "Procure cláusulas de notificação e planos de resposta a incidentes.",
      source: "heuristic",
    },
    {
      q: "A empresa informa medidas de segurança?",
      a: "Textos robustos citam controles técnicos e organizacionais.",
      source: "heuristic",
    },
    {
      q: "O que fazer após notificação de incidente?",
      a: "Troque credenciais, revise acessos e solicite detalhes formais ao controlador.",
      source: "heuristic",
    },
  ],
};

export function resolveTermFaqs(entry: LexiconEntry): FAQItem[] {
  if (entry.faqs && entry.faqs.length >= 3) {
    return entry.faqs.slice(0, 6);
  }

  const lexiconFaq = LEXICON_FAQ_BY_TERM[entry.term_id];
  if (lexiconFaq && lexiconFaq.length >= 3) {
    return lexiconFaq.slice(0, 6);
  }

  return CATEGORY_FALLBACK[entry.category].slice(0, 6);
}
