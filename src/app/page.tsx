"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/store/SessionContext";
import { processText, loadMockSession, SAMPLE_TEXT, getLexicon } from "@/lib/processor";
import AcademicToggle from "@/components/AcademicToggle";

export default function HomePage() {
  const [text, setText] = useState("");
  const [docId, setDocId] = useState("X_PRIVACY");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setResults } = useSession();

  const DOC_OPTIONS = [
    { value: "X_PRIVACY", label: "X (Twitter) — Política de Privacidade" },
    { value: "X_TERMS", label: "X (Twitter) — Termos de Serviço" },
    { value: "META_PRIVACY", label: "Meta — Política de Privacidade" },
    { value: "WA_PRIVACY", label: "WhatsApp — Política de Privacidade" },
    { value: "IG_TERMS", label: "Instagram — Termos de Uso" },
    { value: "FB_TERMS", label: "Facebook — Termos de Serviço" },
    { value: "CUSTOM", label: "Outro documento" },
  ];

  const handleProcess = () => {
    if (text.trim().length < 20) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const result = processText(text.trim(), docId);
        setResults({ ...result, lexicon: getLexicon() });
        router.push("/reader");
      } catch (err) {
        console.error("Erro ao processar:", err);
        alert("Erro ao processar o texto. Verifique o conteúdo e tente novamente.");
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  const handleLoadMock = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const result = loadMockSession();
        setResults({ ...result, lexicon: getLexicon() });
        router.push("/reader");
      } catch (err) {
        console.error("Erro ao carregar mock:", err);
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  return (
    <div className="d-flex flex-column gap-4 md:gap-5">
      {/* ── Hero ───────────────────────────────────── */}
      <div className="text-center py-3">
        <div className="d-flex justify-content-end mb-2">
          <AcademicToggle />
        </div>
        <div className="mb-3" style={{ fontSize: "3rem" }}>
          <i className="bi bi-shield-lock text-ios-accent"></i>
        </div>
        <h1 className="fw-bold mb-2" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
          Entenda seus Termos de Serviço
        </h1>
        <p className="text-ios-secondary mx-auto" style={{ maxWidth: 480, fontSize: "0.9375rem", lineHeight: 1.5 }}>
          Cole o texto de uma Política de Privacidade ou Termos de Serviço e
          visualize cláusula por cláusula, com termos jurídicos explicados em
          linguagem simples usando <strong>Visual Law</strong>.
        </p>
      </div>

      {/* ── Form Card ──────────────────────────────── */}
      <div className="ios-card p-4 d-flex flex-column gap-3">
        {/* Selector */}
        <div>
          <label htmlFor="doc-select" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
            <i className="bi bi-file-earmark-text me-1"></i>
            Documento de origem
          </label>
          <select
            id="doc-select"
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            className="form-select form-select-ios"
          >
            {DOC_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Textarea */}
        <div>
          <label htmlFor="text-input" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
            <i className="bi bi-textarea-t me-1"></i>
            Cole o texto do Termo / Política de Privacidade
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole aqui o texto completo da política de privacidade ou termos de serviço..."
            rows={10}
            className="form-control form-control-ios"
          />
          <div className="text-ios-secondary mt-1" style={{ fontSize: "0.8125rem" }}>
            {text.length > 0
              ? `${text.length} caracteres · Entrada por texto (sem PDF)`
              : "Mínimo 20 caracteres · Entrada por texto (sem PDF)"}
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex flex-column flex-sm-row gap-2">
          <button
            onClick={handleProcess}
            disabled={text.trim().length < 20 || loading}
            className="btn btn-ios btn-ios-primary flex-fill"
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Processando...
              </>
            ) : (
              <>
                <i className="bi bi-lightning-charge-fill me-1"></i>
                Processar
              </>
            )}
          </button>

          <button
            onClick={() => setText(SAMPLE_TEXT)}
            disabled={loading}
            className="btn btn-ios btn-ios-secondary"
          >
            <i className="bi bi-clipboard me-1"></i>
            Colar exemplo
          </button>

          <button
            onClick={handleLoadMock}
            disabled={loading}
            className="btn btn-ios btn-ios-tertiary"
          >
            <i className="bi bi-play-circle me-1"></i>
            Demo
          </button>
        </div>
      </div>

      {/* ── How it works ───────────────────────────── */}
      <div className="row g-3 mt-1">
        {[
          { icon: "bi-scissors", title: "Segmentação", desc: "Quebra o texto em cláusulas individuais" },
          { icon: "bi-search", title: "Destaque", desc: "Identifica termos jurídicos do dicionário léxico" },
          { icon: "bi-eye", title: "Visual Law", desc: "Cards visuais com explicação acessível dos termos" },
        ].map((item) => (
          <div className="col-12 col-sm-4" key={item.title}>
            <div className="ios-card p-3 text-center h-100">
              <i className={`bi ${item.icon} text-ios-accent d-block mb-2`} style={{ fontSize: "1.75rem" }}></i>
              <h3 className="fw-semibold mb-1" style={{ fontSize: "0.9375rem" }}>{item.title}</h3>
              <p className="text-ios-secondary mb-0" style={{ fontSize: "0.8125rem" }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
