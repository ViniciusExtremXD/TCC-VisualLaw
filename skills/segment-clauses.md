# Skill - Segment Clauses

## Objetivo

Segmentar texto juridico em unidades clause-level auditaveis.

## Entradas

- Texto bruto em portugues.
- `doc_id` do documento.

## Saidas

- Lista de clausulas com `clause_id`, titulo, texto e evidencia de segmentacao.
- Atualizacao de goldens quando a regra mudar.

## Passos

1. Normalizar quebras de linha sem alterar o texto exibido.
2. Separar paragrafos por linhas em branco.
3. Mesclar titulo curto com paragrafo seguinte quando aplicavel.
4. Gerar IDs estaveis no formato `DOC_CNNN`.
5. Registrar regra e evidencia usadas para cada clausula.

## Criterios de qualidade

- Segmentacao e deterministica.
- Nenhum trecho relevante desaparece.
- A ordem original e preservada.
- Cada clausula e suficientemente pequena para leitura guiada.

## Erros comuns

- Segmentar por frase curta demais e perder contexto juridico.
- Juntar clausulas heterogeneas em bloco longo.
- Gerar IDs dependentes de timestamp.

## O que NAO fazer

- Nao resumir texto durante segmentacao.
- Nao classificar nesta etapa.
- Nao usar IA generativa para decidir limites de clausula no MVP.
