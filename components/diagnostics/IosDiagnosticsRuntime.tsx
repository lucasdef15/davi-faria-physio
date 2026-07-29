'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import {
  getIosDiagnosticOptions,
  type IosDiagnosticOptions,
  markIosDiagnosticStage,
} from '@/lib/ios-diagnostics';

const IosDiagnosticsPanel = dynamic(() => import('./IosDiagnosticsPanel'), {
  loading: () => null,
  ssr: false,
});

export default function IosDiagnosticsRuntime() {
  const [options, setOptions] = useState<IosDiagnosticOptions | null>(null);

  useEffect(() => {
    const nextOptions = getIosDiagnosticOptions();

    if (!nextOptions.enabled) {
      return;
    }

    const root = document.documentElement;
    root.dataset.iosDiagnostic = 'true';
    root.dataset.iosDiagnosticBelowFold = nextOptions.disableBelowFoldRuntime ? 'off' : 'on';
    root.dataset.iosDiagnosticBreathing = nextOptions.disableBreathing ? 'off' : 'on';
    root.dataset.iosDiagnosticFilters = nextOptions.disableFilters ? 'off' : 'on';
    root.dataset.iosDiagnosticMotion = nextOptions.disableAllMotion ? 'off' : 'on';
    markIosDiagnosticStage('HTML carregado');
    markIosDiagnosticStage('JavaScript iniciado');
    const panelTimer = window.setTimeout(() => setOptions(nextOptions), 0);

    return () => {
      window.clearTimeout(panelTimer);
      delete root.dataset.iosDiagnostic;
      delete root.dataset.iosDiagnosticBelowFold;
      delete root.dataset.iosDiagnosticBreathing;
      delete root.dataset.iosDiagnosticFilters;
      delete root.dataset.iosDiagnosticMotion;
    };
  }, []);

  return options ? <IosDiagnosticsPanel options={options} /> : null;
}
