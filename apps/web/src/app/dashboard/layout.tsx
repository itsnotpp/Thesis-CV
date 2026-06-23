"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, UserCircle, BookOpen, Users, Settings, LogOut, GraduationCap, Menu } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // MVP: For demonstration, if status is unauthenticated we don't block fully so the UI can be tested,
  // but in production we'd uncomment this redirect:
  // if (status === "unauthenticated") { redirect("/login") }

  const navItems = [
    { name: "ภาพรวม (Dashboard)", href: "/dashboard", icon: LayoutDashboard },
    { name: "จัดการโปรไฟล์", href: "/dashboard/profile", icon: UserCircle },
    { name: "ผลงานวิชาการ", href: "/dashboard/portfolio", icon: BookOpen },
    { name: "เครือข่ายวิชาชีพ", href: "/dashboard/network", icon: Users },
    { name: "การตั้งค่า", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen print:h-auto bg-slate-50 dark:bg-slate-950 overflow-hidden print:overflow-visible print:bg-transparent">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col z-20 print:hidden"
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="bg-primary/10 text-primary p-2 rounded-xl flex items-center justify-center">
            <GraduationCap size={28} />
          </div>
          {isSidebarOpen && (
            <span className="ml-3 font-bold text-xl text-slate-800 dark:text-white tracking-tight">EENP</span>
          )}
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <div className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}>
                  <item.icon size={20} className={isActive ? "text-white" : ""} />
                  {isSidebarOpen && <span className="ml-3 font-medium">{item.name}</span>}
                </div>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 cursor-pointer transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">ออกจากระบบ</span>}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible relative">
        {/* Background gradient for premium feel */}
        <div className="absolute top-0 right-0 w-1/2 h-64 bg-primary/5 dark:bg-primary/10 blur-[100px] pointer-events-none rounded-bl-full print:hidden" />
        
        {/* Top Header */}
        <header className="h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0 print:hidden">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:block"
          >
            <Menu size={24} />
          </button>
          
          <div className="md:hidden font-bold text-xl text-slate-800 dark:text-white">EENP</div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{session?.user?.name || "ดร. สมชาย เรียนดี"}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">นักวิจัย / อาจารย์มหาวิทยาลัย</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-slate-900">
              {session?.user?.name?.charAt(0) || "ส"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto print:overflow-visible p-6 md:p-8 print:p-0 z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
