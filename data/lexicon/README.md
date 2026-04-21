# Dicionario Lexico

O arquivo [lexicon.json](/c:/Users/Vini_/OneDrive%20-%20Instituto%20Presbiteriano%20Mackenzie/%C3%81rea%20de%20Trabalho/TCC/Projeto/data/lexicon/lexicon.json) representa o principal artefato de pesquisa aplicada do projeto.

## Papel metodologico

- centraliza termos juridicos recorrentes em documentos digitais
- associa cada termo a traducao direta e definicao leiga
- explicita categoria, impacto e direito LGPD relacionado
- serve de base para destaque, explicacao visual e rastreabilidade

## Estrutura minima por entrada

- `term_id`
- `termo_juridico`
- `traducao_direta`
- `definicao_leiga`
- `exemplo_pratico`
- `categoria`
- `icone_id`
- `nivel_impacto`
- `direito_lgpd_relacionado`
- `lgpd_refs`
- `aliases`
- `palavras_chave_relacionadas`
- `corpus_support`
- `observacao_metodologica` quando a classificacao exigir justificativa adicional

## Calibracao

O script `node scripts/calibrate-lexicon-to-corpus.mjs` adiciona aliases em portugues/ingles e registra suporte por `source_excerpt_id` quando o termo aparece no corpus oficial selecionado. Termos sem ocorrencia direta no corpus so devem permanecer quando forem essenciais para alinhamento com a LGPD ou para interpretar os trechos congelados.

## Relacao com o MVP

No MVP, o dicionario e usado de duas formas:

1. como artefato academico versionado em JSON
2. como base operacional para matching, explicacao e leitura guiada

Essa separacao permite discutir o dicionario tanto como contribuicao metodologica do TCC quanto como componente tecnico do sistema.
