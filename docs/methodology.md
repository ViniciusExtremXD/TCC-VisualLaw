# Metodologia — DSR + Estudo Experimental

## Framework Metodológico

O projeto adota **Design Science Research (DSR)** como metodologia principal, complementada por um estudo experimental comparativo para validação.

### DSR — Ciclo de Desenvolvimento

```
Problema → Objetivos → Design → Desenvolvimento → Demonstração → Avaliação → Comunicação
```

| Etapa | Atividade neste TCC |
|-------|---------------------|
| **Problema** | Termos de serviço são escritos em "legalês" e a maioria dos usuários não os lê nem compreende |
| **Objetivos** | Criar um artefato que melhore a compreensão usando Visual Law + dicionário léxico |
| **Design** | Definir categorias, léxico, pipeline de processamento e UI de leitura guiada |
| **Desenvolvimento** | MVP Next.js com segmentação, classificação heurística e cards Visual Law |
| **Demonstração** | Demo funcional com textos mock das plataformas X e Meta |
| **Avaliação** | Estudo experimental com questionários pré/pós e quiz de compreensão |
| **Comunicação** | Monografia do TCC |

## Design Experimental

### Grupos

| Grupo | n mínimo | Atividade |
|-------|----------|-----------|
| **Controle** | 15 | Lê o texto bruto da política de privacidade |
| **Experimental** | 15 | Usa o MVP Visual Law para ler o mesmo texto |

### Protocolo

```
1. Assinatura do TCLE
2. Pré-questionário (perfil + compreensão inicial)
3. Atividade:
   - Controle: leitura do texto bruto
   - Experimental: uso do MVP
4. Quiz de compreensão (10 questões)
5. Pós-questionário (clareza + confiança + utilidade)
6. SUS (apenas grupo experimental)
```

### Variável Independente
- **Tipo de apresentação**: texto bruto vs Visual Law (MVP)

### Variáveis Dependentes
- Compreensão (score do quiz)
- Confiança (Likert)
- Tempo de leitura
- Usabilidade (SUS, grupo experimental)

## Análise de Dados

1. **Estatística descritiva**: média, mediana, desvio padrão por grupo
2. **Comparação entre grupos**: teste t independente (ou Mann-Whitney se n < 30)
3. **Comparação pré/pós**: teste t pareado (ou Wilcoxon)
4. **Correlações**: perfil × compreensão (Spearman)

## Aspectos Éticos

- Participação voluntária com TCLE
- Dados anonimizados
- Sem coleta de dados sensíveis
- Resultados agregados (não individuais)
