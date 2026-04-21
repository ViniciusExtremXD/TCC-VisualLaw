# Skill - Highlight Terms

## Objetivo

Detectar termos do lexico dentro de cada clausula com offsets corretos e provenance.

## Entradas

- Texto original da clausula.
- `data/lexicon/lexicon.json`.

## Saidas

- `TermMatch[]` com `term_id`, `match`, `start`, `end`.
- `HighlightAudit[]` com campo lexical e variante usada.

## Passos

1. Normalizar texto e termos para busca sem acentos.
2. Expandir termo principal e aliases.
3. Exigir fronteira de palavra para evitar falso positivo.
4. Mapear indice normalizado de volta para o texto original.
5. Evitar sobreposicao redundante do mesmo termo.
6. Ordenar resultados por offset.

## Criterios de qualidade

- `text.slice(start, end) === match`.
- Todo `term_id` existe no lexico.
- Auditoria informa `term` ou `aliases`.
- Offsets continuam validos com acentos e variacoes simples.

## Erros comuns

- Usar busca em texto normalizado e salvar offsets normalizados.
- Destacar substring dentro de palavra maior.
- Criar highlight sem explicacao correspondente.

## O que NAO fazer

- Nao destacar termos que nao existem no lexico.
- Nao corrigir texto original para facilitar matching.
- Nao omitir provenance do match.
