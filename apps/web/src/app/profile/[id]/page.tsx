import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { Building, GraduationCap, Link as LinkIcon, CheckCircle2, UserPlus, BookOpen, BookPlus, UserCheck } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import ConnectButton from "./ConnectButton"

const prisma = new PrismaClient()

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  const currentUserEmail = session?.user?.email || "somchai.r@g.swu.ac.th"
  
  // Get current user ID
  const currentUser = await prisma.user.findUnique({
    where: { email: currentUserEmail }
  })

  // Get target user
  const targetUser = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: true,
      publications: true,
      connectionsReceived: true,
      connectionsSent: true
    }
  })

  if (!targetUser || !targetUser.profile) {
    notFound()
  }

  const profile = targetUser.profile

  // Calculate connections count
  const connectionsCount = targetUser.connectionsReceived.filter(c => c.status === "ACCEPTED").length + 
                           targetUser.connectionsSent.filter(c => c.status === "ACCEPTED").length

  // Check if current user is connected to target user
  let connectionStatus = "NONE"
  let isSelf = false

  if (currentUser) {
    if (currentUser.id === targetUser.id) {
      isSelf = true
    } else {
      const conn = await prisma.connection.findFirst({
        where: {
          OR: [
            { userId: currentUser.id, connectedId: targetUser.id },
            { userId: targetUser.id, connectedId: currentUser.id }
          ]
        }
      })
      if (conn) {
        connectionStatus = conn.status
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Cover Photo */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-primary to-violet-600 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Navigation Bar overlay (Optional, but looks nice) */}
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
          <Link href="/dashboard/network" className="text-white font-bold text-xl drop-shadow-md">← กลับสู่เครือข่าย</Link>
          {isSelf && (
            <Link href="/dashboard/profile" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-md transition-colors">
              แก้ไขโปรไฟล์
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 sm:-mt-32 mb-8 flex flex-col sm:flex-row gap-6 sm:items-end z-20">
          {/* Avatar */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-white dark:border-slate-950 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-6xl font-bold text-slate-500">
                {profile.firstName?.charAt(0) || "อ"}
              </div>
            )}
          </div>

          {/* Title & Actions */}
          <div className="flex-1 flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {profile.prefix} {profile.firstName} {profile.lastName}
                {targetUser.isVerified && <CheckCircle2 size={24} className="text-emerald-500 fill-emerald-100" />}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mt-1 font-medium">{profile.jobTitle}</p>
              <p className="text-slate-500 flex items-center gap-2 mt-1">
                <Building size={18} /> {profile.organization}
              </p>
              <p className="text-sm font-semibold text-primary mt-2">
                {connectionsCount} การเชื่อมต่อ
              </p>
            </div>
            
            <div className="flex gap-3">
              {!isSelf && (
                <ConnectButton 
                  targetId={targetUser.id} 
                  initialStatus={connectionStatus} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar (About & Keywords) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">เกี่ยวกับ</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">
                {profile.bio || "ยังไม่มีข้อมูลประวัติส่วนตัว"}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">ความเชี่ยวชาญ</h3>
              <div className="flex flex-wrap gap-2">
                {profile.keywords ? profile.keywords.split(',').map((k, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                    {k.trim()}
                  </span>
                )) : (
                  <span className="text-slate-500 text-sm">ยังไม่มีข้อมูลความเชี่ยวชาญ</span>
                )}
              </div>
            </div>
          </div>

          {/* Main Content (Publications) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="text-primary" /> ผลงานวิชาการ
                </h3>
              </div>
              
              <div className="space-y-4">
                {targetUser.publications.length > 0 ? (
                  targetUser.publications.map(pub => (
                    <div key={pub.id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md">
                          {pub.type || "RESEARCH"}
                        </span>
                        <span className="text-sm font-semibold text-slate-500">ปี {pub.year}</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">{pub.title}</h4>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-500">ยังไม่มีผลงานวิชาการ</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
