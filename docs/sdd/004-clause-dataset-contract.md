# SDD 004 - Contrato do Dataset Clause-Level

## Arquivos canonicos

- `data/dataset/clauses.json`: fonte estruturada usada pelo app.
- `data/dataset/clauses.csv`: versao tabular para revisao academica, planilha e anexo.
- `data/corpus/*/metadata.json`: origem oficial congelada de cada documento.

## Campos obrigatorios

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `clause_id` | string | Identificador unico e estavel da clausula. |
| `document_id` | string | Documento de origem no manifesto do corpus. |
| `titulo` | string | Titulo curto usado na leitura guiada. |
| `texto_original` | string | Texto analisado, sem reescrita pelo pipeline. |
| `categoria` | Category | Categoria academica atribuida. |
| `termos_detectados` | string[] | Termos esperados do lexico. |
| `traducao_resumida` | string | Resumo em linguagem clara. |
| `direito_lgpd_relacionado` | string[] | Referencias LGPD associadas. |
| `impacto` | Impact | `low`, `medium` ou `high`. |
| `source_kind` | string | Tipo de fonte: `official_selected_excerpt` ou equivalente. |
| `source_package` | string | Pacote em `data/corpus` de onde a clausula foi derivada. |
| `source_excerpt_id` | string | Trecho bruto selecionado dentro do pacote de fonte. |
| `official_url` | string | URL oficial primaria. |

## Convencoes

- `clause_id` deve seguir `DOCUMENT_CNNN`, por exemplo `X_PRIVACY_C001`.
- `document_id` deve existir em `data/corpus/corpus-manifest.json`.
- `categoria` deve pertencer a `CATEGORIES` em `src/lib/types.ts`.
- `termos_detectados` devem corresponder preferencialmente a `termo_juridico` do lexico.
- O CSV usa listas separadas por `; ` dentro de campos com aspas.

## Criterios de aceitacao

- O app deve conseguir carregar o dataset demonstrativo sem transformar o texto em API.
- Cada registro deve gerar uma `Clause` compativel com `src/lib/mock-clauses-data.ts`.
- O pipeline pode auditar a classificacao heuristica mesmo quando a categoria vem do dataset.
- O harness deve conseguir usar fixtures derivadas desse contrato.

## Corpus final

A base final deve ser derivada dos pacotes oficiais congelados em `data/corpus/x-privacy`, `data/corpus/meta-privacy`, `data/corpus/instagram-terms` e `data/corpus/lgpd-excerpts`. O dataset nao deve voltar a usar exemplos mock-only como fonte canonica.

## Riscos

- Reescrever `texto_original` sem atualizar goldens invalida offsets.
- Adicionar categoria fora do contrato quebra UI, testes e relatorio.
- Deixar termo em `termos_detectados` fora do lexico reduz auditabilidade.
