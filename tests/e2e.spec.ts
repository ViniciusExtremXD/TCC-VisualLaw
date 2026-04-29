import { expect, test, type Locator } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const repo = process.env.NEXT_PUBLIC_REPO_NAME || "";
const basePath = repo ? `/${repo}` : "";

const artifactsRoot = path.resolve("artifacts");
const screenshotsDir = path.join(artifactsRoot, "screenshots");
const logsDir = path.join(artifactsRoot, "logs");
const corpusManifestPath = path.resolve("data", "corpus", "corpus-manifest.json");
const expectedPaperCount = JSON.parse(fs.readFileSync(corpusManifestPath, "utf8")).length;

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir: string) {
  ensureDir(dir);
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

async function getTop(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error("Elemento nao visivel para calculo de ordem na Home.");
  }
  return box.y;
}

test.describe("Visual Law academic static export", () => {
  test.beforeAll(() => {
    cleanDir(screenshotsDir);
    cleanDir(logsDir);
  });

  test("home principal + document engine + fluxo guiado", async ({ page }) => {
    test.setTimeout(180_000);

    const staticAssetFailures: string[] = [];
    const staticAssetSuccesses: string[] = [];

    page.on("response", (response) => {
      const url = response.url();
      if (!url.includes("/_next/static/")) return;
      if (response.status() >= 400) {
        staticAssetFailures.push(`${response.status()} ${url}`);
      } else {
        staticAssetSuccesses.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(`${basePath}/`, { waitUntil: "domcontentloaded" });

    const entryBlock = page.getByTestId("home-entry-block");
    const cardsBlock = page.getByTestId("home-flow-cards");
    const processBlock = page.getByTestId("home-process-block");
    const quickTranslation = page.getByTestId("quick-translation-accordion");

    await expect(entryBlock).toBeVisible();
    await expect(cardsBlock).toBeVisible();
    await expect(processBlock).toBeVisible();
    await expect(quickTranslation).toBeVisible();

    const entryTop = await getTop(entryBlock);
    const cardsTop = await getTop(cardsBlock);
    const processTop = await getTop(processBlock);
    expect(entryTop).toBeLessThan(cardsTop);
    expect(cardsTop).toBeLessThan(processTop);

    await page.getByTestId("document-engine-open").click();
    await expect(page.getByTestId("document-engine-modal")).toBeVisible();
    await expect(page.getByTestId("document-engine-source-total")).toContainText(
      `${expectedPaperCount}`
    );
    await expect(page.getByTestId("document-engine-group-trigger")).toHaveCount(4);
    await expect(page.getByTestId("document-engine-row")).toHaveCount(2);
    await expect(page.getByTestId("document-engine-original").first()).toHaveAttribute(
      "target",
      "_blank"
    );

    await page.getByTestId("document-engine-group-trigger").filter({ hasText: "Meta" }).click();
    await expect(page.getByTestId("document-engine-row")).toHaveCount(4);
    await page.getByTestId("document-engine-select").nth(2).click();
    await expect(page.getByTestId("document-engine-modal")).toHaveCount(0);
    await expect(page.getByTestId("document-engine")).toContainText("Meta/Facebook Terms");
    await expect(page.getByTestId("document-engine-file")).toHaveCount(0);

    await page.locator("#text-input").fill(
      "Coletamos dados pessoais para manter a conta e compartilhar informacoes com terceiros."
    );
    await expect(page.locator("#text-input")).toHaveValue(/Coletamos dados pessoais/);

    await page.screenshot({
      path: path.join(screenshotsDir, "HOME_DOCUMENT_ENGINE.png"),
      fullPage: true,
    });

    await page.getByRole("button", { name: /Colar exemplo/i }).click();
    await page.getByRole("button", { name: /^Processar texto$/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));
    await expect(page.getByText(/Leitura guiada acad[e\u00ea]mica/i)).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "READER_GUIADO.png"),
      fullPage: true,
    });

    fs.writeFileSync(
      path.join(logsDir, "network-static-assets.json"),
      JSON.stringify(
        {
          repo,
          ok_count: staticAssetSuccesses.length,
          failures: staticAssetFailures,
        },
        null,
        2
      ),
      "utf8"
    );

    expect(staticAssetFailures, "Nenhum 404/5xx esperado em /_next/static").toEqual([]);
    expect(staticAssetSuccesses.length).toBeGreaterThan(0);
  });

  test("document engine ignora registros externos e mantem repositorio oficial", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "external_corrupted_documents",
        JSON.stringify([
          { name: "Documento legado", status: "active" },
          {
            id: "PAPER_VALID",
            title: "Fonte valida",
            content: "Conteudo valido para selecao.",
            source: "Teste",
            kind: "privacy",
            locale: "pt-BR",
            stamp: "2026-04-29",
            link: "",
          },
        ])
      );
      window.localStorage.setItem("visual_law_document_engine_selected_v1", "DOCUMENTO_INEXISTENTE");
    });

    await page.goto(`${basePath}/`, { waitUntil: "domcontentloaded" });
    await page.getByTestId("document-engine-open").click();

    await expect(page.getByTestId("document-engine-modal")).toBeVisible();
    await expect(page.getByTestId("document-engine-source-total")).toContainText(
      `${expectedPaperCount}`
    );
    await expect(page.getByTestId("document-engine-group-trigger")).toHaveCount(4);
    await expect(page.getByTestId("document-engine-list")).not.toContainText("Fonte valida");
    await page.getByTestId("document-engine-select").first().click();
    await expect(page.getByTestId("document-engine-modal")).toHaveCount(0);
    await expect(page.getByTestId("document-engine")).toContainText("X Terms of Service");
  });
});
