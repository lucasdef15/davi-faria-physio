interface NeonLungsProps {
  className?: string;
}

const BRONCHIAL_PATHS = [
  'M180 58V126',
  'M180 121C165 130 151 142 139 157',
  'M180 121C195 130 209 142 221 157',
  'M139 157C125 167 114 181 106 198',
  'M139 157C145 175 148 192 148 211',
  'M221 157C235 167 246 181 254 198',
  'M221 157C215 175 212 192 212 211',
  'M106 198C95 211 88 227 85 244',
  'M106 198C117 208 124 220 128 235',
  'M148 211C139 226 136 242 137 259',
  'M148 211C158 222 163 236 164 251',
  'M254 198C265 211 272 227 275 244',
  'M254 198C243 208 236 220 232 235',
  'M212 211C221 226 224 242 223 259',
  'M212 211C202 222 197 236 196 251',
  'M85 244C80 254 77 264 77 274',
  'M128 235C121 248 119 261 121 274',
  'M137 259C134 270 134 281 136 289',
  'M164 251C161 265 162 278 166 289',
  'M275 244C280 254 283 264 283 274',
  'M232 235C239 248 241 261 239 274',
  'M223 259C226 270 226 281 224 289',
  'M196 251C199 265 198 278 194 289',
] as const;

const BRONCHIAL_FLOW_PATH = BRONCHIAL_PATHS.join(' ');

const FLOW_POINTS = [
  [180, 82],
  [157, 143],
  [124, 181],
  [96, 226],
  [143, 202],
  [203, 143],
  [236, 181],
  [264, 226],
  [217, 202],
] as const;

export default function NeonLungs({ className = '' }: NeonLungsProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 360 360"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lung-contour" x1="78" x2="286" y1="92" y2="292" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="0.48" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#2DD4BF" />
        </linearGradient>
        <linearGradient id="bronchial-gradient" x1="180" x2="180" y1="52" y2="294" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0F2FE" />
          <stop offset="0.36" stopColor="#67E8F9" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id="lung-fill" cx="0" cy="0" r="1" gradientTransform="translate(180 196) rotate(90) scale(137 128)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" stopOpacity="0.13" />
          <stop offset="0.62" stopColor="#0284C7" stopOpacity="0.045" />
          <stop offset="1" stopColor="#020617" stopOpacity="0" />
        </radialGradient>
        <filter id="lung-glow" x="-45%" y="-45%" width="190%" height="190%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="5.5" result="blur" />
          <feColorMatrix
            in="blur"
            values="0 0 0 0 0.12  0 0 0 0 0.72  0 0 0 0 1  0 0 0 .72 0"
            result="blueGlow"
          />
          <feMerge>
            <feMergeNode in="blueGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g data-lung-rings>
        <g opacity="0.24" stroke="#38BDF8" strokeDasharray="2 10" strokeLinecap="round">
          <circle cx="180" cy="190" r="143" />
          <circle cx="180" cy="190" r="116" />
          <circle cx="180" cy="190" r="87" />
        </g>

        <g opacity="0.22" stroke="#7DD3FC" strokeWidth="0.8">
          <path d="M32 180H73M287 180H328" />
          <path d="M180 26V65M180 302V337" />
          <path d="M52 139H65M295 139H308M52 221H65M295 221H308" />
        </g>
      </g>

      <g data-lung-breath>
        <ellipse cx="180" cy="194" fill="url(#lung-fill)" rx="137" ry="143" />

        <g data-lung-glow filter="url(#lung-glow)" opacity="0.92">
          <path
            d="M168 103C149 91 124 94 105 109C82 128 69 161 68 202C67 242 75 274 96 292C112 305 133 307 148 297C162 288 168 271 170 248C173 218 171 188 173 160C175 135 178 116 168 103Z"
            data-lung-outline
            fill="#0B2A42"
            fillOpacity="0.3"
            pathLength="1"
            stroke="url(#lung-contour)"
            strokeWidth="1.8"
          />
          <path
            d="M192 103C211 91 236 94 255 109C278 128 291 161 292 202C293 242 285 274 264 292C248 305 227 307 212 297C198 288 192 271 190 248C187 218 189 188 187 160C185 135 182 116 192 103Z"
            data-lung-outline
            fill="#0B2A42"
            fillOpacity="0.3"
            pathLength="1"
            stroke="url(#lung-contour)"
            strokeWidth="1.8"
          />

          <path d="M168 103C158 130 155 158 157 187C159 215 159 248 148 297" data-lung-outline pathLength="1" stroke="#7DD3FC" strokeOpacity="0.3" />
          <path d="M192 103C202 130 205 158 203 187C201 215 201 248 212 297" data-lung-outline pathLength="1" stroke="#7DD3FC" strokeOpacity="0.3" />

          <g stroke="url(#bronchial-gradient)" strokeLinecap="round" strokeLinejoin="round">
            {BRONCHIAL_PATHS.map((path, index) => (
              <path
                d={path}
                data-bronchial-branch
                key={path}
                pathLength="1"
                strokeOpacity={index < 3 ? 1 : Math.max(0.42, 0.96 - index * 0.022)}
                strokeWidth={index === 0 ? 5 : index < 3 ? 3.8 : index < 9 ? 2.3 : 1.45}
              />
            ))}
          </g>
        </g>

        <path
          d={BRONCHIAL_FLOW_PATH}
          data-bronchial-flow
          opacity="0.76"
          stroke="#E0F2FE"
          strokeDasharray="4 18"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.1"
        />

        <g stroke="#BAE6FD" strokeLinecap="round" opacity="0.6">
          <path d="M174 58H186" strokeWidth="1" />
          <path d="M174 69H186M174 80H186M174 91H186M174 102H186" strokeWidth="0.8" />
        </g>

        <g fill="#A5F3FC">
          {FLOW_POINTS.map(([cx, cy], index) => (
            <circle cx={cx} cy={cy} data-flow-point key={`${cx}-${cy}`} opacity={0.46 + (index % 3) * 0.16} r={index === 0 ? 2.5 : 1.75} />
          ))}
        </g>

        <g fill="#38BDF8" opacity="0.44">
          <circle cx="105" cy="109" r="1.6" />
          <circle cx="68" cy="202" r="1.6" />
          <circle cx="96" cy="292" r="1.6" />
          <circle cx="255" cy="109" r="1.6" />
          <circle cx="292" cy="202" r="1.6" />
          <circle cx="264" cy="292" r="1.6" />
        </g>
      </g>
    </svg>
  );
}
