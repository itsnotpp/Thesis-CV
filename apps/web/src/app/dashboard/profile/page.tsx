"use client"

import { useState, useEffect } from "react"
import { Save, User, Briefcase, GraduationCap, Link as LinkIcon, Plus, FileDown, X, Loader2, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportSections, setExportSections] = useState({
    personal: true,
    education: true,
    experience: true,
    publications: true
  })
  const [contactExportOptions, setContactExportOptions] = useState({
    email: true,
    phone: true,
    location: true
  })
  const [contactInfo, setContactInfo] = useState({
    email: "somchai.r@g.swu.ac.th",
    phone: "02-123-4567",
    location: "กรุงเทพมหานคร, ประเทศไทย"
  })
  const [personalInfo, setPersonalInfo] = useState({
    prefix: "นาย",
    firstName: "สมชาย",
    lastName: "เรียนดี",
    jobTitle: "อาจารย์ประจำ",
    organization: "มหาวิทยาลัยศรีนครินทรวิโรฒ",
    bio: "มีความสนใจในด้านเทคโนโลยีการศึกษาและการนำ AI มาใช้ในการเรียนการสอน"
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedPersonal = localStorage.getItem("profile_personal")
    if (savedPersonal) setPersonalInfo(JSON.parse(savedPersonal))
    
    const savedContact = localStorage.getItem("profile_contact")
    if (savedContact) setContactInfo(JSON.parse(savedContact))
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem("profile_personal", JSON.stringify(personalInfo))
      localStorage.setItem("profile_contact", JSON.stringify(contactInfo))
      setIsSaving(false)
      setShowSaveSuccess(true)
      setTimeout(() => setShowSaveSuccess(false), 3000)
    }, 800)
  }

  const handleExport = () => {
    const sections = Object.entries(exportSections)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => key)
      .join(",")
    
    const params = new URLSearchParams()
    params.set("sections", sections)
    if (contactExportOptions.email) params.set("email", contactInfo.email)
    else params.set("email", "")

    if (contactExportOptions.phone) params.set("phone", contactInfo.phone)
    else params.set("phone", "")

    if (contactExportOptions.location) params.set("location", contactInfo.location)
    else params.set("location", "")

    window.location.href = `/dashboard/profile/cv?${params.toString()}`
  }

  return (
    <div className="space-y-6 pb-10 relative">
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">เลือกข้อมูลที่ต้องการ Export</h3>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              {[
                { id: 'personal', label: 'ข้อมูลส่วนตัวและประวัติย่อ (Bio)' },
                { id: 'education', label: 'ประวัติการศึกษา' },
                { id: 'experience', label: 'ประสบการณ์ทำงาน' },
                { id: 'publications', label: 'ผลงานวิชาการ' }
              ].map(section => (
                <label key={section.id} className="flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-200 dark:border-slate-800">
                  <input 
                    type="checkbox" 
                    checked={exportSections[section.id as keyof typeof exportSections]}
                    onChange={(e) => setExportSections(prev => ({...prev, [section.id]: e.target.checked}))}
                    className="w-5 h-5 rounded text-primary focus:ring-primary/50"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{section.label}</span>
                </label>
              ))}
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">ช่องทางการติดต่อ</h4>
            <div className="space-y-3 mb-8 pl-4 border-l-2 border-primary/20 dark:border-primary/20">
              {[
                { id: 'email', label: 'อีเมล (Email)' },
                { id: 'phone', label: 'เบอร์โทรศัพท์ (Phone)' },
                { id: 'location', label: 'พิกัด (Location)' }
              ].map(opt => (
                <label key={opt.id} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={contactExportOptions[opt.id as keyof typeof contactExportOptions]}
                    onChange={(e) => setContactExportOptions(prev => ({...prev, [opt.id]: e.target.checked}))}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/50"
                  />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{opt.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowExportModal(false)} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors">
                ยกเลิก
              </button>
              <button onClick={handleExport} className="flex-1 py-3 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-lg shadow-primary/20 transition-colors flex justify-center items-center gap-2">
                <FileDown size={18} /> สร้าง PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">จัดการโปรไฟล์</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">อัปเดตข้อมูลส่วนตัว การศึกษา และประสบการณ์ทำงานของคุณ</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowExportModal(true)} className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-6 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2">
            <FileDown size={18} />
            <span>Export เป็น CV (PDF)</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : (showSaveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />)}
            <span>{isSaving ? "กำลังบันทึก..." : (showSaveSuccess ? "บันทึกสำเร็จ!" : "บันทึกข้อมูล")}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* Left Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: "personal", label: "ข้อมูลส่วนตัว", icon: User },
            { id: "education", label: "ประวัติการศึกษา", icon: GraduationCap },
            { id: "experience", label: "ประสบการณ์ทำงาน", icon: Briefcase },
            { id: "social", label: "ช่องทางติดต่อ", icon: LinkIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Form Area */}
        <div className="flex-1">
          <div className="glass border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-10">
            
            {activeTab === "personal" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">ข้อมูลส่วนตัว</h2>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center overflow-hidden">
                      <User size={40} className="text-slate-400" />
                    </div>
                    <div>
                      <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm">
                        เปลี่ยนรูปโปรไฟล์
                      </button>
                      <p className="text-xs text-slate-500 mt-2">รองรับ JPG, PNG สูงสุด 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">คำนำหน้าชื่อ</label>
                    <select 
                      value={personalInfo.prefix}
                      onChange={(e) => setPersonalInfo({...personalInfo, prefix: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                    >
                      <option>นาย</option>
                      <option>นาง</option>
                      <option>นางสาว</option>
                      <option>ดร.</option>
                      <option>ผศ.ดร.</option>
                      <option>รศ.ดร.</option>
                      <option>ศ.ดร.</option>
                    </select>
                  </div>
                  <div className="hidden md:block"></div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ชื่อจริง</label>
                    <input 
                      type="text" 
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">นามสกุล</label>
                    <input 
                      type="text" 
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ตำแหน่งงานปัจจุบัน</label>
                    <input 
                      type="text" 
                      value={personalInfo.jobTitle}
                      onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">หน่วยงาน / สถาบัน</label>
                    <input 
                      type="text" 
                      value={personalInfo.organization}
                      onChange={(e) => setPersonalInfo({...personalInfo, organization: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2 relative">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ประวัติย่อ (Bio)</label>
                      <button type="button" className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                        ให้ AI ช่วยเขียน
                      </button>
                    </div>
                    <textarea 
                      rows={4} 
                      value={personalInfo.bio}
                      onChange={(e) => setPersonalInfo({...personalInfo, bio: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ประวัติการศึกษา</h2>
                  <button className="flex items-center gap-1 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus size={16} /> เพิ่ม
                  </button>
                </div>
                
                <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative">
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button className="text-slate-400 hover:text-primary">แก้ไข</button>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">ปรัชญาดุษฎีบัณฑิต (เทคโนโลยีการศึกษา)</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">มหาวิทยาลัยศรีนครินทรวิโรฒ</p>
                  <p className="text-sm text-slate-500 mt-2">ปีที่สำเร็จการศึกษา: 2565</p>
                  <p className="text-sm text-slate-500 mt-1"><span className="font-semibold text-slate-700 dark:text-slate-300">วิทยานิพนธ์:</span> การพัฒนารูปแบบการเรียนรู้ด้วย AI สำหรับ...</p>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ประสบการณ์ทำงาน</h2>
                  <button className="flex items-center gap-1 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus size={16} /> เพิ่ม
                  </button>
                </div>
                
                <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative">
                  <div className="absolute top-6 right-6 flex gap-2">
                    <button className="text-slate-400 hover:text-primary">แก้ไข</button>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">อาจารย์ประจำหลักสูตร</h3>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">คณะศึกษาศาสตร์ มหาวิทยาลัยศรีนครินทรวิโรฒ</p>
                  <p className="text-sm text-slate-500 mt-2">2565 - ปัจจุบัน</p>
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ช่องทางการติดต่อ</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">อีเมล (Email)</label>
                    <input 
                      type="email" 
                      value={contactInfo.email} 
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">เบอร์โทรศัพท์ (Phone)</label>
                    <input 
                      type="text" 
                      value={contactInfo.phone} 
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ที่อยู่ / พิกัด (Location)</label>
                    <input 
                      type="text" 
                      value={contactInfo.location} 
                      onChange={(e) => setContactInfo({...contactInfo, location: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white" 
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
