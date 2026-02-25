# Guia de Anotação — Cláusulas e Termos

> Este guia orienta a anotação manual de cláusulas e termos para o corpus do TCC.

## 1. Segmentação de Cláusulas

### Critérios para delimitar uma cláusula

| Critério | Exemplo |
|----------|---------|
| Parágrafo com tema único | "Coletamos dados pessoais quando..." |
| Seção com título explícito | "3. Compartilhamento com Terceiros" |
| Bloco de lista com contexto | Parágrafo + bullets subordinados |
| Separação por 2+ quebras de linha | Parágrafo visual distinto |

### ID da cláusula

Formato: `{DOC_ID}_C{###}`

- `DOC_ID`: identificador do documento (ex: `X_PRIVACY`, `META_PRIVACY`, `WA_PRIVACY`)
- `C{###}`: número sequencial com zero-padding (ex: `C001`, `C002`)

Exemplo: `X_PRIVACY_C001`

### Campos da cláusula

```json
{
  "clause_id": "X_PRIVACY_C001",
  "doc_id": "X_PRIVACY",
  "title": "Coleta de Dados Pessoais",
  "text": "Coletamos seus dados pessoais quando...",
  "category": "data_collection",
  "impact": "high",
  "lgpd_refs": ["Art. 7°, I", "Art. 9°"]
}
```

## 2. Categorias de Cláusula

| Código | Rótulo | Descrição | Exemplos de keywords |
|--------|--------|-----------|----------------------|
| `data_collection` | Coleta de Dados | Quais dados são coletados e como | dados pessoais, coletar, cookies, localização |
| `purpose_use` | Finalidade / Uso | Para que os dados são usados | finalidade, personalizar, publicidade, melhorar |
| `sharing_third_parties` | Compartilhamento | Com quem os dados são compartilhados | terceiros, parceiros, compartilhar, transferir |
| `retention_storage` | Retenção | Por quanto tempo e como os dados são guardados | reter, armazenar, prazo, anonimização |
| `user_rights` | Direitos do Usuário | Direitos LGPD do titular | direito, consentimento, revogar, portabilidade |
| `security_incidents` | Segurança | Medidas de segurança e incidentes | segurança, incidente, vazamento, proteger |

### Regras de classificação

1. **Uma categoria por cláusula** (a predominante)
2. Se a cláusula trata de dois temas igualmente, priorizar: user_rights > sharing > data_collection > purpose > retention > security
3. Usar a lista de keywords como referência, não como regra absoluta

## 3. Anotação de Termos no Léxico

### ID do termo

Formato: `TERM_{###}` (sequencial, global)

### Campos do termo

```json
{
  "term_id": "TERM_001",
  "term": "dados pessoais",
  "aliases": ["dado pessoal", "informações pessoais"],
  "category": "data_collection",
  "meaning": "Definição em linguagem leiga...",
  "why_it_matters": "Explicação de relevância...",
  "what_you_can_do": "Ação que o usuário pode tomar...",
  "impact": "high",
  "icon_id": "user-circle",
  "lgpd_refs": ["Art. 5°, I", "Art. 18, II"]
}
```

### Critérios para inclusão no léxico

| Incluir | Não incluir |
|---------|-------------|
| Termos jurídicos/técnicos que o público geral não entende | Palavras comuns (ex: "informação", "empresa") |
| Conceitos da LGPD | Termos muito específicos de um único documento |
| Termos que aparecem em ≥ 2 documentos do corpus | Jargão técnico de TI sem relação com privacidade |

### Como preencher os campos

| Campo | Orientação |
|-------|------------|
| `meaning` | Máximo 2 frases. Linguagem de 8ª série. Sem jargão. |
| `why_it_matters` | Conectar com a vida real do usuário. "Isso importa porque..." |
| `what_you_can_do` | Ação concreta. Mencionar artigo da LGPD quando aplicável. |
| `impact` | `high` = afeta diretamente privacidade. `medium` = relevante. `low` = informativo. |
| `aliases` | Variações que aparecem nos textos reais. Incluir singular/plural. |

## 4. Impacto

| Nível | Critério |
|-------|----------|
| `high` | Envolve compartilhamento, coleta sensível, direitos, incidentes |
| `medium` | Relevante para privacidade mas com controle parcial do usuário |
| `low` | Informativo, técnico, sem implicação direta de risco |

## 5. Referências LGPD

Usar formato abreviado: `Art. {número}°, {inciso}`

Exemplos:
- `Art. 5°, I` — Definição de dado pessoal
- `Art. 7°, I` — Consentimento como base legal
- `Art. 18` — Direitos do titular (genérico)
- `Art. 18, VII` — Direito a informações sobre compartilhamento
- `Art. 48` — Comunicação de incidentes

## 6. Checklist do Anotador

- [ ] Cada cláusula tem ID único seguindo o padrão
- [ ] Cada cláusula tem exatamente 1 categoria
- [ ] Offsets de highlight batem com o texto (verificar start/end)
- [ ] Termos do léxico têm definição leiga (não jurídica)
- [ ] Aliases cobrem variações encontradas nos textos
- [ ] lgpd_refs usam formato correto
- [ ] Impact está classificado como high/medium/low
