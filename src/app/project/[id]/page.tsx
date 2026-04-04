'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Pipeline } from '@/components/Pipeline'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Zap, 
  Brain, 
  Eye, 
  Video, 
  ChevronRight, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  ArrowLeft,
  Search,
  Send,
  Download,
  RotateCcw,
  Sparkles,
  Clipboard
} from 'lucide-react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProjectWorkspace() {
  const { id } = useParams()
  const router = useRouter()
  
  // SWR with auto-refresh every 5 seconds to track render progress
  const { data: project, isLoading } = useSWR(`/api/projects/${id}`, fetcher, {
    refreshInterval: 5000 
  })
  
  const [activeTab, setActiveTab] = useState('intelligence')
  const [isProcessing, setIsProcessing] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  async function runResearch() {
    setIsProcessing(true)
    setLogs(["[SYS] Initiating Deep Web Triple-Scan..."])
    try {
      await fetch(`/api/research`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(id as string) })
      })
      mutate(`/api/projects/${id}`)
      setLogs(prev => [...prev, "[SYS] Research synthesized. Signals extracted."])
    } catch (e) {
      setLogs(prev => [...prev, "[ERR] Intelligence Link failed."])
    } finally {
      setIsProcessing(false)
    }
  }

  async function runWriter() {
    setIsProcessing(true)
    setLogs(prev => [...prev, "[SYS] Engaging Triple-Pass Scriptwriter..."])
    try {
      await fetch(`/api/generate-script`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(id as string) })
      })
      mutate(`/api/projects/${id}`)
      setLogs(prev => [...prev, "[SYS] Script deployed to production buffer."])
    } catch (e) {
      setLogs(prev => [...prev, "[ERR] Cognitive bypass failed."])
    } finally {
      setIsProcessing(false)
    }
  }

  async function runRender() {
    setIsProcessing(true)
    try {
      const res = await fetch(`/api/render-image`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(id as string) })
      })
      mutate(`/api/projects/${id}`)
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  async function runVideoRender() {
    setIsProcessing(true)
    try {
      const res = await fetch(`/api/render-video`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: parseInt(id as string) })
      })
      mutate(`/api/projects/${id}`)
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <button onClick={() => router.push('/')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                <ArrowLeft size={14} /> Back to Factory
              </button>
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-bold tracking-tighter">{project.title}</h1>
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {project.persona_name}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
               <button className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
                  Archive Project
               </button>
               <button className="px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-white/5">
                  Export Bundle
               </button>
            </div>
          </div>

          <Pipeline currentStatus={project.status} />

          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Steps Sidebar */}
            <div className="lg:col-span-3 space-y-2">
               {[
                 { id: 'intelligence', name: 'Intelligence', icon: Zap, status: project.research_content ? 'Complete' : 'Pending' },
                 { id: 'script', name: 'Master Script', icon: Brain, status: project.script ? 'Complete' : 'Pending' },
                 { id: 'vision', name: 'Identity Vision', icon: Eye, status: project.renders?.some((r:any) => r.type === 'image') ? 'Complete' : 'Pending' },
                 { id: 'motion', name: 'Motion Render', icon: Video, status: project.renders?.some((r:any) => r.type === 'video' && r.status === 'READY') ? 'Complete' : project.renders?.some((r:any) => r.type === 'video') ? 'Processing' : 'Pending' },
               ].map((step) => (
                 <button 
                  key={step.id}
                  onClick={() => setActiveTab(step.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${activeTab === step.id ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                 >
                    <div className="flex items-center gap-3">
                       <step.icon size={18} />
                       <span className="text-xs font-bold uppercase tracking-widest">{step.name}</span>
                    </div>
                    <span className={`text-[8px] font-black uppercase ${step.status === 'Complete' ? 'text-emerald-500' : step.status === 'Processing' ? 'text-blue-500 animate-pulse' : 'text-zinc-800'}`}>
                       {step.status}
                    </span>
                 </button>
               ))}
            </div>

            {/* Main Workspace Area */}
            <div className="lg:col-span-9">
               <AnimatePresence mode="wait">
                  {activeTab === 'intelligence' && (
                    <motion.div 
                      key="intel"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                       <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8">
                          <div className="flex justify-between items-center">
                             <div className="space-y-1">
                                <h3 className="text-2xl font-bold tracking-tight">Project Intelligence</h3>
                                <p className="text-zinc-500 text-xs font-medium">Topic: {project.topic}</p>
                             </div>
                             <button 
                              onClick={runResearch}
                              disabled={isProcessing}
                              className="px-6 py-3 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                             >
                                {isProcessing ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />}
                                {project.research_content ? 'Refresh Scan' : 'Run Triple-Scan'}
                             </button>
                          </div>

                          {project.research_content ? (
                            <div className="bg-black/50 border border-white/10 rounded-2xl p-8 text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap font-medium font-display italic">
                               {project.research_content}
                            </div>
                          ) : (
                            <div className="py-20 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4 text-zinc-700">
                               <Zap size={48} strokeWidth={1} />
                               <p className="text-xs font-bold uppercase tracking-widest text-center max-w-xs">Scan the web for viral signals to build your script foundation.</p>
                            </div>
                          )}
                       </div>

                       <div className="bg-black border border-white/5 rounded-3xl p-8">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
                             <div className="w-1 h-1 rounded-full bg-blue-500" /> Neural Logs
                          </h4>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-4">
                             {logs.map((log, i) => (
                               <div key={i} className="text-[10px] font-mono text-emerald-500/80 leading-relaxed">
                                  {`> ${log}`}
                               </div>
                             ))}
                             {logs.length === 0 && <p className="text-[10px] font-mono text-zinc-800 italic">Waiting for command...</p>}
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'script' && (
                    <motion.div 
                      key="script"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                       <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8 relative overflow-hidden">
                          <div className="flex justify-between items-center relative z-10">
                             <h3 className="text-2xl font-bold tracking-tight italic">Master Script</h3>
                             <div className="flex gap-3">
                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all"><Clipboard size={16} /></button>
                                <button 
                                  onClick={runWriter}
                                  disabled={isProcessing || !project.research_content}
                                  className="px-6 py-3 bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-400 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-20"
                                >
                                   {isProcessing ? <Loader2 className="animate-spin" size={14} /> : <Brain size={14} />}
                                   Generate Script
                                </button>
                             </div>
                          </div>

                          {project.script ? (
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-10 text-xl leading-relaxed text-zinc-300 font-medium italic">
                               {project.script}
                            </div>
                          ) : (
                            <div className="py-20 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4 text-zinc-700 text-center">
                               <Brain size={48} strokeWidth={1} />
                               <p className="text-xs font-bold uppercase tracking-widest max-w-xs">Run Intelligence first, then generate your viral narrative.</p>
                            </div>
                          )}
                          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'vision' && (
                    <motion.div 
                      key="vision"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid lg:grid-cols-5 gap-8"
                    >
                       <div className="lg:col-span-3 space-y-8">
                          <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8 backdrop-blur-xl">
                             <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold tracking-tight">Identity Studio</h3>
                                <button 
                                  onClick={runRender}
                                  disabled={isProcessing || !project.script}
                                  className="px-6 py-3 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-20"
                                >
                                   {isProcessing ? <Loader2 className="animate-spin" size={14} /> : <Eye size={14} />}
                                   Render Portrait
                                </button>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-4">
                                {project.renders?.filter((r:any) => r.type === 'image').map((render: any) => (
                                  <div key={render.id} className="aspect-[9/16] rounded-2xl bg-black overflow-hidden border border-white/5 group relative">
                                     <img src={render.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <a href={render.url} download className="p-3 bg-white text-black rounded-full hover:scale-110 transition-all shadow-2xl"><Download size={18} /></a>
                                     </div>
                                  </div>
                                ))}
                                {!project.renders?.some((r:any) => r.type === 'image') && (
                                  <div className="col-span-2 py-32 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4 text-zinc-700">
                                     <Eye size={48} strokeWidth={1} />
                                     <p className="text-xs font-bold uppercase tracking-widest">Generate the face of your influencer.</p>
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>

                       <div className="lg:col-span-2 space-y-8">
                          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 space-y-6">
                             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Visual DNA Shell</h4>
                             <div className="p-6 bg-black/50 border border-white/5 rounded-2xl space-y-4">
                                <div className="space-y-1">
                                   <p className="text-[8px] font-black text-zinc-700 uppercase">Persona</p>
                                   <p className="text-xs font-bold text-white">{project.persona_name}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[8px] font-black text-zinc-700 uppercase">Lock Seed</p>
                                   <p className="text-xs font-mono text-amber-500">{project.persona_seed}</p>
                                </div>
                                <p className="text-[10px] text-zinc-500 font-medium italic">
                                   "{project.persona_prompt}"
                                </p>
                             </div>
                             <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl border border-white/10">
                                <CheckCircle2 size={14} className="text-emerald-500" />
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Ultra-Realism Active</span>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'motion' && (
                    <motion.div 
                      key="motion"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                       <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8">
                          <div className="flex justify-between items-center text-white">
                             <div className="space-y-1">
                                <h3 className="text-2xl font-bold tracking-tight">Vocal & Motion Synthesis</h3>
                                <p className="text-zinc-500 text-xs font-medium italic">Kling 1.5 Pro High-Fidelity Engine</p>
                             </div>
                             <button 
                              onClick={runVideoRender}
                              disabled={isProcessing || !project.renders?.some((r:any) => r.type === 'image')}
                              className="px-8 py-4 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center gap-3 shadow-xl shadow-emerald-500/20 disabled:opacity-20"
                             >
                                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Video size={16} />}
                                COMMENCE MOTION RENDER
                             </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                             {project.renders?.filter((r:any) => r.type === 'video').map((render: any) => (
                               <div key={render.id} className="aspect-[9/16] rounded-3xl bg-black border border-white/5 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                                  {render.status === 'PROCESSING' ? (
                                    <div className="text-center space-y-4">
                                       <Loader2 className="animate-spin mx-auto text-emerald-500" size={32} />
                                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Animating Identity...</p>
                                       <p className="text-[8px] text-zinc-800">Est. 1-3 minutes</p>
                                    </div>
                                  ) : render.status === 'FAILED' ? (
                                    <div className="text-center space-y-2 text-red-500">
                                       <AlertCircle size={32} className="mx-auto" />
                                       <p className="text-[10px] font-black uppercase tracking-widest">Render Failed</p>
                                    </div>
                                  ) : (
                                    <>
                                      <video src={render.url} controls className="w-full h-full object-cover" />
                                      <a href={render.url} download className="absolute top-6 right-6 p-3 bg-white text-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-2xl">
                                         <Download size={18} />
                                      </a>
                                    </>
                                  )}
                               </div>
                             ))}
                             {!project.renders?.some((r:any) => r.type === 'video') && (
                               <div className="col-span-2 py-32 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4 text-zinc-700">
                                  <Video size={48} strokeWidth={1} />
                                  <p className="text-xs font-bold uppercase tracking-widest">Render a Portrait first to unlock Motion.</p>
                               </div>
                             )}
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
