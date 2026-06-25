'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function UtilNotificationsWidget() {
  const [count] = useState(3)

  return (
    <Link href="/util/notifications" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <span style={{ fontSize: 32 }}>🔔</span>
          {count > 0 && (
            <span style={{
              position: 'absolute',
              top: -4,
              right: -4,
              background: '#e53e3e',
              color: '#fff',
              borderRadius: '50%',
              width: 18,
              height: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 800,
            }}>
              {count}
            </span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
            Notifications push
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Restez alerté en temps réel
          </div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0 }}>›</span>
      </div>
    </Link>
  )
}
