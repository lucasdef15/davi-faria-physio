# Diretrizes para agentes de código

## Contexto

Este repositório contém o site institucional premium do fisioterapeuta Davi Faria. A experiência deve comunicar autoridade clínica, acolhimento, clareza e bom desempenho em aparelhos mais limitados.

## Stack

- Next.js 16
- React 19
- TypeScript estrito
- Tailwind CSS 4
- GSAP e `@gsap/react`
- Lucide React

## Regras de implementação

- Preserve a redação, a identidade visual e os comportamentos já aprovados.
- Não faça refatorações amplas sem uma razão objetiva.
- Use Tailwind para layout, espaçamento, tipografia, cores, bordas e responsividade simples.
- Mantenha no CSS global apenas sistemas visuais complexos, pseudo-elementos e estilos compartilhados que ficariam ilegíveis no JSX.
- Não introduza canvas ou loops permanentes sem necessidade comprovada.
- Toda animação deve respeitar `prefers-reduced-motion` e manter o conteúdo visível caso o JavaScript falhe.
- Prefira Server Components. Use Client Components somente onde há interação ou animação real.
- Centralize informações profissionais, contatos e URLs em `lib/site.ts`.
- Antes de entregar alterações, execute `npm run check` e `npm run build`.
- Não versione `.next`, `node_modules`, `.env.local`, caches, arquivos compactados ou relatórios temporários.

## Organização

Cada seção deve manter seus componentes, dados e hooks dentro da própria pasta. Lógicas grandes e específicas devem ser divididas em subpastas claras, como `components/sections/results/carousel`.
