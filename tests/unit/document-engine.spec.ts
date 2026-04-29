import { describe, expect, it } from "vitest";
import { DOCUMENT_REPOSITORY } from "../../src/document_engine/data";
import { officialGroups, officialShelf } from "../../src/document_engine/vault";
import { toSessionDocument } from "../../src/document_engine/types";

describe("document engine repository", () => {
  it("keeps the official repository grouped by platform", () => {
    const groups = officialGroups();
    const shelf = officialShelf();

    expect(groups).toHaveLength(4);
    expect(shelf).toHaveLength(7);
    expect(groups.every((group) => group.documents.length > 0)).toBe(true);
  });

  it("requires official references for every document", () => {
    const shelf = officialShelf();

    expect(
      shelf.every((paper) => paper.link.startsWith("https://") && paper.groupId && paper.title)
    ).toBe(true);
  });

  it("uses the centralized data file as the repository source", () => {
    expect(officialGroups()).toBe(DOCUMENT_REPOSITORY);
  });

  it("adapts the active paper to the existing session document contract", () => {
    const paper = officialShelf()[0];

    expect(toSessionDocument(paper)).toMatchObject({
      doc_id: paper.id,
      name: paper.title,
      url: paper.link,
      status: "active",
    });
  });
});
