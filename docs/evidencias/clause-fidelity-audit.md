# Auditoria de fidelidade textual das clausulas

Execucao local: 2026-04-29.

## Veredito geral

**RED para o dataset como conjunto.** `clauses.csv` e `clauses.json` estao coerentes entre si, mas o dataset ainda nao pode ser tratado como 100% fiel ao corpus congelado como um todo.

**YELLOW para uso controlado no Google Forms.** As clausulas da Meta aparecem literalmente em `data/corpus/meta-privacy/source.txt`, mas a URL do dataset usa a forma sem `?locale=pt_BR`, enquanto o metadata canonico do pacote usa `https://www.facebook.com/privacy/policy/?locale=pt_BR`.

## Escopo verificado

- `data/dataset/clauses.csv`
- `data/dataset/clauses.json`
- `data/dataset/README.md`
- `data/corpus/*/source.txt`
- `data/corpus/*/metadata.json`
- `data/corpus/*/capture-notes.md`
- fontes relacionadas em `data/corpus/*/related/**/source.txt`, quando existentes

O proprio `data/dataset/README.md` classifica `clauses.json` e `clauses.csv` como camada derivada de transicao e indica que a proxima etapa metodologica e rederivar as clausulas a partir de `source.txt` validado com revisao manual academica.

## Consistencia CSV versus JSON

Resultado: **PASS**.

Todos os registros de `clauses.csv` possuem correspondente em `clauses.json` com os mesmos campos centrais: `clause_id`, `doc_id`, `title`, `text`/`texto_original`, `category`, `impact`, `lgpd_refs`, `source_package`, `source_excerpt_id`, `official_url` e `review_status`.

## Matriz por clausula

| clause_id | doc_id | source_package | URL dataset | URL metadata | idioma metadata | encontrado no source.txt indicado? | tipo de match | status | observacao objetiva |
|---|---|---|---|---|---|---|---|---|---|
| X_PRIVACY_C001 | X_PRIVACY | data/corpus/x-privacy | https://x.com/en/privacy | https://x.com/pt/privacy | pt-BR | Nao | derivado/adaptado de fonte relacionada em ingles | PARTIAL | O pacote principal e pt-BR. O texto em ingles corresponde ao related `english-privacy`, mas foi encurtado e teve exemplos/parenteses removidos. Requer rederivacao ou troca de source_package. |
| X_PRIVACY_C002 | X_PRIVACY | data/corpus/x-privacy | https://x.com/en/privacy | https://x.com/pt/privacy | pt-BR | Nao | derivado/adaptado de fonte relacionada em ingles | PARTIAL | O texto em ingles existe como inicio de paragrafo no related `english-privacy`, mas o dataset encerra a frase antes do paragrafo oficial. Requer rederivacao literal. |
| X_PRIVACY_C003 | X_PRIVACY | data/corpus/x-privacy | https://x.com/en/privacy | https://x.com/pt/privacy | pt-BR | Nao | literal em related source.txt | PARTIAL | Trecho literal em `data/corpus/x-privacy/related/english-privacy/source.txt`, nao no `source.txt` do pacote principal. Idioma e URL apontam para fonte relacionada. |
| X_PRIVACY_C004 | X_PRIVACY | data/corpus/x-privacy | https://x.com/en/privacy | https://x.com/pt/privacy | pt-BR | Nao | literal em related source.txt | PARTIAL | Trecho literal em `data/corpus/x-privacy/related/english-privacy/source.txt`, nao no `source.txt` do pacote principal. Idioma e URL apontam para fonte relacionada. |
| X_PRIVACY_C005 | X_PRIVACY | data/corpus/x-privacy | https://x.com/en/privacy | https://x.com/pt/privacy | pt-BR | Nao | composicao de trechos relacionados | PARTIAL | O dataset combina duas passagens separadas do related `english-privacy`. Nao e literal continuo no pacote principal. |
| META_PRIVACY_C001 | META_PRIVACY | data/corpus/meta-privacy | https://www.facebook.com/privacy/policy/ | https://www.facebook.com/privacy/policy/?locale=pt_BR | pt-BR | Sim | literal no source.txt correto | PASS_LITERAL | Texto aparece literalmente em `data/corpus/meta-privacy/source.txt`. Ajustar URL do dataset para a URL canonica com `?locale=pt_BR`. |
| META_PRIVACY_C002 | META_PRIVACY | data/corpus/meta-privacy | https://www.facebook.com/privacy/policy/ | https://www.facebook.com/privacy/policy/?locale=pt_BR | pt-BR | Sim | literal no source.txt correto | PASS_LITERAL | Texto aparece literalmente em `data/corpus/meta-privacy/source.txt`. Ajustar URL do dataset para a URL canonica com `?locale=pt_BR`. |
| META_PRIVACY_C003 | META_PRIVACY | data/corpus/meta-privacy | https://www.facebook.com/privacy/policy/ | https://www.facebook.com/privacy/policy/?locale=pt_BR | pt-BR | Sim | literal no source.txt correto | PASS_LITERAL | Texto aparece literalmente em `data/corpus/meta-privacy/source.txt`. Ajustar URL do dataset para a URL canonica com `?locale=pt_BR`. |
| INSTAGRAM_TERMS_C001 | INSTAGRAM_TERMS | data/corpus/instagram-terms | https://www.instagram.com/legal/terms/ | https://help.instagram.com/581066165581870/?locale=pt_BR | pt-BR | Nao | nao encontrado | FAIL | Dataset usa texto/URL em ingles, mas o pacote congelado principal e pt-BR e aponta para Help Instagram. Nao usar ate recapturar ou rederivar. |
| INSTAGRAM_TERMS_C002 | INSTAGRAM_TERMS | data/corpus/instagram-terms | https://www.instagram.com/legal/terms/ | https://help.instagram.com/581066165581870/?locale=pt_BR | pt-BR | Nao | nao encontrado | FAIL | Texto em ingles nao foi encontrado no pacote congelado. URL do dataset diverge da URL canonica do metadata. |
| INSTAGRAM_TERMS_C003 | INSTAGRAM_TERMS | data/corpus/instagram-terms | https://www.instagram.com/legal/terms/ | https://help.instagram.com/581066165581870/?locale=pt_BR | pt-BR | Nao | nao encontrado | FAIL | Texto em ingles nao foi encontrado no pacote congelado. URL do dataset diverge da URL canonica do metadata. |
| INSTAGRAM_TERMS_C004 | INSTAGRAM_TERMS | data/corpus/instagram-terms | https://www.instagram.com/legal/terms/ | https://help.instagram.com/581066165581870/?locale=pt_BR | pt-BR | Nao | nao encontrado | FAIL | Texto nao foi encontrado literalmente no pacote congelado. Requer rederivacao do `source.txt` validado. |
| LGPD_EXCERPTS_C001 | LGPD_EXCERPTS | data/corpus/lgpd-excerpts | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm | pt-BR | Nao | montagem de incisos/artigos | PARTIAL | Conteudo vem da LGPD, mas o texto e uma composicao de caput/incisos, nao trecho literal continuo. Ajustar URL para compilado e/ou rederivar excerto literal. |
| LGPD_EXCERPTS_C002 | LGPD_EXCERPTS | data/corpus/lgpd-excerpts | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm | pt-BR | Nao | montagem de incisos/artigos | PARTIAL | Conteudo plausivel, mas condensado. Nao e literal continuo do `source.txt`. |
| LGPD_EXCERPTS_C003 | LGPD_EXCERPTS | data/corpus/lgpd-excerpts | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm | pt-BR | Nao | montagem de artigos | PARTIAL | Combina Art. 15 e Art. 16 em formulacao resumida. Requer rederivacao literal se for usado como clausula. |
| LGPD_EXCERPTS_C004 | LGPD_EXCERPTS | data/corpus/lgpd-excerpts | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm | pt-BR | Nao | resumo de artigo | PARTIAL | Resume direitos do Art. 18, mas nao preserva a literalidade integral/listada do texto legal. |
| LGPD_EXCERPTS_C005 | LGPD_EXCERPTS | data/corpus/lgpd-excerpts | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm | pt-BR | Nao | excerto truncado | PARTIAL | Deriva do Art. 46, mas remove parte final do periodo oficial. Requer rederivacao literal. |
| LGPD_EXCERPTS_C006 | LGPD_EXCERPTS | data/corpus/lgpd-excerpts | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm | https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/L13709compilado.htm | pt-BR | Sim | literal no source.txt correto | PASS_LITERAL | Texto aparece literalmente no `source.txt`. Ajustar URL do dataset para a URL compilada do metadata. |

## Clausulas 100% seguras para Google Forms

Com criterio estrito de texto literal no `source.txt` correto:

- `META_PRIVACY_C001`
- `META_PRIVACY_C002`
- `META_PRIVACY_C003`
- `LGPD_EXCERPTS_C006`

Para o formulario do TCC, considerando o recorte Meta/X/Instagram, usar **Meta**. Se a banca exigir rastreabilidade perfeita tambem no campo URL, atualizar no instrumento a referencia canonica do metadata: `https://www.facebook.com/privacy/policy/?locale=pt_BR`.

## Clausulas que nao devem ser usadas ainda

- Todas as clausulas `INSTAGRAM_TERMS_C001` a `INSTAGRAM_TERMS_C004`: texto nao encontrado no pacote congelado indicado e URL/idioma divergentes.
- Todas as clausulas `X_PRIVACY_C001` a `X_PRIVACY_C005`, se a exigencia for source_package principal em pt-BR. Elas precisam ser reclassificadas para a fonte relacionada em ingles ou rederivadas do `source.txt` pt-BR.
- `LGPD_EXCERPTS_C001` a `LGPD_EXCERPTS_C005`, se forem usadas como texto literal. Elas sao juridicamente plausiveis, mas estao condensadas/montadas.

## Melhor clausula para validacao exploratoria

Recomendacao principal: **`META_PRIVACY_C001`**.

Texto:

> Nós, da Meta, queremos que você saiba quais informações coletamos e como as usamos e compartilhamos.

Justificativa:

- Real e presente no corpus oficial congelado.
- Em portugues, curta e adequada para Google Forms.
- Contem tres acoes compreensiveis e avaliaveis: coleta, uso e compartilhamento.
- Permite perguntas objetivas antes/depois da mediacao visual.
- Evita o problema de idioma/rastreabilidade observado nas clausulas do X e Instagram.

## Correcoes recomendadas

1. **Meta:** trocar `official_url` no dataset de `https://www.facebook.com/privacy/policy/` para `https://www.facebook.com/privacy/policy/?locale=pt_BR`, ou documentar que a URL sem query e alias canonico da mesma politica.
2. **X:** escolher uma das duas linhas metodologicas:
   - rederivar as clausulas a partir de `data/corpus/x-privacy/source.txt` em pt-BR e usar `https://x.com/pt/privacy`; ou
   - mover/registrar as clausulas em ingles como derivadas de `data/corpus/x-privacy/related/english-privacy` e preservar trechos literais, sem condensacao.
3. **Instagram:** rederivar do `source.txt` pt-BR do pacote `instagram-terms`, ou congelar localmente a fonte inglesa correspondente a `https://www.instagram.com/legal/terms/`.
4. **LGPD:** se a finalidade for literalidade, substituir os resumos por excertos contiguos do `source.txt`; se a finalidade for apoio conceitual, marcar como excertos manuais e nao como clausulas literais.

## Conclusao operacional

Para o formulario exploratorio atual, usar **`META_PRIVACY_C001`**. O dataset completo deve permanecer classificado como transicional ate a rederivacao clause-level ser feita diretamente dos `source.txt` validados.
