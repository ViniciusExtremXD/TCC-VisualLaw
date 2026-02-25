# Arquitetura do Sistema

## Visão Geral

```
┌──────────────────────────────────────────────────────────┐
│                    NAVEGADOR (CLIENT-SIDE)                │
│                                                          │
│  ┌──────────┐    ┌───────────────┐    ┌──────────────┐  │
│  │  HOME    │───▶│  PROCESSOR    │───▶│   READER     │  │
│  │(textarea)│    │  (pipeline)   │    │(cláusula 1/N)│  │
│  └──────────┘    └───────────────┘    └──────┬───────┘  │
│                         │                     │          │
│                         ▼                     ▼          │
│                  ┌─────────────┐       ┌────────────┐   │
│                  │ SESSION     │       │ TERM CARD  │   │
│                  │ CONTEXT     │◀─────▶│ /term/[id] │   │
│                  │(+storage)   │       └────────────┘   │
│                  └─────────────┘                         │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │              DADOS ESTÁTICOS (bundled)              │  │
│  │  lexicon.json │ mock/clauses.json │ icon-map.json  │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼ next build (output: export)
                    ┌──────────┐
                    │  /out    │──▶ GitHub Pages
                    └──────────┘
```

## Componentes do Pipeline

```
Texto Bruto
    │
    ▼
┌──────────────┐
│ 1. SEGMENTER │  Divide em cláusulas (parágrafos)
│  segmenter.ts│  Output: Clause[] (sem categoria)
└──────┬───────┘
       ▼
┌──────────────┐
│ 2. CLASSIFIER│  Classifica cada cláusula por keywords
│ classifier.ts│  Output: Clause[] (com categoria + impacto)
└──────┬───────┘
       ▼
┌──────────────┐
│ 3. HIGHLIGHT │  Encontra termos do léxico no texto
│highlighter.ts│  Output: HighlightsMap {clause_id: TermMatch[]}
└──────┬───────┘
       ▼
┌──────────────┐
│ 4. EXPLAINER │  Gera explanations por termo encontrado
│  explainer.ts│  Output: ExplanationsMap {term_id: Explanation}
└──────┬───────┘
       ▼
   PipelineResult
   { clauses, highlights, explanations }
```

## Estrutura de Diretórios

```
Projeto/
├── .github/workflows/deploy.yml   # CI/CD → GitHub Pages
├── public/.nojekyll               # Desativa Jekyll no GH Pages
├── data/
│   ├── corpus/                    # Textos-fonte (futuro)
│   ├── lexicon/lexicon.json       # Dicionário léxico (12 termos)
│   ├── visual/icon-map.json       # Mapa de ícones
│   ├── dataset/clauses.json       # Cláusulas corpus (futuro)
│   └── mock/clauses.json          # Cláusulas mock (10)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Layout raiz (header/footer)
│   │   ├── page.tsx               # Home (textarea + processar)
│   │   ├── globals.css            # Estilos globais + Tailwind
│   │   ├── reader/page.tsx        # Leitura guiada
│   │   └── term/[termId]/page.tsx # Card Visual Law (estático)
│   ├── lib/
│   │   ├── types.ts               # Tipos centrais
│   │   ├── normalizer.ts          # Normalização de texto
│   │   ├── segmenter.ts           # Segmentação em cláusulas
│   │   ├── classifier.ts          # Classificação heurística
│   │   ├── highlighter.ts         # Matching de termos
│   │   ├── explainer.ts           # Geração de explanations
│   │   ├── pipeline.ts            # Orquestração do pipeline
│   │   └── processor.ts           # Service layer (client-side)
│   ├── store/
│   │   └── SessionContext.tsx     # Estado da sessão + storage
│   └── components/
│       ├── TextInput.tsx          # Input de texto
│       ├── Badge.tsx              # Badge categoria/impacto
│       ├── ProgressBar.tsx        # Barra de progresso
│       ├── HighlightedText.tsx    # Texto com destaques
│       ├── TermModal.tsx          # Modal rápido de termo
│       ├── TermCard.tsx           # Card completo Visual Law
│       └── ExportButton.tsx       # Exportar JSONs
├── validation/                    # Instrumentos de validação
│   ├── pre_questionnaire.md
│   ├── post_questionnaire.md
│   ├── quiz_10_questions.md
│   ├── sus.md
│   └── metrics.md
└── docs/                          # Documentação acadêmica
    ├── methodology.md
    ├── scope_limitations.md
    ├── annotation_guidelines.md
    └── architecture.md
```

## Fluxo de Dados

### Fluxo "Processar" (texto colado)

1. Usuário cola texto na textarea da Home
2. Clica "Processar"
3. `processor.processText(text, docId)` roda client-side:
   - `segmenter.segmentText()` → cláusulas
   - `classifier.classifyClause()` → categoria + impacto
   - `highlighter.findTermsInText()` → matches com offsets
   - `explainer.generateExplanations()` → cards por termo
4. Resultado salvo no `SessionContext` + `sessionStorage`
5. Redireciona para `/reader`

### Fluxo "Carregar Demo" (mock)

1. Clica "Carregar demo (mock)"
2. `processor.loadMockSession()` carrega cláusulas do JSON bundled
3. Computa highlights em tempo real (offsets sempre corretos)
4. Mesmo fluxo de salvamento e redirecionamento

### Fluxo de Leitura

1. Reader carrega do `SessionContext`
2. Mostra cláusula N com highlights clicáveis
3. Clique em termo → `TermModal` com resumo rápido
4. "Ver card completo" → `/term/TERM_XXX` (página estática pré-gerada)
5. "Voltar para leitura" → `/reader` (estado preservado no sessionStorage)

## Tecnologias

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Framework | Next.js 15 (App Router) | SSG + static export |
| Linguagem | TypeScript | Type safety |
| Estilo | Tailwind CSS v4 | Utility-first, zero runtime |
| Ícones | Lucide React | Leve, tree-shakeable |
| State | React Context + sessionStorage | Zero deps, persiste entre nav |
| Deploy | GitHub Pages + Actions | Gratuito, CI/CD automático |

## Constraints de Deploy

- `output: 'export'` → gera `/out` com HTML estático
- `trailingSlash: true` → compatível com servidores estáticos
- `images.unoptimized: true` → sem Image Optimization API
- `basePath`/`assetPrefix` via env `NEXT_PUBLIC_REPO_NAME`
- `generateStaticParams()` no `/term/[termId]` → pré-gera todas as páginas
