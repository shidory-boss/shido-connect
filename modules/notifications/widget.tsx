'use client'
import { useState, useEffect } from 'react'

export default function NotificationsWidget({ config }: { config?: Record<string,string> }) {
  const color = config?.color || '#14B8A6'
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('/api/pwa/notifications/list')
      .then(r => r.json())
      .then(d => {
        const unread = Array.isArray(d) ? d.filter((n: any) => !n.read).length : 0
        setCount(unread)
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{background:'rgba(20,184,166,0.08)',border:'1px solid rgba(20,184,166,0.2)',borderRadius:14,padding:'16px',cursor:'pointer',position:'relative'}} onClick={() => window.location.href='/notifications'}>
      <div style={{fontSize:28,marginBottom:6}}>🔔</div>
      {count > 0 && (
        <div style={{position:'absolute',top:10,right:10,background:'#EF4444',color:'#fff',borderRadius:'50%',width:18,height:18,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>
          {count > 9 ? '9+' : count}
        </div>
      )}
      <div style={{fontSize:13,fontWeight:700,color}}>Notifications</div>
      <div style={{fontSize:11,color:'#64748b',marginTop:2}}>Vos alertes</div>
    </div>
  )
}
