import { describe, expect, it } from "vitest";
import { findTermsInText } from "../../src/lib/highlighter";
import { LEXICON } from "../../src/lib/lexicon-data";

describe("findTermsInText", () => {
  it("detects lexicon terms with offsets in the original text", () => {
    const text = "Podemos compartilhar dados pessoais com terceiros.";
    const { matches, audits } = findTermsInText(text, LEXICON);

    const dadosPessoais = matches.find((match) => match.term_id === "TERM_001");
    const terceiros = matches.find((match) => match.term_id === "TERM_007");

    expect(dadosPessoais).toEqual({
      term_id: "TERM_001",
      match: "dados pessoais",
      start: 21,
      end: 35,
    });
    expect(text.slice(dadosPessoais!.start, dadosPessoais!.end)).toBe(dadosPessoais!.match);

    expect(terceiros).toEqual({
      term_id: "TERM_007",
      match: "terceiros",
      start: 40,
      end: 49,
    });
    expect(audits.find((audit) => audit.term_id === "TERM_007")?.lookup).toMatchObject({
      lexicon_field_used: "term",
      matching_rule_id: "LEXICON_PRIMARY_TERM",
    });
  });

  it("does not match terms inside larger words", () => {
    const { matches } = findTermsInText("O consentimentoimento esta incorreto.", LEXICON);

    expect(matches.some((match) => match.term_id === "TERM_002")).toBe(false);
  });
});
