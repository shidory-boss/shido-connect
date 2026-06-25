'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { paymentApi } from '@/lib/api'
import type { Invoice } from '@/lib/types'

export default function PaymentWidget() {
  const [unpaid, setUnpaid] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    paymentApi.getInvoices().then(list => setUnpaid(list.filter(i => i.status === 'pending' || i.status === 'partial'))).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="skeleton" style={{ height: 72, borderRadius: 18 }} />
  if (unpaid.length === 0) return null

  const total = unpaid.reduce((s, i) => s + i.amount, 0)

  return (
    <Link href="/payment" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        background: 'var(--warning-bg)',
      }}>
        <div style={{ fontSize: 32 }}>💳</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--warning-color)' }}>
            {unpaid.length} facture{unpaid.length > 1 ? 's' : ''} à régler
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Total : {total.toLocaleString('fr-FR')} FCFA
          </div>
        </div>
        <div style={{ color: 'var(--accent)', fontSize: 18 }}>›</div>
      </div>
    </Link>
  )
}
