'use client'
import { useEffect, useState } from 'react'
import { pwaApi } from '@/lib/pwaApi'

export default function ReferralPage() {
  const [code, setCode] = useState<string | null>(null)
  const [friends, setFriends] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pwaApi.get('/referral').then(r => {
      setCode(r.data.code || null)
      setFriends(r.data.referrals || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const copyCode = () => {
    if (!code) return
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareWhatsApp = () => {
    if (!code) return
    const text = encodeURIComponent(`Rejoins-moi sur Oria Care avec mon code de parrainage : ${code}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',padding:'20px 16px',fontFamily:'system-ui'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button onClick={() => history.back()} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>←</button>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:'#0f172a'}}>🎁 Parrainage</div>
          <div style={{fontSize:12,color:'#64748b'}}>Invitez vos proches</div>
        </div>
      </div>

      {loading && <div style={{textAlign:'center',padding:40,color:'#94a3b8'}}>Chargement...</div>}

      {!loading && (
        <>
          <div style={{background:'linear-gradient(135deg,#EC4899,#8B5CF6)',borderRadius:20,padding:24,marginBottom:20,textAlign:'center',color:'#fff'}}>
            <div style={{fontSize:36,marginBottom:8}}>🎁</div>
            <div style={{fontSize:14,opacity:0.9,marginBottom:8}}>Votre code de parrainage</div>
            <div style={{fontSize:32,fontWeight:900,letterSpacing:4,marginBottom:16}}>
              {code || '------'}
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
              <button
                onClick={copyCode}
                style={{background:'rgba(255,255,255,0.2)',color:'#fff',border:'1px solid rgba(255,255,255,0.4)',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer'}}
              >
                {copied ? '✅ Copié !' : '📋 Copier le code'}
              </button>
              <button
                onClick={shareWhatsApp}
                style={{background:'#25D366',color:'#fff',border:'none',borderRadius:10,padding:'10px 20px',fontSize:13,fontWeight:700,cursor:'pointer'}}
              >
                📱 Partager WhatsApp
              </button>
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',padding:20}}>
            <div style={{fontSize:15,fontWeight:700,color:'#0f172a',marginBottom:12}}>
              Amis parrainés ({friends.length})
            </div>
            {friends.length === 0 && (
              <div style={{textAlign:'center',padding:20,color:'#94a3b8',fontSize:13}}>
                Aucun ami parrainé pour l'instant
              </div>
            )}
            {friends.map((f, i) => (
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i < friends.length-1 ? '1px solid #f1f5f9' : 'none'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'rgba(236,72,153,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>
                  👤
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:'#0f172a'}}>{f.name || 'Ami'}</div>
                  <div style={{fontSize:11,color:'#64748b'}}>{f.date || ''}</div>
                </div>
                {f.reward && (
                  <div style={{marginLeft:'auto',fontSize:12,fontWeight:700,color:'#EC4899'}}>+{f.reward}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
