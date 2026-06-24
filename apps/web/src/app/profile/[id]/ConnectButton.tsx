"use client"

import { useState } from "react"
import { UserPlus, UserCheck, Loader2, BookPlus } from "lucide-react"
import { connectUser, addJointPublication } from "@/app/actions/network"

export default function ConnectButton({ targetId, initialStatus }: { targetId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showPubInput, setShowPubInput] = useState(false)
  const [pubTitle, setPubTitle] = useState("")
  const [isAddingPub, setIsAddingPub] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connectUser(targetId)
      setStatus("ACCEPTED")
    } catch (err) {
      alert("เชื่อมต่อล้มเหลว")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleAddPub = async () => {
    if (!pubTitle.trim()) {
      alert("กรุณากรอกชื่อผลงาน")
      return
    }
    setIsAddingPub(true)
    try {
      await addJointPublication(targetId, pubTitle)
      alert("เพิ่มผลงานร่วมสำเร็จ!")
      setShowPubInput(false)
      setPubTitle("")
      // Optional: reload the page to see the new pub
      window.location.reload()
    } catch (err) {
      alert("เพิ่มผลงานล้มเหลว")
    } finally {
      setIsAddingPub(false)
    }
  }

  if (status === "ACCEPTED") {
    return (
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="bg-emerald-100 text-emerald-700 px-6 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
          <UserCheck size={18} /> เป็นเพื่อนแล้ว
        </div>
        
        {showPubInput ? (
          <div className="flex gap-2">
            <input 
              type="text" 
              value={pubTitle}
              onChange={e => setPubTitle(e.target.value)}
              placeholder="ระบุชื่อผลงานร่วม..." 
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-48"
            />
            <button 
              onClick={handleAddPub} 
              disabled={isAddingPub}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2"
            >
              {isAddingPub ? <Loader2 size={16} className="animate-spin"/> : "บันทึก"}
            </button>
            <button 
              onClick={() => setShowPubInput(false)}
              className="text-slate-500 hover:bg-slate-100 px-3 rounded-xl"
            >
              ยกเลิก
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowPubInput(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all flex justify-center items-center gap-2"
          >
            <BookPlus size={18} /> เพิ่มผลงานร่วม
          </button>
        )}
      </div>
    )
  }

  return (
    <button 
      onClick={handleConnect} 
      disabled={isConnecting}
      className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center gap-2 min-w-[140px]"
    >
      {isConnecting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />} 
      เชื่อมต่อ (Connect)
    </button>
  )
}
