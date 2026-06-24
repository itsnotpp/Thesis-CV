"use client"

import { useState } from "react"
import { Mail, Loader2, Send } from "lucide-react"
import { sendCollaborationInvite } from "@/app/actions/collaboration"

export default function InviteButton({ targetId, currentUserId }: { targetId: string, currentUserId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState("RESEARCH")
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    setIsLoading(true)
    
    const result = await sendCollaborationInvite(currentUserId, targetId, type, message)
    
    setIsLoading(false)
    if (result.success) {
      setIsSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsSuccess(false)
        setMessage("")
      }, 2000)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl font-semibold shadow-sm flex items-center gap-2 transition-colors"
      >
        <Mail size={18} />
        เชิญร่วมงาน
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">ส่งคำเชิญร่วมงาน</h3>
            
            {isSuccess ? (
              <div className="py-8 text-center text-emerald-600 dark:text-emerald-400">
                <Send size={48} className="mx-auto mb-4" />
                <p className="font-bold text-lg">ส่งคำเชิญเรียบร้อยแล้ว!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ประเภทคำเชิญ</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                  >
                    <option value="RESEARCH">เชิญร่วมทำวิจัย</option>
                    <option value="EVALUATE">ขอให้ประเมินเครื่องมือวิจัย (IOC)</option>
                    <option value="SPEAKER">เชิญเป็นวิทยากร</option>
                    <option value="OTHER">อื่นๆ</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ข้อความเพิ่มเติม</label>
                  <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    placeholder="พิมพ์รายละเอียดของงานวิจัย หรือเครื่องมือที่คุณต้องการให้ประเมิน..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-slate-900 dark:text-white focus:border-primary focus:ring-primary resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !message.trim()}
                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold shadow-md flex items-center gap-2 transition-colors"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    ส่งคำเชิญ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
