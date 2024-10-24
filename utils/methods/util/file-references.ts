import { FileReferenceCategories } from '@/utils/select-options'
import { Session } from 'next-auth'

export function getAllowedCategories({ session }: { session: Session }) {
  const permissions = session.user.permissoes
  const categories = FileReferenceCategories.map((f) => {
    if (!f.restrict) return { value: f.value, allowed: true }
    // Treat possible restrictions
    if (f.value == 'FINANCEIRO') return { value: f.value, allowed: permissions.financeiro.visualizar }
    return { value: f.value, allowed: true }
  })

  return categories.filter((c) => !!c.allowed).map((c) => c.value)
}
