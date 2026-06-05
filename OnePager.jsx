const CONF_STYLE = {
  HIGH:   { color: '#065F46', background: '#D1FAE5', label: '● HIGH' },
  MEDIUM: { color: '#92400E', background: '#FEF3C7', label: '◐ MED' },
  LOW:    { color: '#991B1B', background: '#FEE2E2', label: '○ LOW' },
}

function Badge({ level }) {
  const s = CONF_STYLE[level]
  if (!s) return null
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, color: s.color, background: s.background, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function Source({ src }) {
  if (!src?.url) return null
  return (
    <a href={src.url} target="_blank" rel="noopener noreferrer"
      style={{ fontSize: 11, color: '#2563EB', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200, display: 'inline-block' }}>
      ↗ {src.title || 'Source'}
    </a>
  )
}

function SectionBar({ children }) {
  return (
    <div style={{ background: '#1E3A5F', color: '#fff', fontWeight: 700, fontSize: 13, padding: '8px 14px', borderRadius: '6px 6px 0 0', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
      {children}
    </div>
  )
}

function Panel({ children, style }) {
  return (
    <div style={{ border: '1px solid #D1D5DB', borderRadius: 8, overflow: 'hidden', background: '#fff', ...style }}>
      {children}
    </div>
  )
}

export default function OnePager({ data, error, company, onBack, onRetry }) {
  if (error && !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 20px', maxWidth: 400, textAlign: 'center' }}>
          {error}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onRetry} style={btnStyle('#2563EB')}>Try again</button>
          <button onClick={onBack} style={btnStyle('#6B7280')}>New search</button>
        </div>
      </div>
    )
  }

  if (!data) return null
  const { company: co, overview, financials, products, clients, dataQuality } = data

  return (
    <div style={{ minHeight: '100vh', background: '#F5F6FA', padding: '0 0 60px' }}>

      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#6B7280', padding: '0 4px' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{co?.name}</div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>
            {[co?.ticker, co?.exchange, co?.headquarters].filter(Boolean).join(' · ')}
          </div>
        </div>
        <DataQualityPill quality={dataQuality?.overall} />
        <button onClick={() => window.print()} style={btnStyle('#2563EB', 'sm')}>Export PDF</button>
        <button onClick={onRetry} style={btnStyle('#6B7280', 'sm')}>Regenerate</button>
      </div>

      {/* Sparse warning */}
      {dataQuality?.overall === 'SPARSE' && (
        <div style={{ margin: '16px 32px 0', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#92400E' }}>
          ⚠ <strong>Limited public data available.</strong> {dataQuality.notes}
        </div>
      )}

      {/* Title */}
      <div style={{ padding: '28px 32px 0' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px', color: '#111' }}>
          {co?.name} — Company Overview
        </h1>
      </div>

      {/* Main grid: Overview + Financials */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, padding: '20px 32px 0', alignItems: 'start' }}>

        {/* Overview */}
        <Panel>
          <SectionBar>Company Overview</SectionBar>
          <div style={{ padding: '16px' }}>
            {overview?.description && (
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginBottom: 14, borderLeft: '3px solid #2563EB', paddingLeft: 10, fontStyle: 'italic' }}>
                {overview.description}
              </p>
            )}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {overview?.bullets?.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                  <span style={{ color: '#2563EB', marginTop: 4, flexShrink: 0 }}>▪</span>
                  <div>
                    <span style={{ lineHeight: 1.6 }}>{b.text}</span>
                    <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Badge level={b.confidence} />
                      <Source src={b.source} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {(!overview?.bullets?.length) && <NotFound label="overview" />}
          </div>
        </Panel>

        {/* Financials */}
        <Panel>
          <SectionBar>Financial Overview {financials?.currency ? `(${financials.currency})` : ''}</SectionBar>
          {financials?.note && (
            <div style={{ padding: '8px 12px', background: '#FFFBEB', borderBottom: '1px solid #FDE68A', fontSize: 11, color: '#92400E' }}>
              ℹ {financials.note}
            </div>
          )}
          {financials?.rows?.length ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  <th style={th('left')}>Particulars</th>
                  {financials.years.map(y => <th key={y} style={th('right')}>{y}</th>)}
                  <th style={th('center')}>Conf.</th>
                </tr>
              </thead>
              <tbody>
                {financials.rows.map((row, i) => {
                  const isKeyRow = ['Revenue', 'EBITDA', 'Net Debt'].some(k => row.label?.includes(k))
                  return (
                    <tr key={i} style={{ borderTop: '1px solid #F3F4F6', background: isKeyRow ? '#F0F7FF' : 'transparent' }}>
                      <td style={{ padding: '9px 12px', fontWeight: isKeyRow ? 700 : 400, color: '#111' }}>
                        {row.label}
                        {row.source && <div style={{ marginTop: 2 }}><Source src={row.source} /></div>}
                      </td>
                      {row.values.map((v, j) => (
                        <td key={j} style={{ padding: '9px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: v === null ? '#D1D5DB' : row.isPercentage ? '#2563EB' : '#111', fontWeight: isKeyRow ? 600 : 400 }}>
                          {v === null ? '—' : v}
                        </td>
                      ))}
                      <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                        {row.confidence ? <Badge level={row.confidence} /> : <span style={{ color: '#E5E7EB', fontSize: 12 }}>—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : <NotFound label="financial data" />}
        </Panel>
      </div>

      {/* Products + Clients grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, padding: '20px 32px 0' }}>

        {/* Products */}
        <Panel>
          <SectionBar>Select Products</SectionBar>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {products?.length ? products.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < products.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📦</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginBottom: 4 }}>{p.description}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Badge level={p.confidence} />
                    <Source src={p.source} />
                  </div>
                </div>
              </div>
            )) : <NotFound label="products" />}
          </div>
        </Panel>

        {/* Clients */}
        <Panel>
          <SectionBar>Select Clients</SectionBar>
          <div style={{ padding: 16 }}>
            {clients?.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                {clients.map((c, i) => (
                  <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '12px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏢</div>
                    <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', color: '#111' }}>{c.name}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Badge level={c.confidence} />
                      <Source src={c.source} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <NotFound label="client data" />}
          </div>
        </Panel>
      </div>

      {/* Sources footer */}
      {data.sources?.length > 0 && (
        <div style={{ margin: '20px 32px 0', padding: 16, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>All sources consulted</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {data.sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: '#2563EB', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, padding: '3px 8px', textDecoration: 'none' }}>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DataQualityPill({ quality }) {
  const cfg = { RICH: { color: '#065F46', bg: '#D1FAE5' }, MODERATE: { color: '#92400E', bg: '#FEF3C7' }, SPARSE: { color: '#991B1B', bg: '#FEE2E2' } }
  const s = cfg[quality] || { color: '#6B7280', bg: '#F3F4F6' }
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, color: s.color, background: s.bg }}>
      Data: {quality || '?'}
    </span>
  )
}

function NotFound({ label }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontSize: 13, color: '#9CA3AF', fontStyle: 'italic', border: '1px dashed #E5E7EB', borderRadius: 8, margin: 8 }}>
      Not found in available public sources
    </div>
  )
}

function th(align) {
  return { padding: '8px 12px', textAlign: align, fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap', borderBottom: '1px solid #E5E7EB' }
}

function btnStyle(bg, size = 'md') {
  return { background: bg, color: '#fff', border: 'none', borderRadius: 8, padding: size === 'sm' ? '7px 14px' : '10px 20px', fontSize: size === 'sm' ? 12 : 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }
}
