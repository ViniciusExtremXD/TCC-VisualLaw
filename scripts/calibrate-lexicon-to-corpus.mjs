import fs from "node:fs/promises";
import path from "node:path";

const lexiconPath = path.resolve("data", "lexicon", "lexicon.json");

const extraAliases = {
  TERM_001: ["personal information", "email address", "phone number", "date of birth"],
  TERM_002: ["permission", "give us permission"],
  TERM_004: ["treatment", "data processing", "processing"],
  TERM_005: ["controller"],
  TERM_006: ["share", "sharing", "share your information", "shared", "compartilhamos"],
  TERM_007: ["third party", "third parties", "terceiros"],
  TERM_008: ["purpose", "mission", "finalidade"],
  TERM_009: ["retain", "retention", "keep", "periods of time", "90 days", "backups"],
  TERM_011: ["security incident", "incidente de segurança"],
  TERM_012: ["data subject", "titular"],
  TERM_014: ["legal bases", "legal reasons"],
  TERM_015: ["processor", "operator"],
  TERM_018: ["portability", "download a copy"],
  TERM_020: ["legitimate interest"],
  TERM_021: ["transfer", "transferimos", "international transfer"],
  TERM_022: ["privacy policy", "política de privacidade"],
  TERM_023b: ["terms of use", "terms", "service"],
  TERM_024: ["personalize", "personalized", "systems", "profiling"],
  TERM_025: ["ads", "sponsored content", "offers"],
  TERM_030: ["deletion", "delete content", "delete account", "eliminated"],
  TERM_031: ["automated decision", "automated decisions"],
  TERM_032: ["access", "access to data", "acesso aos dados"],
  TERM_034: ["security measures", "safety and security", "unauthorized access", "acessos não autorizados"],
};

const support = {
  TERM_001: ["X_PRIVACY_E001", "META_PRIVACY_E001", "LGPD_E001"],
  TERM_002: ["INSTAGRAM_TERMS_E003", "LGPD_E002"],
  TERM_004: ["META_PRIVACY_E002", "LGPD_E001", "LGPD_E002"],
  TERM_005: ["LGPD_E004"],
  TERM_006: ["X_PRIVACY_E003", "META_PRIVACY_E001", "META_PRIVACY_E002", "LGPD_E004"],
  TERM_007: ["X_PRIVACY_E003", "INSTAGRAM_TERMS_E003"],
  TERM_008: ["X_PRIVACY_E002", "LGPD_E002"],
  TERM_009: ["X_PRIVACY_E004", "INSTAGRAM_TERMS_E004", "LGPD_E003"],
  TERM_010: ["LGPD_E004"],
  TERM_011: ["LGPD_E006"],
  TERM_012: ["LGPD_E001", "LGPD_E004", "LGPD_E006"],
  TERM_014: ["X_PRIVACY_E004", "LGPD_E002"],
  TERM_015: ["LGPD_E004"],
  TERM_018: ["X_PRIVACY_E005", "LGPD_E004"],
  TERM_020: ["LGPD_E002"],
  TERM_021: ["META_PRIVACY_E002"],
  TERM_022: ["META_PRIVACY_E002"],
  TERM_023b: ["INSTAGRAM_TERMS_E001"],
  TERM_024: ["INSTAGRAM_TERMS_E002"],
  TERM_025: ["X_PRIVACY_E002", "INSTAGRAM_TERMS_E003"],
  TERM_030: ["INSTAGRAM_TERMS_E004", "LGPD_E003", "LGPD_E004"],
  TERM_031: ["LGPD_E002"],
  TERM_032: ["X_PRIVACY_E005", "LGPD_E004"],
  TERM_034: ["X_PRIVACY_E004", "LGPD_E005"],
};

function unique(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

const lexicon = JSON.parse(await fs.readFile(lexiconPath, "utf8"));
const calibrated = lexicon.map((entry) => {
  const aliases = unique([
    ...(entry.aliases ?? []),
    ...(entry.palavras_chave_relacionadas ?? []),
    ...(extraAliases[entry.term_id] ?? []),
  ]);

  return {
    ...entry,
    aliases,
    palavras_chave_relacionadas: aliases,
    lgpd_refs: entry.lgpd_refs ?? entry.direito_lgpd_relacionado ?? [],
    corpus_support: support[entry.term_id] ?? ["LGPD_ALIGNMENT"],
    observacao_metodologica:
      entry.observacao_metodologica ??
      "Entrada mantida por suporte no corpus oficial selecionado ou por alinhamento essencial com a LGPD.",
    icone_id: entry.term_id === "TERM_031" && entry.icone_id === "bot" ? "brain" : entry.icone_id,
  };
});

await fs.writeFile(lexiconPath, `${JSON.stringify(calibrated, null, 2)}\n`, "utf8");
console.log(`Calibrated ${calibrated.length} lexicon entries.`);
