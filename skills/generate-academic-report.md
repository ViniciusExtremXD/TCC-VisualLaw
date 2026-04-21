# Skill - Generate Academic Report

## Objetivo

Gerar relatorio academico exportavel a partir da sessao processada.

## Entradas

- `clauses`
- `highlights`
- `explanations`
- `audit`
- `traceability`
- documento selecionado

## Saidas

- Pagina `Report`.
- PDF client-side.
- Evidencias exportaveis quando aplicavel.

## Passos

1. Listar metadados da sessao e documento.
2. Apresentar sumario das clausulas.
3. Para cada clausula, mostrar categoria, impacto, LGPD, original, resumo e highlights.
4. Incluir evidencia de classificacao e segmentacao.
5. Incluir cards de termos encontrados.
6. Incluir apendice semiotico.
7. Exportar PDF no navegador.

## Criterios de qualidade

- Relatorio reproduz a sessao vista no Reader.
- Nao depende de servidor.
- Evidencias tecnicas sao suficientes para auditoria.
- O PDF e anexo academico, nao parecer juridico.

## Erros comuns

- Gerar relatorio com dados diferentes da sessao atual.
- Esconder as regras quando a classificacao parece correta.
- Tratar o PDF como documento legal oficial.

## O que NAO fazer

- Nao enviar dados para API externa.
- Nao criar banco ou armazenamento remoto.
- Nao remover auditabilidade para melhorar aparencia.
