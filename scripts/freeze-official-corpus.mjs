#!/usr/bin/env node

console.warn(
  [
    "scripts/freeze-official-corpus.mjs foi descontinuado.",
    "Use o fluxo oficial reprodutivel:",
    "  npm run corpus:capture:primary",
    "  npm run corpus:manifest",
    "  npm run corpus:validate",
    "",
    "Este wrapper nao captura nem reescreve dados para evitar retorno acidental ao corpus demonstrativo.",
  ].join("\n")
);

