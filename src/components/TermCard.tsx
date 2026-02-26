"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Accordion from "@/components/Accordion";
import { CATEGORY_LABELS, type LexiconEntry, type TermEvidence } from "@/lib/types";
import { SEMIOTIC_MAP } from "@/lib/semiotic-data";
import { resolveTermFaqs } from "@/lib/faq";
import PremiumCard from "@/ui/components/PremiumCard";
import { useReducedMotionPreference } from "@/ui/hooks/useReducedMotionPreference";
import { uiTokens } from "@/ui/tokens";

interface TermCardProps {
  entry: LexiconEntry;
  evidence?: TermEvidence | null;
  mode?: "page" | "modal" | "report";
}

const IMPACT_LABELS = {
  high: "Alto",
  medium: "Médio",
  low: "Baixo",
} as const;

export default function TermCard({ entry, evidence, mode = "page" }: TermCardProps) {
  const semio = SEMIOTIC_MAP.find((row) => row.category === entry.category);
  const faqItems = resolveTermFaqs(entry);
  const showReaderLinks = mode === "page";
  const reducedMotion = useReducedMotionPreference();

  return (
    <div className="d-flex flex-column gap-3">
      {showReaderLinks && (
        <Link
          href="/reader"
          className="text-ios-accent text-decoration-none fw-semibold"
          style={{ fontSize: "0.9rem" }}
        >
          <i className="bi bi-chevron-left me-1"></i>
          Voltar para leitura guiada
        </Link>
      )}

      <PremiumCard as="article" className="overflow-hidden" interactive={mode !== "report"}>
        <motion.header
          className="p-4 specular"
          style={{
            background:
              "linear-gradient(132deg, rgba(0,122,255,0.08), rgba(99,102,241,0.12))",
          }}
          initial={reducedMotion ? undefined : { opacity: 0, y: 10 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: uiTokens.motion.duration.medium,
            ease: uiTokens.motion.easing.soft,
          }}
        >
          <div className="d-flex flex-column gap-2">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <h2 className="fw-bold mb-0" style={{ fontSize: "1.3rem" }}>
                {entry.term}
              </h2>
              <code>{entry.term_id}</code>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <span className={`badge-ios badge-${entry.category}`}>
                {CATEGORY_LABELS[entry.category]}
              </span>
              <span
                className={`badge-ios badge-impact-${entry.impact} ${
                  entry.impact === "high" ? "badge-glow-high" : ""
                }`}
              >
                {IMPACT_LABELS[entry.impact]}
              </span>
            </div>
          </div>
        </motion.header>

        {[
          {
            title: "O que significa",
            text: entry.meaning,
            className: "text-ios-accent",
            background: "",
          },
          {
            title: "Por que importa",
            text: entry.why_it_matters,
            className: "",
            background: "rgba(255,149,0,0.06)",
            color: "#9a6700",
          },
          {
            title: "O que você pode fazer",
            text: entry.what_you_can_do,
            className: "",
            background: "rgba(16,185,129,0.08)",
            color: "#0f766e",
          },
        ].map((block, index) => (
          <motion.section
            key={block.title}
            className="p-4"
            style={{ borderTop: "0.5px solid var(--vl-border)", background: block.background }}
            initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{
              duration: uiTokens.motion.duration.medium,
              delay: reducedMotion ? 0 : index * 0.035,
              ease: uiTokens.motion.easing.soft,
            }}
          >
            <h3
              className={`fw-semibold mb-1 ${block.className}`}
              style={{ fontSize: "0.9rem", color: block.color }}
            >
              {block.title}
            </h3>
            <p className="mb-0" style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>
              {block.text}
            </p>
          </motion.section>
        ))}

        <motion.section
          className="p-4 glass specular"
          style={{ borderTop: "0.5px solid var(--vl-border)", background: "rgba(99,102,241,0.08)" }}
          initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{
            duration: uiTokens.motion.duration.medium,
            delay: reducedMotion ? 0 : 0.12,
            ease: uiTokens.motion.easing.soft,
          }}
        >
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem", color: "#4338ca" }}>
            Camada semiótica
          </h3>
          <div style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>
            <div>
              <span className="fw-semibold">Significante:</span> ícone{" "}
              <code>{semio?.icon_id ?? entry.icon_id}</code> + badge de categoria/impacto.
            </div>
            <div>
              <span className="fw-semibold">Significado:</span>{" "}
              {semio?.significance ?? "Mapeamento semiótico padrão."}
            </div>
            <div>
              <span className="fw-semibold">Regra:</span> categoria{" "}
              {CATEGORY_LABELS[entry.category]} mapeia para signo{" "}
              {semio?.icon_label ?? entry.icon_id}.
            </div>
          </div>
        </motion.section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Evidência / auditoria do termo
          </h3>
          {evidence ? (
            <div className="ios-card-inset glass p-3" style={{ fontSize: "0.84rem" }}>
              <div>term_id: <code>{evidence.term_id}</code></div>
              <div>clause_id: <code>{evidence.clause_id}</code></div>
              <div>match: "{evidence.match}"</div>
              <div>start/end: [{evidence.start}, {evidence.end}]</div>
              <div>contexto: {evidence.context}</div>
              <div>campo léxico usado: {evidence.lexicon_field_used}</div>
              <div>variante batida: {evidence.matched_variant}</div>
              <div>
                Referências LGPD:{" "}
                {evidence.lgpd_refs.length > 0 ? evidence.lgpd_refs.join(", ") : "-"}
              </div>
              <div>regra semiótica: {evidence.semiotic_rule}</div>
            </div>
          ) : (
            <div className="ios-card-inset glass p-3 text-ios-secondary" style={{ fontSize: "0.84rem" }}>
              Evidência pontual indisponível nesta visualização. Abra o termo a partir do Reader
              para ver offsets e provenance.
            </div>
          )}
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Principais dúvidas (FAQ)
          </h3>
          {mode === "report" ? (
            <ol className="mb-0" style={{ fontSize: "0.84rem" }}>
              {faqItems.map((item) => (
                <li key={`${entry.term_id}-${item.q}`} className="mb-2">
                  <strong>{item.q}</strong>
                  <div>{item.a}</div>
                  <small className="text-ios-secondary">fonte: {item.source}</small>
                </li>
              ))}
            </ol>
          ) : (
            <div className="d-flex flex-column gap-2">
              {faqItems.map((item, index) => (
                <Accordion
                  key={`${entry.term_id}-${item.q}`}
                  title={`${index + 1}. ${item.q}`}
                  summary={`fonte: ${item.source}`}
                  className="ios-card-inset"
                >
                  <div className="mt-1" style={{ fontSize: "0.83rem" }}>
                    {item.a}
                  </div>
                </Accordion>
              ))}
            </div>
          )}
        </section>

        <section className="p-4" style={{ borderTop: "0.5px solid var(--vl-border)" }}>
          <h3 className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Mini-tabela acadêmica
          </h3>
          <div className="ios-card-inset glass overflow-hidden">
            <table className="table table-borderless mb-0" style={{ fontSize: "0.85rem" }}>
              <tbody>
                <tr style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="px-3 py-2 fw-semibold" style={{ width: "35%" }}>
                    Categoria
                  </td>
                  <td className="px-3 py-2">{CATEGORY_LABELS[entry.category]}</td>
                </tr>
                <tr style={{ borderBottom: "0.5px solid var(--vl-border)" }}>
                  <td className="px-3 py-2 fw-semibold">Impacto</td>
                  <td className="px-3 py-2">{IMPACT_LABELS[entry.impact]}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 fw-semibold">Referências LGPD</td>
                  <td className="px-3 py-2">
                    {entry.lgpd_refs.length > 0 ? entry.lgpd_refs.join(", ") : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </PremiumCard>

      {showReaderLinks && (
        <div className="text-center">
          <Link href="/reader" className="btn btn-ios btn-ios-primary ios-tap">
            Voltar para leitura guiada
          </Link>
        </div>
      )}
    </div>
  );
}
