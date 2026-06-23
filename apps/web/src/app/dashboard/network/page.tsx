"use client"

import { useState } from "react"
import { Search, Building, GraduationCap, ChevronDown, CheckCircle2, Sparkles, Loader2, BrainCircuit } from "lucide-react"
import mockExpertsData from "@/data/mockExperts.json"

export default function NetworkPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpert, setSelectedExpert] = useState<typeof mockExpertsData[0] | null>(null)
  
  // AI States
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiResults, setAiResults] = useState<Record<number, { score: number, reason: string }>>({})

  const handleAiSearch = () => {
    if (!searchQuery.trim()) return
    setIsAiLoading(true)
    setAiResults({})
    
    // Simple Keyword Tokenizer
    const keywords = searchQuery.toLowerCase().split(/\s+/).filter(k => k.length > 2)
    
    setTimeout(() => {
      const results: Record<number, { score: number, reason: string }> = {}
      
      mockExpertsData.forEach(expert => {
        let score = 0
        let matchedKeywords: string[] = []
        
        keywords.forEach(kw => {
          if (expert.expertise.some(skill => skill.toLowerCase().includes(kw))) {
            score += 40
            matchedKeywords.push(kw)
          }
          if (expert.bio.toLowerCase().includes(kw)) {
            score += 20
            if (!matchedKeywords.includes(kw)) matchedKeywords.push(kw)
          }
          if (expert.institution.toLowerCase().includes(kw) || expert.role.toLowerCase().includes(kw) || expert.name.toLowerCase().includes(kw)) {
            score += 10
          }
        })

        if (score > 0) {
          // Generate a contextual reason
          const matchContext = matchedKeywords.length > 0 
            ? `มีความเชี่ยวชาญ/เนื้อหาตรงกับคีย์เวิร์ด: "${matchedKeywords.join(', ')}"`
            : "ประวัติการทำงานสอดคล้องกับขอบเขตงานวิจัยของคุณ"
          
          results[expert.id] = {
            score: Math.min(99, Math.max(50, score + Math.floor(Math.random() * 20))), // Scale to look like a %
            reason: `AI แนะนำท่านนี้เนื่องจาก ${matchContext} มีศักยภาพสูงในการต่อยอดงานวิจัยร่วมกัน`
          }
        }
      })

      // If no exact match, grab some random high-profile experts
      if (Object.keys(results).length === 0) {
        for (let i=0; i<3; i++) {
          const randExp = mockExpertsData[Math.floor(Math.random() * mockExpertsData.length)]
          results[randExp.id] = {
            score: 70 + Math.floor(Math.random() * 15),
            reason: "AI วิเคราะห์พบความเชี่ยวชาญแบบข้ามสายงาน (Cross-disciplinary) ที่สามารถนำมาประยุกต์ใช้เพื่อยกระดับงานวิจัยของคุณให้สมบูรณ์แบบยิ่งขึ้น"
          }
        }
      }

      setAiResults(results)
      setIsAiLoading(false)
    }, 1800)
  }

  const handleNormalSearch = () => {
    setAiResults({})
  }

  // Handle Filtering & Sorting
  let filteredExperts = []
  
  if (Object.keys(aiResults).length > 0) {
    filteredExperts = mockExpertsData
      .filter(e => aiResults[e.id])
      .sort((a, b) => aiResults[b.id].score - aiResults[a.id].score)
      .slice(0, 15) // Top 15 AI Matches
  } else {
    filteredExperts = mockExpertsData
      .filter(expert => 
        !searchQuery || 
        expert.name.includes(searchQuery) || 
        expert.institution.includes(searchQuery) ||
        expert.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(0, 30) // Limit normal search to 30 to prevent UI lag
  }

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Profile Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header Cover */}
            <div className="h-32 bg-gradient-to-r from-primary/80 to-violet-500 relative">
              <button onClick={() => setSelectedExpert(null)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="px-8 pb-8 flex-1 overflow-y-auto">
              <div className="flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-md overflow-hidden relative">
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-500">
                    {selectedExpert.name.charAt(selectedExpert.name.indexOf(" ") + 1) || "ผ"}
                  </div>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all">
                  เชื่อมต่อ (Connect)
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedExpert.name}</h2>
                  {selectedExpert.isVerified && <CheckCircle2 size={20} className="text-emerald-500 fill-emerald-100" />}
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">{selectedExpert.role} • {selectedExpert.institution}</p>
                <p className="text-sm text-slate-500 mt-1">{selectedExpert.connections} การเชื่อมต่อร่วมกัน</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">เกี่ยวกับ (About)</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {selectedExpert.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">ความเชี่ยวชาญเฉพาะด้าน</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExpert.expertise.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ค้นหาผู้ร่วมวิจัยด้วย AI</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">วิเคราะห์โครงร่างงานวิจัยและจับคู่ผู้เชี่ยวชาญที่เหมาะสมที่สุดสำหรับคุณ</p>
        </div>
      </div>

      {/* AI Search Header */}
      <div className="relative z-10 w-full mt-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="relative flex-1">
            <BrainCircuit className="absolute left-4 top-4 text-primary/70" size={24} />
            <textarea 
              rows={3}
              placeholder="พิมพ์ชื่อหรือรายละเอียดงานวิจัยที่คุณกำลังทำอยู่ เพื่อให้ AI ช่วยค้นหาผู้เชี่ยวชาญที่เหมาะสมที่สุด..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white text-lg font-medium shadow-sm transition-all placeholder:text-slate-400 resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={handleNormalSearch}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors"
            >
              ค้นหาทั่วไป
            </button>
            <button 
              onClick={handleAiSearch}
              disabled={isAiLoading || !searchQuery}
              className="bg-gradient-to-r from-primary to-violet-600 hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Sparkles size={20} />
              )}
              {isAiLoading ? "กำลังวิเคราะห์..." : "วิเคราะห์ด้วย AI"}
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        {!isAiLoading && Object.keys(aiResults).length === 0 && (
          <div className="flex flex-wrap gap-3 mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
            <span className="text-sm font-medium text-slate-500 py-2">หัวข้อยอดนิยม:</span>
            {["AI in Education", "Data Science", "EdTech", "สถาบันอุดมศึกษา", "นักวิจัยทุน"].map((tag) => (
              <button key={tag} onClick={() => setSearchQuery(tag)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {isAiLoading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <BrainCircuit size={32} className="text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI กำลังวิเคราะห์งานวิจัยของคุณ</h3>
          <p className="text-slate-500">กำลังจับคู่ทักษะและความเชี่ยวชาญจากฐานข้อมูลนักวิจัยกว่า 10,000 ท่าน...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          
          {/* Advanced Filters Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">ตัวกรองการค้นหา</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ตำแหน่งงาน</label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 text-sm focus:outline-none">
                      <option>ทั้งหมด</option>
                      <option>อาจารย์</option>
                      <option>นักวิจัย</option>
                      <option>ผู้บริหาร</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ความเชี่ยวชาญเฉพาะด้าน</label>
                  <div className="space-y-2 mt-2">
                    {["นวัตกรรมการศึกษา", "การวัดและประเมินผล", "จิตวิทยาการศึกษา", "เทคโนโลยีทางการศึกษา"].map((item) => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-700 rounded-md group-hover:border-primary transition-colors flex items-center justify-center"></div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-500">
                {Object.keys(aiResults).length > 0 
                  ? `AI แนะนำ ${filteredExperts.length} โปรไฟล์ที่เหมาะสม`
                  : `พบ ${filteredExperts.length} โปรไฟล์`
                }
              </span>
              <select className="bg-transparent text-sm font-medium text-slate-600 dark:text-slate-400 focus:outline-none cursor-pointer">
                {Object.keys(aiResults).length > 0 ? (
                  <option>เรียงตามเปอร์เซ็นต์ Match</option>
                ) : (
                  <>
                    <option>เรียงตามความเกี่ยวข้อง</option>
                    <option>เพิ่มล่าสุด</option>
                    <option>เครือข่ายที่มีร่วมกัน</option>
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredExperts.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                  ไม่พบข้อมูลที่ตรงกับการค้นหา
                </div>
              )}
              {filteredExperts.map((expert) => {
                const aiMatch = aiResults[expert.id];
                
                return (
                  <div key={expert.id} className={`glass border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group ${aiMatch ? 'border-primary/40 dark:border-primary/30 bg-primary/[0.02]' : 'border-slate-200/50 dark:border-slate-800/50'}`}>
                    <div className="flex flex-col sm:flex-row gap-6">
                      
                      {/* Avatar & Basic Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center text-white font-bold text-xl shadow-md">
                            {expert.name.charAt(expert.name.indexOf(" ") + 1) || "ผ"}
                          </div>
                          {expert.isVerified && (
                            <span className="text-emerald-500" title="Verified Profile">
                              <CheckCircle2 size={24} className="fill-emerald-100" />
                            </span>
                          )}
                        </div>
                        
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{expert.name}</h3>
                        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                          <GraduationCap size={14} /> {expert.role}
                        </p>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                          <Building size={14} /> {expert.institution}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {expert.expertise.slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AI Match Context */}
                      {aiMatch && (
                        <div className="sm:w-1/2 bg-white dark:bg-slate-900 rounded-xl p-4 border border-primary/20 flex flex-col justify-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                              {aiMatch.score}%
                            </div>
                            <span className="font-bold text-sm text-slate-800 dark:text-white">AI Match</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            <span className="font-semibold text-primary">เหตุผลที่แนะนำ:</span> {aiMatch.reason}
                          </p>
                        </div>
                      )}

                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/50 mt-5 pt-4 flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-medium">{expert.connections} การเชื่อมต่อร่วมกัน</span>
                      <button onClick={() => setSelectedExpert(expert)} className="text-primary text-sm font-bold hover:text-primary/80 transition-colors">
                        ดูโปรไฟล์
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
