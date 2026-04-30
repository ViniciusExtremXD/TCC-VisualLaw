# Ajuste institucional de UI e validação exploratória

## Objetivo

Registrar o ajuste final de UX institucional do MVP Visual Law TCC, sem alteração do corpus, dataset, léxico, harness ou regras de processamento.

## Conteúdo institucional incluído

- Título do TCC: "Democratização do Acesso e Compreensão da Informação Jurídica no Brasil".
- Subtítulo: "A implementação do Visual Law em um estudo de caso sobre termos de serviço digitais de redes sociais".
- Nome da ferramenta: "Visual Law TCC".
- Descrição: protótipo acadêmico de leitura assistida para termos de uso e políticas de privacidade.
- Autor: Vinícius Magno Alves Pimentel.
- Orientador: Everton Knihs.
- Instituição: Faculdade de Computação e Informática (FCI), Universidade Presbiteriana Mackenzie, São Paulo, SP, Brasil.

Não há asset institucional da Mackenzie no repositório. Por isso, a interface usa uma área textual discreta com "Mackenzie" e "Universidade Presbiteriana Mackenzie", sem criar brasão ou puxar imagem externa.

## CTA do Formulário

A seção "Validação exploratória" foi integrada ao hero institucional, abaixo da descrição do protótipo, e também aparece de forma compacta ao final da leitura guiada.

O botão aponta para o Google Forms de validação exploratória e abre em nova aba.

## Configuração

O link do formulário fica em:

```ts
// src/config/validation.ts
export const VALIDATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfsWd-CDZaNxTxNX93jgIc_TEvPaS7TwglP2kU_g64u2aIBeQ/viewform?usp=publish-editor";
```

Se o link mudar, atualizar a constante com o novo link público do formulário. O componente abre a URL em nova aba com `target="_blank"` e `rel="noopener noreferrer"`.

Os dados institucionais ficam em:

```ts
// src/config/project.ts
export const PROJECT_INSTITUTIONAL_INFO = { ... };
```

## Validações Realizadas

- `npm run test`: 6 arquivos, 11 testes aprovados.
- `npm run build`: build/export concluído.
- `npx tsc --noEmit --pretty false --incremental false`: aprovado.
- `npm run test:e2e`: 3 testes aprovados na validação anterior de UI.

## Validação Visual

Executada com Playwright local em:

- Desktop: 1365 x 900.
- Mobile: 390 x 844.

Resultados:

- Cabeçalho institucional visível.
- CTA do formulário visível dentro do hero institucional.
- Botão do formulário ativo com link para Google Forms.
- Selo "MVP acadêmico client-side" removido.
- Sem overflow horizontal em desktop e mobile.
- Modal do gerenciador sem a cápsula "Repositorio oficial fechado".
- Marcas textuais dos grupos visíveis no gerenciador: X, Meta, IG e GOV.

Prints gerados:

- `artifacts/screenshots/UX_INSTITUTIONAL_HOME_DESKTOP.png`
- `artifacts/screenshots/UX_INSTITUTIONAL_HOME_MOBILE.png`
- `artifacts/screenshots/UX_DOCUMENT_MANAGER_DESKTOP.png`
- `artifacts/screenshots/UX_DOCUMENT_MANAGER_MOBILE.png`
