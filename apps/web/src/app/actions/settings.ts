"use server"

import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function getSettings() {
  const session = await getServerSession()
  if (!session?.user?.email) return null

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { settings: true }
  })

  if (!user) return null

  // Create default settings if none exist
  if (!user.settings) {
    const newSettings = await prisma.settings.create({
      data: {
        userId: user.id,
        publicProfile: true,
        hideContactInfo: false,
        darkMode: false,
        language: "th",
        emailAlerts: true,
        aiMatchAlerts: true
      }
    })
    return newSettings
  }

  return user.settings
}

export async function updateSettings(data: any) {
  const session = await getServerSession()
  if (!session?.user?.email) return { success: false, error: "Not authenticated" }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return { success: false, error: "User not found" }

  try {
    const updated = await prisma.settings.upsert({
      where: { userId: user.id },
      update: {
        publicProfile: data.publicProfile,
        hideContactInfo: data.hideContactInfo,
        darkMode: data.darkMode,
        language: data.language,
        emailAlerts: data.emailAlerts,
        aiMatchAlerts: data.aiMatchAlerts
      },
      create: {
        userId: user.id,
        publicProfile: data.publicProfile ?? true,
        hideContactInfo: data.hideContactInfo ?? false,
        darkMode: data.darkMode ?? false,
        language: data.language ?? "th",
        emailAlerts: data.emailAlerts ?? true,
        aiMatchAlerts: data.aiMatchAlerts ?? true
      }
    })
    
    revalidatePath("/dashboard/settings")
    revalidatePath(`/profile/${user.id}`)
    return { success: true, settings: updated }
  } catch (error) {
    console.error("Failed to update settings", error)
    return { success: false, error: "Failed to update settings" }
  }
}
