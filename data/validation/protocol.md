# Protocolo de Validacao Exploratoria

## Objetivo

Comparar compreensao de clausulas juridicas digitais em duas condicoes:

- controle: leitura original dos mesmos trechos oficiais;
- experimental: leitura assistida pelo MVP com segmentacao clause-level, highlights lexicais, cards explicativos e mediacao semiotica.

## Materiais

- Corpus congelado em `data/corpus`.
- Dataset clause-level em `data/dataset/clauses.csv`.
- Instrumentos em `data/validation`.
- Versao do app registrada por commit, data e hash dos artefatos de corpus.

## Fluxo do participante

1. Atribuir `participant_id` anonimo.
2. Registrar condicao: `control` ou `experimental`.
3. Aplicar `pre-questionnaire.md`.
4. Entregar o mesmo conjunto de clausulas para leitura.
5. Cronometrar `reading_time_seconds`.
6. Aplicar `comprehension-test.md`.
7. Cronometrar `response_time_seconds`.
8. Aplicar `post-questionnaire.md`.
9. Aplicar `sus.md`.
10. Registrar observacoes em `results-template.csv`.

## Condicao controle

O participante recebe os textos das clausulas sem:

- highlights;
- cards;
- icones;
- categorias;
- resumo em linguagem clara;
- auditoria.

O texto deve ser igual ao campo `text` do dataset.

## Condicao experimental

O participante usa o MVP estatico:

- Home para selecionar documento-base;
- Reader para leitura clause-level;
- cards explicativos acionados por termo;
- mapa semiotico quando necessario;
- Report/PDF se a tarefa incluir revisao final.

## Conjunto recomendado de clausulas piloto

- `X_PRIVACY_C001`
- `X_PRIVACY_C003`
- `META_PRIVACY_C002`
- `INSTAGRAM_TERMS_C002`
- `INSTAGRAM_TERMS_C004`
- `LGPD_EXCERPTS_C004`
- `LGPD_EXCERPTS_C006`

Esse conjunto cobre coleta, finalidade, compartilhamento, retencao, direitos e seguranca.

## Controle de versao

Antes da coleta, registrar:

- commit ou identificador local da versao;
- `content_hash` de cada `metadata.json` do corpus;
- data/hora da execucao;
- navegador usado;
- se o participante usou desktop ou mobile.

## Etica e CEP

Esta validacao envolve participantes humanos e coleta percepcao, desempenho e tempo. Para execucao formal como pesquisa com seres humanos, verificar exigencia de submissao ao CEP/Plataforma Brasil conforme orientacao institucional. Em piloto interno sem publicacao de dados individualizados, ainda assim preservar anonimato, consentimento informado e direito de retirada.

## Criterios de sucesso exploratorio

- Grupo experimental apresenta maior pontuacao media no teste de compreensao.
- Grupo experimental relata maior clareza e confianca.
- Evidencias qualitativas indicam que highlights, cards ou leitura clause-level ajudaram a localizar conceitos.
- Nenhuma diferenca de conteudo textual entre condicoes e detectada.
