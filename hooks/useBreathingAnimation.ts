'use client';

import type { RefObject } from 'react';

import { useEffect, useRef } from 'react';

import { BreathingProfile, RGB } from '@/components/sections/for-whom/symptoms';
import { getIosDiagnosticOptions } from '@/lib/ios-diagnostics';
import { getMediaQuery, subscribeToMediaQuery } from '@/lib/media-query';

interface AnimatedState {
  breathDepth: number;
  breathRate: number;
  catch: number;
  compression: number;
  flow: number;
  glow: number;
  glowSwell: number;
  particle: number;
  particleSpeed: number;
  phase: number;
  primary: [number, number, number];
  secondary: [number, number, number];
  sway: number;
  tilt: number;
  waveAmp: number;
}

export function useBreathingAnimation(
  targetRef: RefObject<HTMLElement | null>,
  profile: BreathingProfile,
): void {
  const profileRef = useRef(profile);

  useEffect(() => {
    profileRef.current = profile;

    const el = targetRef.current;
    if (
      el &&
      typeof window !== 'undefined' &&
      getMediaQuery('(prefers-reduced-motion: reduce)').matches
    ) {
      applyStaticProfile(el, profile);
    }
  }, [profile, targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const mediaQuery = getMediaQuery('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery?.matches ?? false;
    const diagnostics = getIosDiagnosticOptions();

    if (
      prefersReducedMotion ||
      diagnostics.disableAllMotion ||
      diagnostics.disableBelowFoldRuntime ||
      diagnostics.disableBreathing ||
      typeof IntersectionObserver !== 'function' ||
      typeof requestAnimationFrame !== 'function' ||
      typeof cancelAnimationFrame !== 'function'
    ) {
      setBreathingMotionState(el, false);
      applyStaticProfile(el, profileRef.current);
      return;
    }

    const initial = profileRef.current;
    const state: AnimatedState = {
      breathDepth: initial.breathDepth,
      breathRate: initial.breathRate,
      catch: initial.catch,
      compression: initial.compression,
      flow: initial.flow,
      glow: initial.glow,
      glowSwell: initial.glowSwell,
      particle: initial.particle,
      particleSpeed: initial.particleSpeed,
      phase: 0,
      primary: [...initial.primary] as [number, number, number],
      secondary: [...initial.secondary] as [number, number, number],
      sway: initial.sway,
      tilt: initial.tilt,
      waveAmp: initial.waveAmp,
    };

    let raf = 0;
    let isIntersecting = false;
    let isRunning = false;
    let last = getNow();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const target = profileRef.current;
      const ease = 1 - Math.exp(-1.85 * dt);
      const easeColor = 1 - Math.exp(-1.65 * dt);

      state.breathDepth = lerp(state.breathDepth, target.breathDepth, ease);
      state.breathRate = lerp(state.breathRate, target.breathRate, ease);
      state.catch = lerp(state.catch, target.catch, ease);
      state.compression = lerp(state.compression, target.compression, ease);
      state.flow = lerp(state.flow, target.flow, ease);
      state.glow = lerp(state.glow, target.glow, ease);
      state.glowSwell = lerp(state.glowSwell, target.glowSwell, ease);
      state.particle = lerp(state.particle, target.particle, ease);
      state.particleSpeed = lerp(state.particleSpeed, target.particleSpeed, ease);
      state.sway = lerp(state.sway, target.sway, ease);
      state.tilt = lerp(state.tilt, target.tilt, ease);
      state.waveAmp = lerp(state.waveAmp, target.waveAmp, ease);
      state.primary = lerpRGB(state.primary, target.primary, easeColor);
      state.secondary = lerpRGB(state.secondary, target.secondary, easeColor);

      let breath = 0.5;
      let coughPulse = 0;
      let sway = 0;
      let swell = 0;

      state.phase += (dt * (Math.PI * 2)) / Math.max(0.6, state.breathRate);
      breath = smootherstep((Math.sin(state.phase - Math.PI / 2) + 1) / 2);
      coughPulse = state.catch * Math.pow(Math.max(0, Math.sin(state.phase * 2.15)), 14);
      sway = Math.sin(state.phase) * state.sway;
      swell = state.glowSwell * ((Math.sin(state.phase * 0.4) + 1) / 2) * 0.24;

      const lungScale = 1 + breath * state.breathDepth - coughPulse * 0.07;
      const glow = Math.min(1, state.glow * (0.7 + 0.3 * breath) + swell + coughPulse * 0.22);
      const waveAmp = state.waveAmp * (0.85 + 0.25 * breath);
      const rippleDur = clamp(state.breathRate * 1.25, 2.2, 9);
      const particleDur = clamp(6.5 / Math.max(0.35, state.particleSpeed), 3, 14);

      const [r1, g1, b1] = state.primary;
      const [r2, g2, b2] = state.secondary;

      const s = el.style;
      s.setProperty('--breath', breath.toFixed(4));
      s.setProperty('--lung-scale', lungScale.toFixed(4));
      s.setProperty('--glow', glow.toFixed(4));
      s.setProperty('--wave-amp', waveAmp.toFixed(4));
      s.setProperty('--ripple-dur', `${rippleDur.toFixed(2)}s`);
      s.setProperty('--particle', state.particle.toFixed(4));
      s.setProperty('--particle-dur', `${particleDur.toFixed(2)}s`);
      s.setProperty('--tilt', `${(state.tilt + sway).toFixed(3)}deg`);
      s.setProperty('--cough', coughPulse.toFixed(4));
      s.setProperty('--compression', state.compression.toFixed(4));
      s.setProperty('--flow', state.flow.toFixed(4));
      s.setProperty('--c1r', Math.round(r1).toString());
      s.setProperty('--c1g', Math.round(g1).toString());
      s.setProperty('--c1b', Math.round(b1).toString());
      s.setProperty('--c2r', Math.round(r2).toString());
      s.setProperty('--c2g', Math.round(g2).toString());
      s.setProperty('--c2b', Math.round(b2).toString());

      if (isRunning) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (isRunning) return;
      isRunning = true;
      last = getNow();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!isRunning && raf === 0) return;
      isRunning = false;
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const syncAnimationState = () => {
      const shouldRun = isIntersecting && !document.hidden && !(mediaQuery.matches ?? false);

      setBreathingMotionState(el, shouldRun);

      if (shouldRun) start();
      else stop();
    };

    let observer: IntersectionObserver | null = null;

    try {
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncAnimationState();
      });
      observer.observe(el);
    } catch (error) {
      setBreathingMotionState(el, false);
      applyStaticProfile(el, profileRef.current);

      if (process.env.NODE_ENV !== 'production') {
        console.error('Breathing animation was disabled after an observer error.', error);
      }

      return;
    }

    const handleVisibilityChange = () => syncAnimationState();
    const handleReducedMotionChange = () => {
      if (mediaQuery.matches) applyStaticProfile(el, profileRef.current);
      syncAnimationState();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const unsubscribeMediaQuery = subscribeToMediaQuery(mediaQuery, handleReducedMotionChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      unsubscribeMediaQuery();
      observer?.disconnect();
      stop();
      setBreathingMotionState(el, false);
    };
  }, [targetRef]);
}

function applyStaticProfile(el: HTMLElement, profile: BreathingProfile): void {
  const breath = 0.5;
  const lungScale = 1 + breath * profile.breathDepth;
  const glow = Math.min(1, profile.glow * 0.85 + profile.glowSwell * 0.12);
  const rippleDur = clamp(profile.breathRate * 1.25, 2.2, 9);
  const particleDur = clamp(6.5 / Math.max(0.35, profile.particleSpeed), 3, 14);
  const [r1, g1, b1] = profile.primary;
  const [r2, g2, b2] = profile.secondary;
  const style = el.style;

  style.setProperty('--breath', breath.toString());
  style.setProperty('--lung-scale', lungScale.toFixed(4));
  style.setProperty('--glow', glow.toFixed(4));
  style.setProperty('--wave-amp', profile.waveAmp.toFixed(4));
  style.setProperty('--ripple-dur', `${rippleDur.toFixed(2)}s`);
  style.setProperty('--particle', profile.particle.toFixed(4));
  style.setProperty('--particle-dur', `${particleDur.toFixed(2)}s`);
  style.setProperty('--tilt', `${profile.tilt.toFixed(3)}deg`);
  style.setProperty('--cough', '0');
  style.setProperty('--compression', profile.compression.toFixed(4));
  style.setProperty('--flow', profile.flow.toFixed(4));
  style.setProperty('--c1r', r1.toString());
  style.setProperty('--c1g', g1.toString());
  style.setProperty('--c1b', b1.toString());
  style.setProperty('--c2r', r2.toString());
  style.setProperty('--c2g', g2.toString());
  style.setProperty('--c2b', b2.toString());
}

function clamp(x: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}

function getNow(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRGB(a: [number, number, number], b: RGB, t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function setBreathingMotionState(el: HTMLElement, isVisible: boolean): void {
  el.dataset.breathingVisible = isVisible ? 'true' : 'false';
}

function smootherstep(x: number): number {
  const c = Math.min(1, Math.max(0, x));
  return c * c * c * (c * (c * 6 - 15) + 10);
}
