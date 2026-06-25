'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const TOTAL_STEPS = 6;

export default function UtilOnboardingTourWidget() {
  const [done, setDone] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sc_tour_done');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setDone(parsed.length);
      }
    } catch {}
  }, []);

  const pct = Math.round((done / TOTAL_STEPS) * 100);

  return (
    <Link href="/util/onboarding-tour" style={{ textDecoration: 'none' }}>
      <div className="acard" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px' }}>
        <span style={{ fontSize: 32 }}>🎯</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>
            Guide de démarrage
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Tutoriel interactif
          </div>
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 4, borderRadius: 4, background: 'var(--card-border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width 0.4s' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{done}/{TOTAL_STEPS} étapes</div>
          </div>
        </div>
        <span style={{ color: 'var(--accent)', fontSize: 18 }}>›</span>
      </div>
    </Link>
  );
}
