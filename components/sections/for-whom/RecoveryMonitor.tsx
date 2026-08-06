'use client';

import { useRef } from 'react';

import NeonLungs from './NeonLungs';
import { useRespiratoryMonitorAnimation } from './useRespiratoryMonitorAnimation';
import WaveformDisplay from './WaveformDisplay';

const RECOVERY_STAGES = [
  {
    description: 'Entender os efeitos da internação, da imobilidade e da ventilação mecânica.',
    number: '01',
    title: 'Assistência',
  },
  {
    description: 'Reconstruir respiração, mobilidade e tolerância ao esforço de forma progressiva.',
    number: '02',
    title: 'Transição',
  },
  {
    description: 'Recuperar segurança e independência para retornar à rotina.',
    number: '03',
    title: 'Retomada',
  },
] as const;

export default function RecoveryMonitor() {
  const monitorRef = useRef<HTMLDivElement>(null);

  useRespiratoryMonitorAnimation(monitorRef);

  return (
    <div className="monitor-shell" data-recovery-monitor ref={monitorRef}>
      <div aria-hidden="true" className="monitor-grid" data-monitor-grid />
      <div aria-hidden="true" className="monitor-scanlines" data-monitor-scanlines />

      <div className="monitor-topbar" data-monitor-topbar>
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="monitor-status-light" data-monitor-status />
          <div className="min-w-0">
            <span className="block text-[0.58rem] font-semibold tracking-[0.2em] text-slate-200 uppercase sm:hidden">Painel respiratório</span>
            <span className="hidden text-[0.62rem] font-semibold tracking-[0.2em] text-slate-200 uppercase sm:block">
              Painel de retomada respiratória
            </span>
            <span className="monitor-topbar-subtitle mt-1 hidden uppercase sm:block">
              Leitura funcional do percurso pós-hospitalar
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="monitor-system-label hidden items-center gap-2 uppercase md:flex">
            <span className="size-1 rounded-full bg-sky-400" />
            Sistema ilustrativo
          </span>
          <span className="monitor-code">DF-01</span>
        </div>
      </div>

      <div className="monitor-layout">
        <section aria-label="Representação respiratória" className="monitor-lung-module" data-monitor-module>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="monitor-kicker">Núcleo respiratório</span>
              <h3 className="font-space-grotesk mt-2 text-lg font-semibold tracking-[-0.025em] text-white">Mapa broncopulmonar</h3>
            </div>
            <span className="monitor-index">A1</span>
          </div>

          <div className="monitor-lung-stage" data-lung-stage>
            <div aria-hidden="true" className="monitor-lung-halo" />
            <div aria-hidden="true" className="monitor-axis monitor-axis-horizontal" />
            <div aria-hidden="true" className="monitor-axis monitor-axis-vertical" />
            <NeonLungs className="relative z-10 h-full w-full" />
            <span className="monitor-coordinate monitor-coordinate-top">RESP</span>
            <span className="monitor-coordinate monitor-coordinate-bottom">POST · ICU</span>
          </div>

          <div className="monitor-lung-footer">
            <div>
              <span>Leitura</span>
              <strong>Integrada</strong>
            </div>
            <div>
              <span>Contexto</span>
              <strong>Pós-alta</strong>
            </div>
            <div>
              <span>Objetivo</span>
              <strong>Autonomia</strong>
            </div>
          </div>
        </section>

        <section aria-label="Curvas respiratórias ilustrativas" className="monitor-wave-module" data-monitor-module>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] px-5 py-5 sm:px-6">
            <div>
              <span className="monitor-kicker">Curvas de recuperação</span>
              <h3 className="font-space-grotesk mt-2 text-lg font-semibold tracking-[-0.025em] text-white">Resposta respiratória e funcional</h3>
            </div>
            <div className="monitor-wave-meta flex items-center gap-4 uppercase">
              <span>00:12</span>
              <span className="flex items-center gap-1.5 text-teal-300">
                <span className="size-1.5 rounded-full bg-teal-300" />
                Ciclo ativo
              </span>
            </div>
          </div>

          <WaveformDisplay />

          <div className="monitor-timeline" aria-hidden="true">
            <span data-timeline-stage>Assistência</span>
            <span data-timeline-stage>Transição</span>
            <span data-timeline-stage>Retomada</span>
          </div>
        </section>

        <aside className="monitor-recovery-module" data-monitor-module>
          <div className="monitor-recovery-intro" data-recovery-intro>
            <span className="monitor-kicker text-teal-300">Da assistência à autonomia</span>
            <h3 className="font-space-grotesk mt-3 text-[1.4rem] leading-[1.12] font-semibold tracking-[-0.035em] text-white sm:text-[1.55rem]">
              <span className="block">A recuperação</span>
              <span className="block">acontece em camadas.</span>
            </h3>
            <p className="monitor-recovery-copy mt-4 text-xs leading-5">
              O painel traduz, de forma conceitual, o caminho entre o suporte recebido e a retomada da vida cotidiana.
            </p>
          </div>

          <ol className="monitor-recovery-steps">
            {RECOVERY_STAGES.map((stage, index) => (
              <li className="monitor-recovery-step" data-recovery-step key={stage.title}>
                <div className="monitor-step-rail" aria-hidden="true">
                  <span className={index === 0 ? 'monitor-step-dot monitor-step-dot-active' : 'monitor-step-dot'} />
                  {index < RECOVERY_STAGES.length - 1 ? <span className="monitor-step-line" /> : null}
                </div>
                <div className="monitor-step-content min-w-0">
                  <span className="monitor-step-number font-mono">{stage.number}</span>
                  <strong className="monitor-step-title font-space-grotesk">{stage.title}</strong>
                  <p className="monitor-step-copy">{stage.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="monitor-note" data-monitor-note>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-sky-400" />
            Representação conceitual — não exibe dados clínicos reais.
          </div>
        </aside>
      </div>
    </div>
  );
}
