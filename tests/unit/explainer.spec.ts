import { describe, expect, it } from "vitest";
import { generateExplanations } from "../../src/lib/explainer";
import { LEXICON } from "../../src/lib/lexicon-data";

describe("generateExplanations", () => {
  it("generates explanations only for highlighted lexicon terms", () => {
    const explanations = generateExplanations(
      {
        CLAUSE_001: [{ term_id: "TERM_001", match: "dados pessoais", start: 10, end: 24 }],
      },
      LEXICON
    );

    expect(Object.keys(explanations)).toEqual(["TERM_001"]);
    expect(explanations.TERM_001).toMatchObject({
      term_id: "TERM_001",
      termo_juridico: "dados pessoais",
      category: "data_collection",
      icon_id: "user-circle",
      impact: "high",
    });
    expect(explanations.TERM_001.plain_definition).toContain("pessoa");
    expect(explanations.TERM_001.practical_example.length).toBeGreaterThan(20);
  });
});
