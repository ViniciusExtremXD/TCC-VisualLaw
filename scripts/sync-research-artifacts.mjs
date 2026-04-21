import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const datasetPath = path.join(projectRoot, "data", "dataset", "clauses.json");
const lexiconPath = path.join(projectRoot, "data", "lexicon", "lexicon.json");
const outputDir = path.join(projectRoot, "data", "output");
const validationDir = path.join(projectRoot, "data", "validacao");

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function buildNormalizedMap(text) {
  const map = [];
  let normalized = "";

  for (let index = 0; index < text.length; index += 1) {
    const normalizedChar = normalize(text[index]);
    if (!normalizedChar) continue;

    for (const char of normalizedChar) {
      normalized += char;
      map.push(index);
    }
  }

  return { normalized, map };
}

function locateTermOccurrence(text, candidates) {
  const normalizedText = buildNormalizedMap(text);
  const orderedCandidates = [...new Set(candidates.map((candidate) => candidate.trim()).filter(Boolean))];

  for (const candidate of orderedCandidates) {
    const normalizedCandidate = normalize(candidate);
    const start = normalizedText.normalized.indexOf(normalizedCandidate);
    if (start === -1) continue;

    const originalStart = normalizedText.map[start];
    const originalEnd =
      normalizedText.map[start + normalizedCandidate.length - 1] + 1;

    return {
      match: text.slice(originalStart, originalEnd),
      start: originalStart,
      end: originalEnd,
      matchedVariant: candidate,
    };
  }

  return null;
}

function escapeCsv(value) {
  const text = Array.isArray(value) ? value.join("; ") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

async function main() {
  const clauses = JSON.parse(await fs.readFile(datasetPath, "utf8"));
  const lexicon = JSON.parse(await fs.readFile(lexiconPath, "utf8"));

  const lexiconByNormalizedTerm = new Map();
  for (const entry of lexicon) {
    lexiconByNormalizedTerm.set(normalize(entry.termo_juridico), entry);
    for (const keyword of entry.palavras_chave_relacionadas ?? []) {
      lexiconByNormalizedTerm.set(normalize(keyword), entry);
    }
  }

  const highlights = [];
  const usedTermIds = new Set();

  for (const clause of clauses) {
    const clauseSeenTermIds = new Set();
    for (const detectedTerm of clause.termos_detectados) {
      const lexiconEntry = lexiconByNormalizedTerm.get(normalize(detectedTerm));
      if (!lexiconEntry || clauseSeenTermIds.has(lexiconEntry.term_id)) continue;

      usedTermIds.add(lexiconEntry.term_id);
      const located = locateTermOccurrence(clause.texto_original, [
        lexiconEntry.termo_juridico,
        ...(lexiconEntry.palavras_chave_relacionadas ?? []),
      ]);

      if (!located) continue;
      clauseSeenTermIds.add(lexiconEntry.term_id);

      highlights.push({
        clause_id: clause.clause_id,
        document_id: clause.document_id,
        term_id: lexiconEntry.term_id,
        termo_juridico: lexiconEntry.termo_juridico,
        trecho_detectado: located.match,
        start: located.start,
        end: located.end,
        regra_matching: "DATASET_REFERENCE_MATCH",
        campo_lexico:
          normalize(located.matchedVariant) === normalize(lexiconEntry.termo_juridico)
            ? "termo_juridico"
            : "palavras_chave_relacionadas",
        variante_encontrada: located.matchedVariant,
        categoria: clause.categoria,
        impacto: clause.impacto,
      });
    }
  }

  const explanations = lexicon
    .filter((entry) => usedTermIds.has(entry.term_id))
    .map((entry) => ({
      term_id: entry.term_id,
      termo_juridico: entry.termo_juridico,
      traducao_direta: entry.traducao_direta,
      definicao_leiga: entry.definicao_leiga,
      exemplo_pratico: entry.exemplo_pratico,
      categoria: entry.categoria,
      icone_id: entry.icone_id,
      nivel_impacto: entry.nivel_impacto,
      direito_lgpd_relacionado: entry.direito_lgpd_relacionado,
      observacao_metodologica: entry.observacao_metodologica,
    }));

  const traceability = {
    session_id: "REFERENCE_DATASET_EXPORT",
    created_at: new Date().toISOString(),
    source: {
      mode: "dataset_reference",
      doc_hint: "research_artifacts",
    },
    records: clauses.map((clause) => {
      const linkedHighlights = highlights.filter((item) => item.clause_id === clause.clause_id);
      return {
        trace_id: `TRACE_${clause.clause_id}`,
        document_id: clause.document_id,
        clause_id: clause.clause_id,
        titulo: clause.titulo,
        texto_original: clause.texto_original,
        clausula_segmentada: {
          regra: "dataset_clause_reference",
          evidencia: "origin=data/dataset/clauses.json",
        },
        classificacao_atribuida: {
          categoria: clause.categoria,
          impacto: clause.impacto,
          metodo: "dataset_annotation",
          regras_disparadas: ["REFERENCE_DATASET_LABEL"],
        },
        termos_detectados: linkedHighlights.map((item) => ({
          term_id: item.term_id,
          termo_juridico: item.termo_juridico,
          termo_detectado: item.trecho_detectado,
          start: item.start,
          end: item.end,
          regra_matching: item.regra_matching,
          campo_lexico: item.campo_lexico,
          variante_encontrada: item.variante_encontrada,
          explicacao_id: item.term_id,
          traducao_direta:
            explanations.find((explanation) => explanation.term_id === item.term_id)
              ?.traducao_direta ?? "",
        })),
        explicacoes_vinculadas: linkedHighlights.map((item) => item.term_id),
        saida_final: {
          texto_original: clause.texto_original,
          linguagem_simples: clause.traducao_resumida,
          categoria_exibida: clause.categoria,
          visao_comparativa: true,
        },
      };
    }),
  };

  const csvHeader = [
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
  const csvLines = [
    csvHeader.join(","),
    ...clauses.map((clause) =>
      [
        clause.clause_id,
        clause.doc_id ?? clause.document_id,
        clause.title ?? clause.titulo,
        clause.text ?? clause.texto_original,
        clause.category ?? clause.categoria,
        clause.impact ?? clause.impacto,
        clause.lgpd_refs ?? clause.direito_lgpd_relacionado,
        clause.source_kind ?? "dataset_reference",
        clause.source_package ?? "",
        clause.source_excerpt_id ?? "",
        clause.official_url ?? "",
        clause.review_status ?? "",
      ]
        .map(escapeCsv)
        .join(",")
    ),
  ];

  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(validationDir, { recursive: true });

  await fs.writeFile(path.join(projectRoot, "data", "dataset", "clauses.csv"), `${csvLines.join("\n")}\n`);
  await fs.writeFile(path.join(outputDir, "clauses.json"), `${JSON.stringify(clauses, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, "highlights.json"), `${JSON.stringify(highlights, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, "explanations.json"), `${JSON.stringify(explanations, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, "traceability.json"), `${JSON.stringify(traceability, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
