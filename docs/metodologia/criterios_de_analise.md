# Criterios de Analise

## 1. Categorizacao de clausulas

| categoria | criterio principal | sinais usuais |
|-----------|--------------------|---------------|
| `data_collection` | informa quais dados sao coletados | coleta, cadastro, cookies, localizacao, metadados |
| `purpose_use` | informa para que os dados sao usados | finalidade, personalizacao, publicidade, perfilamento |
| `sharing_third_parties` | informa repasse para outras entidades | compartilhamento, terceiros, parceiro, operador |
| `retention_storage` | informa guarda e descarte | retencao, armazenamento, eliminacao, anonimizacao |
| `user_rights` | informa direitos ou canais do titular | acesso, portabilidade, revogacao, encarregado |
| `security_incidents` | informa protecao e incidentes | seguranca, criptografia, incidente, ANPD |

Regra operacional:

- uma categoria principal por clausula
- em caso de empate, priorizar o foco semantico dominante
- quando a clausula vier do dataset, a anotacao de referencia permanece registrada

## 2. Nivel de impacto

| nivel | criterio |
|-------|----------|
| `high` | afeta privacidade, compartilhamento, perfilamento, direitos ou incidente |
| `medium` | relevante para governanca de dados, mas com efeito menos imediato |
| `low` | informativo ou contextual, sem risco direto elevado |

## 3. Associacao com direitos da LGPD

Regras adotadas:

- termos sobre transparencia e finalidade apontam para Arts. 6, 7, 8 e 9
- termos sobre acesso, portabilidade e eliminacao apontam para Art. 18
- termos sobre decisao automatizada apontam para Art. 20
- termos sobre seguranca e incidente apontam para Arts. 46 a 48
- termos sobre transferencia internacional apontam para Arts. 33 e 34

## 4. Regras de deteccao de termos

O sistema usa matching deterministico com:

- termo principal do dicionario
- palavras-chave relacionadas
- variacoes simples geradas pelo normalizador
- registro de offsets `start/end`
- campo do lexico usado no match
- variante efetivamente encontrada

## 5. Limitacoes conhecidas do modelo baseado em dicionario e regras

- nao resolve sinonimia aberta de forma ampla
- depende de vocabulario previamente curado
- pode perder contexto quando uma mesma palavra muda de sentido
- nao interpreta ironia, excecoes contratuais complexas ou referencias cruzadas extensas
- serve melhor como MVP explicavel do que como classificador juridico exaustivo
