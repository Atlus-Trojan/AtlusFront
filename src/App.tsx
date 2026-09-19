import { ShieldCheck } from 'lucide-react'

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-muted">
      <div className="flex items-center gap-3 rounded-card bg-primary px-6 py-4 text-white">
        <ShieldCheck className="h-6 w-6" />
        <span className="font-bold">Trojan — ambiente configurado</span>
      </div>
    </div>
  )
}

export default App
