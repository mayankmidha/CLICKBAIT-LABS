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
  MoreVertical,
  Zap,
  Loader2,
  Calendar,
  LayoutGrid,
  Filter
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
      const res = await fetch('/api/projects', {
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
          
          {/* Header */}
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Global Factory Floor
                </span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Active <span className="text-zinc-500 italic font-light">Projects.</span>
              </h1>
            </div>

            <button 
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
            >
              Start New Campaign <Plus size={16} />
            </button>
          </div>

          {/* Filters & Tabs */}
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
             <div className="flex gap-8">
                {['All Projects', 'In Production', 'Completed', 'Archived'].map((tab, i) => (
                  <button key={tab} className={`text-xs font-bold uppercase tracking-widest ${i === 0 ? 'text-white border-b border-white pb-6 -mb-6' : 'text-zinc-600 hover:text-zinc-400 transition-colors'}`}>
                    {tab}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-zinc-400">
                   <Filter size={12} /> Filter by Persona
                </div>
                <div className="w-px h-4 bg-white/10" />
                <LayoutGrid size={16} className="text-white" />
             </div>
          </div>

          {/* Project List */}
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
                  <motion.div 
                    whileHover={{ scale: 1.005, borderColor: 'rgba(255,255,255,0.1)' }}
                    className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 flex items-center justify-between group transition-all cursor-pointer shadow-2xl"
                  >
                    <div className="flex items-center gap-8 flex-1">
                       <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-blue-500 transition-colors">
                          <Play size={24} className="fill-current" />
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

                    <div className="flex items-center gap-12">
                       <div className="hidden xl:block w-64">
                          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-700 mb-2">
                             <span>Pipeline Progress</span>
                             <span>{project.status === 'DRAFT' ? '10%' : project.status === 'RENDERED' ? '100%' : '50%'}</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-blue-500 transition-all duration-1000" 
                                style={{ width: project.status === 'DRAFT' ? '10%' : project.status === 'RENDERED' ? '100%' : '50%' }}
                             />
                          </div>
                       </div>
                       <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-white group-hover:border-white/20 transition-all">
                          <ChevronRight size={20} />
                       </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* New Project Modal */}
      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[2.5rem] p-12 space-y-8 shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                    <Zap size={24} />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">New Campaign</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Project Title</label>
                    <input 
                      placeholder="e.g. NVIDIA God Mode"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-medium focus:border-white/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Influencer Persona</label>
                    <select 
                      value={selectedPersona}
                      onChange={e => setSelectedPersona(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-bold appearance-none hover:border-white/20 transition-all"
                    >
                      <option value="">Select Talent...</option>
                      {personas?.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.niche})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Core Topic / Angle</label>
                    <textarea 
                      placeholder="What is the controversial hook?"
                      value={newTopic}
                      onChange={e => setNewTopic(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-medium focus:border-white/20 transition-all h-24 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleCreateProject}
                    disabled={isCreating}
                    className="flex-1 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl disabled:opacity-50"
                  >
                    {isCreating ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Initialize Production"}
                  </button>
                  <button 
                    onClick={() => setShowNewModal(false)}
                    className="px-8 py-4 bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
