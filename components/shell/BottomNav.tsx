'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePWAModules } from '@/core/usePWAModules'

// BottomNav v5 — icônes colorées modernes, liquid glass pill

const ACC = '#1D9E75'

type IconProps = { active: boolean }

const NAVY = '#0B1D35'
const NAVY2 = '#122848'
const NAVY_LIGHT = 'rgba(11,29,53,0.14)'

function IconHome({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gh" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      {active ? (
        <>
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-10.5z" fill="url(#gh)"/>
          <path d="M9 22V14h6v8" fill="white" opacity=".9"/>
        </>
      ) : (
        <>
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1H5a1 1 0 01-1-1v-10.5z" fill={NAVY_LIGHT}/>
          <path d="M9 22V14h6v8" fill={NAVY} opacity=".4"/>
          <path d="M3 10.5L12 3l9 7.5" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        </>
      )}
    </svg>
  )
}

function IconCalendar({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      {active ? (
        <>
          <rect x="3" y="5" width="18" height="17" rx="3" fill="url(#gc)"/>
          <rect x="3" y="5" width="18" height="6" rx="3" fill="#059669"/>
          <path d="M8 3v4M16 3v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <rect x="7" y="14" width="3" height="3" rx="1" fill="white" opacity=".9"/>
          <rect x="11" y="14" width="3" height="3" rx="1" fill="white" opacity=".7"/>
          <rect x="15" y="14" width="3" height="3" rx="1" fill="white" opacity=".5"/>
        </>
      ) : (
        <>
          <rect x="3" y="5" width="18" height="17" rx="3" fill={NAVY_LIGHT}/>
          <rect x="3" y="5" width="18" height="6" rx="3" fill={NAVY} opacity=".18"/>
          <path d="M8 3v4M16 3v4" stroke={NAVY} strokeWidth="2" strokeLinecap="round" opacity=".5"/>
          <rect x="7" y="14" width="3" height="3" rx="1" fill={NAVY} opacity=".4"/>
          <rect x="11" y="14" width="3" height="3" rx="1" fill={NAVY} opacity=".3"/>
          <rect x="15" y="14" width="3" height="3" rx="1" fill={NAVY} opacity=".2"/>
        </>
      )}
    </svg>
  )
}

function IconChat({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      {active ? (
        <>
          <path d="M12 2C6.477 2 2 6.145 2 11.25c0 2.555 1.13 4.86 2.97 6.5L4 22l4.53-1.96A10.8 10.8 0 0012 20.5c5.523 0 10-4.145 10-9.25S17.523 2 12 2z" fill="url(#gm)"/>
          <circle cx="8.5" cy="11" r="1.3" fill="white"/>
          <circle cx="12" cy="11" r="1.3" fill="white"/>
          <circle cx="15.5" cy="11" r="1.3" fill="white"/>
        </>
      ) : (
        <>
          <path d="M12 2C6.477 2 2 6.145 2 11.25c0 2.555 1.13 4.86 2.97 6.5L4 22l4.53-1.96A10.8 10.8 0 0012 20.5c5.523 0 10-4.145 10-9.25S17.523 2 12 2z" fill={NAVY_LIGHT}/>
          <circle cx="8.5" cy="11" r="1.3" fill={NAVY} opacity=".45"/>
          <circle cx="12" cy="11" r="1.3" fill={NAVY} opacity=".45"/>
          <circle cx="15.5" cy="11" r="1.3" fill={NAVY} opacity=".45"/>
        </>
      )}
    </svg>
  )
}

function IconFolder({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      {active ? (
        <>
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h5.5l2 2.5H20a2 2 0 012 2V19z" fill="url(#gf)"/>
          <path d="M2 9h20" stroke="#059669" strokeWidth="1" opacity=".4"/>
          <path d="M7 14h10M7 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity=".9"/>
        </>
      ) : (
        <>
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2h5.5l2 2.5H20a2 2 0 012 2V19z" fill={NAVY_LIGHT}/>
          <path d="M7 14h10M7 17h6" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
        </>
      )}
    </svg>
  )
}

function IconPerson({ active }: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      {active ? (
        <>
          <circle cx="12" cy="8" r="4.5" fill="url(#gp)"/>
          <path d="M3.5 21c0-4.694 3.806-8 8.5-8s8.5 3.306 8.5 8" stroke="url(#gp)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </>
      ) : (
        <>
          <circle cx="12" cy="8" r="4.5" fill={NAVY_LIGHT}/>
          <circle cx="12" cy="8" r="4.5" stroke={NAVY} strokeWidth="1.2" fill="none" opacity=".5"/>
          <path d="M3.5 21c0-4.694 3.806-8 8.5-8s8.5 3.306 8.5 8" stroke={NAVY} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".5"/>
        </>
      )}
    </svg>
  )
}

const ICON_COMPONENTS: Record<string, React.ComponentType<IconProps>> = {
  home:     IconHome,
  calendar: IconCalendar,
  chat:     IconChat,
  folder:   IconFolder,
  person:   IconPerson,
}

const MODULE_NAV: Record<string, { href: string; label: string; iconKey: string; position: number }> = {
  pwa_booking:      { href: '/booking', label: 'RDV',      iconKey: 'calendar', position: 2 },
  pwa_queue_status: { href: '/chat',    label: 'Messages', iconKey: 'chat',     position: 3 },
  pwa_chat:         { href: '/chat',    label: 'Messages', iconKey: 'chat',     position: 4 },
  pwa_records:      { href: '/records', label: 'Dossier',  iconKey: 'folder',   position: 5 },
}

const FIXED_NAV = [
  { href: '/home',   label: 'Accueil', iconKey: 'home',   position: 0 },
  { href: '/profil', label: 'Profil',  iconKey: 'person', position: 99 },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { modules } = usePWAModules()

  const seen = new Set<string>()
  const moduleItems = modules
    .filter(m => m.enabled && MODULE_NAV[m.key])
    .map(m => ({ ...MODULE_NAV[m.key], key: m.key }))
    .filter(item => {
      if (seen.has(item.href)) return false
      seen.add(item.href)
      return true
    })

  const allItems = [...FIXED_NAV, ...moduleItems]
    .sort((a, b) => a.position - b.position)
    .slice(0, 5)

  return (
    <nav style={{
      position: 'fixed',
      bottom: 12,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 28px)',
      maxWidth: 396,
      height: 60,
      background: 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderRadius: 999,
      padding: '0 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      boxShadow: '0 8px 32px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.9)',
      border: '1px solid rgba(255,255,255,0.65)',
      zIndex: 500,
      fontFamily: 'Nunito, system-ui, sans-serif',
    }}>
      {allItems.map(item => {
        const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href + '/'))
        const Icon = ICON_COMPONENTS[item.iconKey] || IconHome
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              flex: 1,
              height: '100%',
              textDecoration: 'none',
              position: 'relative',
              padding: '6px 2px 4px',
            }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 12,
              background: isActive ? 'rgba(29,158,117,0.08)' : 'transparent',
              transition: 'all .2s cubic-bezier(.34,1.56,.64,1)',
              transform: isActive ? 'scale(1.08) translateY(-1px)' : 'scale(1)',
            }}>
              <Icon active={isActive} />
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 800 : 500,
              color: isActive ? ACC : '#94A3B8',
              letterSpacing: '-0.2px',
              lineHeight: 1,
            }}>
              {item.label}
            </span>
            {isActive && (
              <span style={{
                position: 'absolute',
                bottom: 3,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: ACC,
              }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
