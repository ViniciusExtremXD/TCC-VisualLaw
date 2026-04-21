# SDD 002 - Arquitetura do Sistema

## Visao geral

O sistema e um Next.js estatico/client-side. A aplicacao carrega dados versionados de `data/`, executa o pipeline em `src/lib` no navegador, persiste a sessao localmente e renderiza Home, Reader e Report.

## Camadas

## UI

- `src/app/page.tsx`: entrada principal, selecao de documento, texto livre e demonstracao.
- `src/app/reader/page.tsx`: leitura guiada clause-level, highlights, cards, progresso e auditoria.
- `src/app/report/page.tsx`: relatorio academico da sessao e exportacao PDF.
- `src/components`: componentes de mediacao visual, auditoria e cards.

## Estado

- `src/store/SessionContext.tsx` guarda a sessao processada em memoria e `localStorage`.
- O estado e composto por `clauses`, `highlights`, `explanations`, `audit`, `traceability`, `lexicon` e documento selecionado.

## Core

- `segmenter.ts`: texto bruto para blocos clause-level.
- `normalizer.ts`: normalizacao para comparacao textual.
- `classifier.ts`: categorias e impacto por heuristica de palavras-chave.
- `highlighter.ts`: matching lexical com offsets e provenance.
- `explainer.ts`: cards explicativos derivados do lexico.
- `pipeline.ts`: orquestracao das etapas.
- `traceability.ts`: registro auditavel por clausula e termo.
- `plain-language.ts`: resumo leigo deterministico.

## Dados

- `data/corpus`: corpus-base e manifesto.
- `data/dataset`: dataset clause-level demonstrativo.
- `data/lexicon`: lexico juridico academico.
- `data/visual`: mapa de icones e semiotica.
- `data/validation`: instrumentos de validacao.
- `data/output`: saidas exportadas de referencia, quando geradas.

## Harness e testes

- `tests/unit`: testes de camada para segmentador, classificador, highlighter e explainer.
- `tests/contracts`: contratos de pipeline com golden.
- `harness`: fixtures, goldens e script comparativo independente da UI.
- `.github/workflows/ci.yml`: quality gate para build e regressao.

## Decisoes arquiteturais

- Pipeline local e deterministico para preservar auditabilidade e reproducibilidade.
- Dados academicos ficam fora de modulos TS para permitir versao, revisao e citacao.
- A UI e camada de mediacao, nao fonte de verdade metodologica.
- O relatorio e construido a partir da mesma sessao auditada exibida no Reader.
- O codigo evita dependencias de backend porque o problema do TCC e compreensao e rastreabilidade, nao infraestrutura.

## Criterios de aceitacao

- `npm run build` deve gerar export estatico.
- `npm test` deve validar core e contratos sem navegador.
- `npm run harness` deve comparar fixtures contra goldens.
- `npm run test:e2e` deve continuar cobrindo fluxo principal quando ambiente permitir.
