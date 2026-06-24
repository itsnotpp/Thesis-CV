"use client"

import { useState, useEffect } from "react"
import { Printer, Share2, Mail, Users, CheckCircle2, X, Loader2 } from "lucide-react"
import { getAcceptedConnections } from "@/app/actions/network"

export default function CVActionButtons() {
  const [showNetworkModal, setShowNetworkModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  
  const [connections, setConnections] = useState<any[]>([])
  const [isLoadingConnections, setIsLoadingConnections] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const openNetworkModal = async () => {
    setShowNetworkModal(true)
    setIsLoadingConnections(true)
    const res = await getAcceptedConnections()
    if (res.success) {
      setConnections(res.connections)
    }
    setIsLoadingConnections(false)
  }

  const handleSendToNetwork = () => {
    // In MVP, we mock sending to network
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setShowNetworkModal(false)
    }, 2000)
  }

  const handleSendEmail = () => {
    if (!emailInput) return
    // In MVP, we mock email sending
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setShowEmailModal(false)
      setEmailInput("")
    }, 2000)
  }

  return (
    <>
      <div className="flex gap-3">
        <button 
          onClick={openNetworkModal}
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-lg font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <Users size={18} />
          <span className="hidden sm:inline">ส่งให้เครือข่าย</span>
        </button>

        <button 
          onClick={() => setShowEmailModal(true)}
          className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2.5 rounded-lg font-semibold shadow-sm flex items-center gap-2 transition-colors"
        >
          <Mail size={18} />
          <span className="hidden sm:inline">ส่งอีเมล</span>
        </button>

        <button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md flex items-center gap-2 transition-colors"
        >
          <Printer size={18} />
          สั่งพิมพ์ / PDF
        </button>
      </div>

      {/* Network Modal */}
      {showNetworkModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowNetworkModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">ส่ง CV ให้คนในเครือข่าย</h3>
            {isSuccess ? (
              <div className="py-8 text-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={48} className="mx-auto mb-4" />
                <p className="font-bold text-lg">ส่ง CV เรียบร้อยแล้ว!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">เลือกลายชื่อจากคนที่คุณเชื่อมต่ออยู่ เพื่อส่งลิงก์ CV ของคุณให้พวกเขาพิจารณาร่วมงาน</p>
                
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {isLoadingConnections ? (
                    <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                  ) : connections.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-sm">คุณยังไม่มีการเชื่อมต่อกับใครเลย</div>
                  ) : (
                    connections.map((conn) => (
                      <label key={conn.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-100 dark:border-slate-800">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary w-5 h-5" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{conn.profile.prefix} {conn.profile.firstName} {conn.profile.lastName}</p>
                          <p className="text-xs text-slate-500">{conn.profile.organization}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <button 
                  onClick={handleSendToNetwork}
                  disabled={isLoadingConnections || connections.length === 0}
                  className="w-full bg-primary disabled:opacity-50 hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-colors"
                >
                  ส่งลิงก์ CV
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">ส่ง CV ทางอีเมล</h3>
            {isSuccess ? (
              <div className="py-8 text-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={48} className="mx-auto mb-4" />
                <p className="font-bold text-lg">ส่งอีเมลเรียบร้อยแล้ว!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">พิมพ์อีเมลของผู้รับเพื่อส่งลิงก์ CV หรือไฟล์แนบอัตโนมัติ</p>
                <input 
                  type="email" 
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="name@university.ac.th"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                />
                <button 
                  onClick={handleSendEmail}
                  disabled={!emailInput}
                  className="w-full bg-primary disabled:opacity-50 hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition-colors"
                >
                  ส่งอีเมล
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
