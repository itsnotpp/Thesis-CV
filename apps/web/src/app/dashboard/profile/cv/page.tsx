import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PrintButton from "./PrintButton"

const prisma = new PrismaClient()

export default async function CVPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Get user with all their related data
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
      education: { orderBy: { year: "desc" } },
      experience: { orderBy: { startDate: "desc" } },
      publications: { orderBy: { year: "desc" }, include: { authors: { include: { profile: true } } } }
    }
  })

  if (!user || !user.profile) {
    return <div className="p-8 text-center">ไม่พบข้อมูลโปรไฟล์ กรุณาไปที่หน้า จัดการโปรไฟล์ เพื่อเพิ่มข้อมูลก่อนครับ</div>
  }

  const profile = user.profile
  const education = user.education
  const experience = user.experience
  const publications = user.publications

  const sectionsQuery = searchParams.sections as string
  const sections = sectionsQuery ? sectionsQuery.split(",") : ["personal", "education", "experience", "publications"]
  
  const showPersonal = sections.includes("personal")
  const showEducation = sections.includes("education")
  const showExperience = sections.includes("experience")
  const showPublications = sections.includes("publications")

  const email = (searchParams.email as string) || user.email
  const phone = (searchParams.phone as string) || "-"
  const location = (searchParams.location as string) || "-"

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
        <PrintButton />
      </div>

      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none print:m-0 text-slate-900 font-sans p-[20mm] relative flex flex-col mx-auto overflow-hidden">
        
        {/* Custom Header replacing browser default */}
        <div className="hidden print:block text-sm font-bold text-primary mb-6 tracking-widest border-b border-slate-100 pb-2">
          EENP
        </div>

        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900">
              {profile.prefix} {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-lg text-slate-600 font-medium mt-2">{profile.jobTitle || "นักวิจัย"}</p>
            <p className="text-base text-slate-500 mt-1">{profile.organization}</p>
          </div>
          <div className="text-right text-sm space-y-1 text-slate-600 mt-2">
            {email && <p>{email}</p>}
            {phone && phone !== "-" && <p>{phone}</p>}
            {location && location !== "-" && <p>{location}</p>}
          </div>
        </div>

        {showPersonal && profile.bio && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2">สรุปประวัติ (Professional Summary)</h2>
            <p className="text-sm leading-relaxed text-slate-700 text-justify">
              {profile.bio}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mb-6">
          
          {showExperience && experience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">ประสบการณ์ทำงาน</h2>
              <div className="space-y-4">
                {experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-base text-slate-800">{exp.title}</h3>
                      <span className="text-xs font-semibold text-slate-500">
                        {exp.startDate ? new Date(exp.startDate).getFullYear() : ""} - {exp.current ? "ปัจจุบัน" : (exp.endDate ? new Date(exp.endDate).getFullYear() : "")}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-600 italic">{exp.company}</p>
                    {exp.description && (
                      <p className="text-sm text-slate-600 mt-1">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {showEducation && education.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">ประวัติการศึกษา</h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-base text-slate-800">{edu.degree}</h3>
                      <span className="text-xs font-semibold text-slate-500">{edu.year || "-"}</span>
                    </div>
                    {edu.details && <p className="text-sm font-medium text-slate-600">{edu.details}</p>}
                    <p className="text-sm text-slate-500 mt-0.5 italic">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {showPublications && publications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">ผลงานวิชาการ (Selected Publications)</h2>
            <ul className="list-decimal list-outside ml-5 text-sm text-slate-700 space-y-2">
              {publications.map((pub: any) => (
                <li key={pub.id}>
                  {pub.authors && pub.authors.length > 0 ? (
                    <span className="font-bold">
                      {pub.authors.map((u: any) => `${u.profile?.lastName || ""}, ${u.profile?.firstName?.charAt(0) || ""}.`).join(", ")}
                    </span>
                  ) : (
                    <span className="font-bold">{profile.lastName}, {profile.firstName?.charAt(0)}.</span>
                  )} 
                  ({pub.year || "ไม่ระบุปี"}). {pub.title}.{pub.url && <a href={pub.url} className="text-primary ml-1">[{pub.url}]</a>}
                </li>
              ))}
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
