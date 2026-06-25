'use client'
import { useState } from 'react'

const DOCS = [
  { icon: '📋', title: 'Dossier médical complet', desc: 'Toutes vos consultations, diagnostics et traitements' },
  { icon: '💊', title: 'Ordonnances (liste)', desc: 'Historique de toutes vos prescriptions médicales' },
  { icon: '📅', title: 'Historique RDV', desc: 'Liste complète de vos rendez-vous passés et à venir' },
  { icon: '🔬', title: 'Résultats analyses', desc: 'Bilans sanguins, examens biologiques et comptes-rendus' },
  { icon: '💳', title: 'Factures et reçus', desc: 'Justificatifs de paiement pour remboursement mutuelle' },
]

export default function PdfExportPage() {
  const [loading, setLoading] = useState<Record<number, boolean>>({})
  const [ready, setReady] = useState<Record<number, boolean>>({})
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [format, setFormat] = useState<'A4' | 'A5'>('A4')

  function handleDownload(i: number) {
    if (loading[i] || ready[i]) return
    setLoading(p => ({ ...p, [i]: true }))
    setTimeout(() => {
      setLoading(p => ({ ...p, [i]: false }))
      setReady(p => ({ ...p, [i]: true }))
    }, 1500)
  }

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}>←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Export PDF</span>
        <span style={{ width: 30 }} />
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        {/* Options */}
        <div className="card-enter" style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Options d'export</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>De</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg2)', color: 'var(--text-primary)', fontSize: 13 }} />
            </div>
            <div style={{ flex: 1, minWidth: 120 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>À</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                style={{ width: '100%', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg2)', color: 'var(--text-primary)', fontSize: 13 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Format</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['A4', 'A5'] as const).map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                    style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--card-border)', background: format === f ? 'var(--acc)' : 'var(--bg2)', color: format === f ? '#fff' : 'var(--text-primary)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Documents list */}
        <div className="stagger">
          {DOCS.map((doc, i) => (
            <div key={i} className="card-enter" style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius)', padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{doc.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{doc.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{doc.desc}</div>
              </div>
              <button onClick={() => handleDownload(i)} disabled={loading[i]}
                style={{ padding: '7px 14px', borderRadius: 8, border: 'none', background: ready[i] ? '#22c55e' : 'var(--acc)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: loading[i] ? 'wait' : 'pointer', flexShrink: 0, minWidth: 100, transition: 'background 0.3s' }}>
                {loading[i] ? '⏳ Génération…' : ready[i] ? 'Prêt ✅' : 'Télécharger'}
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg2)', borderRadius: 'var(--radius)', fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span>ℹ️</span>
          <span>Les PDF sont générés côté serveur et disponibles 24h</span>
        </div>
      </div>
    </div>
  )
}
