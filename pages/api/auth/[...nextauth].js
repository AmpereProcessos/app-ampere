import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectToDatabase from '../../../utils/usersDb'
export const authOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 5,
  },
  jwt: {
    maxAge: 60 * 60 * 5,
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials
        const db = await connectToDatabase(process.env.DB_KEY)
        const collection = db.collection('users')
        let userInDb = await collection.findOne({ email: email })
        // console.log(userInDb);
        // console.log("ID", userInDb._id);
        try {
          if (!userInDb) {
            throw 'Usuário inexistente'
          }
          if (password !== userInDb.password) {
            throw 'Senha inválida'
          }
          return {
            id: userInDb._id,
            email: userInDb.email,
            name: userInDb.nome,
            image: userInDb.avatar_url,
            accessibleRoutes: userInDb.accessibleRoutes,
            visualizacao: userInDb.visualizacao,
            vendedor: userInDb.vendedor,
            regional: userInDb.regional,
            equipe: userInDb.equipe,
            controller: userInDb.controller,
            manager: userInDb.manager,
          }
        } catch (error) {
          throw new Error(error)
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // console.log("USER", user);
      // console.log("ACCOUNT", account);
      // console.log("PROFILE", profile);
      // console.log("EMAIL", email);
      // console.log("CREDENTIALS", credentials);
      return user
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      // console.log("SESSAO", session);
      // console.log("USER", user);
      // console.log("TOKEN", token);
      if (session?.user) {
        session.user.id = token.sub
        session.user.accessibleRoutes = token.accessibleRoutes
        session.user.controller = token.controller
        session.user.manager = token.manager
        session.user.visualizacao = token.visualizacao
        session.user.vendedor = token.vendedor
        session.user.regional = token.regional
        session.user.equipe = token.equipe
      }
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // console.log("USER", user);
      // console.log("ACCOUNT", account);
      // console.log("PROFILE", profile);
      // console.log(token);
      if (user?.accessibleRoutes) {
        token.accessibleRoutes = user.accessibleRoutes
        token.controller = user.controller
        token.manager = user.manager
        token.visualizacao = user.visualizacao
        token.vendedor = user.vendedor
        token.regional = user.regional
        token.equipe = user.equipe
      }
      return token
    },
  },
  secret: process.env.SECRET_NEXT_AUTH,
  pages: {
    signIn: '/auth/authHome',
  },
}
export default NextAuth(authOptions)
