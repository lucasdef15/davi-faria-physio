'use client';
import { gsap } from 'gsap';
import { type LenisRef, ReactLenis } from 'lenis/react';
import { type ReactNode, useEffect, useRef } from 'react';

interface SmoothScrollProviderProps {
  children: ReactNode;
}
export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<LenisRef>(null);
  useEffect(() => {
    const updateLenis = (time: number) => {
      /* * O ticker do GSAP trabalha em segundos. * O raf do Lenis recebe milissegundos. */ lenisRef.current?.lenis?.raf(
        time * 1000,
      );
    };
    gsap.ticker.add(updateLenis);
    /* * Evita que o GSAP tente compensar frames atrasados, * mantendo Lenis e animações visualmente sincronizados. */ gsap.ticker.lagSmoothing(
      0,
    );
    return () => {
      gsap.ticker.remove(updateLenis);
    };
  }, []);
  return (
    <ReactLenis
      options={{
        autoRaf: false,
        /* * Elegante, mas ainda responsivo. * Não deixa a página continuar andando demais. */ duration: 0.95,
        smoothWheel: true,
        /* * Interrompe a inércia anterior durante * navegações programáticas. */ stopInertiaOnNavigate: true,
        /* * Mantém o gesto mobile próximo do comportamento nativo. */ touchMultiplier: 1,
        /* * Suaviza levemente mouse e trackpad * sem dar sensação de lentidão. */ wheelMultiplier: 0.9,
      }}
      ref={lenisRef}
      root
    >
      {' '}
      {children}{' '}
    </ReactLenis>
  );
}
