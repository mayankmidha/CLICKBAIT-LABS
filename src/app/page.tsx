'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Pipeline } from '@/components/Pipeline'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Play, 
  Clock, 
  ChevronRight, 
  Zap,
  Loader2,
  Calendar,
  Layout,
  Search
} from 'lucide-react'
import useSWR, { mutate } from 'swr'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Dashboard() {
  const { data: projects, isLoading } = useSWR('/api/projects', fetcher)
  const { data: personas } = useSWR('/api/personas', fetcher)
  
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTopic, setNewTopic] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('')
  const [isCreating, setIsBuilding] = useState(false)

  async function handleCreateProject() {
    if (!newTitle || !selectedPersona) return
    setIsBuilding(true)
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          topic: newTopic,
          persona_id: parseInt(selectedPersona)
        })
      })
      mutate('/api/projects')
      setShowNewModal(false)
      setNewTitle('')
      setNewTopic('')
    } catch (e) {
      console.error(e)
    } finally {
      setIsBuilding(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Active <span className="text-zinc-500 italic font-light">Projects.</span>
              </h1>
            </div>

            <button 
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
            >
              New Campaign <Plus size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {projects?.map((project: any) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group transition-all cursor-pointer shadow-2xl">
                    <div className="flex items-center gap-8 flex-1">
                       <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-zinc-700">
                          <Play size={24} />
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-3">
                             <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
                             <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-zinc-500 text-[8px] font-black uppercase tracking-widest rounded-md">
                                {project.persona_name}
                             </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-zinc-600">
                             <div className="flex items-center gap-1.5"><Clock size={12} /> {new Date(project.created_at).toLocaleDateString()}</div>
                             <div className="flex items-center gap-1.5"><Zap size={12} className="text-amber-500" /> {project.status}</div>
                          </div>
                       </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-white transition-all">
                       <ChevronRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>

      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[2.5rem] p-12 space-y-8 shadow-2xl">
                <h2 className="text-3xl font-bold tracking-tight">New Campaign</h2>
                <div className="space-y-6">
                  <input placeholder="Project Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-black border border-white/5 rounded-xl p-4 text-white" />
                  <select 
                    value={selectedPersona}
                    onChange={e => setSelectedPersona(e.target.value)}
                    className="w-full bg-black border border-white/5 rounded-xl p-4 text-white"
                  >
                    <option value="">Select Talent...</option>
                    {personas?.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <textarea placeholder="Topic" value={newTopic} onChange={e => setNewTopic(e.target.value)} className="w-full bg-black border border-white/5 rounded-xl p-4 text-white h-24" />
                </div>
                <div className="flex gap-4">
                  <button onClick={handleCreateProject} className="flex-1 py-4 bg-white text-black rounded-xl font-bold">Initialize</button>
                  <button onClick={() => setShowNewModal(false)} className="px-8 py-4 bg-zinc-800 text-white rounded-xl">Cancel</button>
                </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
