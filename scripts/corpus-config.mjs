export const CORPUS_PRIMARY_PACKAGE_IDS = [
  "x-terms",
  "x-privacy",
  "meta-terms",
  "meta-privacy",
  "instagram-terms",
  "lgpd-excerpts",
];

export const CORPUS_PACKAGE_IDS = [
  ...CORPUS_PRIMARY_PACKAGE_IDS,
  "instagram-privacy",
];

export const CORPUS_PACKAGES = [
  {
    package_id: "x-terms",
    doc_id: "X_TERMS",
    title: "X Terms of Service",
    platform: "X",
    type: "terms_of_service",
    app_type: "terms",
    language: "pt-BR",
    official_url: "https://x.com/pt/tos",
    source_kind: "frozen_official_primary_source",
    objective:
      "Preservar os termos contratuais do X para analise clause-level de uso, licenca de conteudo, publicidade e enforcement.",
    related_urls: {
      english_terms: "https://x.com/en/tos",
      privacy_center: "https://privacy.x.com/pt",
      cookies: "https://help.x.com/pt/rules-and-policies/x-cookies",
      data_processing_bases:
        "https://help.x.com/pt/rules-and-policies/data-processing-legal-bases",
    },
    related_documents: [
      {
        id: "english-terms",
        title: "X Terms of Service - English",
        url: "https://x.com/en/tos",
        type: "terms_of_service",
        language: "en",
        method: "page",
      },
      {
        id: "privacy-center",
        title: "X Privacy Center",
        url: "https://privacy.x.com/pt",
        type: "privacy_reference",
        language: "pt-BR",
        method: "page",
      },
      {
        id: "cookies",
        title: "X Cookies Policy",
        url: "https://help.x.com/pt/rules-and-policies/x-cookies",
        type: "cookies_policy",
        language: "pt-BR",
        method: "page",
      },
      {
        id: "data-processing-bases",
        title: "X Legal Bases for Data Processing",
        url: "https://help.x.com/pt/rules-and-policies/data-processing-legal-bases",
        type: "privacy_reference",
        language: "pt-BR",
        method: "page",
      },
    ],
  },
  {
    package_id: "x-privacy",
    doc_id: "X_PRIVACY",
    title: "X Privacy Policy",
    platform: "X",
    type: "privacy_policy",
    app_type: "privacy",
    language: "pt-BR",
    official_url: "https://x.com/pt/privacy",
    source_kind: "frozen_official_primary_source",
    objective:
      "Preservar a politica de privacidade do X para analise de coleta, finalidade, compartilhamento, retencao, direitos e seguranca.",
    related_urls: {
      english_privacy: "https://x.com/en/privacy",
      privacy_center: "https://privacy.x.com/pt",
      cookies: "https://help.x.com/pt/rules-and-policies/x-cookies",
      data_processing_bases:
        "https://help.x.com/pt/rules-and-policies/data-processing-legal-bases",
    },
    related_documents: [
      {
        id: "english-privacy",
        title: "X Privacy Policy - English",
        url: "https://x.com/en/privacy",
        type: "privacy_policy",
        language: "en",
        method: "page",
      },
      {
        id: "privacy-center",
        title: "X Privacy Center",
        url: "https://privacy.x.com/pt",
        type: "privacy_reference",
        language: "pt-BR",
        method: "page",
      },
      {
        id: "cookies",
        title: "X Cookies Policy",
        url: "https://help.x.com/pt/rules-and-policies/x-cookies",
        type: "cookies_policy",
        language: "pt-BR",
        method: "page",
      },
      {
        id: "data-processing-bases",
        title: "X Legal Bases for Data Processing",
        url: "https://help.x.com/pt/rules-and-policies/data-processing-legal-bases",
        type: "privacy_reference",
        language: "pt-BR",
        method: "page",
      },
    ],
  },
  {
    package_id: "meta-terms",
    doc_id: "META_TERMS",
    title: "Meta/Facebook Terms of Service",
    platform: "Meta/Facebook",
    type: "terms_of_service",
    app_type: "terms",
    language: "pt-BR",
    official_url: "https://www.facebook.com/terms/?locale=pt_BR",
    source_kind: "frozen_official_primary_source",
    objective:
      "Preservar os termos do Facebook/Meta para analise clause-level de uso da plataforma, conteudo, suspensao e licencas.",
    related_urls: {
      privacy_policy: "https://www.facebook.com/privacy/policy/?locale=pt_BR",
      cookies: "https://www.facebook.com/privacy/policies/cookies/?locale=pt_BR",
    },
    related_documents: [
      {
        id: "cookies",
        title: "Meta Cookies Policy",
        url: "https://www.facebook.com/privacy/policies/cookies/?locale=pt_BR",
        type: "cookies_policy",
        language: "pt-BR",
        method: "page",
      },
    ],
  },
  {
    package_id: "meta-privacy",
    doc_id: "META_PRIVACY",
    title: "Meta Privacy Policy",
    platform: "Meta/Facebook",
    type: "privacy_policy",
    app_type: "privacy",
    language: "pt-BR",
    official_url: "https://www.facebook.com/privacy/policy/?locale=pt_BR",
    source_kind: "frozen_official_primary_source",
    objective:
      "Preservar a politica de privacidade da Meta que cobre Facebook, Instagram, Messenger e outros produtos Meta.",
    related_urls: {
      versions: "https://www.facebook.com/privacy/policy/?locale=pt_BR&show_versions=1",
      terms: "https://www.facebook.com/terms/?locale=pt_BR",
      cookies: "https://www.facebook.com/privacy/policies/cookies/?locale=pt_BR",
    },
    related_documents: [
      {
        id: "versions",
        title: "Meta Privacy Policy - Version History",
        url: "https://www.facebook.com/privacy/policy/?locale=pt_BR&show_versions=1",
        type: "privacy_reference",
        language: "pt-BR",
        method: "page",
      },
      {
        id: "cookies",
        title: "Meta Cookies Policy",
        url: "https://www.facebook.com/privacy/policies/cookies/?locale=pt_BR",
        type: "cookies_policy",
        language: "pt-BR",
        method: "page",
      },
    ],
  },
  {
    package_id: "instagram-terms",
    doc_id: "INSTAGRAM_TERMS",
    title: "Instagram Terms of Use",
    platform: "Instagram",
    type: "terms_of_use",
    app_type: "terms",
    language: "pt-BR",
    official_url: "https://help.instagram.com/581066165581870/?locale=pt_BR",
    source_kind: "frozen_official_primary_source",
    objective:
      "Preservar os termos de uso do Instagram para analise clause-level de uso, remocao de conteudo, conta e disputas.",
    related_urls: {
      default_terms: "https://help.instagram.com/581066165581870",
      termsofuse_alias: "https://help.instagram.com/termsofuse",
      privacy_center: "https://privacycenter.instagram.com/policy",
    },
    related_documents: [
      {
        id: "default-terms",
        title: "Instagram Terms of Use - Default URL",
        url: "https://help.instagram.com/581066165581870",
        type: "terms_of_use",
        language: "auto",
        method: "page",
      },
      {
        id: "termsofuse-alias",
        title: "Instagram Terms of Use - Alias",
        url: "https://help.instagram.com/termsofuse",
        type: "terms_of_use",
        language: "auto",
        method: "page",
      },
    ],
  },
  {
    package_id: "instagram-privacy",
    doc_id: "INSTAGRAM_PRIVACY",
    title: "Instagram Privacy Policy Reference",
    platform: "Instagram/Meta",
    type: "privacy_policy",
    app_type: "privacy",
    language: "auto",
    official_url: "https://privacycenter.instagram.com/policy",
    source_kind: "frozen_official_related_reference",
    objective:
      "Preservar referencia oficial de privacidade do Instagram/Meta sem duplicar a politica Meta no dataset principal.",
    related_urls: {
      cookies: "https://privacycenter.instagram.com/policies/cookies",
      legacy_privacy: "https://help.instagram.com/519522125107875",
      legacy_cookies: "https://help.instagram.com/1896641480634370",
      meta_privacy_pt_br: "https://www.facebook.com/privacy/policy/?locale=pt_BR",
    },
    related_documents: [
      {
        id: "cookies",
        title: "Instagram Privacy Center - Cookies",
        url: "https://privacycenter.instagram.com/policies/cookies",
        type: "cookies_policy",
        language: "auto",
        method: "page",
      },
      {
        id: "legacy-privacy",
        title: "Instagram Help Center - Privacy Policy",
        url: "https://help.instagram.com/519522125107875",
        type: "privacy_policy",
        language: "auto",
        method: "page",
      },
      {
        id: "legacy-cookies",
        title: "Instagram Help Center - Cookies",
        url: "https://help.instagram.com/1896641480634370",
        type: "cookies_policy",
        language: "auto",
        method: "page",
      },
    ],
  },
  {
    package_id: "lgpd-excerpts",
    doc_id: "LGPD_EXCERPTS",
    title: "Lei Geral de Protecao de Dados Pessoais - LGPD",
    platform: "Planalto",
    type: "law_excerpt_set",
    app_type: "other",
    language: "pt-BR",
    official_url:
      "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm",
    source_kind: "frozen_official_legal_source",
    objective:
      "Preservar a fonte normativa oficial para categorias, direitos, retencao, compartilhamento, seguranca e incidentes.",
    related_urls: {
      camara_html:
        "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html",
      camara_pdf:
        "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.pdf",
      camara_doc:
        "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.doc",
      camara_docx:
        "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.docx",
      senado_pdf:
        "https://www2.senado.leg.br/bdsf/bitstream/handle/id/658231/Lei_geral_protecao_dados_pessoais_1ed.pdf",
    },
    related_documents: [
      {
        id: "camara-html",
        title: "LGPD - Camara HTML Atualizado",
        url: "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html",
        type: "law_reference",
        language: "pt-BR",
        method: "page",
      },
      {
        id: "camara-pdf",
        title: "LGPD - Camara PDF Atualizado",
        url: "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.pdf",
        type: "law_reference",
        language: "pt-BR",
        method: "download",
        file_name: "source.pdf",
      },
      {
        id: "camara-doc",
        title: "LGPD - Camara DOC Atualizado",
        url: "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.doc",
        type: "law_reference",
        language: "pt-BR",
        method: "download",
        file_name: "source.doc",
      },
      {
        id: "camara-docx",
        title: "LGPD - Camara DOCX Atualizado",
        url: "https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.docx",
        type: "law_reference",
        language: "pt-BR",
        method: "download",
        file_name: "source.docx",
      },
      {
        id: "senado-pdf",
        title: "LGPD - Senado Edicao Tecnica",
        url: "https://www2.senado.leg.br/bdsf/bitstream/handle/id/658231/Lei_geral_protecao_dados_pessoais_1ed.pdf",
        type: "law_reference",
        language: "pt-BR",
        method: "download",
        file_name: "source.pdf",
      },
    ],
  },
];

export const CAPTURE_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

export const CAPTURE_ACCEPT_LANGUAGE = "pt-BR,pt;q=0.9,en;q=0.8";

