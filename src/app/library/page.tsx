'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Search, 
  Filter, 
  Video, 
  Image as ImageIcon, 
  ArrowUpRight,
  MoreVertical,
  Play,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function GlobalLibrary() {
  const { data: assets, isLoading } = useSWR('/api/library', fetcher)
  const [filter, setFilter] = useState('all') // all | image | video
  const [search, setSearch] = useState('')

  const filteredAssets = assets?.filter((a: any) => {
    const matchesFilter = filter === 'all' || a.type === filter
    const matchesSearch = a.persona_name?.toLowerCase().includes(search.toLowerCase()) || 
                          a.project_title?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
                  Media Archives
                </span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Global <span className="text-zinc-500 italic font-light">Library.</span>
              </h1>
            </div>

            <div className="flex gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                    placeholder="Search by Persona or Project..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-12 pr-6 py-4 bg-zinc-900 border border-white/5 rounded-xl text-xs font-medium focus:border-white/20 transition-all w-80"
                  />
               </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
             <div className="flex gap-8">
                {['all', 'image', 'video'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`text-xs font-black uppercase tracking-widest transition-all ${filter === t ? 'text-white border-b-2 border-white pb-6 -mb-[26px]' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    {t === 'all' ? 'All Assets' : t === 'image' ? 'Portraits' : 'Motion Renders'}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-4">
                <LayoutGrid size={16} className="text-white" />
                <ListIcon size={16} className="text-zinc-700" />
             </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
               {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[9/16] bg-zinc-900/50 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredAssets?.map((asset: any) => (
                <motion.div 
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="aspect-[9/16] bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden relative group shadow-2xl"
                >
                   {asset.type === 'image' ? (
                     <img src={asset.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   ) : (
                     <div className="w-full h-full bg-black flex items-center justify-center">
                        <Video size={48} className="text-zinc-800" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Play size={48} fill="white" className="text-white" />
                        </div>
                     </div>
                   )}

                   {/* Overlay Info */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{asset.persona_name}</p>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{asset.project_title}</h4>
                         </div>
                         <div className="flex gap-2">
                            <a 
                              href={asset.url} 
                              download 
                              className="flex-1 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                            >
                               <Download size={14} /> Download
                            </a>
                            <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all">
                               <ArrowUpRight size={14} />
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Badges */}
                   <div className="absolute top-6 left-6 flex gap-2">
                      <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md text-[8px] font-black uppercase tracking-widest text-white/60">
                         {asset.type === 'image' ? '4K Portrait' : 'HD Motion'}
                      </span>
                   </div>
                </motion.div>
              ))}
            </div>
          )}

          {(!filteredAssets || filteredAssets.length === 0) && !isLoading && (
            <div className="py-40 text-center space-y-6 opacity-30">
               <ImageIcon size={64} strokeWidth={1} className="mx-auto" />
               <p className="text-xs font-bold uppercase tracking-widest">No assets found. Start a campaign to fill the library.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
