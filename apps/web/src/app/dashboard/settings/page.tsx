"use client"

import { useState, useEffect } from "react"
import { Save, Shield, Bell, Palette, Key, Trash2, Globe, Loader2, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  
  // Settings States
  const [settings, setSettings] = useState({
    publicProfile: true,
    hideContactInfo: false,
    darkMode: false,
    language: "th",
    emailAlerts: true,
    aiMatchAlerts: true
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("app_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Check dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.darkMode])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem("app_settings", JSON.stringify(settings))
      setIsSaving(false)
      setShowSaveSuccess(true)
      setTimeout(() => setShowSaveSuccess(false), 3000)
    }, 800)
  }

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // A reusable toggle component
  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${checked ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  )

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">การตั้งค่า</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">จัดการบัญชีผู้ใช้ ความเป็นส่วนตัว และการแจ้งเตือน</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : (showSaveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />)}
            <span>{isSaving ? "กำลังบันทึก..." : (showSaveSuccess ? "บันทึกสำเร็จ!" : "บันทึกการตั้งค่า")}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        
        {/* Left Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: "account", label: "บัญชีผู้ใช้", icon: Key },
            { id: "privacy", label: "ความเป็นส่วนตัว", icon: Shield },
            { id: "appearance", label: "การแสดงผล", icon: Palette },
            { id: "notifications", label: "การแจ้งเตือน", icon: Bell },
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

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="glass border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-10">
            
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">บัญชีผู้ใช้</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">อีเมลสำหรับเข้าสู่ระบบ</label>
                    <input 
                      type="email" 
                      disabled
                      value="somchai.r@g.swu.ac.th" 
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed" 
                    />
                    <p className="text-xs text-slate-500">หากต้องการเปลี่ยนอีเมล โปรดติดต่อผู้ดูแลระบบ</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">เปลี่ยนรหัสผ่าน</h3>
                    <button onClick={() => alert("ระบบส่งลิงก์เปลี่ยนรหัสผ่านไปยังอีเมลของคุณแล้ว")} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors text-sm">
                      ส่งลิงก์รีเซ็ตรหัสผ่าน
                    </button>
                  </div>

                  <div className="pt-8 mt-8 border-t border-red-100 dark:border-red-900/30">
                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">เขตอันตราย (Danger Zone)</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">หากลบบัญชี ข้อมูล CV และผลงานทั้งหมดของคุณจะหายไปอย่างถาวร</p>
                    <button onClick={() => confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีอย่างถาวร?")} className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                      <Trash2 size={16} /> ลบบัญชีผู้ใช้
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">ความเป็นส่วนตัว</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">เปิดโปรไฟล์เป็นสาธารณะ</p>
                      <p className="text-sm text-slate-500">อนุญาตให้ผู้ที่ไม่มีบัญชีสามารถค้นหาและดู CV ของคุณได้</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings.publicProfile} 
                      onChange={() => toggleSetting('publicProfile')} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">ซ่อนข้อมูลการติดต่อ</p>
                      <p className="text-sm text-slate-500">ซ่อนอีเมลและเบอร์โทรศัพท์ในหน้าโปรไฟล์สาธารณะ</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings.hideContactInfo} 
                      onChange={() => toggleSetting('hideContactInfo')} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">การแสดงผลและภาษา</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">โหมดกลางคืน (Dark Mode)</p>
                      <p className="text-sm text-slate-500">เปลี่ยนธีมระบบให้มืดลงเพื่อถนอมสายตา</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings.darkMode} 
                      onChange={() => toggleSetting('darkMode')} 
                    />
                  </div>

                  <div className="p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <p className="font-semibold text-slate-900 dark:text-white mb-3">ภาษาเริ่มต้น (Language)</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="language" 
                          value="th" 
                          checked={settings.language === 'th'}
                          onChange={() => setSettings(prev => ({...prev, language: 'th'}))}
                          className="text-primary focus:ring-primary/50 w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">ภาษาไทย</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="language" 
                          value="en" 
                          checked={settings.language === 'en'}
                          onChange={() => setSettings(prev => ({...prev, language: 'en'}))}
                          className="text-primary focus:ring-primary/50 w-4 h-4"
                        />
                        <span className="text-slate-700 dark:text-slate-300">English</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">การแจ้งเตือนผ่านอีเมล</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">ข่าวสารและประกาศ</p>
                      <p className="text-sm text-slate-500">รับอีเมลเมื่อมีข้อความใหม่จากนักวิจัยท่านอื่น</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings.emailAlerts} 
                      onChange={() => toggleSetting('emailAlerts')} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">AI Match Alerts</p>
                      <p className="text-sm text-slate-500">รับการแจ้งเตือนรายสัปดาห์เมื่อ AI เจอคนที่เหมาะจะร่วมงานกับคุณ</p>
                    </div>
                    <ToggleSwitch 
                      checked={settings.aiMatchAlerts} 
                      onChange={() => toggleSetting('aiMatchAlerts')} 
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
