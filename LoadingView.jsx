import { useEffect, useState } from 'react'

export default function LoadingView({ company, log }) {
  const [secs, setSecs] = useState(0)
  useEffect(() => { const t = setInterval(() => setSecs(s => s + 1), 1000); return () => clearInterval(t) }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: '#F5F6FA' }}>

      {/* Radar */}
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 32 }}>
        {[0, 20, 40].map(i => (
          <div key={i} style={{ position: 'absolute', inset: i, borderRadius: '50%', border: '1px solid rgba(37,99,235,0.2)' }} />
        ))}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 75%, rgba(37,99,235,0.3) 100%)', animation: 'spin 1.8s linear infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 8, height: 8, borderRadius: '50%', background: '#2563EB', boxShadow: '0 0 8px #2563EB' }} />
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.3px' }}>
        Researching <span style={{ color: '#2563EB' }}>{company}</span>
      </h2>
      <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 32 }}>{secs}s elapsed — verifying every claim before it appears</p>

      {/* Log */}
      <div style={{ width: '100%', maxWidth: 440, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '8px 16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', fontSize: 11, fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'pulse 1s infinite', display: 'inline-block' }} />
          Research log
        </div>
        <div style={{ padding: '8px 0', maxHeight: 220, overflowY: 'auto' }}>
          {log.length === 0
            ? <div style={{ padding: '8px 16px', fontSize: 13, color: '#D1D5DB' }}>Starting…</div>
            : log.map((m, i) => (
              <div key={i} style={{ padding: '5px 16px', fontSize: 13, color: i === log.length - 1 ? '#111' : '#9CA3AF', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 10, minWidth: 24, color: i === log.length - 1 ? '#2563EB' : '#D1D5DB', fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
                {m}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
