import HeroActions from './HeroActions';
import HeroBackgroundCanvas from './HeroBackgroundCanvas';
import HeroContent from './HeroContent';
import HeroMotion from './HeroMotion';
import Indicators from './Indicators';
import ScrollBadge from './ScrollBadge';

export default function Hero() {
  return (
    <HeroMotion>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_20%,rgba(103,232,249,.2),transparent_39%),radial-gradient(ellipse_at_92%_58%,rgba(45,212,191,.15),transparent_38%),radial-gradient(ellipse_at_44%_78%,rgba(153,246,228,.08),transparent_44%)]"
        data-hero-ambient
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-18%] top-[16%] h-[58%] rotate-[-5deg] bg-[linear-gradient(105deg,transparent_20%,rgba(255,255,255,.32)_48%,transparent_76%)] opacity-45 blur-3xl sm:inset-x-[-8%] sm:top-[12%] sm:h-[52%]"
      />

      <HeroBackgroundCanvas />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-32 pb-40 text-center sm:px-8 md:pt-36 md:pb-36">
        <HeroContent />
        <HeroActions />
        <Indicators />
        <ScrollBadge />
      </div>
    </HeroMotion>
  );
}
