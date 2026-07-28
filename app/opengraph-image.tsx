import { ImageResponse } from 'next/og';

import { SITE_CONFIG } from '@/lib/site';

export const alt =
  'Davi Faria — Fisioterapia cardiorrespiratória e reabilitação funcional em Mococa';
export const contentType = 'image/png';
export const size = { height: 630, width: 1200 };

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'center',
        background:
          'radial-gradient(circle at 50% 4%, rgba(45, 212, 191, 0.18), transparent 36%), linear-gradient(135deg, #f8fcfd 0%, #eefbfc 52%, #dcf7f4 100%)',
        color: '#0f172a',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        padding: '68px 76px',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1020px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            border: '1px solid rgba(13, 148, 136, 0.2)',
            borderRadius: 999,
            color: '#0f766e',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 3.5,
            padding: '11px 20px',
          }}
        >
          {SITE_CONFIG.name.toUpperCase()}
        </span>

        <h1
          style={{
            fontSize: 66,
            fontWeight: 600,
            letterSpacing: -3.4,
            lineHeight: 1.03,
            margin: '34px 0 24px',
            maxWidth: '960px',
          }}
        >
          Da alta hospitalar à retomada da rotina, seu cuidado continua.
        </h1>

        <p
          style={{
            color: '#475569',
            fontSize: 25,
            lineHeight: 1.42,
            margin: 0,
            maxWidth: '900px',
          }}
        >
          Fisioterapia cardiorrespiratória e reabilitação funcional em Mococa, com atendimento
          próximo no pós-hospitalar e em domicílio.
        </p>
      </div>
    </div>,
    size,
  );
}
