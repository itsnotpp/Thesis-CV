"use client"

import { Printer } from "lucide-react"

export default function PrintButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button 
      onClick={handlePrint}
      className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md flex items-center gap-2 transition-colors"
    >
      <Printer size={18} />
      สั่งพิมพ์ / บันทึกเป็น PDF
    </button>
  )
}
