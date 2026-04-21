# Skill - Curate Corpus

## Objetivo

Curar documentos-base para o TCC mantendo corpus estavel, citavel e reproduzivel.

## Entradas

- Documento bruto ou trecho adaptado.
- Fonte, data de coleta e tipo do documento.
- Justificativa de uso no TCC.

## Saidas

- Arquivo em `data/corpus/*.md`.
- Registro em `data/corpus/corpus-manifest.json`.
- Atualizacao, se necessario, em `data/dataset/clauses.json` e `.csv`.

## Passos

1. Verificar se o documento contribui para coleta, finalidade, compartilhamento, retencao, direitos ou seguranca.
2. Registrar `document_id`, titulo, plataforma, tipo, idioma, data e natureza da fonte.
3. Manter trecho estavel; se for adaptado, declarar isso explicitamente.
4. Evitar texto excessivo que nao sera segmentado no MVP.
5. Atualizar dataset clause-level apenas com clausulas relevantes ao artigo.

## Criterios de qualidade

- Corpus tem finalidade metodologica clara.
- Texto permite rastrear clausulas e termos juridicos.
- Manifesto e dataset permanecem consistentes.
- Nao ha dependencia de fonte mutavel sem data de coleta.

## Erros comuns

- Colar documento integral sem recorte analitico.
- Misturar corpus final e exemplos temporarios sem marcar origem.
- Alterar texto depois de goldens ja existirem sem atualizar harness.

## O que NAO fazer

- Nao criar backend para coletar documentos.
- Nao usar corpus sem registrar fonte/metodologia.
- Nao transformar a aplicacao em buscador ou chatbot juridico.
