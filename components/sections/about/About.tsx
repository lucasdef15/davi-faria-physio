'use client';

import AboutContent from './AboutContent';

export default function About() {
  return (
    <section
      className="relative overflow-hidden bg-linear-to-b from-[#EDF8FA] via-[#F4FAFB] to-[#F8FCFD]"
      id="sobre"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[8%] right-[-12%] h-120 w-120 rounded-full bg-teal-300/12 blur-[170px]" />
        <div className="absolute bottom-[-10%] left-[-12%] h-120 w-120 rounded-full bg-sky-300/12 blur-[170px]" />
      </div>

      <div className="site-container section-space relative z-10">
        <AboutContent />
      </div>
    </section>
  );
}
