import RecoveryMonitor from './RecoveryMonitor';
import SymptomCard from './SymptomCard';
import { SYMPTOMS } from './symptoms';

export default function ForWhom() {
  return (
    <section
      aria-labelledby="for-whom-title"
      className="relative overflow-hidden bg-white"
      id="para-quem"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,.1),transparent_62%)]"
      />

      <div className="site-container section-space relative z-10">
        <header className="mx-auto max-w-3xl text-center">
          <span className="section-eyebrow">Para quem é o atendimento</span>
          <h2 className="section-title mx-auto mt-5" id="for-whom-title">
            O que você viveu ajuda a orientar{' '}
            <span className="bg-linear-to-r from-teal-700 via-teal-500 to-sky-500 bg-clip-text text-transparent">
              o próximo passo.
            </span>
          </h2>
          <p className="section-copy mx-auto mt-6">
            Internações, ventilação mecânica, AVC e condições respiratórias podem afetar o fôlego, a
            força e a autonomia. O acompanhamento organiza a recuperação de acordo com o momento de
            cada paciente.
          </p>
        </header>

        <div className="monitor-container mt-14 sm:mt-[4.5rem]">
          <RecoveryMonitor />
        </div>

        <div className="mx-auto mt-10 max-w-[80rem] sm:mt-14">
          <div className="grid items-stretch gap-4 min-[1180px]:grid-cols-3 min-[1180px]:gap-5 md:grid-cols-2">
            {SYMPTOMS.map((symptom, index) => (
              <SymptomCard
                index={index}
                key={symptom.id}
                symptom={symptom}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
