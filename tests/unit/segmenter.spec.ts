import { describe, expect, it } from "vitest";
import { segmentText } from "../../src/lib/segmenter";

describe("segmentText", () => {
  it("segments heading/body pairs into stable clause ids", () => {
    const clauses = segmentText(
      [
        "1. Coleta de dados",
        "",
        "Coletamos dados pessoais para manter a conta.",
        "",
        "Direitos do titular",
        "",
        "Voce pode solicitar acesso e eliminacao dos dados.",
      ].join("\n"),
      "DOC_TEST"
    );

    expect(clauses).toHaveLength(2);
    expect(clauses[0]).toMatchObject({
      clause_id: "DOC_TEST_C001",
      doc_id: "DOC_TEST",
      title: "Coleta de dados",
      text: "Coletamos dados pessoais para manter a conta.",
      segmentEvidence: {
        rule: "heading_merge",
        evidence: "paragraph_index=0,merged_with=1",
      },
    });
    expect(clauses[1].clause_id).toBe("DOC_TEST_C002");
    expect(clauses[1].segmentEvidence.rule).toBe("heading_merge");
  });
});
