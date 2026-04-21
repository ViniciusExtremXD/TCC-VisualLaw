# SDD 006 - Protocolo de Validacao

## Objetivo

Medir se a leitura assistida clause-level melhora compreensao, localizacao de termos e percepcao de risco em documentos juridicos digitais.

## Participantes

Usuarios nao especialistas em direito, preferencialmente estudantes ou usuarios comuns de plataformas digitais. O protocolo deve registrar perfil minimo, familiaridade com LGPD e experiencia previa com politicas de privacidade.

## Materiais

- Corpus demonstrativo em `data/corpus`.
- Dataset clause-level em `data/dataset`.
- Instrumentos em `data/validation`.
- Saidas auditaveis do app: `clauses`, `highlights`, `explanations`, `traceability` e PDF.

## Fluxo sugerido

1. Aplicar pre-questionario.
2. Apresentar tarefa de leitura sem explicar internamente o pipeline.
3. Processar documento-base ou trecho definido.
4. Pedir que o participante navegue por clausulas e cards.
5. Aplicar teste de compreensao.
6. Aplicar pos-questionario de percepcao e usabilidade.
7. Coletar tempo, erros, cliques em cards e observacoes.

## Indicadores

- Acerto no teste de compreensao.
- Tempo para localizar uma clausula relevante.
- Capacidade de explicar um termo juridico em linguagem propria.
- Identificacao de direito LGPD relacionado.
- Percepcao de clareza, confianca e sobrecarga visual.

## Criterios de aceitacao da prova de conceito

- Participante identifica ao menos uma clausula de alto impacto.
- Participante explica pelo menos dois termos destacados sem copiar o texto original.
- Relatorio exportado contem evidencia suficiente para reproduzir a sessao.
- Feedback qualitativo aponta se cards e icones ajudaram ou confundiram.

## Limitacoes

- A amostra de TCC pode ser pequena e exploratoria.
- O resultado nao prova validade juridica universal.
- Corpus adaptado melhora controle experimental, mas reduz variabilidade de documentos reais.
