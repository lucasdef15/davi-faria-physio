import Link from 'next/link';

import { PHYSIOTHERAPIST } from './about.data';

const CARE_HIGHLIGHTS = [
  ['Experiência hospitalar', 'Atuação em UTI e contato direto com pacientes em momentos clínicos delicados.'],
  ['Cuidado pós-alta', 'Continuidade da recuperação respiratória e funcional depois da internação.'],
  ['Atendimento domiciliar', 'Acompanhamento adaptado à realidade, à rotina e aos objetivos do paciente.'],
] as const;

export default function AboutContent() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.03fr)_minmax(22rem,.97fr)] lg:items-start lg:gap-16 xl:gap-24">
      <div>
        <span className="section-eyebrow">Sobre o fisioterapeuta</span>
        <h2 className="section-title mt-6 max-w-3xl" id="specialist-title">
          Experiência clínica para acompanhar o paciente{' '}
          <span className="bg-linear-to-r from-teal-700 via-teal-500 to-sky-500 bg-clip-text text-transparent">
            além da alta.
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 font-medium text-teal-800">
          {PHYSIOTHERAPIST.title}
        </p>

        <blockquote className="mt-8 border-l-2 border-teal-400 pl-5 text-base leading-8 text-slate-600 sm:pl-7 sm:text-lg">
          “{PHYSIOTHERAPIST.manifesto}”
        </blockquote>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            className="group inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_34px_-18px_rgba(15,23,42,0.72)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-[0_20px_38px_-18px_rgba(15,118,110,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600 sm:w-auto sm:whitespace-nowrap"
            href="#contato"
          >
            Conversar com o fisioterapeuta
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <p className="max-w-md text-sm leading-6 text-slate-500">
            Avaliação individual para compreender o quadro, as limitações atuais e os objetivos da recuperação.
          </p>
        </div>
      </div>

      <aside className="overflow-hidden rounded-[1.65rem] border border-slate-900/8 bg-white shadow-[0_26px_70px_-42px_rgba(15,23,42,.32)]">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <span className="text-[0.62rem] font-semibold tracking-[0.17em] text-teal-700 uppercase">Perfil profissional</span>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-space-grotesk text-2xl font-semibold tracking-[-0.035em] text-slate-950">{PHYSIOTHERAPIST.name}</h3>
              <p className="mt-1 text-sm text-slate-500">CREFITO-3/442680-F</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
              Ativo
            </span>
          </div>
        </div>

        <ul className="divide-y divide-slate-100">
          {CARE_HIGHLIGHTS.map(([title, description], index) => (
            <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 px-5 py-5 sm:px-7" key={title}>
              <span className="font-mono pt-0.5 text-[0.6rem] font-semibold tracking-[0.14em] text-slate-300">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <strong className="font-space-grotesk block text-base font-semibold text-slate-900">{title}</strong>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-7">
          <p className="text-xs leading-5 text-slate-500">
            Atendimento domiciliar em Mococa, com disponibilidade para localidades próximas sob consulta.
          </p>
        </div>
      </aside>
    </div>
  );
}
