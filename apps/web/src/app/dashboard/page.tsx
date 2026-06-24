"use client"

import { useState, useEffect } from "react"
import { Users, Eye, FileText, CheckCircle, ArrowUpRight, Award, Sparkles, Loader2, Check, X, Mail } from "lucide-react"
import { getReceivedInvites } from "@/app/actions/collaboration"
import { useSession } from "next-auth/react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [invites, setInvites] = useState<any[]>([])
  const [isLoadingInvites, setIsLoadingInvites] = useState(true)

  useEffect(() => {
    const loadInvites = async () => {
      if (session?.user && (session.user as any).id) {
        const res = await getReceivedInvites((session.user as any).id)
        if (res.success && res.invites) {
          setInvites(res.invites)
        }
      }
      setIsLoadingInvites(false)
    }
    loadInvites()
  }, [session])

  const stats = [
    { label: "ผู้เข้าชมโปรไฟล์", value: "1,248", increase: "+12%", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "เครือข่ายใหม่", value: "34", increase: "+5%", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "ผลงานทางวิชาการ", value: "15", increase: "+2", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "คำเชิญร่วมงาน", value: invites.length.toString(), increase: invites.length > 0 ? "New" : "0", icon: CheckCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ]

  // ... (keeping the rest of the code the same until right sidebar)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ภาพรวมบัญชีของคุณ</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">อัปเดตความเคลื่อนไหวทางวิชาการและเครือข่ายล่าสุดของคุณ</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
          <Sparkles size={18} />
          <span>ให้ AI วิเคราะห์โปรไฟล์</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
                {stat.increase} <ArrowUpRight size={14} className="ml-1" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart / AI Recommendations Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI แนะนำผู้เชี่ยวชาญที่คุณอาจสนใจ</h2>
              <button className="text-primary text-sm font-semibold hover:underline">ดูทั้งหมด</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    ศ
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">ศ.ดร. นพดล นักวิจัย</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">เชี่ยวชาญด้าน AI in Education (ตรงกับความสนใจของคุณ 98%)</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
                    เชื่อมต่อ
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Area - Invitations */}
        <div className="space-y-8">
          <div className="glass border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="text-primary" /> คำเชิญร่วมงาน
              {invites.filter(i => i.status === "PENDING").length > 0 && (
                <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {invites.filter(i => i.status === "PENDING").length}
                </span>
              )}
            </h2>

            {isLoadingInvites ? (
              <div className="py-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : invites.length === 0 ? (
              <div className="py-8 text-center text-slate-500">ยังไม่มีคำเชิญใหม่</div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {invites.map((invite) => (
                  <div key={invite.id} className={`p-4 rounded-xl border ${invite.status === "PENDING" ? "bg-white dark:bg-slate-800 border-primary/30 shadow-sm" : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {invite.sender.profile?.firstName?.charAt(0) || "อ"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {invite.sender.profile?.firstName} {invite.sender.profile?.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {invite.type === "EVALUATE" ? "ขอให้ประเมินเครื่องมือ (IOC)" : invite.type === "RESEARCH" ? "เชิญร่วมทำวิจัย" : invite.type === "SPEAKER" ? "เชิญเป็นวิทยากร" : "อื่นๆ"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(invite.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    
                    {invite.message && (
                      <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-400 mb-3 whitespace-pre-wrap">
                        {invite.message}
                      </div>
                    )}

                    {invite.status === "PENDING" ? (
                      <div className="flex gap-2 mt-2">
                        <button 
                          onClick={async () => {
                            const { respondToInvite } = await import('@/app/actions/collaboration')
                            await respondToInvite(invite.id, "ACCEPTED")
                            setInvites(invites.map(i => i.id === invite.id ? { ...i, status: "ACCEPTED" } : i))
                          }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Check size={16} /> ตอบรับ
                        </button>
                        <button 
                          onClick={async () => {
                            const { respondToInvite } = await import('@/app/actions/collaboration')
                            await respondToInvite(invite.id, "DECLINED")
                            setInvites(invites.map(i => i.id === invite.id ? { ...i, status: "DECLINED" } : i))
                          }}
                          className="flex-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-1.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <X size={16} /> ปฏิเสธ
                        </button>
                      </div>
                    ) : (
                      <div className={`text-center text-sm font-semibold py-1.5 rounded-lg ${invite.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                        {invite.status === "ACCEPTED" ? "ตอบรับแล้ว" : "ปฏิเสธแล้ว"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
