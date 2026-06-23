"use client"

import { useSession } from "next-auth/react"
import { Printer, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function CVContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const sectionsQuery = searchParams.get("sections")
  
  const sections = sectionsQuery ? sectionsQuery.split(",") : ["personal", "education", "experience", "publications"]
  
  const showPersonal = sections.includes("personal")
  const showEducation = sections.includes("education")
  const showExperience = sections.includes("experience")
  const showPublications = sections.includes("publications")

  const email = searchParams.has("email") ? searchParams.get("email") : (session?.user?.email || "somchai.r@g.swu.ac.th")
  const phone = searchParams.has("phone") ? searchParams.get("phone") : "02-123-4567"
  const location = searchParams.has("location") ? searchParams.get("location") : "กรุงเทพมหานคร, ประเทศไทย"

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-900 py-8 print:bg-transparent print:py-0 print:p-0 flex flex-col items-center print:block">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background: white !important; 
            margin: 0;
            padding: 0;
          }
        }
      `}} />
      
      <div className="w-full max-w-[210mm] mb-6 flex justify-between items-center print:hidden px-4">
        <Link href="/dashboard/profile" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
          <ArrowLeft size={18} /> กลับไปหน้าโปรไฟล์
        </Link>
        <button 
          onClick={handlePrint}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md flex items-center gap-2 transition-colors"
        >
          <Printer size={18} />
          สั่งพิมพ์ / บันทึกเป็น PDF
        </button>
      </div>

      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none print:m-0 text-slate-900 font-sans p-[20mm] relative flex flex-col mx-auto overflow-hidden">
        
        {/* Custom Header replacing browser default */}
        <div className="hidden print:block text-sm font-bold text-primary mb-6 tracking-widest border-b border-slate-100 pb-2">
          EENP
        </div>

        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900">
              {session?.user?.name || "ดร. สมชาย เรียนดี"}
            </h1>
            <p className="text-lg text-slate-600 font-medium mt-2">อาจารย์ประจำ / นักวิจัย</p>
            <p className="text-base text-slate-500 mt-1">มหาวิทยาลัยศรีนครินทรวิโรฒ</p>
          </div>
          <div className="text-right text-sm space-y-1 text-slate-600 mt-2">
            {email && <p>{email}</p>}
            {phone && <p>{phone}</p>}
            {location && <p>{location}</p>}
          </div>
        </div>

        {showPersonal && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2">สรุปประวัติ (Professional Summary)</h2>
            <p className="text-sm leading-relaxed text-slate-700 text-justify">
              นักวิจัยและอาจารย์ผู้มีความเชี่ยวชาญด้านเทคโนโลยีการศึกษา (Educational Technology) และการนำปัญญาประดิษฐ์ (AI) มาประยุกต์ใช้ในการเรียนการสอน มีประสบการณ์สอนกว่า 5 ปี และมีผลงานวิจัยตีพิมพ์ในวารสารระดับนานาชาติ (Scopus Q1) มุ่งมั่นที่จะพัฒนารูปแบบการเรียนรู้ที่ยั่งยืนและตอบสนองต่อผู้เรียนในยุคดิจิทัล
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mb-6">
          
          {showExperience && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">ประสบการณ์ทำงาน</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-slate-800">อาจารย์ประจำหลักสูตร</h3>
                    <span className="text-xs font-semibold text-slate-500">2565 - ปัจจุบัน</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 italic">คณะศึกษาศาสตร์ มศว</p>
                  <ul className="list-disc list-outside text-sm text-slate-600 mt-2 space-y-1 ml-4">
                    <li>สอนรายวิชาเทคโนโลยีการศึกษาเบื้องต้น</li>
                    <li>หัวหน้าโครงการวิจัยทุน วช.</li>
                  </ul>
                </div>
                
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-slate-800">นักวิจัยผู้ช่วย</h3>
                    <span className="text-xs font-semibold text-slate-500">2562 - 2565</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 italic">ศูนย์วิจัยนวัตกรรมการเรียนรู้</p>
                </div>
              </div>
            </div>
          )}

          {showEducation && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">ประวัติการศึกษา</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-slate-800">ปรัชญาดุษฎีบัณฑิต</h3>
                    <span className="text-xs font-semibold text-slate-500">2565</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">เทคโนโลยีการศึกษา</p>
                  <p className="text-sm text-slate-500 mt-0.5 italic">มหาวิทยาลัยศรีนครินทรวิโรฒ</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-slate-800">ศึกษาศาสตรมหาบัณฑิต</h3>
                    <span className="text-xs font-semibold text-slate-500">2560</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600">เทคโนโลยีสื่อสารการศึกษา</p>
                  <p className="text-sm text-slate-500 mt-0.5 italic">จุฬาลงกรณ์มหาวิทยาลัย</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {showPublications && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">ผลงานวิชาการ (Selected Publications)</h2>
            <ul className="list-decimal list-outside ml-5 text-sm text-slate-700 space-y-2">
              <li>
                <span className="font-bold">เรียนดี, ส.</span>, และคณะ. (2568). การพัฒนารูปแบบการเรียนรู้ด้วยปัญญาประดิษฐ์ในห้องเรียนออนไลน์. <span className="italic">Journal of Educational Technology</span>, 15(2), 45-60. (Scopus Q1)
              </li>
              <li>
                <span className="font-bold">Riandee, S.</span> (2024). Impact of Micro-learning on Student Engagement. <span className="italic">International Conference on EdTech</span>, Bangkok, Thailand.
              </li>
            </ul>
          </div>
        )}
        
        {/* Footer sits at the bottom naturally via flex flex-col and mt-auto */}
        <div className="mt-auto flex justify-between text-xs text-slate-400 border-t border-slate-200 pt-4">
          <span>สร้างโดย Educational Expert Network Platform (EENP)</span>
          <span>{new Date().toLocaleDateString('th-TH')}</span>
        </div>

      </div>
    </div>
  )
}

export default function CVPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading CV...</div>}>
      <CVContent />
    </Suspense>
  )
}
