import type { FAQItem } from "@/lib/types";

export const LEXICON_FAQ_BY_TERM: Record<string, FAQItem[]> = {
  TERM_001: [
    {
      q: "O que entra como dado pessoal?",
      a: "Qualquer informação que identifique ou torne a pessoa identificável, isoladamente ou em combinação.",
      source: "lexicon",
    },
    {
      q: "Dados anonimizados ainda são pessoais?",
      a: "Se houver possibilidade razoável de reidentificação, continuam sob proteção da LGPD.",
      source: "lexicon",
    },
    {
      q: "Posso pedir cópia dos meus dados?",
      a: "Sim. O titular pode solicitar confirmação e acesso aos dados tratados.",
      source: "lexicon",
    },
  ],
  TERM_002: [
    {
      q: "Consentimento vale para qualquer finalidade?",
      a: "Não. Deve ser específico, informado e vinculado a uma finalidade determinada.",
      source: "lexicon",
    },
    {
      q: "Posso revogar depois de aceitar?",
      a: "Sim. A revogação deve ser facilitada e sem cobrança.",
      source: "lexicon",
    },
    {
      q: "Sem consentimento não existe tratamento?",
      a: "Existem outras bases legais, mas a plataforma precisa explicitar qual base usa.",
      source: "lexicon",
    },
  ],
  TERM_003: [
    {
      q: "Cookie técnico e cookie de anúncio são iguais?",
      a: "Não. O técnico viabiliza funcionamento; o de anúncio rastreia comportamento para perfilamento.",
      source: "lexicon",
    },
    {
      q: "Bloquear cookies quebra o serviço?",
      a: "Pode limitar funções, mas não impede o exercício de direitos sobre dados.",
      source: "lexicon",
    },
    {
      q: "Cookies de terceiros são mais sensíveis?",
      a: "Sim, pois ampliam compartilhamento e cruzamento de dados entre plataformas.",
      source: "lexicon",
    },
  ],
  TERM_004: [
    {
      q: "Tratamento é só coleta?",
      a: "Não. Inclui coleta, armazenamento, uso, compartilhamento, eliminação e outras operações.",
      source: "lexicon",
    },
    {
      q: "A empresa deve detalhar o tratamento?",
      a: "Sim. A finalidade e as operações precisam ser descritas com clareza.",
      source: "lexicon",
    },
    {
      q: "Posso contestar tratamento excessivo?",
      a: "Sim. O titular pode solicitar revisão e limitar tratamentos desnecessários.",
      source: "lexicon",
    },
  ],
  TERM_005: [
    {
      q: "Quem responde pelo tratamento?",
      a: "O controlador, que decide meios e finalidades do uso dos dados.",
      source: "lexicon",
    },
    {
      q: "Controlador e operador são a mesma coisa?",
      a: "Não. O operador trata dados em nome do controlador.",
      source: "lexicon",
    },
    {
      q: "Como contato o controlador?",
      a: "Pelos canais de privacidade indicados no termo ou na política.",
      source: "lexicon",
    },
  ],
  TERM_006: [
    {
      q: "Compartilhar sempre é proibido?",
      a: "Não. Pode ocorrer com base legal, mas precisa de transparência e limitação de finalidade.",
      source: "lexicon",
    },
    {
      q: "Posso saber com quem compartilharam?",
      a: "Sim. A LGPD garante informação sobre entidades públicas e privadas receptoras.",
      source: "lexicon",
    },
    {
      q: "Compartilhamento aumenta risco?",
      a: "Sim. Mais agentes com acesso significam maior superfície de exposição.",
      source: "lexicon",
    },
  ],
  TERM_007: [
    {
      q: "Terceiros inclui empresa do mesmo grupo?",
      a: "Pode incluir. O termo deve diferenciar parceiros, afiliadas e prestadores.",
      source: "lexicon",
    },
    {
      q: "Parceria comercial exige aviso?",
      a: "Sim. O usuário deve ser informado sobre categorias e finalidade do repasse.",
      source: "lexicon",
    },
    {
      q: "Posso me opor ao compartilhamento?",
      a: "Depende da base legal, mas você pode solicitar revisão e limitação.",
      source: "lexicon",
    },
  ],
  TERM_008: [
    {
      q: "Finalidade genérica é válida?",
      a: "Finalidades amplas demais reduzem transparência e podem violar necessidade.",
      source: "lexicon",
    },
    {
      q: "A empresa pode mudar finalidade depois?",
      a: "Mudanças materiais exigem nova informação ao titular e, em certos casos, novo consentimento.",
      source: "lexicon",
    },
    {
      q: "Finalidade orienta minimização?",
      a: "Sim. Só devem ser coletados dados estritamente necessários ao objetivo declarado.",
      source: "lexicon",
    },
  ],
  TERM_009: [
    {
      q: "Quanto tempo podem guardar meus dados?",
      a: "Somente pelo período necessário ao tratamento ou cumprimento legal.",
      source: "lexicon",
    },
    {
      q: "Conta apagada elimina tudo?",
      a: "Nem sempre. Pode haver retenção legal, mas isso precisa ser informado.",
      source: "lexicon",
    },
    {
      q: "Posso pedir descarte?",
      a: "Sim. O titular pode solicitar eliminação quando cessar a finalidade.",
      source: "lexicon",
    },
  ],
  TERM_010: [
    {
      q: "Anonimização é irreversível?",
      a: "Deve ser irreversível com meios técnicos razoáveis; se reversível, não é anonimizado.",
      source: "lexicon",
    },
    {
      q: "Pseudônimo é dado anônimo?",
      a: "Não. Pseudonimização ainda permite reidentificação sob certas condições.",
      source: "lexicon",
    },
    {
      q: "Direitos somem após anonimizar?",
      a: "Somente quando a anonimização for efetiva e irreversível.",
      source: "lexicon",
    },
  ],
  TERM_011: [
    {
      q: "O que é incidente de segurança?",
      a: "Evento que compromete confidencialidade, integridade ou disponibilidade dos dados.",
      source: "lexicon",
    },
    {
      q: "A empresa deve avisar titulares?",
      a: "Em risco relevante, deve comunicar titulares e autoridade competente.",
      source: "lexicon",
    },
    {
      q: "Como reagir a incidente?",
      a: "Troque credenciais, monitore contas e registre solicitação formal ao controlador.",
      source: "lexicon",
    },
  ],
  TERM_012: [
    {
      q: "Quem é o titular?",
      a: "A pessoa natural a quem os dados pessoais se referem.",
      source: "lexicon",
    },
    {
      q: "Quais direitos básicos tenho?",
      a: "Acesso, correção, exclusão, portabilidade e informação sobre compartilhamento.",
      source: "lexicon",
    },
    {
      q: "Preciso justificar o pedido?",
      a: "O pedido deve identificar o titular e a solicitação, sem necessidade de tese jurídica complexa.",
      source: "lexicon",
    },
  ],
};
