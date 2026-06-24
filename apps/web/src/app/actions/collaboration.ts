"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function sendCollaborationInvite(senderId: string, receiverId: string, type: string, message: string) {
  try {
    const invite = await prisma.collaborationInvite.create({
      data: {
        senderId,
        receiverId,
        type,
        message,
        status: "PENDING"
      }
    })
    
    revalidatePath(`/profile/${receiverId}`)
    return { success: true, invite }
  } catch (error) {
    console.error("Error sending invite:", error)
    return { success: false, error: "Failed to send invite" }
  }
}

export async function getReceivedInvites(userId: string) {
  try {
    const invites = await prisma.collaborationInvite.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
    return { success: true, invites }
  } catch (error) {
    console.error("Error fetching invites:", error)
    return { success: false, error: "Failed to fetch invites" }
  }
}

export async function respondToInvite(inviteId: string, status: "ACCEPTED" | "DECLINED") {
  try {
    const updated = await prisma.collaborationInvite.update({
      where: { id: inviteId },
      data: { status }
    })
    revalidatePath("/dashboard")
    return { success: true, invite: updated }
  } catch (error) {
    console.error("Error responding to invite:", error)
    return { success: false, error: "Failed to respond to invite" }
  }
}
