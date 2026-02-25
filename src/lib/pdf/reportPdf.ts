import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { resolveTermFaqs } from "@/lib/faq";
import {
  DOCUMENT_SEMIOTIC_MAP,
  getDocumentSemanticProfile,
} from "@/data/visual/document-semiotic-map";
import { CATEGORY_LABELS } from "@/lib/types";
import { IMPACT_SEMIOTIC_MAP, SEMIOTIC_MAP } from "@/lib/semiotic-data";
import type {
  AuditSession,
  Clause,
  DocumentRecord,
  HighlightsMap,
  LexiconEntry,
} from "@/lib/types";

interface BuildReportPdfInput {
  generatedAt: string;
  version: string;
  selectedDocument: DocumentRecord | null;
  docRegistry: DocumentRecord[];
  clauses: Clause[];
  highlights: HighlightsMap;
  lexicon: LexiconEntry[];
  audit: AuditSession | null;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const MARGIN_TOP = 52;
const MARGIN_BOTTOM = 42;

function sanitizePdfText(text: string): string {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/\u2022/g, "-")
    .replace(/\u2013|\u2014/g, "-")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, "\"")
    .replace(/\u2026/g, "...")
    .replace(/\u2192/g, "->")
    .replace(/[^\u0009\u000a\u000d\u0020-\u007e\u00a0-\u00ff]/g, "");
}

function splitLines(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const normalized = sanitizePdfText(text).replace(/\r/g, "");
  const blocks = normalized.split("\n");
  const lines: string[] = [];

  for (const block of blocks) {
    const words = block.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }

    let current = words[0] ?? "";
    for (const word of words.slice(1)) {
      const candidate = `${current} ${word}`;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
    }
    lines.push(current);
  }

  return lines;
}

export async function buildReportPdf(input: BuildReportPdfInput): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let cursorY = PAGE_HEIGHT - MARGIN_TOP;

  const ensureSpace = (heightNeeded: number) => {
    if (cursorY - heightNeeded < MARGIN_BOTTOM) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      cursorY = PAGE_HEIGHT - MARGIN_TOP;
    }
  };

  const drawWrapped = (
    text: string,
    opts?: { size?: number; maxWidth?: number; font?: PDFFont; color?: ReturnType<typeof rgb>; lineGap?: number }
  ) => {
    const size = opts?.size ?? 11;
    const maxWidth = opts?.maxWidth ?? PAGE_WIDTH - MARGIN_X * 2;
    const font = opts?.font ?? regular;
    const lineGap = opts?.lineGap ?? 3;
    const color = opts?.color ?? rgb(0.14, 0.16, 0.2);

    const lines = splitLines(text, font, size, maxWidth);
    const lineHeight = size + lineGap;
    ensureSpace(lines.length * lineHeight + 2);

    for (const line of lines) {
      page.drawText(line, {
        x: MARGIN_X,
        y: cursorY,
        size,
        font,
        color,
      });
      cursorY -= lineHeight;
    }
  };

  const drawHeading = (text: string, level: 1 | 2 | 3 = 2) => {
    const size = level === 1 ? 22 : level === 2 ? 15 : 12.5;
    const spacingBefore = level === 1 ? 0 : 12;
    ensureSpace(size + 22);
    cursorY -= spacingBefore;
    drawWrapped(text, { size, font: bold, lineGap: 4, color: rgb(0.08, 0.18, 0.35) });
    cursorY -= 2;
  };

  const drawKeyValue = (key: string, value: string) => {
    drawWrapped(`${key}: ${value}`, { size: 10.5 });
  };

  const drawDivider = () => {
    ensureSpace(16);
    page.drawLine({
      start: { x: MARGIN_X, y: cursorY - 2 },
      end: { x: PAGE_WIDTH - MARGIN_X, y: cursorY - 2 },
      color: rgb(0.82, 0.84, 0.88),
      thickness: 1,
    });
    cursorY -= 12;
  };

  const impactLabel = (impact: Clause["impact"]) =>
    impact === "high" ? "Alto" : impact === "medium" ? "Médio" : "Baixo";

  // Capa
  drawHeading("Visual Law TCC", 1);
  drawWrapped("Relatório técnico-acadêmico de rastreabilidade", {
    size: 13,
    font: bold,
    color: rgb(0.17, 0.22, 0.28),
  });
  cursorY -= 12;
  drawKeyValue("Data/hora", input.generatedAt);
  drawKeyValue("Versão", input.version);
  drawKeyValue(
    "Documento selecionado",
    input.selectedDocument
      ? `${input.selectedDocument.name} (${input.selectedDocument.doc_id})`
      : "Não informado"
  );

  if (input.selectedDocument) {
    drawKeyValue(
      "Metadados",
      `tipo ${input.selectedDocument.type} | plataforma ${input.selectedDocument.platform} | idioma ${input.selectedDocument.language}`
    );
  }

  drawDivider();
  drawWrapped(
    "Este PDF consolida segmentação, classificação, léxico, semiótica e evidências da sessão para validação acadêmica.",
    { size: 11 }
  );

  // Sumário
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  cursorY = PAGE_HEIGHT - MARGIN_TOP;
  drawHeading("Sumário", 2);
  for (const clause of input.clauses) {
    drawWrapped(`• ${clause.clause_id} - ${clause.title || "Cláusula"}`, { size: 10.5 });
  }

  // Seção por cláusula
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  cursorY = PAGE_HEIGHT - MARGIN_TOP;
  drawHeading("Análise por cláusula", 2);

  for (const clause of input.clauses) {
    const clauseHighlights = input.highlights[clause.clause_id] ?? [];
    const clauseAudit = input.audit?.clauses_audit[clause.clause_id];

    drawHeading(`${clause.clause_id} — ${clause.title || "Cláusula"}`, 3);
    drawWrapped(clause.text, { size: 10.5 });

    drawKeyValue("Categoria", CATEGORY_LABELS[clause.category]);
    drawKeyValue("Impacto", impactLabel(clause.impact));
    drawKeyValue(
      "Referências LGPD",
      clause.lgpd_refs.length > 0 ? clause.lgpd_refs.join(", ") : "-"
    );
    drawKeyValue(
      "Termos detectados",
      clauseHighlights.length > 0
        ? clauseHighlights.map((item) => item.match).join(", ")
        : "Nenhum"
    );

    if (clauseAudit) {
      drawKeyValue("Regra de segmentação", clauseAudit.segment.rule);
      drawKeyValue("Evidência da segmentação", clauseAudit.segment.evidence);
      drawKeyValue(
        "Rules fired",
        clauseAudit.classification.rules_fired.length > 0
          ? clauseAudit.classification.rules_fired
              .map((item) => `${item.rule_id} (${item.keywords.join(", ")})`)
              .join(" | ")
          : "Nenhuma"
      );
    }

    drawDivider();
  }

  // Seção por termo
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  cursorY = PAGE_HEIGHT - MARGIN_TOP;
  drawHeading("Termos encontrados", 2);

  const termIds = Array.from(
    new Set(Object.values(input.highlights).flat().map((item) => item.term_id))
  );

  for (const termId of termIds) {
    const entry = input.lexicon.find((item) => item.term_id === termId);
    if (!entry) {
      continue;
    }

    let firstEvidence:
      | {
          clauseId: string;
          match: string;
          start: number;
          end: number;
          lookupField: string;
          variant: string;
        }
      | null = null;

    for (const clause of input.clauses) {
      const matches = input.highlights[clause.clause_id] ?? [];
      const found = matches.find((item) => item.term_id === termId);
      if (!found) continue;

      const auditHighlight = input.audit?.clauses_audit[clause.clause_id]?.highlights.find(
        (item) => item.term_id === termId && item.start === found.start
      );

      firstEvidence = {
        clauseId: clause.clause_id,
        match: found.match,
        start: found.start,
        end: found.end,
        lookupField: auditHighlight?.lookup.lexicon_field_used ?? "term",
        variant: auditHighlight?.lookup.matched_variant ?? found.match,
      };
      break;
    }

    drawHeading(`${entry.term} (${entry.term_id})`, 3);
    drawKeyValue("Categoria", CATEGORY_LABELS[entry.category]);
    drawKeyValue("Impacto", impactLabel(entry.impact));
    drawKeyValue(
      "Referências LGPD",
      entry.lgpd_refs.length > 0 ? entry.lgpd_refs.join(", ") : "-"
    );

    drawWrapped(`O que significa: ${entry.meaning}`, { size: 10.5 });
    drawWrapped(`Por que importa: ${entry.why_it_matters}`, { size: 10.5 });
    drawWrapped(`O que você pode fazer: ${entry.what_you_can_do}`, { size: 10.5 });

    const semio = SEMIOTIC_MAP.find((item) => item.category === entry.category);
    drawWrapped(
      `Semiótica: ${semio?.icon_label ?? entry.icon_id} | ${semio?.significance ?? "Mapeamento padrão."}`,
      { size: 10.2 }
    );

    if (firstEvidence) {
      drawKeyValue("Evidência (cláusula)", firstEvidence.clauseId);
      drawKeyValue("Match", firstEvidence.match);
      drawKeyValue("Offsets", `[${firstEvidence.start}, ${firstEvidence.end}]`);
      drawKeyValue("Campo léxico usado", firstEvidence.lookupField);
      drawKeyValue("Variante batida", firstEvidence.variant);
    }

    const faqs = resolveTermFaqs(entry);
    if (faqs.length > 0) {
      drawWrapped("Principais dúvidas:", { size: 10.5, font: bold });
      for (const faq of faqs) {
        drawWrapped(`• ${faq.q}`, { size: 10.2, font: bold });
        drawWrapped(`  ${faq.a} (fonte: ${faq.source})`, { size: 10.2 });
      }
    }

    drawDivider();
  }

  // Apêndice
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  cursorY = PAGE_HEIGHT - MARGIN_TOP;
  drawHeading("Apêndice semiótico", 2);

  for (const item of SEMIOTIC_MAP) {
    drawWrapped(
      `• ${CATEGORY_LABELS[item.category]} → ${item.icon_id} → ${item.significance}`,
      { size: 10.3 }
    );
  }

  drawDivider();
  drawHeading("Interpretação de impacto", 3);
  for (const item of IMPACT_SEMIOTIC_MAP) {
    drawWrapped(`• ${item.label}: ${item.interpretation}`, { size: 10.3 });
  }

  if (input.selectedDocument) {
    drawDivider();
    const documentProfile = getDocumentSemanticProfile(input.selectedDocument);
    drawHeading("Mapeamento do documento", 3);
    drawKeyValue("Tipo", documentProfile.profile.label);
    drawKeyValue("Ícone principal", documentProfile.profile.primary_icon);
    drawKeyValue(
      "Categorias-alvo",
      documentProfile.categories.map((cat) => CATEGORY_LABELS[cat]).join(", ")
    );
    drawKeyValue("Regra", documentProfile.profile.rule_summary);
    drawKeyValue("Justificativa", documentProfile.profile.icon_justification);
    if (documentProfile.platformNote) {
      drawKeyValue("Ajuste por plataforma", documentProfile.platformNote);
    }
  }

  drawDivider();
  drawHeading("Matriz doc_type_semantics", 3);
  drawWrapped(JSON.stringify(DOCUMENT_SEMIOTIC_MAP.doc_type_semantics, null, 2), {
    size: 8.8,
    lineGap: 2,
  });

  drawDivider();
  drawKeyValue("Documentos no registro", String(input.docRegistry.length));

  // Rodapé (página X/Y)
  const pages = pdfDoc.getPages();
  for (let index = 0; index < pages.length; index += 1) {
    const current = pages[index];
    current.drawText("Visual Law TCC", {
      x: MARGIN_X,
      y: 22,
      size: 8.8,
      font: regular,
      color: rgb(0.42, 0.45, 0.52),
    });
    current.drawText(`Página ${index + 1}/${pages.length}`, {
      x: PAGE_WIDTH - MARGIN_X - 70,
      y: 22,
      size: 8.8,
      font: regular,
      color: rgb(0.42, 0.45, 0.52),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const pdfArrayBuffer = new ArrayBuffer(pdfBytes.byteLength);
  new Uint8Array(pdfArrayBuffer).set(pdfBytes);
  return new Blob([pdfArrayBuffer], { type: "application/pdf" });
}
