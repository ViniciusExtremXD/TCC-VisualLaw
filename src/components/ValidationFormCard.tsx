"use client";

import { getValidationFormUrl } from "@/config/validation";
import Icon from "@/ui/components/Icon";

interface ValidationFormCardProps {
  compact?: boolean;
  placement?: "standalone" | "hero";
}

export default function ValidationFormCard({
  compact = false,
  placement = "standalone",
}: ValidationFormCardProps) {
  const formUrl = getValidationFormUrl();
  const isHero = placement === "hero";
  const title = isHero ? "Validação exploratória" : "Responder ao formulário de validação";
  const copy = isHero
    ? "Após utilizar a leitura assistida, responda ao formulário de validação."
    : "Após utilizar a leitura assistida, responda ao formulário de validação exploratória.";

  return (
    <section
      className={`validation-form-card ${compact ? "validation-form-card-compact" : ""} ${
        isHero ? "validation-form-card-hero" : ""
      }`}
      data-testid="validation-form-card"
      aria-labelledby="validation-form-title"
    >
      <div className="validation-form-copy">
        {!isHero ? <div className="validation-form-kicker">Validação exploratória</div> : null}
        <h2 id="validation-form-title">{title}</h2>
        <p>{copy}</p>
        {!formUrl ? <span className="validation-form-status">Formulário em preparação.</span> : null}
      </div>

      {formUrl ? (
        <a
          className="validation-form-action"
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="validation-form-link"
        >
          <Icon name="external-link" size={16} />
          Responder formulário de validação
        </a>
      ) : (
        <button
          type="button"
          className="validation-form-action validation-form-action-disabled"
          disabled
          data-testid="validation-form-disabled"
        >
          <Icon name="clipboard-list" size={16} />
          Responder formulário de validação
        </button>
      )}
    </section>
  );
}
