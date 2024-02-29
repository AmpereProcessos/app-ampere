import NextAuth from 'next-auth'
import { TEmployee } from './schemas/users'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      nome: TEmployee['nome']
      email: TEmployee['nome']
      telefone: TEmployee['telefone']
      avatar_url: TEmployee['avatar_url']
      visualizacao: TEmployee['visualizacao']
      permissoes: TEmployee['permissoes']
      /** The user's postal address. */
      // id: string
      // name: string
      // email: string
      // image: string
      // controller?: boolean
      // manager?: boolean
      // accessibleRoutes?: string[]
      // visualizacao?: null | 'INSIDE' | 'VENDEDOR' | 'OBRAS'
      // vendedor?: null | string
      // regional?: null | string
      // equipe?: null | string
    }
  }
}
