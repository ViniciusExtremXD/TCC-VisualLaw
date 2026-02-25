# Visual Law — Termos Acessíveis

> **TCC** — Democratização da compreensão de Termos de Serviço e Políticas de Privacidade usando Visual Law.
> Instituto Presbiteriano Mackenzie.

## O que é

MVP que recebe o texto de uma Política de Privacidade ou Termos de Serviço, segmenta em cláusulas, classifica por categoria, identifica termos jurídicos e apresenta explicações visuais acessíveis (Visual Law).

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4**
- **100% client-side** (static export para GitHub Pages)
- Sem backend, sem banco, sem autenticação

## Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

## Como Buildar (Static Export)

```bash
# Gera a pasta /out com HTML estático
npm run build

# Testar o build localmente
npm run preview
# Abrir http://localhost:3000
```

## Deploy no GitHub Pages

### Setup (uma vez)

1. Crie o repositório no GitHub
2. Vá em **Settings → Pages → Source → GitHub Actions**
3. Faça push para a branch `main`
4. O workflow `.github/workflows/deploy.yml` roda automaticamente
5. O site estará em `https://<usuario>.github.io/<nome-repo>/`

### Configurar basePath (se necessário)

O `basePath` é configurado automaticamente pela variável `NEXT_PUBLIC_REPO_NAME`.

No GitHub Actions, isso já é lido automaticamente do nome do repositório. Para testar localmente com basePath:

```bash
NEXT_PUBLIC_REPO_NAME=nome-repo npm run build
npm run preview
```

## Estrutura do Projeto

```
├── data/
│   ├── corpus/          # Textos-fonte (futuro)
│   ├── lexicon/         # Dicionário léxico (12 termos)
│   ├── visual/          # Mapa de ícones
│   ├── dataset/         # Cláusulas do corpus real (futuro)
│   └── mock/            # Dados mock para demo
├── src/
│   ├── app/             # Páginas (Home, Reader, Term)
│   ├── lib/             # Pipeline de processamento
│   ├── store/           # Estado da sessão
│   └── components/      # Componentes React
├── validation/          # Instrumentos de validação
├── docs/                # Documentação acadêmica
└── .github/workflows/   # CI/CD
```

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Home — textarea para colar texto + processar |
| `/reader` | Leitura guiada — 1 cláusula por vez com highlights |
| `/term/[termId]` | Card Visual Law do termo jurídico |
| `/swagger/` | Swagger UI estático com contrato OpenAPI (planejado) |

## Dados

### Léxico (`data/lexicon/lexicon.json`)

12 termos jurídicos com:
- Definição em linguagem leiga
- "Por que importa" + "O que você pode fazer"
- Categoria, impacto, referências LGPD

### Mock (`data/mock/clauses.json`)

10 cláusulas representativas cobrindo as 6 categorias:
- Coleta de Dados
- Finalidade / Uso
- Compartilhamento / Terceiros
- Retenção / Armazenamento
- Direitos do Usuário (LGPD)
- Segurança / Incidentes

## Pipeline de Processamento

```
Texto → Segmentação → Classificação → Highlights → Explanations
```

1. **Segmenter**: divide por parágrafos, gera clause_ids
2. **Classifier**: heurística por keywords (6 categorias)
3. **Highlighter**: matching de termos do léxico (case-insensitive, sem acento, plural)
4. **Explainer**: gera cards Visual Law por termo encontrado

Tudo roda no navegador. Sem API. Sem ML.

## Licença

Projeto acadêmico — TCC.
