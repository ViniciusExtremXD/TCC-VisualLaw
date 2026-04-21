# Skill - Render Term Cards

## Objetivo

Renderizar cards explicativos que conectem termo, linguagem clara, LGPD, impacto e semiotica.

## Entradas

- `LexiconEntry`.
- Evidencia do highlight.
- Mapa de icones e categoria.

## Saidas

- Card clicavel no Reader ou card expandido no Report.
- Evidencia do termo exibida de forma auditavel.

## Passos

1. Carregar definicao, traducao direta e exemplo pratico do lexico.
2. Exibir contexto do termo detectado.
3. Mostrar categoria, impacto e referencias LGPD.
4. Mostrar regra semiotica de forma clara.
5. Manter linguagem clara sem prometer aconselhamento juridico.

## Criterios de qualidade

- O card explica o termo em linguagem acessivel.
- O usuario consegue voltar da explicacao para a clausula.
- A evidencia inclui offset, variante e campo do lexico.
- Visual Law reforca compreensao, nao decora a tela.

## Erros comuns

- Card com texto generico que nao vem do lexico.
- Icone sem justificativa metodologica.
- Esconder o trecho original detectado.

## O que NAO fazer

- Nao criar conversa livre.
- Nao responder perguntas juridicas fora do corpus.
- Nao inventar direitos ou recomendacoes.
