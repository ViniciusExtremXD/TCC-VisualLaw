import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  HARNESS_FIXTURES,
  getHarnessPath,
  runFixture,
  type HarnessFixture,
} from "../../harness/scripts/pipeline-golden";

function readGolden(fixture: HarnessFixture) {
  return JSON.parse(
    fs.readFileSync(getHarnessPath("goldens", `${fixture.id}.json`), "utf8")
  ) as unknown;
}

describe("pipeline golden contract", () => {
  for (const fixture of HARNESS_FIXTURES) {
    it(`matches normalized pipeline output for ${fixture.id}`, () => {
      expect(runFixture(fixture)).toEqual(readGolden(fixture));
    });
  }
});
