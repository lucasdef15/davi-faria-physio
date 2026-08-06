import About from '@/components/sections/about/About';
import ContactCTA from '@/components/sections/contact/ContactCTA';
import FAQ from '@/components/sections/faq/FAQ';
import ForWhom from '@/components/sections/for-whom/ForWhom';
import Hero from '@/components/sections/hero/Hero';
import HowItWorks from '@/components/sections/how-works/HowItWorks';
import Results from '@/components/sections/results/Results';

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <ForWhom />
      <About />
      <HowItWorks />
      <Results />
      <FAQ />
      <ContactCTA />
    </div>
  );
}
