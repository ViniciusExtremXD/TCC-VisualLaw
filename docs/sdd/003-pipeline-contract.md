# SDD 003 - Contrato do Pipeline

## Entrada

```ts
runPipeline(rawText: string, docId: string, lexicon: LexiconEntry[]): PipelineResult
```

`rawText` deve ser texto juridico ou parajuridico em portugues. `docId` identifica o documento na sessao. `lexicon` deve seguir o contrato de `LexiconEntry`.

## Saida

```ts
interface PipelineResult {
  clauses: Clause[];
  highlights: Record<string, TermMatch[]>;
  explanations: Record<string, Explanation>;
  audit: AuditSession;
  traceability: TraceabilitySession;
}
```

## Etapas

1. Ingestao: recebe texto bruto.
2. Segmentacao: gera blocos clause-level com `clause_id`, `doc_id`, titulo e evidencia.
3. Normalizacao: cria representacao para matching sem alterar o texto original.
4. Classificacao: aplica regras por categoria e calcula impacto.
5. Highlight lexical: encontra termos/aliases e registra offsets no texto original.
6. Explicacao: gera card a partir do lexico para cada `term_id` encontrado.
7. Semiotic mapping: associa categoria/impacto a icone, cor e interpretacao visual.
8. Auditoria: registra regras, evidencias e saidas por clausula.
9. Relatorio/exportacao: transforma a sessao em evidencia academica.

## Invariantes

- `clause_id` deve ser unico dentro de um resultado.
- `highlights[clause_id]` so pode conter offsets dentro de `clause.text`.
- `text.slice(start, end)` deve ser igual ao `match` armazenado.
- `explanations` so deve conter termos presentes em `highlights`.
- `audit.clauses_audit[clause_id]` deve existir para toda clausula.
- `traceability.records.length` deve acompanhar `clauses.length`.

## Campos temporais

`audit.session_id`, `audit.created_at`, `traceability.session_id` e `traceability.created_at` podem variar entre execucoes. Testes golden devem normalizar esses campos.

## Criterios de aceitacao

- Texto com quatro paragrafos deve gerar quatro clausulas quando nao houver titulo mesclavel.
- Termos com acento no lexico devem ser detectados em textos sem acento quando semanticamente equivalentes.
- Uma classificacao por palavra-chave deve registrar `rules_fired`.
- Uma explicacao deve conter traducao direta, definicao leiga, exemplo pratico, LGPD, impacto e icone.

## Falhas esperadas e tratamento

- Texto vazio ou curto pode gerar zero clausulas ou fluxo bloqueado pela UI.
- Termo inexistente no lexico nao deve produzir card inventado.
- Ambiguidade de categoria deve ser resolvida pela maior pontuacao heuristica e auditada.
