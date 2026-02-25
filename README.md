# Visual Law TCC (Modo Acadêmico)

MVP acadêmico para leitura guiada de Termos de Serviço e Políticas de Privacidade com rastreabilidade total.

## Visão geral

- Next.js App Router + TypeScript + Tailwind v4
- 100% client-side, sem backend, sem API routes, sem server actions
- Estado em `localStorage`
- Deploy estático no GitHub Pages

## Fluxo acadêmico implementado

1. Gerenciador de documentos (CRUD + ativo/inativo)
2. Mapa do processo semiótico e de auditoria (accordion)
3. Segmentação, classificação, destaque léxico e evidências
4. Card completo por termo (sem modal intermediário)
5. FAQ por termo (léxico + fallback heurístico)
6. Geração automática de PDF real (`pdf-lib`) a partir do Reader
7. Rota `/report` como visualização acadêmica da sessão

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test:e2e
```

## Build estático para GitHub Pages

```bash
# limpeza recomendada
rm -rf .next out
npm ci
NEXT_PUBLIC_REPO_NAME=TCC-VisualLaw npm run build
npm run preview
```

URLs locais após `npm run preview`:

- `http://localhost:3000/TCC-VisualLaw/`
- `http://localhost:3000/TCC-VisualLaw/reader/`
- `http://localhost:3000/TCC-VisualLaw/report/`

## Como gerar PDF

1. Processar texto na Home e abrir o Reader.
2. Clicar em `Gerar PDF`.
3. O download do arquivo `.pdf` inicia automaticamente.
4. A rota `/report` abre em seguida para visualização acadêmica.

## Testes E2E (Playwright)

A suíte valida:

- ordem dos blocos da Home (Entrada -> Cards -> Mapa)
- mapa do processo colapsado por padrão
- Swagger em nova guia (`target="_blank"`)
- CRUD de documentos com persistência
- processamento para Reader
- clique em highlight abre card completo direto
- download de PDF válido (`%PDF-` e tamanho > 1KB)
- assets `_next/static` sem 404

Comando:

```bash
NEXT_PUBLIC_REPO_NAME=TCC-VisualLaw npm run test:e2e
```

## Estrutura principal

- `src/app/page.tsx` - Home acadêmica
- `src/app/reader/page.tsx` - leitura guiada + rastreamento + geração de PDF
- `src/app/report/page.tsx` - relatório acadêmico visual
- `src/lib/pdf/reportPdf.ts` - geração programática do PDF (`pdf-lib`)
- `src/lib/docRegistry.ts` - CRUD localStorage de documentos
- `src/data/visual/document-semiotic-map.ts` - mapeamento semântico de documentos e processo
- `src/data/mock/lexicon.ts` - FAQ por termo
- `tests/e2e.spec.ts` - smoke/e2e acadêmico

## GitHub Pages

`next.config.ts` usa:

- `output: 'export'`
- `trailingSlash: true`
- `images.unoptimized: true`
- `basePath` e `assetPrefix` por `NEXT_PUBLIC_REPO_NAME`

Workflow: `.github/workflows/deploy.yml`.
