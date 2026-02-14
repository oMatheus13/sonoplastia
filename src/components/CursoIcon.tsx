import type { CursoIconName } from "../types/curso";

type CursoIconProps = {
  name: CursoIconName;
  size?: number;
  title?: string;
};

const icons: Record<CursoIconName, JSX.Element> = {
  fundamentos: (
    <g>
      <rect x="6" y="10" width="16" height="26" rx="3" />
      <rect x="26" y="10" width="16" height="26" rx="3" />
      <line x1="24" y1="10" x2="24" y2="36" />
      <line x1="11" y1="17" x2="18" y2="17" />
      <line x1="30" y1="17" x2="37" y2="17" />
    </g>
  ),
  cabos: (
    <g>
      <rect x="6" y="14" width="10" height="10" rx="2" />
      <rect x="32" y="24" width="10" height="10" rx="2" />
      <path d="M16 19h9c6 0 6 14 0 14h-9" />
    </g>
  ),
  microfone: (
    <g>
      <rect x="18" y="8" width="12" height="20" rx="6" />
      <line x1="24" y1="28" x2="24" y2="36" />
      <path d="M16 36h16" />
      <path d="M18 22h12" />
    </g>
  ),
  mixer: (
    <g>
      <rect x="8" y="10" width="32" height="28" rx="4" />
      <line x1="16" y1="16" x2="16" y2="32" />
      <line x1="24" y1="16" x2="24" y2="32" />
      <line x1="32" y1="16" x2="32" y2="32" />
      <circle cx="16" cy="24" r="2" />
      <circle cx="24" cy="20" r="2" />
      <circle cx="32" cy="28" r="2" />
    </g>
  ),
  onda: (
    <g>
      <path d="M6 26c4-8 8-8 12 0s8 8 12 0 8-8 12 0" />
      <circle cx="6" cy="26" r="1.5" />
      <circle cx="42" cy="26" r="1.5" />
    </g>
  ),
  eq: (
    <g>
      <line x1="12" y1="14" x2="12" y2="34" />
      <line x1="24" y1="14" x2="24" y2="34" />
      <line x1="36" y1="14" x2="36" y2="34" />
      <circle cx="12" cy="22" r="2" />
      <circle cx="24" cy="28" r="2" />
      <circle cx="36" cy="20" r="2" />
    </g>
  ),
  amplificador: (
    <g>
      <rect x="8" y="16" width="32" height="18" rx="3" />
      <circle cx="16" cy="25" r="2" />
      <circle cx="24" cy="25" r="2" />
      <rect x="30" y="23" width="6" height="4" rx="1" />
      <line x1="12" y1="20" x2="18" y2="20" />
    </g>
  ),
  caixa: (
    <g>
      <rect x="10" y="10" width="16" height="28" rx="2" />
      <circle cx="18" cy="18" r="3" />
      <circle cx="18" cy="28" r="5" />
      <path d="M32 18c4 4 4 10 0 14" />
      <path d="M36 16c6 6 6 14 0 20" />
    </g>
  ),
  headset: (
    <g>
      <path d="M12 24a12 12 0 0 1 24 0" />
      <rect x="8" y="24" width="6" height="10" rx="2" />
      <rect x="34" y="24" width="6" height="10" rx="2" />
      <path d="M28 36h6v4" />
    </g>
  ),
  livro: (
    <g>
      <rect x="12" y="8" width="24" height="32" rx="3" />
      <path d="M18 8v14l6-4 6 4V8" />
      <line x1="16" y1="28" x2="32" y2="28" />
    </g>
  ),
};

export default function CursoIcon({ name, size = 40, title }: CursoIconProps) {
  return (
    <span className="curso-icon" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={title ? undefined : true}
      >
        {title ? <title>{title}</title> : null}
        {icons[name]}
      </svg>
    </span>
  );
}
