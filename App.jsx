import { useState } from 'react'
import SearchView from './components/SearchView'
import LoadingView from './components/LoadingView'
import OnePager from './components/OnePager'

export default function App() {
  const [view, setView]       = useState('search')
  const [input, setInput]     = useState({ name: '', hint: '' })
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)
  const [log, setLog]         = useState([])

  const generate = async (name, hint) => {
    setInput({ name, hint })
    setLog([])
    setError(null)
    setResult(null)
    setView('loading')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: name, hint }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)

      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop()
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const ev = JSON.parse(line.slice(6))
            if (ev.type === 'status')   setLog(p => [...p, ev.message])
            if (ev.type === 'complete') { setResult(ev.data); setView('result') }
            if (ev.type === 'error')    { setError(ev.message); setView('result') }
          } catch {}
        }
      }
    } catch (e) {
      setError(e.message)
      setView('result')
    }
  }

  return (
    <>
      {view === 'search'  && <SearchView onGenerate={generate} />}
      {view === 'loading' && <LoadingView company={input.name} log={log} />}
      {view === 'result'  && (
        <OnePager
          data={result}
          error={error}
          company={input.name}
          onBack={() => setView('search')}
          onRetry={() => generate(input.name, input.hint)}
        />
      )}
    </>
  )
}
