"use client";

import { useState } from "react";

interface TextInputProps {
  onSubmit: (text: string, docId: string) => void;
  loading?: boolean;
}

const DOC_OPTIONS = [
  { value: "X_PRIVACY", label: "X (Twitter) — Política de Privacidade" },
  { value: "X_TERMS", label: "X (Twitter) — Termos de Serviço" },
  { value: "META_PRIVACY", label: "Meta — Política de Privacidade" },
  { value: "WA_PRIVACY", label: "WhatsApp — Política de Privacidade" },
  { value: "IG_TERMS", label: "Instagram — Termos de Uso" },
  { value: "FB_TERMS", label: "Facebook — Termos de Serviço" },
  { value: "CUSTOM", label: "Outro documento" },
];

export default function TextInput({ onSubmit, loading }: TextInputProps) {
  const [text, setText] = useState("");
  const [docId, setDocId] = useState("X_PRIVACY");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 20) return;
    onSubmit(text.trim(), docId);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {/* Seletor de documento */}
      <div>
        <label htmlFor="doc-select" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
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
          Cole o texto do Termo / Política de Privacidade
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole aqui o texto completo da política de privacidade ou termos de serviço..."
          rows={12}
          className="form-control form-control-ios"
        />
        <div className="text-ios-secondary mt-1" style={{ fontSize: "0.8125rem" }}>
          {text.length > 0
            ? `${text.length} caracteres`
            : "Mínimo 20 caracteres"}
        </div>
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={text.trim().length < 20 || loading}
        className="btn btn-ios btn-ios-primary w-100"
      >
        {loading ? "Processando..." : "Processar Documento"}
      </button>
    </form>
  );
}
