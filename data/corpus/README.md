# Corpus oficial da pesquisa

Este diretorio guarda o corpus congelado do TCC-VisualLaw. O objetivo e preservar fontes oficiais primarias de modo reproduzivel antes de qualquer segmentacao clause-level, classificacao heuristica ou geracao de cards explicativos.

## Decisao de corpus

O recorte canonico atual e composto por 5 documentos de plataformas digitais mais a LGPD oficial:

| document_id | pacote | fonte oficial primaria | papel no estudo |
| --- | --- | --- | --- |
| `X_TERMS` | `x-terms/` | `https://x.com/pt/tos` | Termos contratuais do X |
| `X_PRIVACY` | `x-privacy/` | `https://x.com/pt/privacy` | Politica de privacidade do X |
| `META_TERMS` | `meta-terms/` | `https://www.facebook.com/terms/?locale=pt_BR` | Termos do Facebook/Meta |
| `META_PRIVACY` | `meta-privacy/` | `https://www.facebook.com/privacy/policy/?locale=pt_BR` | Politica compartilhada da Meta |
| `INSTAGRAM_TERMS` | `instagram-terms/` | `https://help.instagram.com/581066165581870/?locale=pt_BR` | Termos de uso do Instagram |
| `LGPD_EXCERPTS` | `lgpd-excerpts/` | `https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm` | Base normativa oficial |

O pacote `instagram-privacy/` existe como referencia auxiliar porque a politica de privacidade aplicavel ao Instagram e a politica compartilhada da Meta. Ele nao deve inflar o dataset principal sem justificativa metodologica.

## Arquivos obrigatorios por pacote primario

Cada pacote primario deve conter:

- `source.html`: DOM renderizado salvo a partir da fonte oficial;
- `source.txt`: texto visivel extraido de `document.body.innerText`;
- `source.pdf`: evidencia PDF gerada a partir da pagina oficial renderizada;
- `source-screenshot.png`: evidencia visual da captura;
- `metadata.json`: contrato tecnico da captura;
- `capture-notes.md`: notas metodologicas, anomalias e normalizacao;
- `SHA256SUMS`: hashes dos artefatos versionados.

Documentos companheiros ficam em `related/` dentro do pacote correspondente.

## Como capturar

```bash
npm run corpus:capture:primary
npm run corpus:manifest
npm run corpus:validate
```

Use `npm run corpus:capture` quando tambem quiser capturar documentos relacionados. Meta/Facebook e Instagram podem retornar login, bloqueio temporario ou rate limit em automacao; nesses casos o resultado deve ser registrado em `metadata.json` e revisado visualmente antes de entrar no dataset academico.

## Contrato de metadados

Cada `metadata.json` deve conter no minimo:

- `doc_id`
- `title`
- `platform`
- `type`
- `language`
- `official_url`
- `resolved_url`
- `captured_at`
- `capture_method`
- `capture_status`
- `content_hash_sha256`
- `source_files`
- `related_urls`
- `notes`

## Raw vs normalizado

`source.html` e a evidencia primaria renderizada. `source.txt` e uma normalizacao tecnica limitada a espacos e quebras de linha repetidas. Nao ha resumo, traducao ou reescrita semantica no pacote de fonte.

## Manifestos

`corpus-manifest.json` e o inventario canonico consumido pelo app e pela pesquisa. `corpus_manifest.json` permanece como espelho legado para compatibilidade. `index.csv` facilita auditoria e revisao academica.

## Derivacao posterior

A ordem correta e:

1. captura oficial bruta;
2. validacao estrutural;
3. segmentacao clause-level;
4. revisao manual academica;
5. dataset derivado;
6. calibracao do lexico;
7. UI de leitura assistida e relatorio.

O dataset em `data/dataset` nao deve substituir uma clausula real por texto sintetico sem deixar isso explicito em README, manifesto e notas de revisao.
