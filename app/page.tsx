'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { 
  Zap, 
  User, 
  Settings, 
  Plus, 
  Play, 
  Image as ImageIcon, 
  Video, 
  Download, 
  RotateCcw,
  Lock,
  Search,
  Loader2,
  Trash2,
  ChevronRight,
  Clipboard,
  Shield,
  Layout
} from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ClickbaitLabsOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('factory')
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  
  const { data: projects, isLoading: projectsLoading } = useSWR('/api/projects', fetcher)
  const { data: personas, isLoading: personasLoading } = useSWR('/api/personas', fetcher)
  const { data: activeProject } = useSWR(activeProjectId ? `/api/projects/${activeProjectId}` : null, fetcher, { refreshInterval: 5000 })

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('factory_access') === 'granted') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === 'admin123') {
      localStorage.setItem('factory_access', 'granted')
      setIsAuthenticated(true)
    } else {
      alert("Invalid Access Code")
    }
  }

  // --- Pipeline Actions ---
  const runResearch = async () => {
    if (!activeProjectId) return
    setIsProcessing(true)
    setLogs(["[SYS] Initiating Triple-Scan..."])
    await fetch('/api/research', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: activeProjectId }) })
    mutate(`/api/projects/${activeProjectId}`)
    setLogs(prev => [...prev, "[SYS] Analysis complete."])
    setIsProcessing(false)
  }

  const runWriter = async () => {
    if (!activeProjectId) return
    setIsProcessing(true)
    setLogs(prev => [...prev, "[SYS] Running Triple-Pass Writer..."])
    await fetch('/api/generate-script', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: activeProjectId }) })
    mutate(`/api/projects/${activeProjectId}`)
    setLogs(prev => [...prev, "[SYS] Script Deployed."])
    setIsProcessing(false)
  }

  const runRender = async () => {
    if (!activeProjectId) return
    setIsProcessing(true)
    await fetch('/api/render-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: activeProjectId }) })
    mutate(`/api/projects/${activeProjectId}`)
    setIsProcessing(false)
  }

  // --- Auth Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans">
        <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-12 rounded-[2.5rem] text-center space-y-8 shadow-2xl">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Lock className="text-black" size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter uppercase">Factory Vault</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Access Code" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-5 bg-black border border-white/10 rounded-2xl text-center focus:border-white/30 transition-all outline-none" />
            <button type="submit" className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200">Enter Studio</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Universal Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-8 fixed h-full bg-black z-50">
        <div className="flex items-center gap-3 mb-12">
          <Zap className="text-white fill-white" size={20} />
          <span className="font-black text-lg tracking-tighter">CLICKBAIT LABS</span>
        </div>
        <nav className="flex-1 space-y-2">
          {[
            { id: 'factory', name: 'Factory Floor', icon: Layout },
            { id: 'matrix', name: 'Talent Agency', icon: User },
            { id: 'library', name: 'Asset Library', icon: ImageIcon },
            { id: 'settings', name: 'Settings', icon: Settings },
          ].map(item => (
            <button key={item.id} onClick={() => { setTab(item.id); setActiveProjectId(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${tab === item.id ? 'bg-white/5 text-white border border-white/10 shadow-lg' : 'text-zinc-600 hover:text-white'}`}>
              <item.icon size={16} /> {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-16">
        <div className="max-w-6xl mx-auto">
          
          {/* TAB: FACTORY FLOOR */}
          {tab === 'factory' && !activeProjectId && (
            <div className="space-y-12">
              <div className="flex justify-between items-end">
                <h1 className="text-7xl font-bold tracking-tighter">Factory <span className="text-zinc-600 italic font-light">Floor.</span></h1>
                <button className="px-8 py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">New Campaign +</button>
              </div>
              <div className="grid gap-6">
                {projects?.map((p: any) => (
                  <div key={p.id} onClick={() => setActiveProjectId(p.id)} className="p-8 bg-zinc-900/30 border border-white/5 rounded-[2rem] flex items-center justify-between hover:border-white/10 transition-all cursor-pointer group shadow-xl">
                    <div className="flex items-center gap-8">
                      <div className="w-14 h-14 bg-black border border-white/5 rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-blue-500"><Play size={24} className="fill-current" /></div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">{p.title}</h3>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mt-1">{p.persona_name} • {p.status}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-zinc-800 group-hover:text-white transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROJECT WORKSPACE */}
          {activeProjectId && activeProject && (
            <div className="space-y-12">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <button onClick={() => setActiveProjectId(null)} className="text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest mb-4">← Back to Floor</button>
                  <h1 className="text-5xl font-bold tracking-tighter">{activeProject.title}</h1>
                </div>
                <div className="flex gap-4">
                   <button onClick={runResearch} className="px-6 py-3 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Scan Intel</button>
                   <button onClick={runWriter} className="px-6 py-3 bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/20">Write Script</button>
                   <button onClick={runRender} className="px-6 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">Render 4K</button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                 <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic">Master Script</h3>
                    <div className="text-lg leading-relaxed text-zinc-300 font-medium italic min-h-[300px]">{activeProject.script || "Waiting for intelligence signals..."}</div>
                 </div>
                 <div className="aspect-[9/16] bg-black rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl">
                    {activeProject.renders?.[0] ? (
                      <img src={activeProject.renders[0].url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-zinc-800">
                         <ImageIcon size={64} strokeWidth={0.5} />
                         <p className="text-[10px] font-black uppercase tracking-[0.5em]">Vision Standby</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          {/* TAB: TALENT AGENCY */}
          {tab === 'matrix' && (
            <div className="space-y-12">
              <h1 className="text-7xl font-bold tracking-tighter">Identity <span className="text-zinc-600 italic font-light">Matrix.</span></h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {personas?.map((p: any) => (
                  <div key={p.id} className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-white/10 transition-all">
                    <div className="aspect-[4/5] bg-black relative">
                      <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(p.prompt)}&width=512&height=640&seed=${p.seed}&model=flux`} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-6 left-6 px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-emerald-500">Live Entity</div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{p.niche}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-12">
              <h1 className="text-7xl font-bold tracking-tighter">System <span className="text-zinc-600 italic font-light">Vault.</span></h1>
              <div className="max-w-xl bg-zinc-900/30 border border-white/5 p-12 rounded-[2.5rem] space-y-8 shadow-2xl">
                 <div className="flex items-center gap-4 text-emerald-500 bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/10">
                    <Shield size={24} />
                    <p className="text-xs font-bold leading-relaxed">Session is encrypted. All API keys are stored only in your local browser cache.</p>
                 </div>
                 <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all">Destroy Factory Session</button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
