"use client"

import { Users, Eye, FileText, CheckCircle, ArrowUpRight, Award, Sparkles } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    { label: "ผู้เข้าชมโปรไฟล์", value: "1,248", increase: "+12%", icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "เครือข่ายใหม่", value: "34", increase: "+5%", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "ผลงานทางวิชาการ", value: "15", increase: "+2", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "คำเชิญร่วมงาน", value: "3", increase: "New", icon: CheckCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ]

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

        {/* Right Sidebar Area */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-primary to-violet-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full translate-x-10 -translate-y-10" />
            <Award size={40} className="text-white/80 mb-4" />
            <h3 className="text-xl font-bold mb-2">ยืนยันตัวตนสำเร็จ!</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              โปรไฟล์ของคุณได้รับ Badge "Verified Researcher" แล้ว ทำให้ค้นหาพบง่ายขึ้น 40%
            </p>
            <button className="w-full py-2.5 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-slate-50 transition-colors">
              ดูโปรไฟล์สาธารณะ
            </button>
          </div>

          <div className="glass border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">กิจกรรมล่าสุด</h2>
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6">
              {[
                { title: "ตีพิมพ์บทความ Scopus Q1", time: "2 ชั่วโมงที่แล้ว" },
                { title: "เพิ่มประสบการณ์การเป็นวิทยากร", time: "เมื่อวานนี้" },
                { title: "มีผู้ดาวน์โหลด CV ของคุณ", time: "3 วันที่แล้ว" }
              ].map((activity, i) => (
                <div key={i} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-slate-950" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
