# Davi Faria Physio

Site institucional desenvolvido para Davi Faria, fisioterapeuta com atuação em fisioterapia
cardiorrespiratória, reabilitação funcional e acompanhamento pós-hospitalar em Mococa, SP.

O projeto apresenta os serviços, a abordagem clínica, as áreas de atuação e os canais de contato
do profissional, com foco em clareza, confiança, acessibilidade e boa experiência em dispositivos
móveis.

## Tecnologias

- Next.js
- React
- TypeScript
- Tailwind CSS
- GSAP

## Requisitos

- Node.js 24, conforme definido em `.nvmrc`
- npm

Em ambientes WSL, instale e execute o Node.js dentro do próprio WSL. Não reutilize o mesmo
diretório `node_modules` entre Windows e Linux.

## Desenvolvimento

Instale as dependências:

```bash
npm ci
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

## Scripts disponíveis

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run check
npm run indexnow
```

O comando abaixo executa a validação de tipos, o lint e os testes em sequência:

```bash
npm run check
```

`npm run indexnow` é manual e só aceita uma URL HTTPS canônica de Production com uma chave
`INDEXNOW_KEY` válida. Ele não deve ser executado em localhost ou Preview.

## Configuração do projeto

As informações públicas e a URL canônica do site ficam centralizadas em:

```text
lib/site.ts
```

Nesse arquivo são configurados dados como:

- nome do profissional;
- título profissional;
- descrição do site;
- telefone e WhatsApp;
- e-mail;
- localização;
- link de agendamento;
- URL oficial do projeto;

Os metadados, serviços e dados estruturados usados no SEO ficam em `lib/seo.ts`.

Antes de publicar uma nova versão, confira se todos os dados estão atualizados e correspondem às
informações reais do profissional.

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Para desenvolvimento local, mantenha:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Na Vercel Production, configure a URL HTTPS canônica do site. Os tokens de Google, Bing e IndexNow
só devem ser adicionados quando houver valores reais; `INDEXNOW_KEY` permanece privada e não deve
usar o prefixo `NEXT_PUBLIC_`.

## Estrutura principal

```text
app/
components/
hooks/
lib/
public/
scripts/
tests/
```

### Diretórios

- `app/`: rotas, layout, metadata, sitemap, robots e arquivos técnicos;
- `components/layout/`: header, navegação e footer;
- `components/sections/`: seções da página;
- `hooks/`: animações e interações reutilizáveis;
- `hooks/hero-canvas/`: renderer, perfis de qualidade e tipos do canvas do Hero;
- `lib/site.ts`: configuração central do projeto;
- `lib/seo.ts`: metadados e dados estruturados para SEO;
- `public/`: imagens e arquivos públicos;
- `scripts/`: scripts auxiliares de indexação e manutenção;
- `tests/`: testes automatizados.

## SEO e indexação

O projeto possui configuração para:

- metadata do Next.js;
- Open Graph;
- Twitter Cards;
- sitemap;
- robots.txt;
- dados estruturados em JSON-LD;
- indexação em mecanismos de busca;
- descoberta por mecanismos e agentes de IA.

Depois do deploy, valide:

```text
/robots.txt
/sitemap.xml
/opengraph-image
/llms.txt
/llms-full.txt
/entity.json
```

## Validação antes do deploy

Execute:

```bash
npm run check
npm run build
```

Também verifique manualmente:

- navegação em desktop e mobile;
- links de WhatsApp e agendamento;
- telefone e e-mail;
- imagens e textos;
- acessibilidade básica;
- metadata e compartilhamento;
- funcionamento do sitemap e do robots.txt.

## Deploy

O projeto está preparado para deploy na Vercel.

Após configurar o repositório, confirme as variáveis de ambiente e publique a aplicação utilizando
o ambiente de produção.

## Créditos

Projeto desenvolvido pela Alkor Labs para Davi Faria.
