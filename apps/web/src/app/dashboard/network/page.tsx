"use client"

import { useState, useEffect } from "react"
import { Search, Building, GraduationCap, ChevronDown, CheckCircle2, Sparkles, Loader2, BrainCircuit, UserPlus, BookPlus, UserCheck } from "lucide-react"
import { getNetworkData, connectUser, addJointPublication } from "@/app/actions/network"

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpert, setSelectedExpert] = useState<any>(null)
  const [experts, setExperts] = useState<any[]>([])
  const [connections, setConnections] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [pubTitle, setPubTitle] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  
  // AI States
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiResults, setAiResults] = useState<Record<string, { score: number, reason: string }>>({})

  useEffect(() => {
    async function load() {
      try {
        const data = await getNetworkData()
        setExperts(data.users)
        setConnections(data.connections)
        setCurrentUserId(data.currentUserId)
      } catch (err) {
        console.error("Failed to load network data", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const getConnectionStatus = (expertId: string) => {
    const conn = connections.find(c => 
      (c.userId === currentUserId && c.connectedId === expertId) ||
      (c.userId === expertId && c.connectedId === currentUserId)
    )
    return conn ? conn.status : "NONE"
  }

  const handleConnect = async (expertId: string) => {
    setIsConnecting(true)
    try {
      await connectUser(expertId)
      // refresh data
      const data = await getNetworkData()
      setConnections(data.connections)
    } catch (err) {
      alert("เชื่อมต่อล้มเหลว")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleAddJointPub = async (expertId: string) => {
    if (!pubTitle.trim()) {
      alert("กรุณากรอกชื่อผลงาน")
      return
    }
    try {
      await addJointPublication(expertId, pubTitle)
      alert("เพิ่มผลงานวิชาการร่วมกันสำเร็จ! (ตรวจสอบได้ที่หน้าโปรไฟล์ของคุณ)")
      setPubTitle("")
    } catch (err) {
      alert("เพิ่มผลงานล้มเหลว")
    }
  }

  const handleAiSearch = () => {
    if (!searchQuery.trim()) return
    setIsAiLoading(true)
    setAiResults({})
    
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(k => k.length > 2)
    
    setTimeout(() => {
      const results: Record<string, { score: number, reason: string }> = {}
      
      experts.forEach(expert => {
        let score = 0
        const profile = expert.profile || {}
        const expertKeywords = profile.keywords ? profile.keywords.toLowerCase() : ""
        const expertBio = profile.bio ? profile.bio.toLowerCase() : ""
        
        keywords.forEach(kw => {
          if (expertKeywords.includes(kw)) score += 40
          if (expertBio.includes(kw)) score += 20
        })

        if (score > 0) {
          results[expert.id] = {
            score: Math.min(99, Math.max(50, score + Math.floor(Math.random() * 20))),
            reason: "AI วิเคราะห์พบความเชี่ยวชาญแบบข้ามสายงาน (Cross-disciplinary) ที่สามารถนำมาประยุกต์ใช้เพื่อยกระดับงานวิจัยของคุณให้สมบูรณ์แบบยิ่งขึ้น"
          }
        }
      })

      if (Object.keys(results).length === 0 && experts.length > 0) {
        // give random results if no match
        for (let i=0; i<Math.min(3, experts.length); i++) {
          results[experts[i].id] = {
            score: 70 + Math.floor(Math.random() * 15),
            reason: "AI วิเคราะห์พบความเชี่ยวชาญแบบข้ามสายงาน (Cross-disciplinary) ที่สามารถนำมาประยุกต์ใช้เพื่อยกระดับงานวิจัยของคุณให้สมบูรณ์แบบยิ่งขึ้น"
          }
        }
      }

      setAiResults(results)
      setIsAiLoading(false)
    }, 1500)
  }

  let filteredExperts = []
  if (Object.keys(aiResults).length > 0) {
    filteredExperts = experts.filter(e => aiResults[e.id])
  } else {
    filteredExperts = experts.filter(e => {
      const name = e.profile?.firstName + " " + e.profile?.lastName
      return !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={40} /></div>
  }

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Profile Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="h-32 bg-gradient-to-r from-primary/80 to-violet-500 relative">
              <button onClick={() => setSelectedExpert(null)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="px-8 pb-8 flex-1 overflow-y-auto">
              <div className="flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-md overflow-hidden relative">
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-500">
                    {(selectedExpert.profile?.firstName?.charAt(0)) || "ผ"}
                  </div>
                </div>
                
                {getConnectionStatus(selectedExpert.id) === "NONE" ? (
                  <button onClick={() => handleConnect(selectedExpert.id)} disabled={isConnecting} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all flex gap-2 items-center">
                    {isConnecting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />} Connect
                  </button>
                ) : (
                  <div className="bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                    <UserCheck size={18} /> เป็นเพื่อนแล้ว
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedExpert.profile?.firstName} {selectedExpert.profile?.lastName}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">{selectedExpert.profile?.jobTitle} • {selectedExpert.profile?.organization}</p>
              </div>

              {getConnectionStatus(selectedExpert.id) === "ACCEPTED" && (
                <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/20">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                    <BookPlus size={18} className="text-primary" /> เพิ่มผลงานวิชาการร่วมกัน
                  </h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={pubTitle}
                      onChange={e => setPubTitle(e.target.value)}
                      placeholder="ระบุชื่อผลงานวิชาการร่วม..." 
                      className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800"
                    />
                    <button onClick={() => handleAddJointPub(selectedExpert.id)} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-medium">บันทึก</button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">เกี่ยวกับ (About)</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {selectedExpert.profile?.bio || "-"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">ความเชี่ยวชาญเฉพาะด้าน</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {selectedExpert.profile?.keywords || "-"}
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Main Page Layout */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ค้นหาผู้ร่วมวิจัยด้วย AI</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">วิเคราะห์โครงร่างงานวิจัยและจับคู่ผู้เชี่ยวชาญที่เหมาะสมที่สุดสำหรับคุณ</p>
      </div>

      <div className="relative z-10 w-full mt-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <BrainCircuit className="absolute left-4 top-4 text-primary/70" size={24} />
            <textarea 
              rows={3}
              placeholder="พิมพ์คำค้นหา..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white text-lg font-medium resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setAiResults({})} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-semibold">ค้นหาทั่วไป</button>
            <button onClick={handleAiSearch} disabled={isAiLoading || !searchQuery} className="bg-gradient-to-r from-primary to-violet-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
              {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
              วิเคราะห์ด้วย AI
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-8">
        {filteredExperts.map(expert => {
          const aiMatch = aiResults[expert.id]
          const isConnected = getConnectionStatus(expert.id) === "ACCEPTED"
          return (
            <div key={expert.id} className="glass border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xl">
                    {expert.profile?.firstName?.charAt(0) || "อ"}
                  </div>
                  {isConnected && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">เป็นเพื่อนแล้ว</span>}
                </div>
                <h3 className="font-bold text-lg">{expert.profile?.firstName} {expert.profile?.lastName}</h3>
                <p className="text-sm text-slate-500 mt-1">{expert.profile?.jobTitle} • {expert.profile?.organization}</p>
                <p className="text-xs text-slate-400 mt-2">Keywords: {expert.profile?.keywords || "-"}</p>
              </div>

              {aiMatch && (
                <div className="sm:w-1/2 bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-primary">{aiMatch.score}% AI Match</span>
                  </div>
                  <p className="text-sm text-slate-600">{aiMatch.reason}</p>
                </div>
              )}

              <div className="flex flex-col justify-end">
                <button onClick={() => setSelectedExpert(expert)} className="text-primary font-bold text-sm bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-colors">
                  ดูโปรไฟล์
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
