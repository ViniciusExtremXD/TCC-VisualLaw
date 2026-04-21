/* ========================================================
 * normalizer.ts — Normalização de texto para matching
 * Case-insensitive, remoção de acentos, plural básico
 * ======================================================== */

/**
 * Remove acentos/diacríticos de uma string.
 */
export function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Normaliza uma string para comparação:
 * - lowercase
 * - sem acentos
 * - trim
 */
export function normalize(str: string): string {
  return removeAccents(str.toLowerCase().trim());
}

/**
 * Gera variações de plural/singular simplificadas para PT-BR.
 * Ex: "dados pessoais" → ["dados pessoais", "dado pessoal"]
 * Ex: "cookie" → ["cookie", "cookies"]
 */
export function generateVariations(term: string): string[] {
  const variations = new Set<string>();
  variations.add(term);

  const singular = term.replace(/([A-Za-zÀ-ÿ0-9_])s\b/g, "$1");
  if (singular !== term) {
    variations.add(singular);
  }

  const words = term.split(/\s+/);
  const lastWord = words[words.length - 1];
  if (!lastWord.endsWith("s")) {
    const plural = [...words.slice(0, -1), `${lastWord}s`].join(" ");
    variations.add(plural);
  }

  if (term.endsWith("ões")) {
    variations.add(term.slice(0, -3) + "ão");
  } else if (term.endsWith("ão")) {
    variations.add(term.slice(0, -2) + "ões");
  }

  return Array.from(variations);
}
