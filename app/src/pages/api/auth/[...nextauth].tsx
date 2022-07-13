import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        // // @ts-ignore
        // scope: "read:user"
      }),
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
      async jwt({ token }) {
        token.userRole = "admin"
        return token
      },
    }
  })