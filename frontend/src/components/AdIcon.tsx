import type { ReactNode } from 'react'
import type { AdIconId } from '../constants/adIcons'
import './AdIconPicker.css'

interface AdIconProps {
  icon: AdIconId | string
  className?: string
}

const STROKE = '1.5'
const STROKE_INNER = '1.05'

function IconSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" overflow="visible">
      <g transform="translate(12 12) scale(1.12) translate(-12 -12)">
        {children}
      </g>
    </svg>
  )
}

const ICONS: Record<AdIconId, ReactNode> = {
  microphone: (
    <IconSvg>
      <rect
        x="9.5"
        y="3.5"
        width="5"
        height="9"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
      />
      <path
        d="M7.5 10a4.5 4.5 0 0 0 9 0"
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
      <path d="M12 14.5v3" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
      <path d="M9.5 19.5h5" stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" />
    </IconSvg>
  ),
  drums: (
    <IconSvg>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.8 4.1 13.6 9.6" />
        <path d="M18.2 4.1 10.4 9.6" />
        <ellipse cx="12" cy="10.3" rx="6.4" ry="2.05" />
        <path d="M5.6 10.3v6.5" />
        <path d="M18.4 10.3v6.5" />
        <path d="M5.6 16.8a6.4 2 0 0 0 12.8 0" />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE_INNER}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.6 12.2 8.35 16.5 12 12.2 15.65 16.5 18.4 12.2" />
      </g>
    </IconSvg>
  ),
  guitar: (
    <IconSvg>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(12 12) rotate(45) translate(-12 -12) translate(0 -0.6)"
      >
        <path
          strokeWidth={STROKE}
          d="M10.6 10.4
            C7.8 10.5 6.6 12.2 6.8 13.8
            C7.1 14.8 8.3 15.4 8.1 16
            C7.4 18 5.6 20.5 6 22.2
            C7.6 23.6 9.8 24.1 12 24.1"
        />
        <path
          strokeWidth={STROKE}
          d="M13.4 10.4
            C16.2 10.5 17.4 12.2 17.2 13.8
            C16.9 14.8 15.7 15.4 15.9 16
            C16.6 18 18.4 20.5 18 22.2
            C16.4 23.6 14.2 24.1 12 24.1"
        />
        <circle cx="12" cy="15.8" r="1.45" strokeWidth={STROKE} />
        <path d="M9.6 20.8h4.8" strokeWidth={STROKE} />
        <rect x="11.2" y="3.8" width="1.6" height="6.5" rx="0.2" strokeWidth={STROKE} />
        <rect x="9.1" y="1.6" width="5.8" height="2.2" rx="0.45" strokeWidth={STROKE} />
      </g>
    </IconSvg>
  ),
  piano: (
    <IconSvg>
      <rect
        x="4"
        y="6.5"
        width="16"
        height="11"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
      />
      <g fill="currentColor" stroke="none" transform="translate(1.85 0)">
        <rect x="5.55" y="7.25" width="2" height="6.15" rx="0.35" />
        <rect x="9.18" y="7.25" width="2" height="6.15" rx="0.35" />
        <rect x="12.81" y="7.25" width="2" height="6.15" rx="0.35" />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE_INNER}
        strokeLinecap="round"
      >
        <path d="M8.375 13.4v3.35" />
        <path d="M12 13.4v3.35" />
        <path d="M15.625 13.4v3.35" />
      </g>
    </IconSvg>
  ),
  bass: (
    <IconSvg>
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(12 12) rotate(45) translate(-12 -12) translate(0 -0.6)"
      >
        <path
          strokeWidth={STROKE}
          d="M10.8 11.8
            C8.4 11.9 7.4 13.2 7.5 14.5
            C7.7 15.5 8.5 16 8.4 16.5
            C7.9 18.2 6.6 20.2 7 21.5
            C8.2 22.8 10 23.2 12 23.2"
        />
        <path
          strokeWidth={STROKE}
          d="M13.2 11.8
            C15.6 11.9 16.6 13.2 16.5 14.5
            C16.3 15.5 15.5 16 15.6 16.5
            C16.1 18.2 17.4 20.2 17 21.5
            C15.8 22.8 14 23.2 12 23.2"
        />
        <circle cx="12" cy="16.2" r="1.25" strokeWidth={STROKE} />
        <path d="M9.8 20.2h4.4" strokeWidth={STROKE} />
        <rect x="11.2" y="2.5" width="1.6" height="9" rx="0.2" strokeWidth={STROKE} />
        <rect x="9.1" y="1.2" width="5.8" height="2.2" rx="0.45" strokeWidth={STROKE} />
      </g>
    </IconSvg>
  ),
  group: (
    <IconSvg>
      <circle cx="8" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth={STROKE} />
      <circle cx="16" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth={STROKE} />
      <path
        d="M4.8 18c0-2 1.6-3.2 3.2-3.2s3.2 1.2 3.2 3.2M12.8 18c0-2 1.4-3.2 3.2-3.2s3.2 1.2 3.2 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
      />
    </IconSvg>
  ),
}

export default function AdIcon({ icon, className = '' }: AdIconProps) {
  const content = ICONS[icon as AdIconId] ?? ICONS.group

  return (
    <span className={`ad-icon ${className}`.trim()} aria-hidden="true">
      {content}
    </span>
  )
}
