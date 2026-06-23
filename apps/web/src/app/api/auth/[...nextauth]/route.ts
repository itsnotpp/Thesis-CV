import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // MVP: Accept any login for demonstration purposes
        return { 
          id: "1", 
          name: "ดร. สมชาย เรียนดี", 
          email: credentials?.email || "admin@eenp.com" 
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
