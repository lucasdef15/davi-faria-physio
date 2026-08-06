# Davi Faria Physio

Site institucional do fisioterapeuta Davi Faria, com foco em fisioterapia cardiorrespiratória, reabilitação funcional, cuidado pós-hospitalar e atendimento domiciliar em Mococa e região.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- GSAP e `@gsap/react`
- Lucide React

## Requisitos

- Node.js 22 ou superior
- npm

A versão recomendada está definida em `.nvmrc`.

## Desenvolvimento local

```bash
npm ci
cp .env.example .env.local
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Validação

```bash
npm run typecheck
npm run lint
npm run check
npm run build
```

O comando `npm run check` executa TypeScript e ESLint. O build de produção também deve passar antes de qualquer deploy.

## Variáveis de ambiente

Use `.env.example` como referência. As principais variáveis são:

- `NEXT_PUBLIC_SITE_URL`: URL canônica pública do site.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: token opcional do Google Search Console.
- `NEXT_PUBLIC_BING_SITE_VERIFICATION`: token opcional do Bing Webmaster Tools.
- `NEXT_PUBLIC_CONTENT_LAST_MODIFIED`: data pública da última atualização no formato `YYYY-MM-DD`.
- `INDEXNOW_KEY`: chave privada opcional para submissão ao IndexNow.

Nunca versione `.env.local`.

## Estrutura principal

```text
app/
  layout.tsx              Metadados, fontes, header e footer
  page.tsx                Ordem das seções da página
  globals.css             Tokens globais e sistemas visuais complexos

components/
  layout/                  Header, footer e navegação
  sections/
    hero/                  Apresentação principal e entrada GSAP
    for-whom/              Painel respiratório e situações acompanhadas
    about/                 Perfil profissional
    how-works/             Abordagem clínica
    results/               Jornada de evolução funcional
      carousel/            Mecânica e componentes do carrossel responsivo
    faq/                   Perguntas frequentes
    contact/               Chamada final para contato
  svg/                     Marca em SVG

lib/
  site.ts                  Dados centrais do profissional e contatos
  seo.ts                   Metadados estruturados e conteúdo de SEO

scripts/
  submit-indexnow.mjs      Submissão opcional ao IndexNow
```

## Convenções do projeto

- Componentes e ajustes simples usam Tailwind diretamente no JSX.
- Sistemas visuais maiores, pseudo-elementos e composições complexas podem permanecer em `app/globals.css`.
- Animações devem ter fallback visível sem JavaScript e respeitar `prefers-reduced-motion`.
- Evite canvas, loops contínuos desnecessários e efeitos caros em dispositivos móveis.
- Dados profissionais e URLs devem ser centralizados em `lib/site.ts`.
- Arquivos de build, caches, relatórios temporários e versões antigas não devem ser versionados.

## Deploy

O projeto está preparado para Vercel. Em produção, configure `NEXT_PUBLIC_SITE_URL` com a URL HTTPS canônica e execute o build antes do deploy.
