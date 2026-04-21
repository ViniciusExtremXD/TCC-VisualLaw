# Corpus Audit Report

Data da auditoria: 2026-04-21  
Escopo: auditoria do congelamento de corpus oficial e da fundacao academica do TCC-VisualLaw.  
Modo: validacao de evidencias existentes, sem recaptura integral e sem refatoracao de produto.

## 1. Executive verdict

**YELLOW**

O congelamento do corpus oficial esta tecnicamente completo para os pacotes esperados e passou no validador estrutural. O projeto tambem possui SDD, skills, harness, validacao, CI, testes unitarios/contratuais e build funcional.

O estado ainda nao e GREEN porque:

- o dataset clause-level ainda e de transicao, derivado de `official_selected_excerpt`, nao rederivado do corpus integral congelado;
- `clauses.csv` ainda nao possui os campos `source_doc` e `source_section` exigidos para a etapa final;
- o lexico usa `corpus_support`, mas nao o campo `evidence_docs` solicitado;
- o E2E esta desatualizado e falha porque espera 5 documentos enquanto o manifesto atual gera 7 pacotes + entrada manual;
- o README ainda contem pontos stale sobre o antigo script `freeze-official-corpus.mjs` e sobre armazenamento apenas de trechos selecionados.

## 2. Internet access assessment

**INTERNET_CONFIRMED**

Evidencias:

- Checagem leve atual: `fetch('https://x.com/pt/tos', { range: 'bytes=0-1024' })` retornou HTTP 200 e HTML oficial.
- Playwright Chromium esta disponivel localmente.
- Os metadados dos pacotes registram `captured_at`, `official_url`, `resolved_url`, `raw_http_probe` e `browser_capture`.
- Os arquivos `source.txt` contem texto juridico oficial renderizado, nao placeholders.
- Os pacotes de X, Instagram/Meta e LGPD contem `source.html`, `source.pdf`, `source-screenshot.png` e hashes.

Observacao: a checagem leve atual com Node `fetch` para Planalto retornou `ECONNRESET`, mas o pacote `lgpd-excerpts` existente possui captura completa, `raw_http_probe.status = 200`, `browser_capture.http_status = 200`, texto legal oficial e hashes coerentes. Isso confirma evidencia historica da captura, embora o host tenha falhado no check leve atual.

## 3. Corpus package matrix

| package | files complete? | metadata valid? | source text valid? | official source evidence? | verdict |
| --- | --- | --- | --- | --- | --- |
| `x-terms` | yes | yes: `X_TERMS`, `captured`, raw 200/browser 200 | yes, 63,920 chars | `https://x.com/pt/tos` | PASS |
| `x-privacy` | yes | yes: `X_PRIVACY`, `captured`, raw 200/browser 200 | yes, 37,595 chars | `https://x.com/pt/privacy` | PASS |
| `meta-terms` | yes | yes: `META_TERMS`, `captured`, raw 400/browser 200 | yes, 36,938 chars | `https://www.facebook.com/terms/?locale=pt_BR` | PASS |
| `meta-privacy` | yes | yes: `META_PRIVACY`, `captured`, raw 400/browser 200 | yes, 59,238 chars | `https://www.facebook.com/privacy/policy/?locale=pt_BR` | PASS |
| `instagram-terms` | yes | yes: `INSTAGRAM_TERMS`, `captured`, raw 400/browser 200 | yes, 24,955 chars | `https://help.instagram.com/581066165581870/?locale=pt_BR` | PASS |
| `instagram-privacy` | yes | yes: `INSTAGRAM_PRIVACY`, `captured`, raw 200/browser 200 | yes, 59,238 chars | `https://privacycenter.instagram.com/policy` | PASS, auxiliary reference |
| `lgpd-excerpts` | yes | yes: `LGPD_EXCERPTS`, `captured`, raw 200/browser 200 | yes, 79,922 chars | Planalto LGPD compilada | PASS |

Validation command:

```text
npm.cmd run corpus:validate
Corpus validado: pacotes primarios completos e hashes coerentes.
```

Browser fallback:

- Required for effective capture of `meta-terms`, `meta-privacy`, and `instagram-terms`, because raw HTTP probe returned 400 while Playwright rendered HTTP 200.
- Browser evidence was also generated for all packages to preserve PDF and screenshot artifacts.

Failed sources:

- No required top-level corpus package failed.
- Some hosts may fail lightweight checks intermittently, as observed with Planalto `ECONNRESET`, but the repository contains captured evidence and hashes for the LGPD package.

## 4. Academic foundation matrix

| area | expected | found | verdict |
| --- | --- | --- | --- |
| corpus | 6 canonical sources + official LGPD evidence, metadata, notes, hash, manifest | 7 top-level packages: 6 canonical/primary plus `instagram-privacy` auxiliary; all required files present | COMPLETE |
| dataset | corpus-derived `clauses.csv` with `clause_id`, `doc_id`, `source_doc`, `source_section`, provenance | `clauses.csv` exists with 18 rows and provenance via `source_package`, `source_excerpt_id`, `official_url`; still `official_selected_excerpt`; lacks `source_doc`/`source_section` | PARTIAL |
| lexicon | controlled dictionary grounded in corpus/LGPD, with evidence docs | `lexicon.json` has 35 entries, required app fields, `corpus_support`; lacks `evidence_docs` field | PARTIAL |
| visual map | icon/category mapping aligned to six categories | `icon-map.json` has 34 icons and covers six categories plus `general` | COMPLETE |
| SDD | 7 actionable specs aligned with clause-level assisted reading | all 7 expected files exist and contain substantive contracts; some wording still references demonstrative dataset state | PARTIAL |
| skills | 7 operational skills with purpose, inputs, outputs, steps, criteria, forbidden behaviors | all 7 expected files exist and contain the required sections | COMPLETE |
| harness | fixtures/goldens/scripts validating core without UI | harness exists and `npm.cmd run harness` passes on `lgpd-sample` | COMPLETE, narrow scope |
| validation package | pilot instruments for control vs experimental comparison | all expected files exist; protocol defines timing, scoring, versioning and CEP note; questions still tied to transitional clause IDs | PARTIAL |
| tests | unit, contract, E2E, static build | unit/contract/build/tsc/harness pass; E2E fails on stale document count expectation | PARTIAL |
| CI | build + tests + harness + E2E | `.github/workflows/ci.yml` exists and includes E2E; would currently fail because local E2E fails | PARTIAL/FAILING |

## 5. Failures and weak points

- **E2E failure:** `tests/e2e.spec.ts:90` expects 5 document items, but the current app renders 8 items after the official corpus manifest expansion.
- **Dataset not final:** `data/dataset/clauses.csv` is still derived from `official_selected_excerpt` rows and has not been rederived from the full `source.txt` files.
- **Dataset contract gap:** `clauses.csv` lacks `source_doc` and `source_section`, which are needed for stronger banca traceability.
- **Lexicon contract gap:** `data/lexicon/lexicon.json` uses `corpus_support`, but does not yet expose the requested `evidence_docs` field.
- **README stale points:** `README.md` still says `scripts/freeze-official-corpus.mjs` captures/regenerates corpus and dataset; that script is now deprecated. It also says the repository does not store integral proprietary documents, while the new corpus packages include full rendered `source.html`, `source.txt`, `source.pdf`, and screenshots.
- **SDD stale points:** `docs/sdd/002-system-architecture.md`, `004-clause-dataset-contract.md`, and `006-validation-protocol.md` still refer to demonstrative corpus/dataset status and should be reconciled after final dataset derivation.
- **Validation package dependency:** `data/validation/comprehension-test.md` uses current transitional clause IDs; after dataset rederivation, questions must be checked against the final canonical clauses.
- **Worktree state:** the corpus capture artifacts and scripts are present but not committed at audit time.

## 6. Recommended next action

Update the dataset and tests in one controlled follow-up:

1. Derive a small canonical `data/dataset/clauses.csv` from the frozen `source.txt` files.
2. Add `source_doc`, `source_section`, `content_hash` or equivalent provenance.
3. Add `evidence_docs` to lexicon entries, mapped to corpus packages and/or clause IDs.
4. Update `tests/e2e.spec.ts` to assert the expected corpus-driven document count without hardcoding the old value 5.
5. Refresh README and the stale SDD references to reflect the official full-source corpus state.

After that, rerun:

```text
npm.cmd run corpus:validate
npm.cmd run test
npm.cmd run harness
npm.cmd run build
npm.cmd run test:e2e
```
