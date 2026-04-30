"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Accordion from "@/components/Accordion";
import { CATEGORY_LABELS, type LexiconEntry, type TermEvidence } from "@/lib/types";
import { resolveTermFaqs } from "@/lib/faq";
import { SEMIOTIC_MAP } from "@/lib/semiotic-data";
import Icon from "@/ui/components/Icon";
import PremiumCard from "@/ui/components/PremiumCard";

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

  const detailsContent: ReactNode = (
    <div className="term-card-technical-grid">
      <section className="term-card-technical-section">
        <h3>Evidência / auditoria do termo</h3>
        {evidence ? (
          <div className="term-card-evidence">
            <div>
              term_id: <code>{evidence.term_id}</code>
            </div>
            <div>
              clause_id: <code>{evidence.clause_id}</code>
            </div>
            <div>match: "{evidence.match}"</div>
            <div>
              start/end: [{evidence.start}, {evidence.end}]
            </div>
            <div>contexto: {evidence.context}</div>
            <div>campo léxico usado: {evidence.lexicon_field_used}</div>
            <div>variante batida: {evidence.matched_variant}</div>
            <div>
              Referências LGPD: {evidence.lgpd_refs.length > 0 ? evidence.lgpd_refs.join(", ") : "-"}
            </div>
            <div>regra semiótica: {evidence.semiotic_rule}</div>
          </div>
        ) : (
          <div className="term-card-empty-evidence">
            Evidência pontual indisponível nesta visualização. Abra o termo a partir do Reader para
            ver offsets e provenance.
          </div>
        )}
      </section>

      <section className="term-card-technical-section">
        <h3>Camada visual e semiótica</h3>
        <div className="term-card-semiotic">
          <div>
            <span>Significante:</span> ícone <code>{semio?.icon_id ?? entry.icon_id}</code> + badge
            de categoria/impacto.
          </div>
          <div>
            <span>Significado:</span> {semio?.significance ?? "Mapeamento semiótico padrão."}
          </div>
          <div>
            <span>Regra:</span> categoria {CATEGORY_LABELS[entry.category]} mapeia para signo{" "}
            {semio?.icon_label ?? entry.icon_id}.
          </div>
        </div>
      </section>

      <section className="term-card-technical-section">
        <h3>FAQ</h3>
        <ol className="term-card-faq-list">
          {faqItems.map((item) => (
            <li key={`${entry.term_id}-${item.q}`}>
              <strong>{item.q}</strong>
              <div>{item.a}</div>
              <small>fonte: {item.source}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="term-card-technical-section">
        <h3>Mini-tabela acadêmica</h3>
        <div className="term-card-table-wrap">
          <table className="table table-borderless mb-0">
            <tbody>
              <tr>
                <td>Categoria</td>
                <td>{CATEGORY_LABELS[entry.category]}</td>
              </tr>
              <tr>
                <td>Impacto</td>
                <td>{IMPACT_LABELS[entry.impact]}</td>
              </tr>
              <tr>
                <td>Referências LGPD</td>
                <td>{entry.lgpd_refs.length > 0 ? entry.lgpd_refs.join(", ") : "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  return (
    <div className="term-card-stack">
      {showReaderLinks ? (
        <Link href="/reader" className="term-card-back-link">
          <Icon name="chevron-left" size={16} />
          Voltar para leitura guiada
        </Link>
      ) : null}

      <PremiumCard as="article" className="term-card" interactive={mode !== "report"}>
        <header className="term-card-header">
          <div>
            <div className="term-card-kicker">Termo explicado</div>
            <div className="term-card-title-row">
              <h2>{entry.term}</h2>
              <code>{entry.term_id}</code>
            </div>
          </div>
          <div className="term-card-badges">
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
        </header>

        <section className="term-card-readable">
          <div className="term-card-readable-kicker">Entenda em linguagem clara</div>

          <div className="term-card-readable-block">
            <h3>O que significa?</h3>
            <p className="term-card-definition">{entry.traducao_direta}</p>
            <p>{entry.meaning}</p>
          </div>

          <div className="term-card-readable-grid">
            <div className="term-card-readable-block">
              <h3>Por que importa?</h3>
              <p>{entry.why_it_matters}</p>
            </div>
            <div className="term-card-readable-block">
              <h3>O que você pode fazer?</h3>
              <p>{entry.what_you_can_do}</p>
            </div>
          </div>

          <div className="term-card-refs">
            <span>Referências principais</span>
            <strong>{entry.lgpd_refs.length > 0 ? entry.lgpd_refs.join(", ") : "-"}</strong>
          </div>
        </section>

        <section className="term-card-details">
          {mode === "report" ? (
            <div className="term-card-report-details">
              <h2>Detalhes técnicos e acadêmicos</h2>
              {detailsContent}
            </div>
          ) : (
            <Accordion
              title="Ver detalhes técnicos e acadêmicos"
              summary="Auditoria, camada semiótica, FAQ e mini-tabela para rastreabilidade."
              className="term-card-accordion"
              testId="term-card-technical-accordion"
            >
              {detailsContent}
            </Accordion>
          )}
        </section>
      </PremiumCard>

      {showReaderLinks ? (
        <div className="text-center">
          <Link href="/reader" className="btn btn-ios btn-ios-primary ios-tap">
            Voltar para leitura guiada
          </Link>
        </div>
      ) : null}
    </div>
  );
}
