const fs = require('fs');
const path = require('path');

const firstNames = [
  "สมชาย", "สมศรี", "นภัสสร", "วรุตม์", "อภิชญา", "ปิยบุตร", "วิจิตร", "สุรศักดิ์", "กิตติพงษ์", "รัตนา",
  "ชลธิดา", "ธนพล", "พิมพิกา", "ศุภชัย", "อารยา", "ณัฐวุฒิ", "กฤษณะ", "จุฑามาศ", "ธิดารัตน์", "พีรยุทธ",
  "ศราวุธ", "มณีรัตน์", "ชินดนัย", "จิรายุ", "อรรถพล", "วิลาสินี", "สุปรียา", "ปกรณ์", "ทวีศักดิ์", "นฤมล",
  "เอกชัย", "พงศกร", "สุพรรณิกา", "กรกช", "อัครา", "ดวงพร", "วรัญญา", "ชยธร", "นันทิวัต", "ประวิทย์"
];

const lastNames = [
  "เรียนดี", "วิทยาปัญญา", "ศรีสวัสดิ์", "รักเรียน", "แสงสว่าง", "เจริญกุล", "ทรัพย์อนันต์", "อภิรักษ์", "ประเสริฐยิ่ง", "ชัยวัฒน์",
  "ทองดี", "พิทักษ์", "งามสง่า", "สุขใจ", "บุญส่ง", "รัตนสุวรรณ", "วิเศษกุล", "จินดามณี", "ศิริชัย", "อมรเดช",
  "ภักดี", "นิลวรรณ", "ดำรงสกุล", "ปัญญาพงศ์", "เตชะศิลป์", "โชติวิวัฒน์", "สินธพ", "ไตรภพ", "อัครเดช", "เทพพิทักษ์",
  "สุวรรณมัจฉา", "ธนากิจ", "บริบูรณ์", "พรหมสุวรรณ", "วิเศษโชค", "อุดมสุข", "เลิศชัย", "ทิพย์ธารา", "พิพัฒน์", "รุ่งเรือง"
];

const titles = ["รศ.ดร.", "ผศ.ดร.", "ดร.", "ศ.ดร.", "อ.", "นพ.", "พญ."];
const roles = ["นักวิจัย / อาจารย์", "นักวิจัยเชี่ยวชาญ", "อาจารย์ประจำ", "ผู้ช่วยศาสตราจารย์", "รองศาสตราจารย์", "ผู้อำนวยการศูนย์วิจัย", "นักวิทยาศาสตร์"];

const institutions = [
  "มหาวิทยาลัยเกษตรศาสตร์", "จุฬาลงกรณ์มหาวิทยาลัย", "มหาวิทยาลัยเชียงใหม่", "มหาวิทยาลัยศรีนครินทรวิโรฒ",
  "มหาวิทยาลัยธรรมศาสตร์", "มหาวิทยาลัยมหิดล", "มหาวิทยาลัยขอนแก่น", "มหาวิทยาลัยสงขลานครินทร์",
  "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง", "มหาวิทยาลัยนเรศวร", "มหาวิทยาลัยบูรพา",
  "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี", "มหาวิทยาลัยศิลปากร", "สถาบันวิจัยระบบสาธารณสุข", "ศูนย์เทคโนโลยีอิเล็กทรอนิกส์และคอมพิวเตอร์แห่งชาติ (NECTEC)"
];

const domains = [
  {
    name: "Medical & Health",
    expertisePool: ["Cardiology", "Oncology", "Public Health", "Genomics", "Immunology", "Telemedicine", "Neuroscience", "Pediatrics", "Clinical Research", "Health Informatics", "โรคมะเร็ง", "การแพทย์แม่นยำ", "ระบาดวิทยา", "สมุนไพรไทย", "เภสัชวิทยา"],
    bioTemplates: [
      "มีความเชี่ยวชาญด้าน [EXP1] และ [EXP2] ปัจจุบันกำลังทำวิจัยเกี่ยวกับการรักษา [EXP1]",
      "นักวิจัยทางคลินิกที่เน้นการนำ [EXP1] มาประยุกต์ใช้เพื่อพัฒนา [EXP2]",
      "สนใจการทำงานร่วมกับผู้เชี่ยวชาญด้าน IT เพื่อพัฒนาระบบ [EXP1] แบบครบวงจร"
    ]
  },
  {
    name: "Engineering & Tech",
    expertisePool: ["Artificial Intelligence", "Machine Learning", "Civil Engineering", "Robotics", "IoT", "Cybersecurity", "Blockchain", "Material Science", "Structural Engineering", "Renewable Energy", "การวิเคราะห์โครงสร้าง", "วิศวกรรมโยธา", "วัสดุศาสตร์", "พลังงานสะอาด", "Data Science"],
    bioTemplates: [
      "มุ่งเน้นการสร้างนวัตกรรมใหม่ๆ ด้าน [EXP1] โดยผสานเทคโนโลยี [EXP2] เข้าด้วยกัน",
      "มีประสบการณ์พัฒนาอัลกอริทึมสำหรับ [EXP1] มากกว่า 10 ปี",
      "กำลังมองหาผู้ร่วมวิจัยเพื่อพัฒนาโปรเจกต์ด้าน [EXP1] และ [EXP2]"
    ]
  },
  {
    name: "Education",
    expertisePool: ["AI in Education", "EdTech", "Learning Analytics", "Gamification", "Instructional Design", "Curriculum Development", "Special Education", "Early Childhood Education", "STEM Education", "การวัดและประเมินผล", "จิตวิทยาการศึกษา", "การเรียนการสอนออนไลน์", "เทคโนโลยีการศึกษา"],
    bioTemplates: [
      "มีความสนใจด้านการพัฒนาระบบ [EXP1] เพื่อช่วยส่งเสริมการเรียนรู้ สนใจร่วมงานกับสตาร์ทอัพด้าน [EXP2]",
      "เชี่ยวชาญการออกแบบ [EXP1] ปัจจุบันกำลังหาผู้ร่วมวิจัยเกี่ยวกับการสร้าง [EXP2]",
      "อาจารย์และนักวิจัยที่หลงใหลในการประยุกต์ใช้ [EXP1] ในห้องเรียน"
    ]
  },
  {
    name: "Science & Agriculture",
    expertisePool: ["Biotechnology", "Botany", "Ecology", "Climate Change", "Agricultural Tech", "Soil Science", "Food Science", "Chemistry", "Physics", "พันธุศาสตร์", "สัตววิทยา", "ความยั่งยืน", "การทำฟาร์มอัจฉริยะ", "สมุนไพร"],
    bioTemplates: [
      "ทำงานวิจัยด้าน [EXP1] โดยเฉพาะที่เกี่ยวข้องกับสภาพภูมิอากาศ และ [EXP2]",
      "มีความสนใจในการนำ [EXP1] ไปใช้ในอุตสาหกรรม [EXP2]",
      "เชี่ยวชาญด้าน [EXP1] มีผลงานตีพิมพ์ในวารสารระดับนานาชาติ"
    ]
  },
  {
    name: "Social Science & Humanities",
    expertisePool: ["Sociology", "Psychology", "Economics", "Linguistics", "Anthropology", "Political Science", "History", "Arts", "เศรษฐศาสตร์พฤติกรรม", "จิตวิทยาคลินิก", "มานุษยวิทยา", "ประวัติศาสตร์ไทย", "รัฐศาสตร์", "การจัดการ", "การตลาด"],
    bioTemplates: [
      "ศึกษาผลกระทบของ [EXP1] ต่อสังคม และการเปลี่ยนแปลงทางด้าน [EXP2]",
      "นักวิจัยทางสังคมศาสตร์ที่มีความสนใจเชิงลึกใน [EXP1]",
      "ผสมผสานความรู้ด้าน [EXP1] และ [EXP2] เข้าด้วยกันเพื่อหาข้อค้นพบใหม่ๆ"
    ]
  }
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSubset(arr, count) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const experts = [];

for (let i = 1; i <= 1500; i++) {
  const domain = getRandom(domains);
  const expertiseList = getRandomSubset(domain.expertisePool, Math.floor(Math.random() * 3) + 2); // 2-4 skills
  
  const firstName = getRandom(firstNames);
  const lastName = getRandom(lastNames);
  const title = domain.name === "Medical & Health" ? (Math.random() > 0.5 ? "นพ." : "พญ.") : getRandom(titles);
  const name = `${title} ${firstName} ${lastName}`;
  
  const role = getRandom(roles);
  const institution = getRandom(institutions);
  const isVerified = Math.random() > 0.3; // 70% verified
  const connections = Math.floor(Math.random() * 500);
  
  let bioTemplate = getRandom(domain.bioTemplates);
  bioTemplate = bioTemplate.replace("[EXP1]", expertiseList[0]);
  if (expertiseList.length > 1) {
    bioTemplate = bioTemplate.replace("[EXP2]", expertiseList[1]);
  } else {
    bioTemplate = bioTemplate.replace(" และ [EXP2]", "");
    bioTemplate = bioTemplate.replace(" และ [EXP2]", "");
  }

  experts.push({
    id: i,
    name,
    role,
    institution,
    expertise: expertiseList,
    isVerified,
    connections,
    bio: bioTemplate,
    domain: domain.name
  });
}

// Add the original 3 mock experts at the top for consistency if needed, but the loop is fine.
const originalMock = [
    {
      id: 9991,
      name: "รศ.ดร. นภัสสร วิทยาปัญญา",
      role: "นักวิจัย / อาจารย์",
      institution: "มหาวิทยาลัยเกษตรศาสตร์",
      expertise: ["AI in Education", "Machine Learning", "EdTech"],
      isVerified: true,
      connections: 128,
      bio: "มีความสนใจด้านการพัฒนาระบบ AI เพื่อช่วยส่งเสริมการเรียนรู้ของเด็กไทย สนใจร่วมงานกับสตาร์ทอัพด้าน EdTech"
    },
    {
      id: 9992,
      name: "ผศ.ดร. วรุตม์ ศรีสวัสดิ์",
      role: "นักวิจัยเชี่ยวชาญ",
      institution: "จุฬาลงกรณ์มหาวิทยาลัย",
      expertise: ["Data Science", "Learning Analytics", "Instructional Design"],
      isVerified: true,
      connections: 84,
      bio: "นักวิจัยด้าน Data Science ที่เน้นเรื่อง Learning Analytics มีผลงานวิจัยระดับแนวหน้าใน Scopus Q1 มากกว่า 10 ฉบับ"
    },
    {
      id: 9993,
      name: "ดร. อภิชญา รักเรียน",
      role: "อาจารย์ประจำ",
      institution: "มหาวิทยาลัยเชียงใหม่",
      expertise: ["Gamification", "Online Learning", "Curriculum Development"],
      isVerified: false,
      connections: 45,
      bio: "เชี่ยวชาญการออกแบบบอร์ดเกมเพื่อการศึกษา (Gamification) ปัจจุบันกำลังหาผู้ร่วมวิจัยเกี่ยวกับการสร้าง Game-based Learning แบบออนไลน์"
    }
];

const finalData = [...originalMock, ...experts];

fs.writeFileSync(
  path.join(__dirname, 'mockExperts.json'),
  JSON.stringify(finalData, null, 2),
  'utf8'
);

console.log("Successfully generated mockExperts.json with " + finalData.length + " profiles.");
