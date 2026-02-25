import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const repo = process.env.NEXT_PUBLIC_REPO_NAME || "TCC-VisualLaw";
const basePath = `/${repo}`;

const artifactsRoot = path.resolve("artifacts");
const screenshotsDir = path.join(artifactsRoot, "screenshots");
const logsDir = path.join(artifactsRoot, "logs");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanDir(dir: string) {
  ensureDir(dir);
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
}

test.describe("Visual Law academic static export", () => {
  test.beforeAll(() => {
    cleanDir(screenshotsDir);
    cleanDir(logsDir);
  });

  test("home academic map + doc CRUD + reader + term card direto + report PDF", async ({ page }) => {
    const staticAssetFailures: string[] = [];
    const staticAssetSuccesses: string[] = [];

    page.on("response", (response) => {
      const url = response.url();
      if (!url.includes(`/${repo}/_next/static/`)) return;
      if (response.status() >= 400) {
        staticAssetFailures.push(`${response.status()} ${url}`);
      } else {
        staticAssetSuccesses.push(`${response.status()} ${url}`);
      }
    });

    await page.goto(`${basePath}/`, { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/Mapa do Processo/i)).toBeVisible();
    await expect(page.getByTestId("process-map")).toBeVisible();

    // CRUD documents + persistence
    await page.getByTestId("doc-add-button").click();
    await page.getByTestId("doc-name-input").fill("Documento Teste E2E");
    await page.getByTestId("doc-platform-input").fill("Plataforma Teste");
    await page.getByTestId("doc-save-button").click();

    await expect(page.getByText("Documento Teste E2E")).toBeVisible();

    await page.reload();
    await expect(page.getByText("Documento Teste E2E")).toBeVisible();

    const testDocCard = page.locator('[data-testid="doc-item"]', {
      hasText: "Documento Teste E2E",
    });
    await testDocCard.getByRole("button", { name: /Remover/i }).click();
    await expect(page.getByText("Documento Teste E2E")).toHaveCount(0);

    await page.screenshot({
      path: path.join(screenshotsDir, "HOME_ACADEMIC_DOC_MANAGER.png"),
      fullPage: true,
    });

    // Process text -> reader
    await page.getByRole("button", { name: /Colar exemplo/i }).click();
    await page.getByRole("button", { name: /Processar texto/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));

    await expect(page.getByTestId("processing-trace")).toBeVisible();
    await expect(page.getByText(/Rastreamento do Processamento/i)).toBeVisible();

    // Term card opens directly (no highlight proof modal)
    const firstHighlight = page.locator("mark.term-highlight").first();
    await expect(firstHighlight).toBeVisible();
    await firstHighlight.click();

    await expect(page.getByText(/Evidencia \/ Auditoria do Termo/i)).toBeVisible();
    await expect(page.getByText(/Principais duvidas/i)).toBeVisible();
    await expect(page.getByText(/Prova do Highlight/i)).toHaveCount(0);

    await page.screenshot({
      path: path.join(screenshotsDir, "READER_TERM_CARD_DIRETO.png"),
      fullPage: true,
    });

    await page.getByRole("button", { name: /Fechar card do termo/i }).click();

    // Report/PDF route
    await page.getByRole("link", { name: /Gerar Relatorio PDF/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/report/?$`));

    await expect(page.getByTestId("report-page")).toBeVisible();
    await expect(page.getByText(/Relatorio Academico Visual Law/i)).toBeVisible();
    await expect(page.getByText(/Analise por clausula/i)).toBeVisible();
    await expect(page.getByTestId("print-report-button")).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotsDir, "REPORT_READY_FOR_PDF.png"),
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
});
