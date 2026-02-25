# Escopo e Limitações

## Escopo do MVP

### O que o MVP faz

| Funcionalidade | Status |
|----------------|--------|
| Entrada de texto via textarea (colar) | ✅ Implementado |
| Segmentação em cláusulas por parágrafos | ✅ Implementado |
| Classificação heurística (keywords → 6 categorias) | ✅ Implementado |
| Matching de termos do dicionário léxico | ✅ Implementado |
| Destaques clicáveis com offsets (start/end) | ✅ Implementado |
| Cards Visual Law (significado, importância, ação) | ✅ Implementado |
| Navegação cláusula a cláusula com progresso | ✅ Implementado |
| Exportação dos JSONs (clauses, highlights, explanations) | ✅ Implementado |
| Deploy estático em GitHub Pages | ✅ Implementado |

### Escopo do corpus

| Plataforma | Documentos | Status |
|------------|-----------|--------|
| X (Twitter) | Termos de Serviço, Política de Privacidade | Pendente (dados reais) |
| WhatsApp | Política de Privacidade | Pendente |
| Instagram | Termos de Uso | Pendente |
| Facebook | Termos de Serviço, Política de Dados | Pendente |

### Escopo do léxico

- **Versão atual**: 12 termos seed
- **Meta final**: 30–60 termos jurídicos
- Cada termo inclui: definição leiga, "por que importa", "o que fazer", categoria, impacto, LGPD

## Limitações

### Técnicas

| Limitação | Justificativa |
|-----------|---------------|
| **Sem entrada PDF/OCR** | Foco no MVP; entrada por texto colado em textarea |
| **Sem IA/ML na classificação** | Heurística por keywords — auditável e determinística |
| **Matching exato (sem fuzzy avançado)** | Normalização de acento + plural básico; sem Word2Vec/embeddings |
| **Sem backend** | 100% client-side para deploy em GitHub Pages |
| **Sem autenticação** | Demo acadêmico, sem dados de usuário |
| **Sem banco de dados** | Dados em JSON estáticos + sessionStorage |
| **Corpus limitado** | Apenas X e Meta (WhatsApp, Instagram, Facebook) |

### Metodológicas

| Limitação | Mitigação |
|-----------|-----------|
| Amostra pequena (20-30 participantes) | Testes não-paramétricos, reportar tamanho de efeito |
| Sem randomização duplo-cega | Natureza do artefato impede cegamento do grupo experimental |
| Texto isolado (sem contexto de uso real) | Simula cenário realista com textos reais das plataformas |
| Viés de conveniência na amostra | Documentar perfil demográfico e generalizar com cautela |

### Fora de escopo

- Análise automática de contratos fora do corpus definido
- Tradução de termos para outros idiomas
- Integração com extensões de navegador
- Alertas automáticos de mudanças nos termos
- Sumarização por IA generativa
- Acessibilidade completa (WCAG 2.1 AAA)

## Evolução Planejada

| Fase | Funcionalidade |
|------|---------------|
| v0.1 (atual) | MVP com mock + pipeline heurístico |
| v0.2 | Dados reais do corpus (X + Meta) |
| v0.3 | Léxico expandido (30-60 termos) |
| v0.4 | Classificação por modelo ML leve |
| v0.5 | Logging de interações para análise |
| v1.0 | Validação experimental completa |
