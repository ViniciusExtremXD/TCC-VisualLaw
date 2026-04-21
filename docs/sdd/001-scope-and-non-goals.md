# SDD 001 - Escopo e Nao Objetivos

## Objetivo

Definir o limite tecnico e academico do MVP. O sistema e uma ferramenta de leitura assistida clause-level para documentos juridicos digitais, apoiada por Visual Law, linguagem clara, lexico juridico versionado e rastreabilidade do pipeline.

## Escopo do MVP

- Entrada de texto colado ou documento-base versionado em `data/corpus`.
- Segmentacao clause-level com `clause_id` estavel.
- Normalizacao para busca lexical e classificacao heuristica.
- Classificacao por categorias academicas: coleta, finalidade, compartilhamento, retencao, direitos e seguranca.
- Highlights por dicionario lexico com offsets no texto original.
- Cards explicativos acionados por termo, com definicao leiga, exemplo, impacto, LGPD e icone.
- Mapeamento semiotico categoria/impacto/icone.
- Auditoria por clausula e rastreabilidade entre entrada, regra aplicada e saida.
- Relatorio academico exportavel em PDF no cliente.

## Nao objetivos

- Nao e chatbot.
- Nao depende de IA generativa para produzir conclusoes.
- Nao possui backend, banco, API routes, server actions, fila, autenticacao ou infraestrutura.
- Nao substitui analise juridica profissional.
- Nao promete cobertura juridica completa de todo documento.
- Nao tenta interpretar intencao subjetiva da plataforma alem das regras explicitadas no pipeline.
- Nao classifica risco legal definitivo; classifica impacto metodologico para leitura guiada.

## Criterios de aceitacao

- A Home deve permitir documento-base ou texto livre e iniciar o pipeline no cliente.
- O Reader deve apresentar uma clausula por vez, progresso, highlights, cards e auditoria.
- O Report deve exportar evidencias academicas sem chamar servico externo.
- O core deve produzir `clauses`, `highlights`, `explanations`, `audit` e `traceability`.
- Dados academicos devem existir em `data/` em formatos versionaveis.
- Mudancas no core devem passar por testes unitarios, contrato golden e harness.

## Invariantes

- Todo highlight deve apontar para offsets validos no texto original.
- Toda explicacao deve derivar de uma entrada do lexico.
- Toda clausula exibida no Reader deve ter categoria, impacto, resumo e trilha de auditoria.
- A UI nao deve apresentar o sistema como assistente conversacional.
- O pipeline deve ser deterministico para a mesma entrada, exceto campos temporais de sessao.

## Riscos

- Textos demonstrativos podem ser confundidos com corpus juridico final.
- Heuristicas podem gerar falso positivo ou falso negativo em textos fora do dominio.
- Offsets podem regredir se a normalizacao perder mapeamento com o texto original.
- A camada visual pode induzir interpretacao excessiva se nao estiver vinculada ao lexico e a auditoria.

## Relacao com o TCC

Este escopo sustenta a tese de democratizacao da compreensao por mediacao visual e linguagem clara, mantendo interpretabilidade. O artefato tecnico serve como prova de conceito auditavel, nao como "IA juridica".
