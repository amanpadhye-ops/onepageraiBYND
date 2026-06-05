import { useState, useRef, useEffect } from 'react'

const EXAMPLES = [
  { name: 'Bharat Forge Limited',       hint: 'NSE: BHARATFORG, Pune forging company' },
  { name: 'Brakes India Private Limited', hint: 'Chennai, TVS Group, unlisted' },
  { name: 'Tata Consultancy Services',  hint: 'NSE: TCS' },
]

const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#F5F6FA' },
  logo: { fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 48, letterSpacing: '-0.5px' },
  accent: { color: '#2563EB' },
  card: { background: '#fff', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)', padding: 32, width: '100%', maxWidth: 560 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '11px 14px', fontSize: 15, border: '1.5px solid #E5E7EB', borderRadius: 10, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#111', background: '#fff', transition: 'border-color 0.15s' },
  inputFocus: { borderColor: '#2563EB' },
  hint: { width: '100%', padding: '9px 14px', fontSize: 13, border: '1.5px solid #E5E7EB', borderRadius: 10, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#6B7280', background: '#FAFAFA', marginTop: 8, transition: 'border-color 0.15s' },
  btn: { width: '100%', marginTop: 16, padding: '12px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.15s' },
  btnDisabled: { background: '#93C5FD', cursor: 'not-allowed' },
  examples: { marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { padding: '5px 12px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 100, fontSize: 12, color: '#1D4ED8', cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  features: { marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 560, width: '100%' },
  feat: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px', textAlign: 'center' },
  featTitle: { fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 4 },
  featDesc: { fontSize: 12, color: '#6B7280', lineHeight: 1.5 },
}

export default function SearchView({ onGenerate }) {
  const [name, setName]     = useState('')
  const [hint, setHint]     = useState('')
  const [focused, setFocused] = useState(false)
  const ref = useRef()

  useEffect(() => { ref.current?.focus() }, [])

  const submit = e => { e.preventDefault(); if (name.trim()) onGenerate(name.trim(), hint.trim()) }

  return (
    <div style={S.page}>
      <div style={S.logo}>
        OnePager<span style={S.accent}>AI</span>
      </div>

      <form style={S.card} onSubmit={submit} className="fade-up">
        <div style={{ marginBottom: 6 }}>
          <label style={S.label}>Company name</label>
          <input
            ref={ref}
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Bharat Forge Limited"
            style={{ ...S.input, ...(focused ? S.inputFocus : {}) }}
          />
          <input
            value={hint}
            onChange={e => setHint(e.target.value)}
            placeholder="Optional: ticker, website, or sector hint"
            style={S.hint}
          />
        </div>
        <button type="submit" disabled={!name.trim()} style={{ ...S.btn, ...(!name.trim() ? S.btnDisabled : {}) }}>
          Generate one-pager →
        </button>
      </form>

      <div style={S.examples} className="fade-up">
        <span style={{ fontSize: 12, color: '#9CA3AF', alignSelf: 'center' }}>Try:</span>
        {EXAMPLES.map(ex => (
          <button key={ex.name} style={S.chip} onClick={() => { setName(ex.name); setHint(ex.hint) }}>
            {ex.name}
          </button>
        ))}
      </div>

      <div style={S.features} className="fade-up">
        {[
          { icon: '🔍', t: 'Deep research', d: '8–12 live web searches per company' },
          { icon: '📎', t: 'Every claim cited', d: 'Source URL on every bullet and figure' },
          { icon: '🛡️', t: 'Honest gaps', d: 'Gaps shown clearly — nothing invented' },
        ].map(f => (
          <div key={f.t} style={S.feat}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
            <div style={S.featTitle}>{f.t}</div>
            <div style={S.featDesc}>{f.d}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
