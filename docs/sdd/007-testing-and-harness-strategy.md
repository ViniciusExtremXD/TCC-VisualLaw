# SDD 007 - Estrategia de Testes e Harness

## Objetivo

Detectar regressao no core academico sem depender apenas da UI. A UI continua importante, mas os contratos metodologicos vivem no pipeline e nos dados.

## Camadas de teste

- Unitarios: validam funcoes puras de segmentacao, classificacao, highlights e explicacoes.
- Contratos: executam o pipeline em fixture conhecida e comparam saida normalizada contra golden.
- Harness: permite comparacao independente via CLI para pesquisadores e banca tecnica.
- E2E: cobre fluxo Home -> Reader -> Report -> PDF quando ambiente permitir.

## Scripts esperados

```bash
npm test
npm run test:unit
npm run test:contracts
npm run harness
npm run build
npm run test:e2e
```

## Golden testing

Goldens devem ignorar campos temporais (`session_id`, `created_at`) e comparar:

- clausulas geradas
- categorias e impactos
- highlights com offsets
- explicacoes vinculadas ao lexico
- auditoria de regras
- rastreabilidade basica

## Criterios de aceitacao

- Alteracao em normalizacao nao pode deslocar offsets sem falhar teste.
- Alteracao no lexico nao pode remover explicacao esperada sem falhar teste.
- Alteracao em heuristica deve atualizar golden apenas com justificativa em SDD ou docs.
- CI deve falhar se build, testes unitarios, contratos ou harness falharem.

## Politica de atualizacao de goldens

Atualizar golden e aceitavel quando:

- o corpus ou dataset foi revisado conscientemente;
- o contrato mudou e foi documentado;
- a mudanca melhora aderencia ao TCC.

Nao atualizar golden apenas para esconder regressao.
