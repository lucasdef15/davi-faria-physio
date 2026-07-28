import About from '@/components/sections/about/About';
import ContactCTA from '@/components/sections/contact/ContactCTA';
import FAQ from '@/components/sections/faq/FAQ';
import ForWhom from '@/components/sections/for-whom/ForWhom';
import Hero from '@/components/sections/hero/Hero';
import HowItWorks from '@/components/sections/how-works/HowItWorks';
import Results from '@/components/sections/results/Results';
import Specialties from '@/components/sections/specialties/Specialties';
// import Testimonials from '@/components/sections/testimonials/Testimonials';

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <ForWhom />
      <About />
      <Specialties />
      <HowItWorks />
      <Results />
      {/* <Testimonials /> */}
      <FAQ />
      <ContactCTA />
    </div>
  );
}
