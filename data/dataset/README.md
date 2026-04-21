# Clause-level dataset

Este diretorio contem o dataset clause-level consumido pelo MVP e pelos testes de regressao. Ele deve ser sempre derivado de pacotes congelados em `data/corpus/`, nunca de texto inventado ou de fonte secundaria.

## Base oficial atual

O corpus canonico congelavel esta em:

- `data/corpus/x-terms`
- `data/corpus/x-privacy`
- `data/corpus/meta-terms`
- `data/corpus/meta-privacy`
- `data/corpus/instagram-terms`
- `data/corpus/lgpd-excerpts`

`data/corpus/instagram-privacy` e pacote auxiliar de referencia, pois a politica de privacidade do Instagram e tratada pela politica compartilhada da Meta.

## Estado do dataset

`clauses.json` e `clauses.csv` preservam compatibilidade com o MVP atual. A versao anterior foi derivada de excertos oficiais selecionados. Depois da captura integral do corpus oficial, o proximo passo metodologico e rederivar as clausulas a partir de `source.txt` validado, com revisao manual academica.

Enquanto essa rederivacao nao for concluida, qualquer uso em banca deve declarar que:

- os pacotes de fonte oficial sao o artefato primario;
- o dataset atual e uma camada derivada de transicao;
- novas clausulas so devem entrar com `doc_id`, `source_package`, `source_section`, `official_url` e status de revisao.

## Fluxo de derivacao

1. Capturar fonte oficial bruta em `data/corpus`.
2. Validar estrutura, hashes e ausencia de bloqueio/login.
3. Extrair `source.txt` sem resumo ou reescrita semantica.
4. Segmentar em unidades clause-level.
5. Classificar automaticamente nas seis categorias do projeto.
6. Revisar manualmente fronteiras ambiguas e impacto.
7. Atualizar `clauses.json`, `clauses.csv`, goldens e instrumentos de validacao.

## Categorias

- `data_collection`
- `purpose_use`
- `sharing_third_parties`
- `retention_storage`
- `user_rights`
- `security_incidents`

## Arquivos

- `clauses.json`: registros academicos compativeis com o app.
- `clauses.csv`: contrato tabular para revisao, validacao e banca.
