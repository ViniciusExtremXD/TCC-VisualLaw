import { describe, expect, it } from "vitest";
import { classifyClause, suggestLGPDRefs } from "../../src/lib/classifier";

describe("classifyClause", () => {
  it("classifies third-party sharing clauses by keyword evidence", () => {
    const result = classifyClause(
      "Podemos compartilhar dados pessoais com terceiros e parceiros comerciais."
    );

    expect(result.category).toBe("sharing_third_parties");
    expect(result.impact).toBe("high");
    expect(result.audit.method).toBe("heuristic_keywords");
    expect(result.audit.rules_fired.map((rule) => rule.rule_id)).toContain("RULE_CAT_SHARE_01");
    expect(result.audit.scores.sharing_third_parties).toBeGreaterThan(
      result.audit.scores.data_collection
    );
  });

  it("suggests LGPD references from the assigned category", () => {
    expect(suggestLGPDRefs("user_rights")).toEqual(["Art. 17", "Art. 18"]);
  });
});
