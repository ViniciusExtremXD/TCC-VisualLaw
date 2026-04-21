# Skill - Classify Clauses

## Objetivo

Classificar clausulas em categorias academicas com heuristicas auditaveis.

## Entradas

- Texto da clausula.
- Regras de palavras-chave em `src/lib/classifier.ts`.
- Categoria anotada no dataset, quando houver.

## Saidas

- Categoria, impacto e auditoria de regras disparadas.

## Passos

1. Normalizar o texto para comparacao.
2. Pontuar categorias por palavras-chave.
3. Selecionar categoria de maior score.
4. Calcular impacto por sinais de risco.
5. Registrar scores e `rules_fired`.
6. Quando dataset trouxer categoria, preservar anotacao e manter auditoria heuristica.

## Criterios de qualidade

- Regra e palavra disparada aparecem na auditoria.
- Categoria pertence ao contrato de `CATEGORIES`.
- Impacto nao e apresentado como conclusao juridica definitiva.

## Erros comuns

- Criar categoria nova sem atualizar contratos, UI e testes.
- Usar label visual como substituto da regra.
- Esconder baixa confianca em texto ambiguo.

## O que NAO fazer

- Nao usar classificador opaco sem explicacao.
- Nao adicionar chamada a LLM.
- Nao confundir classificacao metodologica com parecer juridico.
