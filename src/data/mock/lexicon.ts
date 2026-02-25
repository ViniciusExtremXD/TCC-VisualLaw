import type { FAQItem } from "@/lib/types";

export const LEXICON_FAQ_BY_TERM: Record<string, FAQItem[]> = {
  TERM_001: [
    { q: "O que entra como dado pessoal?", a: "Qualquer informacao que identifique ou torne a pessoa identificavel, isoladamente ou em combinacao.", source: "lexicon" },
    { q: "Dados anonimizados ainda sao pessoais?", a: "Se houver possibilidade razoavel de reidentificacao, continuam sob protecao da LGPD.", source: "lexicon" },
    { q: "Posso pedir copia dos meus dados?", a: "Sim. O titular pode solicitar confirmacao e acesso aos dados tratados.", source: "lexicon" },
  ],
  TERM_002: [
    { q: "Consentimento vale para qualquer finalidade?", a: "Nao. Deve ser especifico, informado e vinculado a uma finalidade determinada.", source: "lexicon" },
    { q: "Posso revogar depois de aceitar?", a: "Sim. A revogacao deve ser facilitada e sem cobranca.", source: "lexicon" },
    { q: "Sem consentimento nao existe tratamento?", a: "Existem outras bases legais, mas a plataforma precisa explicitar qual base usa.", source: "lexicon" },
  ],
  TERM_003: [
    { q: "Cookie tecnico e cookie de anuncio sao iguais?", a: "Nao. O tecnico viabiliza funcionamento; o de anuncio rastreia comportamento para perfilamento.", source: "lexicon" },
    { q: "Bloquear cookies quebra o servico?", a: "Pode limitar funcoes, mas nao impede o exercicio de direitos sobre dados.", source: "lexicon" },
    { q: "Cookies de terceiros sao mais sensiveis?", a: "Sim, pois ampliam compartilhamento e cruzamento de dados entre plataformas.", source: "lexicon" },
  ],
  TERM_004: [
    { q: "Tratamento e so coleta?", a: "Nao. Inclui coleta, armazenamento, uso, compartilhamento, eliminacao e outras operacoes.", source: "lexicon" },
    { q: "A empresa deve detalhar o tratamento?", a: "Sim. A finalidade e as operacoes precisam ser descritas com clareza.", source: "lexicon" },
    { q: "Posso contestar tratamento excessivo?", a: "Sim. O titular pode solicitar revisao e limitar tratamentos desnecessarios.", source: "lexicon" },
  ],
  TERM_005: [
    { q: "Quem responde pelo tratamento?", a: "O controlador, que decide meios e finalidades do uso dos dados.", source: "lexicon" },
    { q: "Controlador e operador sao a mesma coisa?", a: "Nao. O operador trata dados em nome do controlador.", source: "lexicon" },
    { q: "Como contato o controlador?", a: "Pelos canais de privacidade indicados no termo ou na politica.", source: "lexicon" },
  ],
  TERM_006: [
    { q: "Compartilhar sempre e proibido?", a: "Nao. Pode ocorrer com base legal, mas precisa de transparencia e limitacao de finalidade.", source: "lexicon" },
    { q: "Posso saber com quem compartilharam?", a: "Sim. A LGPD garante informacao sobre entidades publicas e privadas receptoras.", source: "lexicon" },
    { q: "Compartilhamento aumenta risco?", a: "Sim. Mais agentes com acesso significam maior superficie de exposicao.", source: "lexicon" },
  ],
  TERM_007: [
    { q: "Terceiros inclui empresa do mesmo grupo?", a: "Pode incluir. O termo deve diferenciar parceiros, afiliadas e prestadores.", source: "lexicon" },
    { q: "Parceria comercial exige aviso?", a: "Sim. O usuario deve ser informado sobre categorias e finalidade do repasse.", source: "lexicon" },
    { q: "Posso me opor ao compartilhamento?", a: "Depende da base legal, mas voce pode solicitar revisao e limitacao.", source: "lexicon" },
  ],
  TERM_008: [
    { q: "Finalidade generica e valida?", a: "Finalidades amplas demais reduzem transparencia e podem violar necessidade.", source: "lexicon" },
    { q: "A empresa pode mudar finalidade depois?", a: "Mudancas materiais exigem nova informacao ao titular e, em certos casos, novo consentimento.", source: "lexicon" },
    { q: "Finalidade orienta minimizacao?", a: "Sim. So devem ser coletados dados estritamente necessarios ao objetivo declarado.", source: "lexicon" },
  ],
  TERM_009: [
    { q: "Quanto tempo podem guardar meus dados?", a: "Somente pelo periodo necessario ao tratamento ou cumprimento legal.", source: "lexicon" },
    { q: "Conta apagada elimina tudo?", a: "Nem sempre. Pode haver retencao legal, mas isso precisa ser informado.", source: "lexicon" },
    { q: "Posso pedir descarte?", a: "Sim. O titular pode solicitar eliminacao quando cessar a finalidade.", source: "lexicon" },
  ],
  TERM_010: [
    { q: "Anonimizacao e irreversivel?", a: "Deve ser irreversivel com meios tecnicos razoaveis; se reversivel, nao e anonimizado.", source: "lexicon" },
    { q: "Pseudonimo e dado anonimo?", a: "Nao. Pseudonimizacao ainda permite reidentificacao sob certas condicoes.", source: "lexicon" },
    { q: "Direitos somem apos anonimizar?", a: "Somente quando a anonimização for efetiva e irreversivel.", source: "lexicon" },
  ],
  TERM_011: [
    { q: "O que e incidente de seguranca?", a: "Evento que compromete confidencialidade, integridade ou disponibilidade dos dados.", source: "lexicon" },
    { q: "A empresa deve avisar titulares?", a: "Em risco relevante, deve comunicar titulares e autoridade competente.", source: "lexicon" },
    { q: "Como reagir a incidente?", a: "Troque credenciais, monitore contas e registre solicitacao formal ao controlador.", source: "lexicon" },
  ],
  TERM_012: [
    { q: "Quem e o titular?", a: "A pessoa natural a quem os dados pessoais se referem.", source: "lexicon" },
    { q: "Quais direitos basicos tenho?", a: "Acesso, correcao, exclusao, portabilidade e informacao sobre compartilhamento.", source: "lexicon" },
    { q: "Preciso justificar o pedido?", a: "O pedido deve identificar o titular e a solicitacao, sem necessidade de tese juridica complexa.", source: "lexicon" },
  ],
};
