'use client';
import { useMemo, useState } from 'react';

type Consultation = {
  id: number;
  date: string;
  name: string;
  type: string;
  statut: string;
  prix: number;
};

const ALL_ITEMS: Consultation[] = [
  { id: 1, date: '2026-06-20', name: 'Consultation Générale — Dr. Traoré', type: 'Générale', statut: 'Terminé', prix: 5000 },
  { id: 2, date: '2026-06-18', name: 'Cardiologie — Dr. Kouassi', type: 'Spécialité', statut: 'Terminé', prix: 15000 },
  { id: 3, date: '2026-06-15', name: 'Téléconsultation — Dr. Diallo', type: 'Téléconsult', statut: 'Annulé', prix: 8000 },
  { id: 4, date: '2026-06-10', name: 'Pédiatrie — Dr. Bamba', type: 'Spécialité', statut: 'Terminé', prix: 12000 },
  { id: 5, date: '2026-06-05', name: 'Consultation Générale — Dr. Yao', type: 'Générale', statut: 'Terminé', prix: 5000 },
  { id: 6, date: '2026-05-28', name: 'Radiologie — Centre Médical', type: 'Imagerie', statut: 'Terminé', prix: 25000 },
  { id: 7, date: '2026-07-01', name: 'RDV Cardiologie — Dr. Kouassi', type: 'Spécialité', statut: 'Prévu', prix: 15000 },
  { id: 8, date: '2026-07-10', name: 'Téléconsultation — Dr. Sangaré', type: 'Téléconsult', statut: 'Prévu', prix: 8000 },
];

const TYPES = ['Générale', 'Spécialité', 'Téléconsult', 'Imagerie'];
const STATUTS = ['Tous', 'Terminé', 'Prévu', 'Annulé'];
const SORTS = [
  { label: 'Date ↓', key: 'date', dir: 'desc' },
  { label: 'Date ↑', key: 'date', dir: 'asc' },
  { label: 'Nom A-Z', key: 'name', dir: 'asc' },
  { label: 'Prix ↓', key: 'prix', dir: 'desc' },
  { label: 'Prix ↑', key: 'prix', dir: 'asc' },
];

const STATUS_COLOR: Record<string, string> = {
  Terminé: '#4CAF50',
  Prévu: '#2196F3',
  Annulé: '#f44336',
};

export default function FiltersPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [statut, setStatut] = useState('Tous');
  const [sortIdx, setSortIdx] = useState(0);

  const toggleType = (t: string) =>
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const reset = () => {
    setDateFrom(''); setDateTo(''); setSelectedTypes([]); setStatut('Tous'); setSortIdx(0);
  };

  const results = useMemo(() => {
    let list = [...ALL_ITEMS];
    if (dateFrom) list = list.filter(c => c.date >= dateFrom);
    if (dateTo) list = list.filter(c => c.date <= dateTo);
    if (selectedTypes.length) list = list.filter(c => selectedTypes.includes(c.type));
    if (statut !== 'Tous') list = list.filter(c => c.statut === statut);

    const s = SORTS[sortIdx];
    list.sort((a, b) => {
      const va = a[s.key as keyof Consultation];
      const vb = b[s.key as keyof Consultation];
      if (va < vb) return s.dir === 'asc' ? -1 : 1;
      if (va > vb) return s.dir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [dateFrom, dateTo, selectedTypes, statut, sortIdx]);

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)' }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, height: 56, background: 'var(--card)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' }}>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', lineHeight: 1 }}>←</button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>Filtres & Tri</div>
        <div style={{ width: 30 }} />
      </div>

      <div style={{ padding: 16 }}>
        {/* Filtres */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '14px 16px', border: '1px solid var(--card-border)', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>Filtres</div>

          {/* Date range */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Période</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg2)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' }} />
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid var(--card-border)', background: 'var(--bg2)', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit' }} />
            </div>
          </div>

          {/* Types multi-select */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Type (multi-sélection)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => toggleType(t)} style={{
                  padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: selectedTypes.includes(t) ? 'var(--accent)' : 'var(--bg2)',
                  color: selectedTypes.includes(t) ? '#fff' : 'var(--text-secondary)',
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Statut radio */}
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>Statut</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STATUTS.map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: 13 }}>
                  <input type="radio" name="statut" value={s} checked={statut === s} onChange={() => setStatut(s)} />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Tri */}
        <div className="card-enter" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '14px 16px', border: '1px solid var(--card-border)', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 10 }}>Tri</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {SORTS.map((s, i) => (
              <button key={i} onClick={() => setSortIdx(i)} style={{
                padding: '5px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                background: sortIdx === i ? 'var(--accent)' : 'var(--bg2)',
                color: sortIdx === i ? '#fff' : 'var(--text-secondary)',
              }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Résultats header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 14 }}>{results.length} résultat{results.length > 1 ? 's' : ''}</div>
          <button onClick={reset} style={{
            padding: '5px 12px', borderRadius: 8, border: '1px solid var(--card-border)',
            background: 'transparent', cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'inherit',
          }}>
            Réinitialiser les filtres
          </button>
        </div>

        {/* Liste résultats */}
        <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0', fontSize: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              Aucune consultation ne correspond aux filtres.
            </div>
          ) : results.map(c => (
            <div key={c.id} className="card-enter" style={{
              background: 'var(--card)', borderRadius: 'var(--radius)', padding: '12px 14px',
              border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {new Date(c.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · {c.type}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{c.prix.toLocaleString('fr-FR')} FCFA</div>
                <div style={{ fontSize: 11, color: STATUS_COLOR[c.statut] ?? 'var(--text-secondary)', fontWeight: 700, marginTop: 2 }}>{c.statut}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
