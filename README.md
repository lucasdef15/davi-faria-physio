# Alkor Physio

Template premium de landing page para fisioterapia cardiorrespiratória, desenvolvido com Next.js,
React, TypeScript, Tailwind CSS e GSAP.

## Requisitos

- Node.js 24 (consulte `.nvmrc`)
- npm
- Um único ambiente por instalação. Em caminhos WSL, instale e execute Node dentro do WSL; não
  reutilize o mesmo `node_modules` entre Windows e Linux.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Acesse `http://localhost:3000`.

## Validação

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run check` executa typecheck, lint e testes em sequência. O mesmo fluxo é validado no CI.

## Configuração do template

Dados globais ficam em `lib/site.ts`. Antes de publicar para um cliente:

1. confirme nome, registro profissional e especializações;
2. substitua telefone, e-mail e localização;
3. valide claims clínicos, estatísticas e fontes;
4. use apenas depoimentos reais e autorizados;
5. configure `NEXT_PUBLIC_SITE_URL` com a URL canônica, quando não houver URL automática da Vercel;
6. valide todos os canais de contato em dispositivos reais.

Não publique os dados demonstrativos deste template como se fossem informações reais.

## Estrutura

- `app/`: rota, layout, metadata e arquivos técnicos de SEO;
- `components/layout/`: header, navegação e footer;
- `components/sections/`: seções organizadas por domínio;
- `hooks/`: animações e interações reutilizadas;
- `lib/site.ts`: configuração global do cliente;
- `tests/`: testes das regras de interação com maior risco de regressão.
