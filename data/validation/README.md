# Pacote de Validacao - Prova de Conceito

Este pacote operacionaliza a validacao exploratoria do MVP academico. O desenho compara leitura original de clausulas com leitura assistida por mediacao lexical e visual.

## Modelo experimental

- Grupo controle: participante le os mesmos trechos oficiais sem highlights, cards ou mapa semiotico.
- Grupo experimental: participante le os mesmos trechos no Reader do MVP, com highlights lexicais, cards explicativos, progresso clause-level e auditoria disponivel.

## Artefatos

- `protocol.md`: fluxo do estudo, tempos, versoes e cuidados eticos.
- `pre-questionnaire.md`: perfil, familiaridade previa e confianca inicial.
- `comprehension-test.md`: 10 questoes objetivas baseadas no corpus congelado.
- `post-questionnaire.md`: percepcao de clareza, utilidade e ganho de compreensao.
- `sus.md`: instrumento SUS padrao de 10 itens.
- `results-template.csv`: planilha inicial para coleta dos resultados.

## Corpus usado

As tarefas devem usar os `clause_id`s derivados dos pacotes oficiais em `data/corpus`:

- `X_PRIVACY_C001` a `X_PRIVACY_C005`
- `META_PRIVACY_C001` a `META_PRIVACY_C003`
- `INSTAGRAM_TERMS_C001` a `INSTAGRAM_TERMS_C004`
- `LGPD_EXCERPTS_C001` a `LGPD_EXCERPTS_C006`

## Regra metodologica

O conteudo textual deve ser identico nas duas condicoes. A unica diferenca permitida e a camada de mediacao: segmentacao guiada, highlights, cards, mapa semiotico e relatorio.

## Saidas esperadas

- tempo de leitura por participante;
- acertos no teste de compreensao;
- confianca pre e pos-uso;
- SUS;
- notas qualitativas sobre clareza, sobrecarga visual e valor dos cards.
