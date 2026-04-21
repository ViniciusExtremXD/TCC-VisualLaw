# SDD 005 - Contrato Lexico-Semiotico

## Objetivo

Formalizar o dicionario juridico e o mapeamento visual usados para transformar termo detectado em card explicativo auditavel.

## Fonte canonica

- `data/lexicon/lexicon.json`: registros academicos do lexico.
- `data/visual/icon-map.json`: mapeamento `icon_id` para biblioteca visual.
- `data/visual/semiotic-map.json`: justificativa semiotica por categoria.

## Campos do lexico

| Campo | Tipo | Obrigatorio |
| --- | --- | --- |
| `term_id` | string | sim |
| `termo_juridico` | string | sim |
| `traducao_direta` | string | sim |
| `definicao_leiga` | string | sim |
| `exemplo_pratico` | string | sim |
| `categoria` | Category | sim |
| `icone_id` | string | sim |
| `nivel_impacto` | Impact | sim |
| `direito_lgpd_relacionado` | string[] | sim |
| `palavras_chave_relacionadas` | string[] | sim |
| `observacao_metodologica` | string | opcional |

## Regras semioticas

- `icone_id` deve existir em `data/visual/icon-map.json`.
- A cor do icone deve ser coerente com a categoria ou o nivel de risco.
- A justificativa semiotica deve explicar o signo visual sem prometer conclusao juridica.
- O card nao pode inventar recomendacao fora do lexico ou das regras do pipeline.

## Matching lexical

- O termo principal e os aliases participam do matching.
- A normalizacao remove acentos e caixa, mas os offsets devem apontar para o texto original.
- Variacoes simples singular/plural podem ser geradas pelo normalizador.
- Cada match deve registrar se veio de `term` ou `aliases`.

## Criterios de aceitacao

- Todo `term_id` deve ser unico.
- Todo `icone_id` usado no lexico deve existir no mapa visual.
- Todo highlight deve conseguir apontar para uma explicacao.
- Toda explicacao deve manter vinculo com LGPD, impacto e categoria.

## O que nao fazer

- Nao usar icones como ornamento sem justificativa.
- Nao criar termos que nao aparecam no corpus ou no protocolo academico.
- Nao substituir o lexico por resposta generativa.
- Nao ocultar a regra de matching quando apresentar o card.
