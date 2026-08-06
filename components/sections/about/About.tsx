import AboutContent from './AboutContent';

export default function About() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#edf8fa_0%,#f8fcfd_100%)]" id="sobre">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-500/15 to-transparent" />
      <div className="site-container section-space relative z-10">
        <AboutContent />
      </div>
    </section>
  );
}
