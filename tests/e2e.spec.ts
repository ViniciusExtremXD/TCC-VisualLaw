import { expect, test, type Locator } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const repo = process.env.NEXT_PUBLIC_REPO_NAME || "TCC-VisualLaw";
const basePath = `/${repo}`;

const artifactsRoot = path.resolve("artifacts");
const screenshotsDir = path.join(artifactsRoot, "screenshots");
const logsDir = path.join(artifactsRoot, "logs");
const downloadsDir = path.join(artifactsRoot, "downloads");

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
    throw new Error("Elemento não visível para cálculo de ordem na Home.");
  }
  return box.y;
}

test.describe("Visual Law academic static export", () => {
  test.beforeAll(() => {
    cleanDir(screenshotsDir);
    cleanDir(logsDir);
    cleanDir(downloadsDir);
  });

  test("home iOS-like + sheets + reader sem banner + PDF formatado", async ({ page }) => {
    test.setTimeout(240_000);

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

    const entryBlock = page.getByTestId("home-entry-block");
    const cardsBlock = page.getByTestId("home-flow-cards");
    const processBlock = page.getByTestId("home-process-block");

    await expect(entryBlock).toBeVisible();
    await expect(cardsBlock).toBeVisible();
    await expect(processBlock).toBeVisible();

    const entryTop = await getTop(entryBlock);
    const cardsTop = await getTop(cardsBlock);
    const processTop = await getTop(processBlock);

    expect(entryTop).toBeLessThan(cardsTop);
    expect(cardsTop).toBeLessThan(processTop);

    await expect(page.getByTestId("process-map")).toHaveCount(0);

    await page.getByTestId("process-map-accordion").getByRole("button").click();
    await expect(page.getByTestId("process-map")).toBeVisible();

    const swaggerAccordion = page.getByTestId("swagger-accordion");
    await swaggerAccordion.getByRole("button").click();
    const swaggerLink = page.getByTestId("swagger-link");
    await expect(swaggerLink).toHaveAttribute("target", "_blank");
    await expect(swaggerLink).toHaveAttribute("rel", /noopener/);

    const managerOpenButton = page.getByTestId("doc-manager-open-button");
    await managerOpenButton.click();
    await expect(page.getByTestId("doc-manager-sheet")).toBeVisible();
    await page.screenshot({
      path: path.join(screenshotsDir, "DOC_SHEET_OPEN.png"),
      fullPage: true,
    });

    await expect(page.getByTestId("doc-list").locator('[data-testid="doc-item"]')).toHaveCount(
      7
    );
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("doc-manager-sheet")).toHaveCount(0);

    await page.screenshot({
      path: path.join(screenshotsDir, "HOME_LIMPA_ACCORDIONS.png"),
      fullPage: true,
    });

    await page.getByRole("button", { name: /Colar exemplo/i }).click();
    await page.getByRole("button", { name: /Processar texto/i }).click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));
    await page.screenshot({
      path: path.join(screenshotsDir, "READER_IOS.png"),
      fullPage: true,
    });

    await expect(page.getByText(/Modo acadêmico permanente/i)).toHaveCount(0);
    await expect(page.getByTestId("processing-trace")).toHaveCount(0);
    await page.getByTestId("processing-trace-accordion").getByRole("button").click();
    await expect(page.getByTestId("processing-trace")).toBeVisible();

    const firstHighlight = page
      .locator("button.premium-highlight-mark, button.term-highlight, mark.term-highlight")
      .first();
    await expect(firstHighlight).toBeVisible();
    await firstHighlight.click();

    await expect(page.getByText(/Evidência \/ auditoria do termo/i)).toBeVisible();
    await expect(page.getByText(/Principais dúvidas/i)).toBeVisible();
    await expect(page.getByText(/Prova do Highlight/i)).toHaveCount(0);

    await page.screenshot({
      path: path.join(screenshotsDir, "READER_TERM_CARD_DIRETO.png"),
      fullPage: true,
    });

    await page.getByTestId("term-card-sheet").getByRole("button", { name: "Fechar" }).click();

    const downloadPromise = page.waitForEvent("download", { timeout: 120_000 }).catch(() => null);
    await page.getByTestId("generate-pdf-button").click();
    await expect(page).toHaveURL(new RegExp(`${basePath}/report/?(\\?.*)?$`), { timeout: 90_000 });
    await expect(page.getByTestId("report-page")).toBeVisible();
    await expect(page.getByText(/Relatório acadêmico Visual Law/i)).toBeVisible();
    const download = await downloadPromise;

    let pdfDownloadInfo:
      | {
          filename: string;
          bytes: number;
          signature: string;
          intercepted: boolean;
        }
      | undefined;

    if (download) {
      const downloadPath = path.join(downloadsDir, download.suggestedFilename());
      await download.saveAs(downloadPath);

      const pdfBytes = fs.readFileSync(downloadPath);
      expect(pdfBytes.length).toBeGreaterThan(20 * 1024);
      expect(pdfBytes.subarray(0, 5).toString("utf8")).toBe("%PDF-");

      pdfDownloadInfo = {
        filename: download.suggestedFilename(),
        bytes: pdfBytes.length,
        signature: pdfBytes.subarray(0, 5).toString("utf8"),
        intercepted: true,
      };
    } else {
      const sessionPdfMeta = await page.evaluate(() => sessionStorage.getItem("last_pdf_meta"));
      const sessionPdfError = await page.evaluate(() =>
        sessionStorage.getItem("last_pdf_error")
      );
      expect(sessionPdfError, `Erro ao gerar PDF: ${sessionPdfError ?? "desconhecido"}`).toBeNull();
      expect(sessionPdfMeta).toBeTruthy();

      const parsedMeta = JSON.parse(sessionPdfMeta ?? "{}") as {
        filename?: string;
        type?: string;
        size?: number;
        signature?: string;
      };

      expect(parsedMeta.type).toBe("application/pdf");
      expect(parsedMeta.size ?? 0).toBeGreaterThan(20 * 1024);
      expect(parsedMeta.signature).toBe("%PDF-");

      pdfDownloadInfo = {
        filename: parsedMeta.filename ?? "unknown.pdf",
        bytes: parsedMeta.size ?? 0,
        signature: parsedMeta.signature ?? "n/a",
        intercepted: false,
      };
    }

    await page.screenshot({
      path: path.join(screenshotsDir, "REPORT_PAGE.png"),
      fullPage: true,
    });

    fs.writeFileSync(
      path.join(logsDir, "network-static-assets.json"),
      JSON.stringify(
        {
          repo,
          ok_count: staticAssetSuccesses.length,
          failures: staticAssetFailures,
          pdf_download: pdfDownloadInfo,
        },
        null,
        2
      ),
      "utf8"
    );

    expect(staticAssetFailures, "Nenhum 404/5xx esperado em /_next/static").toEqual([]);
    expect(staticAssetSuccesses.length).toBeGreaterThan(0);
  });

  test.describe("reduced motion compatibility", () => {
    test.use({ reducedMotion: "reduce" });

    test("home e reader funcionam com animações reduzidas", async ({ page }) => {
      await page.goto(`${basePath}/`, { waitUntil: "domcontentloaded" });

      await expect(page.getByTestId("home-entry-block")).toBeVisible();
      await page.getByRole("button", { name: /Colar exemplo/i }).click();
      await page.getByRole("button", { name: /Processar texto/i }).click();

      await expect(page).toHaveURL(new RegExp(`${basePath}/reader/?$`));
      await expect(page.getByText(/Leitura guiada acadêmica/i)).toBeVisible();

      await page.screenshot({
        path: path.join(screenshotsDir, "READER_REDUCED_MOTION.png"),
        fullPage: true,
      });
    });
  });
});
