# Visual Law TCC (Modo Academico)

MVP academico para leitura guiada de Termos de Servico e Politicas de Privacidade com rastreabilidade total.

## Visao geral

- Next.js App Router + TypeScript + Tailwind v4
- 100% client-side, sem backend, sem API routes, sem server actions
- Estado em `localStorage`
- Deploy estatico no GitHub Pages

## Fluxo academico implementado

1. Gerenciador de documentos (CRUD + ativo/inativo)
2. Mapa do processo semiótico e de auditoria
3. Segmentacao, classificacao, destaque lexico e evidencias
4. Card completo por termo (sem modal intermediario)
5. FAQ por termo (lexicon + fallback heuristico)
6. Relatorio final em PDF via rota `/report` print-friendly

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test:e2e
```

## Build estatico para GitHub Pages

```bash
# limpeza recomendada
rm -rf .next out
npm ci
NEXT_PUBLIC_REPO_NAME=TCC-VisualLaw npm run build
npm run preview
```

URLs locais apos `npm run preview`:

- `http://localhost:3000/TCC-VisualLaw/`
- `http://localhost:3000/TCC-VisualLaw/reader/`
- `http://localhost:3000/TCC-VisualLaw/report/`

## Como gerar PDF

1. Processar texto na Home e abrir o Reader.
2. Clicar em `Gerar Relatorio PDF`.
3. Na rota `/report`, clicar `Imprimir / Salvar PDF`.
4. No dialogo do navegador, escolher `Salvar como PDF`.

## Testes E2E (Playwright)

A suite valida:

- mapa semiótico da Home
- CRUD de documentos com persistencia
- processamento para Reader
- clique em highlight abre card completo direto
- relatorio `/report` pronto para PDF
- assets `_next/static` sem 404

Comando:

```bash
NEXT_PUBLIC_REPO_NAME=TCC-VisualLaw npm run test:e2e
```

## Estrutura principal

- `src/app/page.tsx` - Home academica
- `src/app/reader/page.tsx` - Leitura guiada + rastreamento + CTA PDF
- `src/app/report/page.tsx` - Relatorio print-friendly
- `src/lib/docRegistry.ts` - CRUD localStorage de documentos
- `src/data/visual/document-semiotic-map.ts` - mapeamento semantico de documentos e processo
- `src/data/mock/lexicon.ts` - FAQ por termo
- `tests/e2e.spec.ts` - smoke/e2e academico

## GitHub Pages

`next.config.ts` usa:

- `output: 'export'`
- `trailingSlash: true`
- `images.unoptimized: true`
- `basePath` e `assetPrefix` por `NEXT_PUBLIC_REPO_NAME`

Workflow: `.github/workflows/deploy.yml`.
