const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

const firstNames = ["วิชาญ", "นันทนา", "อานนท์", "สมชาย", "สุดา", "นพดล", "ดารณี", "ประเสริฐ", "วันดี", "กิตติ", "มาลี", "ชูชาติ", "พรทิพย์", "สมศักดิ์", "สุนิสา", "วรุฒ", "ศิริพร", "ไพโรจน์", "นฤมล", "วีระ"]
const lastNames = ["เชี่ยวชาญ", "ใจดี", "เจริญกุล", "รักเรียน", "แสงสว่าง", "ทองคำ", "ทรัพย์สิน", "พูนสวัสดิ์", "รุ่งเรือง", "วิเศษกุล", "ศิริชัย", "วิวัฒน์", "นันทกุล", "อุดมทรัพย์", "บุญส่ง", "มณีรัตน์", "สิงห์ทอง", "ไชยศรี", "สุขสันต์", "วงศ์วาร"]
const prefixes = ["ศ.ดร.", "รศ.ดร.", "ผศ.ดร.", "ดร.", "อาจารย์"]
const institutions = ["มหาวิทยาลัยเชียงใหม่", "จุฬาลงกรณ์มหาวิทยาลัย", "มหาวิทยาลัยธรรมศาสตร์", "มหาวิทยาลัยเกษตรศาสตร์", "มหาวิทยาลัยขอนแก่น", "มหาวิทยาลัยสงขลานครินทร์", "มหาวิทยาลัยมหิดล", "มหาวิทยาลัยศรีนครินทรวิโรฒ", "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง", "มหาวิทยาลัยบูรพา"]
const keywordsPool = ["AI", "Education", "Machine Learning", "Data Science", "Psychology", "Pedagogy", "EdTech", "Curriculum Design", "STEM", "E-learning", "Special Education", "Educational Leadership", "Instructional Design", "Assessment", "Distance Learning", "Virtual Reality", "Augmented Reality", "Internet of Things", "Robotics in Education", "Neuroscience"]

function getRandomElements(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, num)
}

async function main() {
  const usersToCreate = []
  
  for (let i = 1; i <= 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const email = `mockuser${i}@swu.ac.th`
    const password = "password123" // Normally this should be hashed, but for MVP mock we just store it in plain text or mock hash
    
    usersToCreate.push({
      email,
      passwordHash: password, // Store plain for demo purposes, or bcrypt it if auth checks it strictly
      role: "EXPERT",
      profile: {
        firstName,
        lastName,
        prefix: prefixes[Math.floor(Math.random() * prefixes.length)],
        jobTitle: "นักวิจัย / อาจารย์ประจำ",
        organization: institutions[Math.floor(Math.random() * institutions.length)],
        keywords: getRandomElements(keywordsPool, 3).join(", "),
        bio: `มีความสนใจและเชี่ยวชาญในด้าน ${getRandomElements(keywordsPool, 2).join(" และ ")} มุ่งมั่นพัฒนางานวิจัยเพื่อยกระดับวงการวิชาการไทย`,
      }
    })
  }

  const createdAccounts = []

  for (const userData of usersToCreate) {
    // Check if exists
    let user = await prisma.user.findUnique({ where: { email: userData.email } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash: userData.passwordHash,
          role: userData.role,
          profile: {
            create: userData.profile
          }
        }
      })
    }
    createdAccounts.push({
      email: userData.email,
      password: "password123",
      name: `${userData.profile.prefix} ${userData.profile.firstName} ${userData.profile.lastName}`,
      organization: userData.profile.organization
    })
  }

  // Generate Markdown Table
  let mdTable = `# บัญชีผู้ใช้งานจำลอง (100 โปรไฟล์)\n\n| No. | ชื่อ-นามสกุล | องค์กร/มหาวิทยาลัย | Email (ล็อกอิน) | Password |\n|---|---|---|---|---|\n`
  createdAccounts.forEach((acc, idx) => {
    mdTable += `| ${idx + 1} | ${acc.name} | ${acc.organization} | \`${acc.email}\` | \`${acc.password}\` |\n`
  })

  // Write to Artifact directory
  const artifactPath = path.join('C:\\Users\\CEMT\\.gemini\\antigravity\\brain\\99dd8d95-4e94-4a66-84d2-c01156102a42', 'mock_users_accounts.md')
  fs.writeFileSync(artifactPath, mdTable)
  console.log('Successfully seeded 100 users and created artifact.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
