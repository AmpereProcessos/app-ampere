import { TProductItem } from '../schemas/crm/kits.schema'
import { TUserDTO } from '../schemas/users'

type GetUserAvatarUrlParams = {
  users: TUserDTO[]
  userName: string
}
export function getUserAvatarUrl({ users, userName }: GetUserAvatarUrlParams) {
  if (!users) return undefined
  const user = users.find((p) => p.nome == userName)

  if (!user) return undefined
  return user.avatar_url
}

export function getModulesPeakPotByProducts(products: TProductItem[] | undefined) {
  if (!products) return 0
  const power = products.filter((product) => product.categoria == 'MÓDULO').reduce((acc, current) => acc + current.qtde * (current.potencia || 0), 0)
  return power / 1000
}
export function getInverterPeakPowerByProducts(products: TProductItem[] | undefined) {
  if (!products) return 0
  const power = products.filter((p) => p.categoria == 'INVERSOR').reduce((acc, current) => acc + current.qtde * (current.potencia || 0), 0)
  return power / 1000
}
export function getModulesAveragePower(products: TProductItem[]) {
  const modules = products.filter((m) => m.categoria == 'MÓDULO')
  const averagepower = modules.reduce((acc, current) => acc + (current.potencia || 0), 0) / modules.length
  console.log(averagepower)
  return averagepower
}
