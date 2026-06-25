'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { bookingApi } from '@/lib/api'
import type { Appointment } from '@/lib/types'

export default function BookingWidget() {
  const [next, setNext] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bookingApi.getMyAppointments().then(list => {
      const upcoming = list
        .filter(a => a.status !== 'cancelled' && new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setNext(upcoming[0] ?? null)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  })

  if (loading) return <div className="skeleton" style={{ height: 80, borderRadius: 18 }} />

  return (
    <Link href="/booking" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <div style={{ fontSize: 32 }}>📅</div>
        <div style={{ flex: 1 }}>
          {next ? (
            <>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Prochain RDV</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{fmt(next.date)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Dr {next.doctor_name}</div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>Prendre un rendez-vous</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Aucun RDV à venir</div>
            </>
          )}
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
