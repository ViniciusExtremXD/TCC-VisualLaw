import { LEXICON_FAQ_BY_TERM } from "@/data/mock/lexicon";
import type { Category, FAQItem, LexiconEntry } from "@/lib/types";

const CATEGORY_FALLBACK: Record<Category, FAQItem[]> = {
  data_collection: [
    {
      q: "Quais dados estao sendo coletados?",
      a: "Verifique se o texto lista categorias de dados e se a coleta e proporcional a finalidade.",
      source: "heuristic",
    },
    {
      q: "Posso limitar a coleta?",
      a: "Avalie configuracoes de privacidade, opt-out de rastreadores e contato com o controlador.",
      source: "heuristic",
    },
    {
      q: "Coleta automatica precisa aviso?",
      a: "Sim. Cookies e trackers devem ser informados com finalidade e base legal.",
      source: "heuristic",
    },
  ],
  purpose_use: [
    {
      q: "A finalidade esta clara?",
      a: "A finalidade deve ser especifica e compreensivel, evitando termos vagos.",
      source: "heuristic",
    },
    {
      q: "Finalidade pode ser alterada?",
      a: "Mudancas relevantes exigem transparencia e, quando cabivel, nova base legal.",
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
      q: "Com quais terceiros os dados sao compartilhados?",
      a: "Procure categorias de terceiros e finalidades de cada repasse.",
      source: "heuristic",
    },
    {
      q: "Existe opcao de oposicao?",
      a: "Alguns compartilhamentos permitem opt-out; outros dependem de base contratual ou legal.",
      source: "heuristic",
    },
    {
      q: "Como documentar esse risco?",
      a: "Registre categoria, impacto e ausencia de transparência no relatorio de auditoria.",
      source: "heuristic",
    },
  ],
  retention_storage: [
    {
      q: "Qual e o prazo de retencao?",
      a: "O prazo deve ser indicado ou justificavel por obrigacao legal especifica.",
      source: "heuristic",
    },
    {
      q: "Depois da conta excluida os dados somem?",
      a: "Nem sempre. Verifique politica de descarte e backup.",
      source: "heuristic",
    },
    {
      q: "Como o titular comprova pedido de exclusao?",
      a: "Guarde protocolo da solicitacao e resposta do controlador.",
      source: "heuristic",
    },
  ],
  user_rights: [
    {
      q: "Quais direitos posso exercer?",
      a: "Acesso, correcao, eliminacao, portabilidade e informacoes sobre compartilhamento.",
      source: "heuristic",
    },
    {
      q: "Existe prazo para resposta?",
      a: "A empresa deve responder em prazo razoavel, com canal de atendimento identificavel.",
      source: "heuristic",
    },
    {
      q: "O pedido pode ser negado?",
      a: "Pode, mas a negativa deve ser fundamentada e auditavel.",
      source: "heuristic",
    },
  ],
  security_incidents: [
    {
      q: "Como saber se houve incidente?",
      a: "Procure clausulas de notificacao e planos de resposta a incidentes.",
      source: "heuristic",
    },
    {
      q: "A empresa informa medidas de seguranca?",
      a: "Textos robustos citam controles tecnicos e organizacionais.",
      source: "heuristic",
    },
    {
      q: "O que fazer apos notificacao de incidente?",
      a: "Trocar credenciais, revisar acessos e solicitar detalhes formais ao controlador.",
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
