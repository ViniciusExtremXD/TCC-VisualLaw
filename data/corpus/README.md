# Corpus da Pesquisa

Este diretorio concentra o corpus congelado do TCC. A versao atual substitui a base demonstrativa adaptada por pacotes rastreaveis derivados de fontes oficiais primarias.

## Pacotes canonicos

| document_id | pacote | fonte oficial | tipo |
| --- | --- | --- | --- |
| `X_PRIVACY` | `x-privacy/` | X Privacy Policy | privacy |
| `META_PRIVACY` | `meta-privacy/` | Meta/Facebook Privacy Policy | privacy |
| `INSTAGRAM_TERMS` | `instagram-terms/` | Instagram Terms of Use | terms |
| `LGPD_EXCERPTS` | `lgpd-excerpts/` | Lei 13.709/2018 - Planalto | other |

Cada pacote contem:

- `metadata.json`: inventario tecnico da captura;
- `source.txt`: trechos oficiais selecionados para analise clause-level;
- `capture-notes.md`: notas metodologicas, limitacoes e normalizacao;
- `source-screenshot.png`: evidencia visual da pagina oficial capturada.

## Escopo de reproducibilidade

As politicas de plataformas sao documentos proprietarios e mutaveis. Por isso, o repositorio nao armazena copias integrais dessas politicas. Ele congela URL oficial, hash, screenshot e trechos selecionados necessarios para a validacao academica.

A LGPD e tratada como base normativa oficial; apenas os artigos relevantes ao estudo foram incluidos no pacote `lgpd-excerpts`.

## Manifesto

`corpus-manifest.json` e o inventario canonico. `corpus_manifest.json` permanece como espelho legado para compatibilidade.

## Derivacao

O dataset final em `data/dataset` deve sempre apontar para:

- `source_package`;
- `source_excerpt_id`;
- `official_url`;
- `content_hash` no manifesto.

Mudancas no corpus devem ser geradas por `node scripts/freeze-official-corpus.mjs` e revisadas antes de atualizar goldens ou instrumentos de validacao.
