"use client"

import { useState } from "react"
import { BookOpen, Plus, Search, Filter, FileText, CheckCircle2 } from "lucide-react"

export default function PortfolioPage() {
  const [publications] = useState([
    {
      id: 1,
      type: "JOURNAL",
      title: "การพัฒนารูปแบบการเรียนรู้ด้วยปัญญาประดิษฐ์ในห้องเรียนออนไลน์",
      publisher: "Journal of Educational Technology",
      year: "2025",
      isScopus: true,
      isTci: false
    },
    {
      id: 2,
      type: "CONFERENCE",
      title: "Impact of Micro-learning on Student Engagement",
      publisher: "International Conference on EdTech",
      year: "2024",
      isScopus: false,
      isTci: true
    }
  ])

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ผลงานวิชาการ (Portfolio)</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">จัดการบทความวิจัย งานนำเสนอ และผลงานวิชาการอื่นๆ ของคุณ</p>
        </div>
        <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
          <Plus size={18} />
          <span>เพิ่มผลงานใหม่</span>
        </button>
      </div>

      <div className="glass border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อผลงาน, ปี, สำนักพิมพ์..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            />
          </div>
          <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <Filter size={18} />
            <span>ตัวกรอง (Filter)</span>
          </button>
        </div>

        {/* List of Publications */}
        <div className="space-y-4">
          {publications.map((pub) => (
            <div key={pub.id} className="group bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-2xl"></div>
              
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md">
                      {pub.type}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">ปี {pub.year}</span>
                    
                    <div className="flex gap-2 ml-2">
                      {pub.isScopus && (
                        <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 size={12} className="mr-1" /> Scopus
                        </span>
                      )}
                      {pub.isTci && (
                        <span className="flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          <CheckCircle2 size={12} className="mr-1" /> TCI
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2">
                    <BookOpen size={16} /> {pub.publisher}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button className="text-slate-400 hover:text-primary p-2 transition-colors">แก้ไข</button>
                  <button className="text-slate-400 hover:text-red-500 p-2 transition-colors">ลบ</button>
                </div>
              </div>
            </div>
          ))}

          {publications.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">ยังไม่มีข้อมูลผลงาน</h3>
              <p className="text-slate-500 mt-2">เริ่มต้นเพิ่มผลงานวิชาการของคุณเพื่อให้คนในเครือข่ายค้นพบ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
