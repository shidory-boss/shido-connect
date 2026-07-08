'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { id: number; from: 'user' | 'bot'; text: string; time: string }

const FAQ_ITEMS = [
  { q: 'Comment prendre un rendez-vous ?', a: 'Rendez-vous dans la section "Agenda" de votre espace patient et sélectionnez un créneau disponible chez votre médecin.' },
  { q: 'Comment accéder à mes résultats ?', a: 'Vos résultats d\'analyses sont disponibles dans la section "Résultats" dès qu\'ils sont validés par le laboratoire.' },
  { q: 'Comment contacter mon médecin ?', a: 'Utilisez la messagerie sécurisée dans votre dossier patient pour envoyer un message direct à votre praticien.' },
  { q: 'Comment renouveler mon ordonnance ?', a: 'Demandez un renouvellement depuis votre dossier médical. Votre médecin validera la demande sous 24-48h.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Oui, toutes vos données sont chiffrées et hébergées en conformité avec les normes HDS (Hébergeur de Données de Santé).' },
]

const BOT_REPLIES: Record<string, string> = {
  'Horaires 🕐': 'Nos équipes de support sont disponibles du lundi au vendredi, de 8h à 18h. En dehors de ces horaires, notre bot IA reste actif 24h/24.',
  'Urgence 🚨': 'En cas d\'urgence médicale, appelez le 15 (SAMU) ou le 18 (pompiers). Pour toute urgence non-vitale, consultez votre médecin ou rendez-vous aux urgences.',
  'RDV 📅': 'Pour gérer vos rendez-vous, accédez à la section "Agenda". Vous pouvez prendre, modifier ou annuler un RDV jusqu\'à 24h avant.',
  'Résultats 🔬': 'Vos résultats d\'examens sont accessibles dès validation dans la section "Résultats". Vous recevrez une notification dès qu\'ils sont disponibles.',
}

function nowTime() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatSupportPage() {
  const [tab, setTab] = useState<'live' | 'bot' | 'faq'>('live')
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'bot', text: 'Bonjour ! Comment puis-je vous aider ?', time: nowTime() },
    { id: 2, from: 'bot', text: 'Un agent va vous répondre sous peu.', time: nowTime() },
  ])
  const [input, setInput] = useState('')
  const [botReply, setBotReply] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now(), from: 'user', text: input.trim(), time: nowTime() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, from: 'bot', text: 'Merci pour votre message. Un conseiller va prendre en charge votre demande.', time: nowTime() }
      setMessages(prev => [...prev, botMsg])
    }, 1200)
  }

  function handleBotQuick(label: string) {
    setBotReply(BOT_REPLIES[label] ?? 'Je n\'ai pas de réponse pour cette question.')
  }

  const TABS = [
    { id: 'live', label: 'Chat live' },
    { id: 'bot', label: 'Bot IA' },
    { id: 'faq', label: 'FAQ rapide' },
  ] as const

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Nunito,system-ui,sans-serif', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        height: 56, background: 'var(--card)',
        borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px'
      }}>
        <button
          onClick={() => window.history.back()}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 22, color: 'var(--text-primary)', padding: 0 }}
        >
          ←
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 17 }}>
          Support
        </div>
        <div style={{ width: 30 }} />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 0,
        background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        padding: '0 16px'
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1, padding: '12px 8px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: tab === t.id ? 800 : 500,
              fontSize: 13, color: tab === t.id ? 'var(--accent, #3b82f6)' : 'var(--text-secondary)',
              borderBottom: tab === t.id ? '2px solid var(--accent, #3b82f6)' : '2px solid transparent',
              transition: 'all 0.15s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TAB: Chat live */}
        {tab === 'live' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(msg => (
                <div key={msg.id} style={{
                  display: 'flex',
                  flexDirection: msg.from === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end', gap: 8
                }}>
                  {msg.from === 'bot' && (
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--accent, #3b82f6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, flexShrink: 0
                    }}>💬</div>
                  )}
                  <div style={{
                    maxWidth: '72%',
                    background: msg.from === 'user' ? 'var(--accent, #3b82f6)' : 'var(--card)',
                    color: msg.from === 'user' ? '#fff' : 'var(--text-primary)',
                    borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '10px 14px',
                    border: msg.from === 'bot' ? '1px solid var(--card-border)' : 'none',
                  }}>
                    <div style={{ fontSize: 14, lineHeight: 1.4 }}>{msg.text}</div>
                    <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input sticky */}
            <div style={{
              padding: '12px 16px',
              background: 'var(--card)',
              borderTop: '1px solid var(--card-border)',
              display: 'flex', gap: 10, alignItems: 'center'
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Écrivez votre message..."
                style={{
                  flex: 1, padding: '10px 14px',
                  background: 'var(--bg2, var(--bg))',
                  border: '1px solid var(--card-border)',
                  borderRadius: 20, outline: 'none',
                  fontSize: 14, color: 'var(--text-primary)',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--accent, #3b82f6)', color: '#fff',
                  border: 'none', cursor: 'pointer', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ➤
              </button>
            </div>
          </div>
        )}

        {/* TAB: Bot IA */}
        {tab === 'bot' && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card-enter" style={{
              background: 'var(--card)', borderRadius: 'var(--radius)',
              border: '1px solid var(--card-border)', padding: '14px 16px'
            }}>
              <div style={{ fontSize: 14, marginBottom: 4 }}>🤖 <strong>Assistant ShidoConnect</strong></div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Choisissez un sujet pour obtenir une réponse rapide.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.keys(BOT_REPLIES).map(label => (
                <button
                  key={label}
                  onClick={() => handleBotQuick(label)}
                  style={{
                    padding: '14px 12px',
                    background: 'var(--card)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontWeight: 700, fontSize: 14,
                    color: 'var(--text-primary)',
                    textAlign: 'center', transition: 'background 0.15s'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {botReply && (
              <div className="card-enter" style={{
                background: 'rgba(59,130,246,0.08)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(59,130,246,0.25)',
                padding: '14px 16px'
              }}>
                <div style={{ fontSize: 12, color: 'var(--accent, #3b82f6)', fontWeight: 700, marginBottom: 6 }}>
                  🤖 Réponse du bot
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-primary)' }}>
                  {botReply}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: FAQ */}
        {tab === 'faq' && (
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="card-enter" style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
              Questions fréquentes
            </div>
            <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className="card-enter" style={{
                  background: 'var(--card)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--card-border)', overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    style={{
                      width: '100%', padding: '14px 16px',
                      background: 'transparent', border: 'none',
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', textAlign: 'left'
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{ fontSize: 18, color: 'var(--accent, #3b82f6)', transition: 'transform 0.2s', transform: openFaq === idx ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
                  </button>
                  {openFaq === idx && (
                    <div style={{
                      padding: '0 16px 14px',
                      fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
                      borderTop: '1px solid var(--card-border)'
                    }}>
                      <div style={{ paddingTop: 10 }}>{item.a}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
