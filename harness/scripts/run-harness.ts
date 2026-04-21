import fs from "node:fs";
import assert from "node:assert/strict";
import {
  HARNESS_FIXTURES,
  getHarnessPath,
  runFixture,
  type HarnessFixture,
} from "./pipeline-golden";

const shouldUpdate = process.argv.includes("--update");

function goldenPath(fixture: HarnessFixture): string {
  return getHarnessPath("goldens", `${fixture.id}.json`);
}

function readGolden(fixture: HarnessFixture) {
  return JSON.parse(fs.readFileSync(goldenPath(fixture), "utf8")) as unknown;
}

function writeGolden(fixture: HarnessFixture, actual: unknown): void {
  fs.writeFileSync(goldenPath(fixture), `${JSON.stringify(actual, null, 2)}\n`, "utf8");
}

for (const fixture of HARNESS_FIXTURES) {
  const actual = runFixture(fixture);

  if (shouldUpdate) {
    writeGolden(fixture, actual);
    console.log(`[harness] updated ${fixture.id}`);
    continue;
  }

  assert.deepEqual(actual, readGolden(fixture), `Golden mismatch for ${fixture.id}`);
  console.log(`[harness] ok ${fixture.id}`);
}
