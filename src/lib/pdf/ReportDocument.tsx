"use client";

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { resolveTermFaqs } from "@/lib/faq";
import { CATEGORY_LABELS } from "@/lib/types";
import type {
  AuditSession,
  Clause,
  DocumentRecord,
  HighlightsMap,
  LexiconEntry,
  TermEvidence,
} from "@/lib/types";
import { IMPACT_SEMIOTIC_MAP, SEMIOTIC_MAP } from "@/lib/semiotic-data";
import {
  DOCUMENT_SEMIOTIC_MAP,
  getDocumentSemanticProfile,
} from "@/data/visual/document-semiotic-map";

export interface ReportPdfInput {
  generatedAt: string;
  version: string;
  selectedDocument: DocumentRecord | null;
  docRegistry: DocumentRecord[];
  clauses: Clause[];
  highlights: HighlightsMap;
  lexicon: LexiconEntry[];
  audit: AuditSession | null;
}

interface TermBlock {
  entry: LexiconEntry;
  evidences: TermEvidence[];
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 42,
    paddingHorizontal: 34,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#1f2937",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0b3b85",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0b3b85",
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "#dbe2ef",
    borderStyle: "solid",
    padding: 9,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
  },
  cardTitle: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 5,
  },
  line: {
    marginBottom: 4,
  },
  muted: {
    color: "#64748b",
  },
  footer: {
    position: "absolute",
    left: 34,
    right: 34,
    bottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#dbe2ef",
    borderTopStyle: "solid",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#64748b",
    fontSize: 8.2,
  },
});

function impactLabel(impact: "high" | "medium" | "low") {
  if (impact === "high") return "Alto";
  if (impact === "medium") return "Médio";
  return "Baixo";
}

function buildContext(text: string, start: number, end: number) {
  const left = Math.max(0, start - 36);
  const right = Math.min(text.length, end + 36);
  const prefix = left > 0 ? "..." : "";
  const suffix = right < text.length ? "..." : "";
  return `${prefix}${text.slice(left, right)}${suffix}`;
}

function buildTerms(input: ReportPdfInput): TermBlock[] {
  const map = new Map<string, TermBlock>();

  for (const clause of input.clauses) {
    const clauseHighlights = input.highlights[clause.clause_id] ?? [];
    const clauseAudit = input.audit?.clauses_audit[clause.clause_id];

    for (const item of clauseHighlights) {
      const entry = input.lexicon.find((lex) => lex.term_id === item.term_id);
      if (!entry) continue;

      const auditHighlight = clauseAudit?.highlights.find(
        (row) => row.term_id === item.term_id && row.start === item.start
      );

      const evidence: TermEvidence = {
        term_id: item.term_id,
        clause_id: clause.clause_id,
        match: item.match,
        start: item.start,
        end: item.end,
        context: buildContext(clause.text, item.start, item.end),
        lexicon_field_used: auditHighlight?.lookup.lexicon_field_used ?? "term",
        matched_variant: auditHighlight?.lookup.matched_variant ?? item.match,
        lgpd_refs: entry.lgpd_refs,
        semiotic_rule: `${CATEGORY_LABELS[entry.category]} -> ${entry.icon_id}`,
      };

      const existing = map.get(item.term_id);
      if (!existing) {
        map.set(item.term_id, { entry, evidences: [evidence] });
      } else if (existing.evidences.length < 4) {
        existing.evidences.push(evidence);
      }
    }
  }

  return Array.from(map.values());
}

function footer() {
  return (
    <View style={styles.footer} fixed>
      <Text>Visual Law TCC · Relatório técnico-acadêmico</Text>
      <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber}/${totalPages}`} />
    </View>
  );
}

export default function ReportDocument({ input }: { input: ReportPdfInput }) {
  const terms = buildTerms(input);
  const documentProfile = input.selectedDocument
    ? getDocumentSemanticProfile(input.selectedDocument)
    : null;

  return (
    <Document
      title="Visual Law TCC - Relatório técnico-acadêmico"
      author="Visual Law TCC"
      subject="Auditoria semiótica de cláusulas"
      language="pt-BR"
    >
      <Page size="A4" style={styles.page}>
        {footer()}
        <Text style={styles.title}>Visual Law TCC</Text>
        <Text style={styles.subtitle}>
          Relatório técnico-acadêmico de rastreabilidade semiótica
        </Text>

        <View style={styles.card}>
          <Text style={styles.line}>Data/hora: {input.generatedAt}</Text>
          <Text style={styles.line}>Versão do MVP: {input.version}</Text>
          <Text style={styles.line}>
            Documento selecionado:{" "}
            {input.selectedDocument
              ? `${input.selectedDocument.name} (${input.selectedDocument.doc_id})`
              : "Não informado"}
          </Text>
          <Text style={styles.line}>Registro local: {input.docRegistry.length} documento(s)</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Escopo</Text>
          <Text style={styles.line}>
            A sessão consolidada inclui segmentação, classificação, léxico,
            semiótica, explicações e evidências auditáveis.
          </Text>
          <Text style={styles.line}>
            Cláusulas: {input.clauses.length} | Destaques:{" "}
            {Object.values(input.highlights).flat().length} | Termos únicos:{" "}
            {terms.length}
          </Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page} wrap>
        {footer()}
        <Text style={styles.sectionTitle}>Sumário de cláusulas</Text>
        {input.clauses.map((clause) => (
          <View key={clause.clause_id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {clause.clause_id} · {clause.title || "Cláusula"}
            </Text>
            <Text style={styles.line}>Categoria: {CATEGORY_LABELS[clause.category]}</Text>
            <Text style={styles.line}>Impacto: {impactLabel(clause.impact)}</Text>
            <Text style={styles.line}>
              Referências LGPD:{" "}
              {clause.lgpd_refs.length > 0 ? clause.lgpd_refs.join(", ") : "-"}
            </Text>
          </View>
        ))}
      </Page>

      <Page size="A4" style={styles.page} wrap>
        {footer()}
        <Text style={styles.sectionTitle}>Análise por cláusula</Text>
        {input.clauses.map((clause) => {
          const clauseHighlights = input.highlights[clause.clause_id] ?? [];
          const clauseAudit = input.audit?.clauses_audit[clause.clause_id];
          return (
            <View key={clause.clause_id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {clause.clause_id} · {clause.title || "Cláusula"}
              </Text>
              <Text style={styles.line}>Categoria: {CATEGORY_LABELS[clause.category]}</Text>
              <Text style={styles.line}>Impacto: {impactLabel(clause.impact)}</Text>
              <Text style={styles.line}>
                Referências LGPD:{" "}
                {clause.lgpd_refs.length > 0 ? clause.lgpd_refs.join(", ") : "-"}
              </Text>
              <Text style={styles.line}>Texto original: {clause.text}</Text>
              <Text style={styles.line}>
                Termos detectados:{" "}
                {clauseHighlights.length > 0
                  ? clauseHighlights.map((item) => item.match).join(", ")
                  : "nenhum"}
              </Text>
              <Text style={styles.line}>
                Segmentação: {clauseAudit?.segment.rule ?? "n/a"} |{" "}
                {clauseAudit?.segment.evidence ?? "n/a"}
              </Text>
              <Text style={styles.line}>
                rules_fired:{" "}
                {clauseAudit?.classification.rules_fired.length
                  ? clauseAudit.classification.rules_fired
                      .map((rule) => `${rule.rule_id} (${rule.keywords.join(", ")})`)
                      .join(" | ")
                  : "nenhuma regra disparada"}
              </Text>
              <Text style={styles.line}>
                scores:{" "}
                {clauseAudit
                  ? JSON.stringify(clauseAudit.classification.scores)
                  : "n/a"}
              </Text>
            </View>
          );
        })}
      </Page>

      <Page size="A4" style={styles.page} wrap>
        {footer()}
        <Text style={styles.sectionTitle}>Termos encontrados</Text>
        {terms.map(({ entry, evidences }) => {
          const semio = SEMIOTIC_MAP.find((item) => item.category === entry.category);
          const faqs = resolveTermFaqs(entry);
          return (
            <View key={entry.term_id} style={styles.card}>
              <Text style={styles.cardTitle}>
                {entry.term} ({entry.term_id})
              </Text>
              <Text style={styles.line}>Categoria: {CATEGORY_LABELS[entry.category]}</Text>
              <Text style={styles.line}>Impacto: {impactLabel(entry.impact)}</Text>
              <Text style={styles.line}>
                Referências LGPD:{" "}
                {entry.lgpd_refs.length > 0 ? entry.lgpd_refs.join(", ") : "-"}
              </Text>
              <Text style={styles.line}>O que significa: {entry.meaning}</Text>
              <Text style={styles.line}>Por que importa: {entry.why_it_matters}</Text>
              <Text style={styles.line}>
                O que você pode fazer: {entry.what_you_can_do}
              </Text>
              <Text style={styles.line}>
                Camada semiótica: {semio?.icon_id ?? entry.icon_id} |{" "}
                {semio?.significance ?? "Mapeamento padrão do projeto."}
              </Text>
              {evidences.map((evidence, index) => (
                <View key={`${entry.term_id}-${evidence.clause_id}-${index}`} style={styles.card}>
                  <Text style={styles.line}>
                    clause_id: {evidence.clause_id} | match: {evidence.match}
                  </Text>
                  <Text style={styles.line}>
                    offsets: [{evidence.start}, {evidence.end}] | campo:{" "}
                    {evidence.lexicon_field_used}
                  </Text>
                  <Text style={styles.line}>
                    variante: {evidence.matched_variant} | refs:{" "}
                    {evidence.lgpd_refs.join(", ")}
                  </Text>
                  <Text style={styles.line}>contexto: {evidence.context}</Text>
                </View>
              ))}
              <Text style={styles.cardTitle}>FAQ</Text>
              {faqs.map((item) => (
                <Text key={`${entry.term_id}-${item.q}`} style={styles.line}>
                  • {item.q} — {item.a} (fonte: {item.source})
                </Text>
              ))}
            </View>
          );
        })}
      </Page>

      <Page size="A4" style={styles.page} wrap>
        {footer()}
        <Text style={styles.sectionTitle}>Apêndice semiótico</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Categoria {"->"} ícone {"->"} justificativa</Text>
          {SEMIOTIC_MAP.map((item) => (
            <Text key={item.category} style={styles.line}>
              • {CATEGORY_LABELS[item.category]} | {item.icon_id} | {item.significance}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Impacto {"->"} interpretação</Text>
          {IMPACT_SEMIOTIC_MAP.map((item) => (
            <Text key={item.impact} style={styles.line}>
              • {item.label} ({item.icon}) - {item.interpretation}
            </Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Doc mapping</Text>
          {documentProfile ? (
            <>
              <Text style={styles.line}>
                Tipo: {documentProfile.profile.label} ({documentProfile.profile.doc_type})
              </Text>
              <Text style={styles.line}>
                Ícone principal: {documentProfile.profile.primary_icon}
              </Text>
              <Text style={styles.line}>
                Categorias-alvo:{" "}
                {documentProfile.categories.map((cat) => CATEGORY_LABELS[cat]).join(", ")}
              </Text>
              <Text style={styles.line}>
                Regra: {documentProfile.profile.rule_summary}
              </Text>
              <Text style={styles.line}>
                Justificativa: {documentProfile.profile.icon_justification}
              </Text>
              {documentProfile.platformNote ? (
                <Text style={styles.line}>
                  Ajuste por plataforma: {documentProfile.platformNote}
                </Text>
              ) : null}
            </>
          ) : (
            <Text style={[styles.line, styles.muted]}>Documento sem mapeamento selecionado.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Matriz doc_type_semantics (resumo)</Text>
          {Object.values(DOCUMENT_SEMIOTIC_MAP.doc_type_semantics).map((profile) => (
            <Text key={profile.doc_type} style={styles.line}>
              • {profile.label}: {profile.rule_summary}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
