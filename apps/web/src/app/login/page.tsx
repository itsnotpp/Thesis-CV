"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, ArrowRight, BookOpen, Network, Users } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Attempt sign in via NextAuth
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    })
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 relative overflow-hidden selection:bg-primary/30">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />

      {/* Left Column: Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-20 z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="glass p-8 rounded-3xl backdrop-blur-2xl border-white/20 shadow-2xl relative"
        >
          <div className="absolute -top-6 -left-6 bg-primary text-white p-4 rounded-2xl shadow-xl animate-float">
            <GraduationCap size={40} />
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight mt-4 text-slate-900 dark:text-white leading-tight">
            Educational Expert <br />
            <span className="text-gradient">Network Platform</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
            เชื่อมต่อบุคลากรทางการศึกษา สร้างโปรไฟล์วิชาการ และก้าวสู่สังคมแห่งการเรียนรู้ระดับประเทศ
          </p>

          <div className="mt-12 space-y-6">
            {[
              { icon: BookOpen, text: "สร้าง CV วิชาการและจัดการผลงานวิจัย" },
              { icon: Network, text: "ค้นหาผู้เชี่ยวชาญและเพื่อนร่วมงาน" },
              { icon: Users, text: "แลกเปลี่ยนความรู้ในชุมชนวิชาชีพ" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.2) }}
                className="flex items-center space-x-4 text-slate-700 dark:text-slate-200"
              >
                <div className="bg-white/50 dark:bg-white/10 p-3 rounded-xl shadow-sm">
                  <feature.icon className="text-primary" size={24} />
                </div>
                <span className="font-medium text-lg">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md glass-card p-10 rounded-3xl"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">เข้าสู่ระบบ</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">ยินดีต้อนรับกลับสู่ EENP</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                อีเมล (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="name@university.ac.th"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  รหัสผ่าน (Password)
                </label>
                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full group bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-primary/30 transition-all flex justify-center items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              <span>{isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</span>
              {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              ยังไม่มีบัญชีผู้ใช้?{" "}
              <a href="#" className="text-primary font-semibold hover:underline">
                ลงทะเบียนเลย
              </a>
            </p>
          </div>
          
          <div className="mt-8 relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full absolute"></div>
            <span className="bg-slate-50 dark:bg-slate-950 px-4 text-xs text-slate-400 relative glass-card py-1 rounded-full">
              Or continue with
            </span>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="w-full flex justify-center items-center py-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors bg-white/30 dark:bg-transparent shadow-sm font-medium text-slate-600 dark:text-slate-300">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="w-full flex justify-center items-center py-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors bg-white/30 dark:bg-transparent shadow-sm font-medium text-slate-600 dark:text-slate-300">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              ORCID
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
