"use server"

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

async function getOrCreateCurrentUser() {
  const session = await getServerSession()
  const email = session?.user?.email || "somchai.r@g.swu.ac.th"

  let user = await prisma.user.findUnique({ where: { email } })
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
      }
    })
  }
  return user
}

export async function getNetworkData() {
  const currentUser = await getOrCreateCurrentUser()

  // Ensure mock users exist
  const mockEmails = ["mock1@swu.ac.th", "mock2@swu.ac.th", "mock3@swu.ac.th"]
  for (const mockEmail of mockEmails) {
    let u = await prisma.user.findUnique({ where: { email: mockEmail } })
    if (!u) {
      await prisma.user.create({
        data: {
          email: mockEmail,
          role: "EXPERT",
          profile: {
            create: {
              firstName: mockEmail === "mock1@swu.ac.th" ? "ดร. วิชาญ" : mockEmail === "mock2@swu.ac.th" ? "ผศ.ดร. นันทนา" : "ดร. อานนท์",
              lastName: "เชี่ยวชาญ",
              jobTitle: "นักวิจัย",
              organization: "มหาวิทยาลัยเชียงใหม่",
              keywords: "AI, Education, Machine Learning"
            }
          }
        }
      })
    }
  }

  const users = await prisma.user.findMany({
    where: { email: { not: currentUser.email } },
    include: { profile: true, connectionsReceived: true, connectionsSent: true }
  })

  // get user's connections
  const connections = await prisma.connection.findMany({
    where: {
      OR: [
        { userId: currentUser.id },
        { connectedId: currentUser.id }
      ]
    }
  })

  return { users, connections, currentUserId: currentUser.id }
}

export async function connectUser(targetUserId: string) {
  const currentUser = await getOrCreateCurrentUser()
  
  await prisma.connection.create({
    data: {
      userId: currentUser.id,
      connectedId: targetUserId,
      status: "ACCEPTED" // Auto accept for MVP
    }
  })

  revalidatePath('/dashboard/network')
}

export async function addJointPublication(targetUserId: string, title: string) {
  const currentUser = await getOrCreateCurrentUser()

  await prisma.publication.create({
    data: {
      title,
      type: "JOURNAL",
      year: new Date().getFullYear(),
      authors: {
        connect: [
          { id: currentUser.id },
          { id: targetUserId }
        ]
      }
    }
  })

  revalidatePath('/dashboard/network')
  revalidatePath('/dashboard/profile')
}
