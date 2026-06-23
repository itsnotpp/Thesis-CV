"use server"

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function getProfile() {
  const session = await getServerSession()
  let email = session?.user?.email || "somchai.r@g.swu.ac.th"

  let user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })

  // Mock user creation for testing if not exists
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: "EXPERT",
        profile: {
          create: {
            firstName: "สมชาย",
            lastName: "เรียนดี",
            jobTitle: "อาจารย์ประจำ",
            organization: "มหาวิทยาลัยศรีนครินทรวิโรฒ"
          }
        }
      },
      include: { profile: true }
    })
  }

  return user?.profile
}

export async function saveProfile(data: any) {
  const session = await getServerSession()
  let email = session?.user?.email || "somchai.r@g.swu.ac.th"

  let user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        role: "EXPERT"
      }
    })
  }

  const updatedProfile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: data,
    create: {
      userId: user.id,
      ...data
    }
  })

  revalidatePath('/dashboard/profile')
  return updatedProfile
}
