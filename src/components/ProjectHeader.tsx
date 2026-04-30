"use client";

import { PROJECT_INSTITUTIONAL_INFO } from "@/config/project";
import ValidationFormCard from "@/components/ValidationFormCard";

export default function ProjectHeader() {
  const info = PROJECT_INSTITUTIONAL_INFO;
  const hasLogo = info.institutionLogoSrc.trim().length > 0;

  return (
    <header className="project-header" data-testid="project-header">
      <div className="project-header-main">
        <div className="project-header-kicker">{info.eyebrow}</div>
        <h1>{info.title}</h1>
        <p className="project-header-subtitle">{info.subtitle}</p>
        <p className="project-header-thesis">{info.description}</p>
        <ValidationFormCard placement="hero" />
      </div>

      <aside className="project-header-aside" aria-label="Dados institucionais">
        {hasLogo ? (
          <img
            className="project-header-logo"
            src={info.institutionLogoSrc}
            alt={info.institution.name}
          />
        ) : (
          <div className="project-header-logo project-header-logo-placeholder">
            <span>Mackenzie</span>
            <small>Universidade Presbiteriana Mackenzie</small>
          </div>
        )}

        <dl className="project-header-meta">
          <div>
            <dt>Autor</dt>
            <dd>
              <span>{info.author.name}</span>
              <a href={`mailto:${info.author.email}`}>{info.author.email}</a>
            </dd>
          </div>
          <div>
            <dt>Orientador</dt>
            <dd>
              <span>{info.advisor.name}</span>
              <a href={`mailto:${info.advisor.email}`}>{info.advisor.email}</a>
            </dd>
          </div>
          <div>
            <dt>Instituição</dt>
            <dd>
              <span>{info.institution.unit}</span>
              <span>{info.institution.name}</span>
              <span>{info.institution.location}</span>
            </dd>
          </div>
        </dl>
      </aside>
    </header>
  );
}
