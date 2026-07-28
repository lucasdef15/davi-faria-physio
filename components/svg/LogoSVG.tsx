interface LogoSVGProps {
  className?: string;
  fill?: string;
  fontSize?: string;
  fontWeight?: string;
  name: string;
  surname: string;
}
const AVG_CHAR_WIDTH_RATIO = 0.62;

export default function LogoSVG({
  className,
  fill,
  fontSize,
  fontWeight,
  name,
  surname,
}: LogoSVGProps) {
  const nameFontSize = Number(fontSize ?? 28);
  const surnameFontSize = 10;

  const nameLetterSpacing = nameFontSize * 0.16;
  const surnameLetterSpacing = surnameFontSize * 0.3;

  const nameWidth = estimateTextWidth(name, nameFontSize, nameLetterSpacing);
  const surnameWidth = estimateTextWidth(surname, surnameFontSize, surnameLetterSpacing);

  const horizontalPadding = 20;
  const contentWidth = Math.max(nameWidth, surnameWidth + 16);
  const viewWidth = Math.max(160, contentWidth + horizontalPadding * 2);

  const centerX = viewWidth / 2;
  const padding = 8;

  const leftLineEnd = Math.max(horizontalPadding, centerX - surnameWidth / 2 - padding);
  const rightLineStart = Math.min(
    viewWidth - horizontalPadding,
    centerX + surnameWidth / 2 + padding,
  );

  return (
    <svg
      className={className}
      fill="none"
      viewBox={`0 0 ${viewWidth} 70`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        dominantBaseline="middle"
        fill={fill ?? 'currentColor'}
        fontFamily="var(--font-space-grotesk), sans-serif"
        fontSize={nameFontSize}
        fontWeight={fontWeight ?? 700}
        letterSpacing={nameLetterSpacing}
        textAnchor="middle"
        x={centerX}
        y="30"
      >
        {name}
      </text>

      <g opacity=".7" stroke={fill ?? 'currentColor'} strokeLinecap="round" strokeWidth="1">
        <line x1={horizontalPadding} x2={leftLineEnd} y1="52" y2="52" />

        <path
          d={`M ${rightLineStart} 52
              C ${rightLineStart + (viewWidth - horizontalPadding - rightLineStart) * 0.28} 52,
                ${rightLineStart + (viewWidth - horizontalPadding - rightLineStart) * 0.36} 48.5,
                ${rightLineStart + (viewWidth - horizontalPadding - rightLineStart) * 0.5} 52
              S ${rightLineStart + (viewWidth - horizontalPadding - rightLineStart) * 0.72} 55.5,
                ${viewWidth - horizontalPadding} 52`}
          fill="none"
        />
      </g>

      <text
        dominantBaseline="middle"
        fill={fill ?? 'currentColor'}
        fontFamily="var(--font-montserrat), sans-serif"
        fontSize={surnameFontSize}
        fontWeight={fontWeight ?? 500}
        letterSpacing={surnameLetterSpacing}
        textAnchor="middle"
        x={centerX}
        y="52"
      >
        {surname}
      </text>
    </svg>
  );
}

function estimateTextWidth(text: string, fontSize: number, letterSpacing: number): number {
  if (!text) return 0;
  const glyphsWidth = text.length * fontSize * AVG_CHAR_WIDTH_RATIO;
  const spacingWidth = Math.max(0, text.length - 1) * letterSpacing;
  return glyphsWidth + spacingWidth;
}
