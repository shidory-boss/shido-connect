'use client'

import Link from 'next/link'

export default function UtilChatSupportWidget() {
  return (
    <Link href="/util/chat-support" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32, flexShrink: 0 }}>💬</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
            Support client
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            Chat en direct ou bot IA
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block',
                animation: 'pulseDot 1.5s infinite',
                boxShadow: '0 0 0 0 rgba(34,197,94,0.4)'
              }} />
              <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700 }}>En ligne</span>
            </span>
          </div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0 }}>›</span>
      </div>
    </Link>
  )
}
