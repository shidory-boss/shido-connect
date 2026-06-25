'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function getEmbedUrl(url: string): string | null {
  if (!url) return null
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return null
}

export default function VitrineVideoPage() {
  const router = useRouter()
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('Bienvenue dans notre établissement. Découvrez nos équipes, nos installations et notre engagement pour votre santé.')
  const [playing, setPlaying] = useState(false)

  const embedUrl = getEmbedUrl(videoUrl)

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--card)', borderBottom: '1px solid var(--card-border)',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-primary)', padding: '0 4px' }}
        >←</button>
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Vidéo présentation</span>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ padding: '16px 16px 80px' }}>
        {/* Player */}
        <div
          className="card-enter"
          style={{
            borderRadius: 'var(--radius)', overflow: 'hidden',
            border: '1px solid var(--card-border)',
            marginBottom: 16, background: '#000',
            aspectRatio: '16/9', position: 'relative',
          }}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <div
              onClick={() => setPlaying(!playing)}
              style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexDirection: 'column', gap: 12,
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
              }}>
                <span style={{ fontSize: 28, marginLeft: 4 }}>▶</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                Entrez une URL YouTube ou Vimeo ci-dessous
              </span>
            </div>
          )}
        </div>

        <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:0.8} 50%{transform:scale(1.12);opacity:1} }`}</style>

        {/* URL input */}
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>URL de la vidéo</div>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '9px 12px', borderRadius: 8,
              border: '1px solid var(--card-border)', background: 'var(--bg)',
              color: 'var(--text-primary)', fontSize: 13, outline: 'none',
            }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>
            Compatible YouTube et Vimeo
          </div>
        </div>

        {/* Description */}
        <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--card-border)', padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Description</div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '9px 12px', borderRadius: 8,
              border: '1px solid var(--card-border)', background: 'var(--bg)',
              color: 'var(--text-primary)', fontSize: 13, outline: 'none',
              resize: 'vertical', lineHeight: 1.5,
            }}
          />
        </div>
      </div>
    </div>
  )
}
