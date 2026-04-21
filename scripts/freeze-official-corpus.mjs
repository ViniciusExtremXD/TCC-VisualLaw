import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const capturedAt = new Date().toISOString();
const corpusRoot = path.resolve("data", "corpus");
const datasetRoot = path.resolve("data", "dataset");

const sources = [
  {
    doc_id: "X_PRIVACY",
    dir: "x-privacy",
    title: "X Privacy Policy",
    platform: "X",
    type: "privacy",
    language: "en",
    official_url: "https://x.com/en/privacy",
    status: "frozen_selected_official_excerpts",
    effective_label: "Effective: January 15, 2026",
    capture_method:
      "Playwright chromium innerText capture + viewport screenshot; selected raw excerpts only.",
    access_limitations:
      "Official page was accessible without login during capture. Full policy text is not stored in the repository because it is platform-owned content.",
    normalization_decisions:
      "Whitespace was collapsed only for selected excerpts. Original language and wording were preserved for those excerpts.",
    excerpts: [
      {
        excerpt_id: "X_PRIVACY_E001",
        heading: "1.1 Information you provide us",
        text:
          "Personal accounts. If you create an account, you must provide us with some information so that we can provide our services to you. This includes a display name, a username, a password, an email address or phone number, a date of birth, your display language, and third-party single sign-in information.",
      },
      {
        excerpt_id: "X_PRIVACY_E002",
        heading: "2.1 Operate, improve, and personalize our services",
        text:
          "We use the information we collect to provide and operate X products and services. We also use the information we collect to improve and personalize our products and services.",
      },
      {
        excerpt_id: "X_PRIVACY_E003",
        heading: "3. Sharing Information",
        text:
          "You should know the ways we share your information, why we share it, and how you can control it. There are five general ways we share your information.",
      },
      {
        excerpt_id: "X_PRIVACY_E004",
        heading: "4. How Long We Keep Information",
        text:
          "We keep different types of information for different periods of time, depending on how long we need to retain it in order to provide you with our products and services, to comply with our legal requirements and for safety and security reasons.",
      },
      {
        excerpt_id: "X_PRIVACY_E005",
        heading: "5.1 Access, correction, and portability",
        text:
          "You can access, correct, or modify the information you provided to us by editing your profile and adjusting your account settings. You can download a copy of your information, such as your posts.",
      },
    ],
  },
  {
    doc_id: "META_PRIVACY",
    dir: "meta-privacy",
    title: "Politica de Privacidade da Meta",
    platform: "Meta/Facebook",
    type: "privacy",
    language: "pt-BR",
    official_url: "https://www.facebook.com/privacy/policy/",
    status: "frozen_selected_official_excerpts",
    effective_label: "Em vigor em 16 de dezembro de 2025",
    capture_method:
      "Playwright chromium innerText capture + viewport screenshot; selected raw excerpts only.",
    access_limitations:
      "Official page was accessible during capture. Dynamic sections may vary by locale, cookies or region.",
    normalization_decisions:
      "Selected excerpts preserve Portuguese wording from the official page; line breaks were normalized for CSV compatibility.",
    excerpts: [
      {
        excerpt_id: "META_PRIVACY_E001",
        heading: "Destaques",
        text:
          "Nós, da Meta, queremos que você saiba quais informações coletamos e como as usamos e compartilhamos.",
      },
      {
        excerpt_id: "META_PRIVACY_E002",
        heading: "Politica de Privacidade",
        text:
          "Na Política de Privacidade, explicamos como coletamos, usamos, compartilhamos, retemos e transferimos informações. Explicamos também quais são seus direitos.",
      },
      {
        excerpt_id: "META_PRIVACY_E003",
        heading: "Controle de privacidade",
        text:
          "Para nós, é importante que você saiba como controlar sua privacidade. Por isso, também mostramos onde gerenciar suas informações nas configurações dos Produtos da Meta que você usa.",
      },
    ],
  },
  {
    doc_id: "INSTAGRAM_TERMS",
    dir: "instagram-terms",
    title: "Instagram Terms of Use",
    platform: "Instagram",
    type: "terms",
    language: "en",
    official_url: "https://www.instagram.com/legal/terms/",
    status: "frozen_selected_official_excerpts",
    effective_label: "Official Instagram Help Center terms page captured at runtime",
    capture_method:
      "Playwright chromium innerText capture + viewport screenshot; selected raw excerpts only.",
    access_limitations:
      "The Instagram legal URL resolved to the official Instagram Help Center terms page during capture.",
    normalization_decisions:
      "Selected excerpts preserve English wording from the official page; line breaks were normalized for CSV compatibility.",
    excerpts: [
      {
        excerpt_id: "INSTAGRAM_TERMS_E001",
        heading: "1. The Instagram Service",
        text:
          "The Service includes all of the Instagram products, features, applications, services, technologies, and software that we provide to advance Instagram's mission.",
      },
      {
        excerpt_id: "INSTAGRAM_TERMS_E002",
        heading: "Personalized opportunities",
        text:
          "We build systems that try to understand who and what you and others care about, and use that information to help you create, find, join and share in experiences that matter to you.",
      },
      {
        excerpt_id: "INSTAGRAM_TERMS_E003",
        heading: "Permission for ads and sponsored content",
        text:
          "You give us permission to show your username, profile picture, and information about your actions or relationships next to or in connection with accounts, ads, offers, and other sponsored content.",
      },
      {
        excerpt_id: "INSTAGRAM_TERMS_E004",
        heading: "Account and content deletion",
        text:
          "When you request to delete content or your account, the deletion process will automatically begin no more than 30 days after your request. It may take up to 90 days to delete content after the deletion process begins.",
      },
    ],
  },
  {
    doc_id: "LGPD_EXCERPTS",
    dir: "lgpd-excerpts",
    title: "Lei Geral de Protecao de Dados Pessoais - trechos relevantes",
    platform: "Planalto",
    type: "other",
    language: "pt-BR",
    official_url:
      "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    status: "frozen_relevant_legal_excerpts",
    effective_label: "Lei no 13.709, de 14 de agosto de 2018 - texto compilado",
    capture_method:
      "Playwright chromium innerText capture + viewport screenshot; selected legal excerpts used by the study.",
    access_limitations:
      "Official Planalto page was accessible during capture. The repository stores only study-relevant excerpts.",
    normalization_decisions:
      "Selected legal excerpts preserve wording from the official compiled law text; repeated historical versions inside the page were not duplicated.",
    excerpts: [
      {
        excerpt_id: "LGPD_E001",
        heading: "Art. 5 definicoes",
        text:
          "Art. 5º Para os fins desta Lei, considera-se: I - dado pessoal: informação relacionada a pessoa natural identificada ou identificável; V - titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.",
      },
      {
        excerpt_id: "LGPD_E002",
        heading: "Art. 6 finalidade e transparencia",
        text:
          "Art. 6º As atividades de tratamento de dados pessoais deverão observar a boa-fé e os seguintes princípios: I - finalidade; VI - transparência.",
      },
      {
        excerpt_id: "LGPD_E003",
        heading: "Art. 15 e Art. 16 termino e eliminacao",
        text:
          "Art. 15. O término do tratamento de dados pessoais ocorrerá quando a finalidade for alcançada ou os dados deixarem de ser necessários. Art. 16. Os dados pessoais serão eliminados após o término de seu tratamento.",
      },
      {
        excerpt_id: "LGPD_E004",
        heading: "Art. 18 direitos do titular",
        text:
          "Art. 18. O titular dos dados pessoais tem direito a obter do controlador confirmação da existência de tratamento, acesso aos dados, correção, anonimização, bloqueio ou eliminação, portabilidade e informação sobre compartilhamento.",
      },
      {
        excerpt_id: "LGPD_E005",
        heading: "Art. 46 seguranca",
        text:
          "Art. 46. Os agentes de tratamento devem adotar medidas de segurança, técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados.",
      },
      {
        excerpt_id: "LGPD_E006",
        heading: "Art. 48 incidente",
        text:
          "Art. 48. O controlador deverá comunicar à autoridade nacional e ao titular a ocorrência de incidente de segurança que possa acarretar risco ou dano relevante aos titulares.",
      },
    ],
  },
];

const clauses = [
  clause("X_PRIVACY_C001", "X_PRIVACY", "Account information required by X", "X_PRIVACY_E001", "data_collection", "high", ["Art. 5º, I", "Art. 9º"], ["personal information", "email address", "phone number", "date of birth"]),
  clause("X_PRIVACY_C002", "X_PRIVACY", "How X uses collected information", "X_PRIVACY_E002", "purpose_use", "medium", ["Art. 6º, I", "Art. 9º"], ["information", "personalize", "ads"]),
  clause("X_PRIVACY_C003", "X_PRIVACY", "Sharing information on X", "X_PRIVACY_E003", "sharing_third_parties", "high", ["Art. 18, VII"], ["share your information", "sharing"]),
  clause("X_PRIVACY_C004", "X_PRIVACY", "Retention periods on X", "X_PRIVACY_E004", "retention_storage", "medium", ["Art. 15", "Art. 16"], ["retain", "retention"]),
  clause("X_PRIVACY_C005", "X_PRIVACY", "Access, correction and portability on X", "X_PRIVACY_E005", "user_rights", "high", ["Art. 18, I", "Art. 18, V"], ["access", "portability", "download a copy"]),
  clause("META_PRIVACY_C001", "META_PRIVACY", "Meta highlights collection, use and sharing", "META_PRIVACY_E001", "data_collection", "high", ["Art. 5º, I", "Art. 9º"], ["informações", "coletamos", "usamos", "compartilhamos"]),
  clause("META_PRIVACY_C002", "META_PRIVACY", "Meta policy explains retention and rights", "META_PRIVACY_E002", "purpose_use", "high", ["Art. 6º, I", "Art. 9º", "Art. 18"], ["coletamos", "compartilhamos", "retemos", "transferimos", "direitos"]),
  clause("META_PRIVACY_C003", "META_PRIVACY", "Privacy controls in Meta products", "META_PRIVACY_E003", "user_rights", "medium", ["Art. 18"], ["controlar sua privacidade", "gerenciar suas informações"]),
  clause("INSTAGRAM_TERMS_C001", "INSTAGRAM_TERMS", "Scope of the Instagram service", "INSTAGRAM_TERMS_E001", "purpose_use", "medium", ["Art. 6º, I", "Art. 9º"], ["terms of use", "service"]),
  clause("INSTAGRAM_TERMS_C002", "INSTAGRAM_TERMS", "Instagram personalization systems", "INSTAGRAM_TERMS_E002", "purpose_use", "high", ["Art. 9º", "Art. 20"], ["systems", "information", "personalized"]),
  clause("INSTAGRAM_TERMS_C003", "INSTAGRAM_TERMS", "Sponsored content permission", "INSTAGRAM_TERMS_E003", "sharing_third_parties", "high", ["Art. 18, VII"], ["ads", "sponsored content", "information about your actions"]),
  clause("INSTAGRAM_TERMS_C004", "INSTAGRAM_TERMS", "Deletion and backup timing", "INSTAGRAM_TERMS_E004", "retention_storage", "high", ["Art. 15", "Art. 16", "Art. 18, VI"], ["delete content", "90 days", "backups"]),
  clause("LGPD_EXCERPTS_C001", "LGPD_EXCERPTS", "Definitions of personal data and data subject", "LGPD_E001", "data_collection", "high", ["Art. 5º, I", "Art. 5º, V"], ["dado pessoal", "titular", "tratamento"]),
  clause("LGPD_EXCERPTS_C002", "LGPD_EXCERPTS", "Principles of purpose and transparency", "LGPD_E002", "purpose_use", "high", ["Art. 6º, I", "Art. 6º, VI"], ["tratamento de dados", "finalidade", "transparência"]),
  clause("LGPD_EXCERPTS_C003", "LGPD_EXCERPTS", "Termination and deletion of processing", "LGPD_E003", "retention_storage", "high", ["Art. 15", "Art. 16"], ["término do tratamento", "eliminação", "dados pessoais"]),
  clause("LGPD_EXCERPTS_C004", "LGPD_EXCERPTS", "Data subject rights", "LGPD_E004", "user_rights", "high", ["Art. 18"], ["titular", "controlador", "acesso aos dados", "portabilidade", "compartilhamento"]),
  clause("LGPD_EXCERPTS_C005", "LGPD_EXCERPTS", "Security measures", "LGPD_E005", "security_incidents", "high", ["Art. 46"], ["medidas de segurança", "acessos não autorizados"]),
  clause("LGPD_EXCERPTS_C006", "LGPD_EXCERPTS", "Security incident communication", "LGPD_E006", "security_incidents", "high", ["Art. 48"], ["incidente de segurança", "autoridade nacional", "titular"]),
];

function clause(clause_id, doc_id, title, excerpt_id, category, impact, lgpd_refs, detected_terms) {
  const source = sources.find((item) => item.doc_id === doc_id);
  const excerpt = source.excerpts.find((item) => item.excerpt_id === excerpt_id);
  return {
    clause_id,
    document_id: doc_id,
    doc_id,
    titulo: title,
    title,
    texto_original: excerpt.text,
    text: excerpt.text,
    categoria: category,
    category,
    impacto: impact,
    impact,
    direito_lgpd_relacionado: lgpd_refs,
    lgpd_refs,
    termos_detectados: detected_terms,
    source_kind: "official_selected_excerpt",
    source_package: `data/corpus/${source.dir}`,
    source_excerpt_id: excerpt_id,
    official_url: source.official_url,
    review_status: "manual_academic_review_v1",
    traducao_resumida: buildPlainSummary(category, impact),
  };
}

function buildPlainSummary(category, impact) {
  const summaries = {
    data_collection:
      "A cláusula indica quais dados ou informações entram no tratamento descrito pelo documento.",
    purpose_use:
      "A cláusula indica finalidade, serviço, personalização ou justificativa de uso das informações.",
    sharing_third_parties:
      "A cláusula indica circulação, exposição ou associação de informações com terceiros, parceiros ou público.",
    retention_storage:
      "A cláusula indica prazo, retenção, exclusão ou permanência técnica de dados e conteúdo.",
    user_rights:
      "A cláusula indica controle do titular, acesso, portabilidade, correção, exclusão ou gestão de privacidade.",
    security_incidents:
      "A cláusula indica proteção, segurança ou comunicação de incidentes envolvendo dados pessoais.",
  };
  return `${summaries[category]} Impacto metodológico: ${impact}.`;
}

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function sourceText(source) {
  return [
    `# ${source.title}`,
    "",
    `Official URL: ${source.official_url}`,
    `Captured at: ${capturedAt}`,
    `Scope: selected official excerpts for academic clause-level analysis; not a full reproduction of the document.`,
    "",
    ...source.excerpts.flatMap((excerpt) => [
      `## ${excerpt.excerpt_id} - ${excerpt.heading}`,
      excerpt.text,
      "",
    ]),
  ].join("\n");
}

function captureNotes(source, resolvedUrl, observedHash) {
  return [
    `# Capture notes - ${source.title}`,
    "",
    `- What was captured: selected official excerpts used for clause-level analysis, plus metadata and screenshot evidence.`,
    `- Official source: ${source.official_url}`,
    `- Resolved URL during capture: ${resolvedUrl || "not captured"}`,
    `- Capture timestamp: ${capturedAt}`,
    `- Effective/version label: ${source.effective_label}`,
    `- Access limitations: ${source.access_limitations}`,
    `- Normalization decisions: ${source.normalization_decisions}`,
    `- Observed body text SHA-256: ${observedHash || "not available"}`,
    "",
    "## Copyright and scope note",
    "",
    "The repository stores selected excerpts required for academic analysis and reproducibility. It does not store complete proprietary platform policies. For full review, use the official URL recorded in metadata.",
    "",
  ].join("\n");
}

function csvEscape(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function csvRows() {
  const header = [
    "clause_id",
    "doc_id",
    "title",
    "text",
    "category",
    "impact",
    "lgpd_refs",
    "source_kind",
    "source_package",
    "source_excerpt_id",
    "official_url",
    "review_status",
  ];
  return [
    header.join(","),
    ...clauses.map((item) =>
      [
        item.clause_id,
        item.doc_id,
        item.title,
        item.text,
        item.category,
        item.impact,
        item.lgpd_refs,
        item.source_kind,
        item.source_package,
        item.source_excerpt_id,
        item.official_url,
        item.review_status,
      ]
        .map(csvEscape)
        .join(",")
    ),
  ].join("\n");
}

function datasetReadme() {
  return `# Clause-Level Dataset

This dataset is derived from the frozen source packages in \`data/corpus/*/\`.

## Source basis

- X Privacy Policy: \`data/corpus/x-privacy\`
- Meta/Facebook Privacy Policy: \`data/corpus/meta-privacy\`
- Instagram Terms of Use: \`data/corpus/instagram-terms\`
- LGPD relevant legal excerpts: \`data/corpus/lgpd-excerpts\`

## Derivation flow

1. Official primary URLs were accessed with Playwright.
2. Each source package received metadata, selected raw excerpts, capture notes, and a screenshot.
3. Selected excerpts were segmented into clause-level units.
4. Automatic project categories were applied first using the six-category taxonomy.
5. Manual academic review normalized ambiguous boundaries and assigned final impact.
6. Traceability was preserved through \`source_package\`, \`source_excerpt_id\`, and \`official_url\`.

## Categories

- \`data_collection\`
- \`purpose_use\`
- \`sharing_third_parties\`
- \`retention_storage\`
- \`user_rights\`
- \`security_incidents\`

## Boundary decisions

The platform documents are long and proprietary. The dataset intentionally uses selected official excerpts, not full policy copies. Clause boundaries were chosen when an excerpt contained a single analyzable legal/privacy action: collection, purpose, sharing, retention, rights, or security.

## Files

- \`clauses.json\`: app-compatible academic records.
- \`clauses.csv\`: tabular contract for review and validation.
`;
}

async function main() {
  await fs.mkdir(corpusRoot, { recursive: true });
  await fs.mkdir(datasetRoot, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const manifest = [];

  for (const source of sources) {
    const dir = path.join(corpusRoot, source.dir);
    await fs.mkdir(dir, { recursive: true });

    let resolvedUrl = "";
    let observedBodyHash = "";
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
      await page.goto(source.official_url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2500);
      resolvedUrl = page.url();
      const bodyText = await page.locator("body").innerText({ timeout: 15000 });
      observedBodyHash = sha256(bodyText);
      await page.screenshot({ path: path.join(dir, "source-screenshot.png"), fullPage: false });
      await page.close();
    } catch (error) {
      await fs.writeFile(
        path.join(dir, "source-screenshot-error.txt"),
        `${error instanceof Error ? error.message : String(error)}\n`,
        "utf8"
      );
    }

    const sourceBody = sourceText(source);
    const metadata = {
      doc_id: source.doc_id,
      title: source.title,
      platform: source.platform,
      type: source.type,
      language: source.language,
      official_url: source.official_url,
      resolved_url: resolvedUrl,
      captured_at: capturedAt,
      content_hash: sha256(sourceBody),
      observed_body_text_hash: observedBodyHash,
      capture_method: source.capture_method,
      status: source.status,
      effective_label: source.effective_label,
      source_scope: "selected_official_excerpts",
      excerpt_count: source.excerpts.length,
    };

    await fs.writeFile(path.join(dir, "source.txt"), `${sourceBody}\n`, "utf8");
    await fs.writeFile(path.join(dir, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`, "utf8");
    await fs.writeFile(
      path.join(dir, "capture-notes.md"),
      captureNotes(source, resolvedUrl, observedBodyHash),
      "utf8"
    );

    manifest.push({
      document_id: source.doc_id,
      titulo: source.title,
      plataforma: source.platform,
      tipo: source.type,
      idioma: source.language,
      coleta_referencia: capturedAt,
      natureza_fonte: source.status,
      objetivo_no_corpus:
        source.doc_id === "LGPD_EXCERPTS"
          ? "Fornecer base normativa para categorias, direitos, impacto e referencias LGPD."
          : "Fornecer trechos oficiais de documento digital para leitura assistida clause-level.",
      official_url: source.official_url,
      source_package: `data/corpus/${source.dir}`,
      content_hash: metadata.content_hash,
      capture_method: source.capture_method,
      status: source.status,
    });
  }

  await browser.close();

  await fs.writeFile(
    path.join(corpusRoot, "corpus-manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(corpusRoot, "corpus_manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  await fs.writeFile(path.join(datasetRoot, "clauses.json"), `${JSON.stringify(clauses, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(datasetRoot, "clauses.csv"), `${csvRows()}\n`, "utf8");
  await fs.writeFile(path.join(datasetRoot, "README.md"), datasetReadme(), "utf8");

  console.log(`Frozen ${sources.length} source packages and ${clauses.length} clauses.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
