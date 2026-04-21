# Harness de Regressao

O harness executa o pipeline real contra fixtures controladas e compara a saida normalizada com goldens versionados. Ele valida o nucleo academico sem depender da UI.

## Estrutura

- `fixtures/`: textos brutos usados como entrada.
- `goldens/`: saidas esperadas normalizadas.
- `scripts/`: runner e normalizador compartilhado com testes de contrato.

## Como rodar

```bash
npm run harness
```

Para regenerar goldens apos mudanca metodologica documentada:

```bash
npm run harness:update
```

## O que o harness valida

- Segmentacao clause-level.
- Classificacao e impacto.
- Highlights com offsets.
- Explicacoes derivadas do lexico.
- Auditoria minima por clausula.
- Rastreabilidade entre clausula, termo e explicacao.

## Politica

Falha no harness deve ser tratada como regressao ate que exista justificativa no SDD, nos dados ou na documentacao metodologica.
