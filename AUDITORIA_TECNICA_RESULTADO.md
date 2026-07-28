# Auditoria técnica — Davi Faria Physio

**Data:** 28/07/2026  
**Escopo:** auditoria estática integral do repositório, build local e verificação de dependências.  
**Fora de escopo nesta etapa:** alterações de código, deploy, painel da Vercel, submissão IndexNow e auditoria comercial/visual.

## 1. Resumo executivo

O projeto tem uma base saudável para uma landing page institucional: usa App Router, TypeScript estrito,
componentes organizados por seção, rotas técnicas de SEO bem estruturadas e testes que cobrem os pontos
de resiliência mais sensíveis. `npm run typecheck`, `npm run lint`, `npm run test` e `npm run build`
concluíram com sucesso; os 13 testes passaram.

O veredito não é aprovação plena por dois motivos confirmados:

1. A dependência de produção `next@16.2.10` possui vulnerabilidades altas reportadas pelo `npm audit`.
2. A primeira dobra concentra canvas, GSAP e camadas de composição; isto é uma causa técnica plausível
   para a instabilidade relatada em Safari/iPhone e para uma carga inicial acima do desejável no padrão Alkor.

Não há evidência de Lenis, loops duplicados de ticker GSAP, segredos expostos, formulário próprio que
colete dados clínicos, falha de build, erro de tipagem ou links internos mortos no estado atual. A
auditoria também identificou dados de depoimentos fictícios mantidos no repositório, embora eles não
sejam renderizados pela página atual; isso é um risco ético de reativação acidental e deve ser removido
ou substituído somente por material autorizado.

### Limites da evidência

- O build local usa `.env.local`, portanto os artefatos locais apontam para `localhost`; isto é o
  comportamento esperado em desenvolvimento e não é evidência de canonical incorreta em Production.
- Não foi possível reproduzir em um iPhone físico nesta etapa. A causa exata da mensagem do WebKit exige
  console e perfil de performance no aparelho, mas a área de maior risco está isolada abaixo.
- Não houve verificação externa da situação cadastral profissional. A informação de CREFITO existe no
  código; sua veracidade deve continuar sendo responsabilidade de quem publica o site.

## 2. Pontos fortes

- **Arquitetura proporcional ao projeto.** `app/`, `components/`, `hooks/`, `lib/`, `scripts/` e
  `tests/` formam uma estrutura pequena, direta e adequada a manutenção por uma pessoa.
- **Server Components por padrão na composição da página.** `app/page.tsx` é servidor; os limites
  client-side aparecem junto a interação, animação ou APIs do navegador.
- **Tipagem e qualidade automatizada.** `tsconfig.json` usa `strict`, o lint está ativo e os comandos
  de validação são documentados no `README.md`.
- **Interações com cleanup.** `useBackgroundCanvas`, `useRevealAnimation`, `useHeroAnimation`, Header
  e menu mobile removem listeners, cancelam `requestAnimationFrame` e encerram timelines/observers.
- **Acessibilidade de movimento.** GSAP e CSS consideram `prefers-reduced-motion`; o canvas também
  interrompe animação nesse cenário.
- **Menu mobile bem cuidado.** `components/layout/MobileHeader.tsx` usa `aria-expanded`,
  `aria-controls`, Escape, devolução de foco e foco inicial no menu.
- **SEO técnico consistente.** `lib/site.ts` centraliza URL; `app/layout.tsx`, `robots.ts`,
  `sitemap.ts`, JSON-LD, llms e imagens sociais dependem dessa mesma origem. Preview é tratado como
  `noindex, nofollow`.
- **Rotas técnicas estáticas e cacheadas.** `entity.json`, `llms.txt`, `llms-full.txt`, sitemap,
  robots e imagens sociais são gerados pelo App Router; a rota IndexNow é dinâmica apenas quando
  necessário.
- **Privacidade por minimização.** Não há formulário próprio, analytics ou SDK de terceiros no código.
  Os contatos levam a Calendly, WhatsApp, telefone e e-mail.
- **Imagem principal correta.** `AboutImage.tsx` usa `next/image`, imagem estática, `sizes` e carregamento
  lazy padrão. A fonte PNG de 1,6 MB não é solicitada em tamanho integral pelo navegador.

## 3. Problemas encontrados

### AT-01 — Dependências de produção com vulnerabilidades altas

- **Categoria:** Segurança e dependências
- **Gravidade:** Alta
- **Arquivo ou rota:** `package.json`, `package-lock.json`
- **Evidência:** `npm audit --omit=dev --audit-level=high` reportou 3 vulnerabilidades altas para
  `next@16.2.10`, incluindo problemas de App Router/Server Actions, otimização de imagens e dependências
  transitivas `postcss` e `sharp`. A própria auditoria indica correção disponível com `next@16.2.12`.
- **Explicação:** Mesmo que este site não use Server Actions próprias, a versão do framework é parte da
  superfície pública do deployment e inclui componentes do runtime do Next.
- **Impacto:** risco de segurança e de indisponibilidade em produção; não é adequado ignorar alertas altos
  de uma dependência central.
- **Correção recomendada:** atualizar `next` e o lockfile para a versão corrigida indicada pelo audit,
  revisando as release notes e evitando `npm audit fix --force` como ação cega. Depois, repetir audit,
  testes, build e uma checagem de rotas/otimização de imagem.
- **Risco da correção:** Médio. Atualização patch costuma ser localizada, mas Next.js afeta build, imagem,
  metadata e runtime; precisa de validação em Preview antes de Production.
- **Forma de validar:** `npm audit --omit=dev --audit-level=high` sem vulnerabilidades altas; `npm run
  check`; `npm run build`; smoke test da página, imagens, sitemap e rotas de metadata.

### AT-02 — Primeira dobra concentra custo de renderização e é o principal risco de Safari/iPhone

- **Categoria:** Performance e estabilidade mobile
- **Gravidade:** Alta
- **Arquivo ou rota:** `hooks/useBackgroundCanvas.ts`, `components/sections/hero/HeroBackgroundCanvas.tsx`,
  `components/sections/hero/Hero.tsx`, `components/motion/useHeroAnimation.ts`, `app/page.tsx`
- **Evidência:**
  - `useBackgroundCanvas.ts` tem 1.093 linhas e, no primeiro viewport, cria canvas 2D, gradientes,
    partículas, curvas, observers, eventos de ponteiro e loop `requestAnimationFrame`.
  - O perfil mobile limita o canvas a 16 FPS e DPR 1,15, o que é uma proteção positiva, mas não elimina
    o custo da composição de canvas, gradientes e blur no carregamento.
  - A página inicial hidrata Header, hero, seção interativa respiratória, Sobre, Especialidades,
    Abordagem, Resultados, FAQ e Contato. A inspeção da produção observou 14 chunks JavaScript iniciais,
    somando aproximadamente 884 KB não comprimidos, além de HTML de aproximadamente 178 KB.
  - O projeto já possui relato de falha em iPhone 12 enquanto funciona em Android mais potente.
- **Explicação:** WebKit tende a ter menor margem para pressão simultânea de CPU, memória e GPU do que
  Chromium em aparelhos recentes. A combinação atual não prova isoladamente a causa do crash, mas é a
  hipótese técnica mais forte e está concentrada em uma área de código verificável.
- **Impacto:** página em branco, processo do navegador encerrado ou carregamento instável em aparelhos
  iOS/intermediários; também reduz LCP e responsividade percebida.
- **Correção recomendada:** criar um fallback estático real para o canvas em dispositivos móveis/de baixa
  capacidade e adiar a ativação da experiência não essencial até o navegador estar ocioso. Reduzir as
  áreas de `backdrop-filter`/blur simultâneas no mobile, sem mudar a hierarquia ou o conteúdo. A decisão
  deve ser orientada por perfil em iPhone real, não por user-agent apenas.
- **Risco da correção:** Médio. A direção visual do hero é sensível; validar desktop, Android, Safari iOS
  e reduced motion antes de aprovar.
- **Forma de validar:** Safari Web Inspector em iPhone 12, Performance/Memory, recarga fria e quente,
  uso prolongado, throttling e comparação de LCP/long tasks antes e depois. Confirmar que a versão sem
  canvas ainda mostra hero e CTA imediatamente.

### AT-03 — O conteúdo essencial do hero depende de duas animações de frame para aparecer

- **Categoria:** Resiliência e acessibilidade
- **Gravidade:** Alta
- **Arquivo ou rota:** `components/motion/useHeroAnimation.ts`
- **Evidência:** o hook aplica `autoAlpha: 0` ao fundo, canvas, eyebrow, cópia, linhas do título, CTAs e
  indicadores. A timeline só inicia após dois `window.requestAnimationFrame`. O cleanup é correto, mas
  o estado inicial é invisível.
- **Explicação:** se o JavaScript/GSAP estiver atrasado, o processo estiver sob pressão ou o frame não
  ocorrer, a primeira dobra perde conteúdo crítico. O tratamento de exceção posterior tenta limpar
  propriedades, mas não substitui uma estratégia de conteúdo visível por padrão.
- **Impacto:** piora de LCP, percepção de página vazia e risco de inacessibilidade no cenário que já foi
  relatado em iPhone.
- **Correção recomendada:** manter texto e CTA visíveis por padrão e aplicar estado inicial de animação
  somente após uma preparação que possa falhar sem ocultar o conteúdo; prever timeout/fallback que limpa
  propriedades caso a timeline não comece.
- **Risco da correção:** Médio. É necessário preservar a sequência visual no desktop e reduced motion.
- **Forma de validar:** desabilitar JS, simular CPU lenta, bloquear temporariamente GSAP e testar Safari
  iOS; título, texto e CTA devem permanecer acessíveis em todos os casos.

### AT-04 — Depoimentos fictícios permanecem no repositório, prontos para reativação

- **Categoria:** Conteúdo, ética e manutenção
- **Gravidade:** Média
- **Arquivo ou rota:** `components/sections/testimonials/testimonials.data.ts`,
  `components/sections/testimonials/Testimonials.tsx`, `app/page.tsx`
- **Evidência:** existem três depoimentos em primeira pessoa com iniciais e resultados apresentados como
  “Paciente acompanhado”. A importação/renderização está comentada em `app/page.tsx`, portanto eles não
  aparecem na página atual.
- **Explicação:** dados demonstrativos não podem permanecer indistintos de prova social real em um projeto
  de saúde. Um futuro reenable da seção publicaria afirmações clínicas sem autorização ou origem.
- **Impacto:** risco ético, reputacional e de conformidade; baixo impacto imediato porque a seção não está
  montada.
- **Correção recomendada:** remover a seção e os dados até existirem depoimentos reais autorizados, ou
  trocar por um placeholder editorial que não possa ser publicado por engano.
- **Risco da correção:** Baixo. A seção já está fora da experiência atual.
- **Forma de validar:** busca por `TESTIMONIALS`, “Paciente acompanhado” e frases dos depoimentos sem
  ocorrências publicáveis; confirmar que a página continua sem a seção.

### AT-05 — Contrato de versão do Node ficou inconsistente entre documentação e projeto

- **Categoria:** Build e manutenibilidade
- **Gravidade:** Média
- **Arquivo ou rota:** `package.json`, `.nvmrc`, `README.md`
- **Evidência:** `.nvmrc` e README indicam Node 24, mas a propriedade `engines` foi removida do
  `package.json` no worktree atual. O diff também contém whitespace pendente nesse arquivo.
- **Explicação:** `.nvmrc` orienta ambientes que o respeitam, mas `engines` protege CI, ferramentas e
  novos mantenedores contra uso acidental de runtime incompatível. A inconsistência não quebrou o build
  auditado, porém reduz previsibilidade de deploy e manutenção.
- **Impacto:** risco de diferenças de ambiente em futuras instalações/builds, especialmente fora de WSL.
- **Correção recomendada:** após confirmar a política de versão da equipe, restaurar um contrato explícito
  em `engines` compatível com Node 24 e alinhar o lockfile/documentação. Corrigir o whitespace no mesmo
  patch, sem mudanças funcionais paralelas.
- **Risco da correção:** Baixo.
- **Forma de validar:** instalação limpa com a versão declarada; `npm run check`; `npm run build`; painel
  Vercel configurado na mesma major version.

### AT-06 — Documento de arquitetura contém referência a diretório inexistente

- **Categoria:** Documentação e manutenção
- **Gravidade:** Baixa
- **Arquivo ou rota:** `README.md`
- **Evidência:** a seção de diretórios cita `components/providers/`, mas o diretório não existe no
  repositório inventariado.
- **Explicação:** não afeta runtime, porém gera ruído para manutenção solo e enfraquece o README como
  fonte de orientação.
- **Impacto:** baixo; pode induzir busca ou criação de estrutura inexistente.
- **Correção recomendada:** remover a referência ou criar documentação apenas quando o diretório passar
  a existir por necessidade concreta.
- **Risco da correção:** Muito baixo.
- **Forma de validar:** inventário do README corresponde a `rg --files`.

## 4. Melhorias por prioridade

### 1. Bloqueadores

Não há bloqueador de build ou falha funcional reproduzida localmente. Contudo, AT-01 deve ser tratado
antes da próxima publicação por ser um alerta alto confirmado de dependência.

### 2. Alta prioridade

1. **AT-01:** atualizar o Next.js para a correção de segurança e validar o runtime.
2. **AT-02:** reduzir e isolar o custo da experiência do hero no mobile, começando por fallback do canvas.
3. **AT-03:** assegurar conteúdo do hero visível mesmo se GSAP/frames atrasarem ou falharem.

### 3. Média prioridade

1. **AT-04:** remover ou blindar os depoimentos não autorizados antes que a seção seja reutilizada.
2. **AT-05:** restaurar o contrato de versão Node após confirmar que a remoção não foi intencional.

### 4. Baixa prioridade

1. **AT-06:** corrigir a documentação de diretórios.

### 5. Melhorias opcionais

- Medir bundle com analisador de produção e Core Web Vitals reais antes de decidir por code splitting
  adicional. Não é recomendável introduzir `dynamic()` por preferência sem a medição.
- Adicionar teste de navegador em WebKit no pipeline quando houver infraestrutura para isso. Hoje, os
  testes unitários cobrem estado e cleanup, mas não composição GPU/Canvas em Safari.
- Criar uma página `not-found.tsx` personalizada somente se houver necessidade de experiência de marca;
  o fallback atual do Next funciona e não há evidência de erro funcional.

## 5. Arquivos mais críticos

| Arquivo | Motivo |
| --- | --- |
| `hooks/useBackgroundCanvas.ts` | 1.093 linhas, canvas contínuo, eventos, qualidade adaptativa, observers e maior risco de estabilidade mobile. |
| `components/motion/useHeroAnimation.ts` | Controla a visibilidade de todo o conteúdo essencial da primeira dobra. |
| `components/layout/Header.tsx` | 503 linhas; combina navegação, scroll, GSAP, menu e estado de foco. Funciona, mas exige cuidado em qualquer alteração. |
| `components/sections/for-whom/ForWhom.tsx` e `BreathingIllustration.tsx` | Interação, scroll horizontal, SVG animado e filtros; relevantes para custo de composição. |
| `lib/site.ts` e `lib/seo.ts` | Fonte de verdade de URL, canonical, dados públicos e JSON-LD; alterações têm impacto transversal. |
| `package.json` e `package-lock.json` | Dependências e contrato de runtime; hoje concentram o risco de segurança confirmado. |

## 6. Plano de correção

1. Criar branch de correção e manter o worktree atual preservado, especialmente a alteração não
   relacionada em `package.json`.
2. Atualizar exclusivamente Next.js/lockfile para a versão corrigida indicada pela auditoria. Executar
   audit, check, build e smoke test das rotas técnicas.
3. Reproduzir o problema no iPhone 12 com Safari Web Inspector. Registrar iOS, navegador, mensagem,
   console, memória e momento da falha.
4. Implementar fallback visual estático para canvas/efeitos não essenciais em baixa capacidade e WebKit
   móvel, usando detecção de capacidade e `prefers-reduced-motion`, sem user-agent como condição única.
5. Tornar o hero resiliente: conteúdo e CTA devem permanecer visíveis se a animação não iniciar.
6. Validar desktop, Android, iPhone, reduced motion, JS lento e recarga fria; só então comparar LCP/INP
   antes/depois.
7. Remover ou substituir os dados de depoimentos apenas com autorização e conteúdo real.
8. Resolver o contrato Node e a documentação como patch de baixo risco separado.

## 7. Notas

| Área | Nota | Justificativa resumida |
| --- | ---: | --- |
| Arquitetura | 8,0 | Estrutura simples e coerente; alguns pontos críticos concentram muita responsabilidade. |
| Qualidade do código | 7,8 | Tipagem, lint e testes bons; canvas/header extensos e código morto de depoimentos reduzem a nota. |
| Next.js | 8,0 | App Router, metadata, fonts, imagens e rotas técnicas bem usados; atualização de segurança pendente. |
| TypeScript | 8,5 | `strict`, tipos locais claros e ausência de `any` identificado. |
| Performance | 6,5 | Proteções no canvas existem, mas primeira dobra/client hydration ainda são pesados para o cenário iPhone relatado. |
| Acessibilidade | 8,0 | Semântica, foco, touch targets e reduced motion são bons; precisa validar em WebKit real. |
| SEO técnico | 9,0 | Canonical, preview noindex, robots, sitemap, OG/Twitter, JSON-LD e rotas auxiliares estão consistentes. |
| Segurança | 6,5 | Segredos e inputs estão bem delimitados, mas há três vulnerabilidades altas de dependência. |
| Animações | 7,0 | Cleanup e reduced motion são bons; custo e visibilidade inicial do hero exigem correção. |
| Manutenibilidade | 7,5 | Boa estrutura para dev solo; arquivos muito extensos, README divergente e contrato Node incompleto. |

## 8. Veredito técnico

**Aprovado com ressalvas.**

O projeto é compilável, tipado, testado e bem encaminhado para o padrão técnico Alkor. SEO, rotas,
imagem, fontes, acessibilidade básica e manutenção geral mostram decisões conscientes. Entretanto,
as vulnerabilidades altas do framework e o risco concentrado de estabilidade/performance no primeiro
viewport — especialmente diante do relato em iPhone — precisam ser resolvidos e validados antes de
considerá-lo pronto para uma entrega premium sem ressalvas.

Não houve alteração de código nesta auditoria. Aguarda-se autorização explícita para implementar itens
específicos deste relatório.
