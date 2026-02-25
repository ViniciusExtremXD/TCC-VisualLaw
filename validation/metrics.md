# Métricas de Validação — Como Medir

## Variáveis Dependentes

### 1. Compreensão (principal)

| Métrica | Instrumento | Como medir |
|---------|-------------|------------|
| Score de acertos | Quiz 10 questões | Número de respostas corretas (0–10) |
| Melhoria absoluta | Quiz pré vs pós | Score_pós − Score_pré |
| Melhoria relativa | Quiz pré vs pós | ((Score_pós − Score_pré) / Score_pré) × 100% |
| Compreensão qualitativa | Pré/Pós Q aberta | Análise temática das respostas abertas |

### 2. Tempo de Leitura

| Métrica | Instrumento | Como medir |
|---------|-------------|------------|
| Tempo total (pré) | Cronômetro manual | Tempo para ler o trecho sem Visual Law (segundos) |
| Tempo total (pós) | Cronômetro / log | Tempo para completar leitura guiada no MVP (segundos) |
| Tempo por cláusula | Log interno | Tempo médio por cláusula navegada |

> **Implementação futura**: O MVP pode registrar timestamps de navegação (`window.performance.now()`) para maior precisão.

### 3. Confiança

| Métrica | Instrumento | Como medir |
|---------|-------------|------------|
| Autoconfiança (pré) | Pré-questionário Q9 | Likert 1-5 |
| Autoconfiança (pós) | Pós-questionário Q4 | Likert 1-5 |
| Delta confiança | Pós − Pré | Diferença simples |

### 4. Usabilidade (opcional)

| Métrica | Instrumento | Como medir |
|---------|-------------|------------|
| Score SUS | Questionário SUS | Cálculo padrão (0-100) |
| Percepção de utilidade | Pós-questionário Q6-Q9 | Likert médio |

## Variáveis Independentes (controle)

| Variável | Valores | Origem |
|----------|---------|--------|
| Grupo | Controle (sem Visual Law) vs Experimental (com Visual Law) | Alocação aleatória |
| Escolaridade | Médio / Graduação / Pós | Pré-questionário Q2 |
| Familiaridade jurídica | Sim / Não | Pré-questionário Q3 |
| Frequência de leitura | Sempre / Às vezes / Raramente / Nunca | Pré-questionário Q4 |
| Conhecimento LGPD | Sim / Parcial / Não | Pré-questionário Q5 |

## Design Experimental

```
Grupo Controle:     Pré-teste → Lê texto bruto    → Quiz → Pós-teste
Grupo Experimental: Pré-teste → Usa MVP Visual Law → Quiz → Pós-teste
```

### Tamanho Amostral Sugerido

- Mínimo: 15 participantes por grupo (30 total)
- Ideal: 25 por grupo (50 total)
- Mínimo absoluto para TCC: 10 por grupo (20 total)

### Testes Estatísticos Sugeridos

| Comparação | Teste |
|------------|-------|
| Pré vs Pós (mesmo grupo) | Teste t pareado / Wilcoxon |
| Controle vs Experimental | Teste t independente / Mann-Whitney U |
| Correlação com variáveis de perfil | Spearman / Chi-quadrado |

## Coleta de Dados no MVP

### Dados automáticos (implementação futura)

```typescript
interface SessionLog {
  session_id: string;
  started_at: string;
  clauses_read: number;
  total_clauses: number;
  terms_clicked: string[];     // term_ids clicados
  cards_viewed: string[];      // term_ids cujo card completo foi aberto
  time_per_clause_ms: number[];
  total_time_ms: number;
  exported_json: boolean;
}
```

### Dados manuais (pesquisador)

- Tempo de leitura com cronômetro
- Observações comportamentais
- Respostas dos questionários

## Referências

- Brooke, J. (1996). "SUS: A Quick and Dirty Usability Scale."
- Likert, R. (1932). "A Technique for the Measurement of Attitudes."
- LGPD (Lei 13.709/2018)
