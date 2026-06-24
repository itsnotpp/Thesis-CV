import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null
        
        // Find user in DB
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { profile: true }
        })
        
        // MVP: Accept if user exists, ignore actual password hash match for simplicity if needed,
        // or just accept any password since it's MVP, but we return the real user ID.
        if (user) {
          return {
            id: user.id,
            name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : "User",
            email: user.email
          }
        }
        
        // Fallback for demonstration if user not found in DB
        return { 
          id: "1", 
          name: "ดร. สมชาย เรียนดี", 
          email: credentials?.email || "admin@eenp.com" 
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
