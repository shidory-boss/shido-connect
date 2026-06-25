'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { chatApi } from '@/lib/api'
import type { ChatThread } from '@/lib/types'

export default function ChatWidget() {
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chatApi.getThreads().then(setThreads).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="skeleton" style={{ height: 72, borderRadius: 18 }} />

  const unread = threads.reduce((s, t) => s + (t.unread_count || 0), 0)
  const last = threads[0]

  return (
    <Link href="/chat" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
        <div style={{ position: 'relative', fontSize: 32 }}>
          💬
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 0,
              background: '#ef4444', color: '#fff',
              fontSize: 10, fontWeight: 900,
              borderRadius: 10, padding: '1px 5px', lineHeight: 1.4,
            }}>{unread}</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>Messages</div>
          {last ? (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}
              className="text-ellipsis">{last.last_message}</div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Aucun message</div>
          )}
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
