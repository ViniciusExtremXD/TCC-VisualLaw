# Visual Law TCC

Projeto de TCC orientado a pesquisa aplicada para leitura assistida clause-level de politicas de privacidade, termos de uso e clausulas digitais em portugues, com Visual Law, linguagem clara, dicionario lexico-juridico e auditoria do pipeline.

## Problema

Documentos digitais costumam combinar linguagem tecnico-juridica, baixa legibilidade e extensao excessiva. Isso reduz a compreensao do usuario comum e dificulta a identificacao de riscos, direitos e efeitos praticos.

## Objetivo do MVP

Demonstrar um artefato client-side e estatico que:

- segmenta texto em clausulas;
- categoriza o conteudo em temas recorrentes;
- detecta termos juridicos por dicionario lexico;
- apresenta linguagem simples e explicacao visual;
- registra rastreabilidade entre entrada, regra aplicada e saida final;
- exporta relatorio academico para revisao e banca.

## Experiencia principal

- leitura guiada de clausulas e termos;
- destaque clicavel de termos juridicos;
- card explicativo com Visual Law;
- rastreamento do processamento por etapa;
- relatorio tecnico em PDF.

## Nao escopo

- chatbot ou conversa livre;
- backend, banco, API routes ou server actions;
- parecer juridico automatizado;
- IA generativa como nucleo da solucao.

## Artefatos principais

- `data/corpus`: pacotes congelados de fontes oficiais primarias;
- `data/dataset`: dataset clause-level derivado do corpus real selecionado;
- `data/lexicon`: dicionario lexico juridico calibrado contra corpus e LGPD;
- `data/visual`: mapeamento semiotico e mapa de icones;
- `data/validation`: instrumentos canonicos de validacao;
- `data/output`: saidas de referencia exportaveis;
- `data/validacao`: templates tabulares legados/auxiliares de coleta;
- `docs/sdd`: contratos Spec Driven Development do escopo, dados, pipeline e harness;
- `docs/metodologia`: problema, objetivos, criterios e escopo;
- `docs/diagramas`: atividades, C4 simplificado e wireframe;
- `docs/validacao`: protocolo e instrumentos de avaliacao;
- `docs/evidencias`: auditoria da base, backlog e roteiro de banca;
- `skills`: instrucoes operacionais para agentes/engenheiros;
- `harness`: fixtures, goldens e scripts de regressao do core.
- `scripts/freeze-official-corpus.mjs`: captura/regera os pacotes oficiais e o dataset derivado.

## Fluxo do sistema

1. Selecionar documento-base ou colar texto livre.
2. Segmentar o texto em clausulas.
3. Classificar cada clausula por categoria e impacto.
4. Detectar termos juridicos do dicionario.
5. Gerar resumo em linguagem simples.
6. Exibir leitura guiada e cards de explicacao.
7. Exportar `clauses.json`, `highlights.json`, `explanations.json` e `traceability.json`.

## Scripts

```bash
npm run dev
npm test
npm run test:unit
npm run test:contracts
npm run harness
npm run build
npm run preview
npm run sync:research
npm run test:e2e
```

## Demonstracao academica

- Home com entrada de texto e documentos-base;
- Reader com comparacao entre texto original e linguagem simples;
- highlights e cards acionados por termo;
- rastreamento do processamento por clausula;
- exportacao de evidencias em JSON;
- relatorio visual para orientacao e banca.

## Fundacao tecnica

O core vive em `src/lib` e deve permanecer deterministico e auditavel. Mudancas em segmentacao, classificacao, highlights, explicacoes ou rastreabilidade devem ser justificadas nos SDDs e validadas por testes unitarios, contrato golden e harness.

O corpus oficial congelado registra apenas trechos selecionados e rastreaveis das politicas de plataforma, preservando URL oficial, hash, screenshot e notas de captura. O repositorio nao armazena copias integrais de documentos proprietarios.
