# Skill - Run Quality Harness

## Objetivo

Executar regressao tecnica do core antes de alterar dados, lexico ou pipeline.

## Entradas

- Fixtures em `harness/fixtures`.
- Goldens em `harness/goldens`.
- Testes em `tests/unit` e `tests/contracts`.

## Saidas

- Resultado de `npm test`.
- Resultado de `npm run harness`.
- Build estatico validado quando necessario.

## Passos

1. Rodar `npm test`.
2. Rodar `npm run harness`.
3. Rodar `npm run build` antes de entregar mudanca que afeta UI, imports ou dados.
4. Rodar `npm run test:e2e` quando o ambiente local permitir navegador e tempo.
5. Se golden falhar, revisar se e regressao ou mudanca metodologica documentada.

## Criterios de qualidade

- Nenhum teste falha silenciosamente.
- Goldens so mudam com justificativa.
- Harness compara saida normalizada, ignorando timestamps.
- Relatorio final informa comandos executados.

## Erros comuns

- Atualizar golden sem ler diff.
- Validar apenas Playwright e ignorar core.
- Rodar build sem testes de contrato.

## O que NAO fazer

- Nao contornar falha apagando teste.
- Nao adicionar servidor para passar harness.
- Nao depender de rede para validar o core.
