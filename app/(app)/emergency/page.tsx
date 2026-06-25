'use client'
import { useState } from 'react'
import { pwaApi } from '@/lib/pwaApi'

export default function EmergencyPage() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const sendAlert = async () => {
    if (!message.trim()) return
    setSending(true)
    try {
      await pwaApi.post('/emergency/alert', { message })
      setSent(true)
      setMessage('')
    } catch {
      alert('Erreur lors de l\'envoi. Veuillez appeler directement.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'#fff5f5',padding:'20px 16px',fontFamily:'system-ui'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button onClick={() => history.back()} style={{background:'none',border:'none',fontSize:20,cursor:'pointer'}}>←</button>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:'#0f172a'}}>🚨 Urgences / SOS</div>
          <div style={{fontSize:12,color:'#64748b'}}>Contacter la clinique</div>
        </div>
      </div>

      <div style={{background:'#fff',borderRadius:20,border:'2px solid #EF4444',padding:24,marginBottom:20,textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:12}}>🆘</div>
        <div style={{fontSize:16,fontWeight:700,color:'#0f172a',marginBottom:4}}>Urgence médicale ?</div>
        <div style={{fontSize:13,color:'#64748b',marginBottom:20}}>Appelez directement la clinique</div>
        <div style={{fontSize:22,fontWeight:800,color:'#EF4444',marginBottom:16}}>+225 00 00 00 00</div>
        <button
          onClick={() => window.location.href='tel:+22500000000'}
          style={{background:'#EF4444',color:'#fff',border:'none',borderRadius:14,padding:'14px 32px',fontSize:16,fontWeight:800,cursor:'pointer',width:'100%',letterSpacing:0.5}}
        >
          🆘 APPELER LA CLINIQUE
        </button>
      </div>

      <div style={{background:'#fff',borderRadius:16,border:'1px solid #e2e8f0',padding:20}}>
        <div style={{fontSize:15,fontWeight:700,color:'#0f172a',marginBottom:12}}>Envoyer un message d'urgence</div>
        {sent && (
          <div style={{background:'rgba(5,150,105,0.1)',border:'1px solid rgba(5,150,105,0.2)',borderRadius:10,padding:12,marginBottom:12,fontSize:13,color:'#059669',fontWeight:600}}>
            Message envoyé. Le personnel va vous contacter.
          </div>
        )}
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Décrivez votre urgence..."
          rows={4}
          style={{width:'100%',borderRadius:10,border:'1px solid #e2e8f0',padding:12,fontSize:14,fontFamily:'system-ui',resize:'none',boxSizing:'border-box'}}
        />
        <button
          onClick={sendAlert}
          disabled={sending || !message.trim()}
          style={{marginTop:12,background:message.trim() ? '#EF4444' : '#e2e8f0',color:message.trim() ? '#fff' : '#94a3b8',border:'none',borderRadius:10,padding:'12px 24px',fontSize:14,fontWeight:700,cursor:message.trim() ? 'pointer' : 'not-allowed',width:'100%'}}
        >
          {sending ? 'Envoi...' : 'Envoyer le message'}
        </button>
      </div>
    </div>
  )
}
